"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./users/user.entity");
const category_entity_1 = require("./categories/category.entity");
const subcategory_entity_1 = require("./categories/subcategory.entity");
const type_entity_1 = require("./categories/type.entity");
const product_entity_1 = require("./products/product.entity");
const product_parameter_entity_1 = require("./products/product-parameter.entity");
const subcategory_parameter_entity_1 = require("./categories/subcategory-parameter.entity");
const order_entity_1 = require("./orders/order.entity");
const currency_entity_1 = require("./currency/currency.entity");
const min_order_entity_1 = require("./min-order/min-order.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    entities: [
        user_entity_1.User,
        category_entity_1.Category,
        subcategory_entity_1.Subcategory,
        type_entity_1.Type,
        product_entity_1.Product,
        product_parameter_entity_1.ProductParameter,
        subcategory_parameter_entity_1.SubcategoryParameter,
        order_entity_1.Order,
        order_entity_1.OrderItem,
        currency_entity_1.Currency,
        min_order_entity_1.MinOrder,
    ],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    logging: ['error', 'warn'],
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
//# sourceMappingURL=ormconfig.js.map