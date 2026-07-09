import * as dotenv from 'dotenv';

dotenv.config();

const { AppDataSource } = require('../ormconfig');
const { Category } = require('../categories/category.entity');
const { Subcategory } = require('../categories/subcategory.entity');
const { Type } = require('../categories/type.entity');
const { Product } = require('../products/product.entity');

const categoryBlueprints = [
  {
    name: 'Ювелірна біжутерія ХР ( Золото 18к )',
    subcategories: [
      { name: 'Золото', types: ['18к', 'Стандарт'] },
      { name: 'Комбіновані', types: ['Святкові', 'Повсякденні'] },
    ],
  },
  {
    name: 'Ювелірна біжутерія ХР ( Срібло )',
    subcategories: [
      { name: 'Класичні', types: ['Золото', 'Срібло'] },
      { name: 'Преміум', types: ['Люкс', 'Дизайнерські'] },
    ],
  },
  {
    name: 'Сваровські',
    subcategories: [
      { name: 'Ланцюжки', types: ['Золото 18к', 'Срібло 925'] },
      { name: 'Підвіски', types: ['Кулон', 'Кристали'] },
    ],
  },
  {
    name: 'Символіка',
    subcategories: [
      { name: 'Крупні', types: ['Класичні', 'Модні'] },
      { name: 'Міні', types: ['Легка форма', 'Тонкі'] },
    ],
  },
  {
    name: 'Подарункова упаковка',
    subcategories: [],
  },
];

const prefixMap: Record<string, string> = {
  A: 'Ювелірна біжутерія ХР ( Золото 18к )',
  B: 'Ювелірна біжутерія ХР ( Золото 18к )',
  E: 'Ювелірна біжутерія ХР ( Золото 18к )',
  K: 'Ювелірна біжутерія ХР ( Срібло )',
  L: 'Ювелірна біжутерія ХР ( Срібло )',
  N: 'Ювелірна біжутерія ХР ( Срібло )',
  R: 'Сваровські',
  S: 'Сваровські',
  T: 'Сваровські',
  P: 'Подарункова упаковка',
  G: 'Подарункова упаковка',
};

function getCategoryForSku(sku: string) {
  if (!sku) return 'Символіка';
  const initial = sku.charAt(0).toUpperCase();
  return prefixMap[initial] || 'Символіка';
}

function getSubcategoryAndType(sku: string, categoryName: string) {
  const numericPart = Number((sku.match(/\d+/) || ['0'])[0]);
  const even = numericPart % 2 === 0;

  if (categoryName === 'Ювелірна біжутерія ХР ( Золото 18к )') {
    return { subcategory: even ? 'Золото' : 'Комбіновані', type: even ? '18к' : 'Святкові' };
  }

  if (categoryName === 'Ювелірна біжутерія ХР ( Срібло )') {
    return { subcategory: even ? 'Класичні' : 'Преміум', type: 'Срібло' };
  }

  if (categoryName === 'Сваровські') {
    return { subcategory: even ? 'Ланцюжки' : 'Підвіски', type: even ? 'Золото 18к' : 'Кристали' };
  }

  if (categoryName === 'Символіка') {
    return { subcategory: even ? 'Крупні' : 'Міні', type: even ? 'Класичні' : 'Легка форма' };
  }

  return { subcategory: '', type: '' };
}

function getPriceUsd(sku: string, categoryName: string) {
  const numericPart = Number((sku.match(/\d+/) || ['0'])[0]);
  const baseByCategory: Record<string, number> = {
    'Ювелірна біжутерія ХР ( Золото 18к )': 120,
    'Ювелірна біжутерія ХР ( Срібло )': 80,
    'Сваровські': 90,
    'Символіка': 40,
    'Подарункова упаковка': 10,
  };
  const base = baseByCategory[categoryName] || 50;
  const modifier = (numericPart % 13) * 2 + (sku.length % 4);
  return Number((base + modifier).toFixed(2));
}

async function main() {
  await AppDataSource.initialize();

  const categoryRepo = AppDataSource.getRepository(Category);
  const subcategoryRepo = AppDataSource.getRepository(Subcategory);
  const typeRepo = AppDataSource.getRepository(Type);
  const productRepo = AppDataSource.getRepository(Product);

  const categoriesByName: Record<string, any> = {};

  for (const blueprint of categoryBlueprints) {
    let category = await categoryRepo.findOne({ where: { name: blueprint.name } });
    if (!category) {
      category = categoryRepo.create({ name: blueprint.name });
      category = await categoryRepo.save(category);
    }
    categoriesByName[blueprint.name] = category;

    for (const subBlueprint of blueprint.subcategories) {
      let subcategory = await subcategoryRepo.findOne({
        where: { name: subBlueprint.name, category: { id: category.id } },
      });
      if (!subcategory) {
        subcategory = subcategoryRepo.create({ name: subBlueprint.name, category });
        subcategory = await subcategoryRepo.save(subcategory);
      }

      for (const typeName of subBlueprint.types) {
        const existingType = await typeRepo.findOne({
          where: { name: typeName, subcategory: { id: subcategory.id } },
        });
        if (!existingType) {
          await typeRepo.save(typeRepo.create({ name: typeName, subcategory }));
        }
      }
    }
  }

  const products = await productRepo.find({ relations: ['category', 'subcategory', 'type'] });
  const subcategoryCache: Record<string, any> = {};
  const typeCache: Record<string, any> = {};

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    if (!product.sku) {
      skipped += 1;
      continue;
    }

    const categoryName = getCategoryForSku(product.sku);
    const category = categoriesByName[categoryName];
    if (!category) {
      skipped += 1;
      continue;
    }

    const { subcategory: subcategoryName, type: typeName } = getSubcategoryAndType(product.sku, categoryName);
    const price_usd = getPriceUsd(product.sku, categoryName);

    product.category = category;
    product.price_usd = price_usd;

    const subcategoryKey = `${category.id}:${subcategoryName}`;
    let subcategory = subcategoryCache[subcategoryKey];
    if (!subcategory) {
      subcategory = await subcategoryRepo.findOne({
        where: { name: subcategoryName, category: { id: category.id } },
      });
      subcategoryCache[subcategoryKey] = subcategory;
    }
    if (subcategory) {
      product.subcategory = subcategory;
    }

    const typeKey = `${subcategory?.id || 'none'}:${typeName}`;
    let type = typeCache[typeKey];
    if (!type) {
      type = await typeRepo.findOne({
        where: { name: typeName, subcategory: { id: subcategory?.id } },
      });
      typeCache[typeKey] = type;
    }
    if (type) {
      product.type = type;
    }

    updated += 1;
  }

  await productRepo.save(products);

  const counts = await Promise.all(
    Object.keys(categoriesByName).map(async (name) => ({
      name,
      count: await productRepo.count({ where: { category: { id: categoriesByName[name].id } } }),
    })),
  );

  console.log(JSON.stringify({
    totalProducts: products.length,
    updated,
    skipped,
    counts,
  }, null, 2));

  await AppDataSource.destroy();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
