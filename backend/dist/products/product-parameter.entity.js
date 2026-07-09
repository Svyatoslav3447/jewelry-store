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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductParameter = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const subcategory_parameter_entity_1 = require("../categories/subcategory-parameter.entity");
let ProductParameter = class ProductParameter {
    id;
    product;
    parameter;
    value;
};
exports.ProductParameter = ProductParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, product => product.parameters, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductParameter.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subcategory_parameter_entity_1.SubcategoryParameter, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parameter_id' }),
    __metadata("design:type", subcategory_parameter_entity_1.SubcategoryParameter)
], ProductParameter.prototype, "parameter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductParameter.prototype, "value", void 0);
exports.ProductParameter = ProductParameter = __decorate([
    (0, typeorm_1.Entity)('product_parameters')
], ProductParameter);
//# sourceMappingURL=product-parameter.entity.js.map