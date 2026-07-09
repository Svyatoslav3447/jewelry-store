"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./category.entity");
const subcategory_entity_1 = require("./subcategory.entity");
const type_entity_1 = require("./type.entity");
const subcategory_parameter_entity_1 = require("../categories/subcategory-parameter.entity");
let CategoriesService = class CategoriesService {
    categoryRepo;
    subcategoryRepo;
    typeRepo;
    subParamRepo;
    constructor(categoryRepo, subcategoryRepo, typeRepo, subParamRepo) {
        this.categoryRepo = categoryRepo;
        this.subcategoryRepo = subcategoryRepo;
        this.typeRepo = typeRepo;
        this.subParamRepo = subParamRepo;
    }
    async findAll() {
        const categories = await this.categoryRepo.find({
            relations: ['subcategories', 'subcategories.types', 'subcategories.parameters'],
        });
        return categories;
    }
    createCategory(name) {
        return this.categoryRepo.save(this.categoryRepo.create({ name }));
    }
    async updateCategory(id, name) {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) {
            throw new common_1.BadRequestException('Категорія не знайдена');
        }
        category.name = name;
        return this.categoryRepo.save(category);
    }
    deleteCategory(id) {
        return this.categoryRepo.delete(id);
    }
    createSubcategory(name, categoryId) {
        return this.subcategoryRepo.save(this.subcategoryRepo.create({ name, category: { id: categoryId } }));
    }
    updateSubcategory(id, name) {
        return this.subcategoryRepo.update(id, { name });
    }
    deleteSubcategory(id) {
        return this.subcategoryRepo.delete(id);
    }
    createType(name, subcategoryId) {
        return this.typeRepo.save(this.typeRepo.create({ name, subcategory: { id: subcategoryId } }));
    }
    updateType(id, name) {
        return this.typeRepo.update(id, { name });
    }
    deleteType(id) {
        return this.typeRepo.delete(id);
    }
    async findById(id) {
        return this.categoryRepo.findOne({ where: { id } });
    }
    createSubcategoryParameter(subcategoryId, name, required = false) {
        return this.subParamRepo.save(this.subParamRepo.create({
            name,
            required,
            subcategory: { id: subcategoryId },
        }));
    }
    async updateSubcategoryParameter(id, name, required = false) {
        const param = await this.subParamRepo.findOne({ where: { id } });
        if (!param) {
            throw new common_1.BadRequestException('Параметр не знайдено');
        }
        param.name = name;
        param.required = required;
        return this.subParamRepo.save(param);
    }
    deleteSubcategoryParameter(id) {
        return this.subParamRepo.delete(id);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(subcategory_entity_1.Subcategory)),
    __param(2, (0, typeorm_1.InjectRepository)(type_entity_1.Type)),
    __param(3, (0, typeorm_1.InjectRepository)(subcategory_parameter_entity_1.SubcategoryParameter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map