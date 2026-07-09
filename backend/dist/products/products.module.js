"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const product_entity_1 = require("./product.entity");
const category_entity_1 = require("../categories/category.entity");
const subcategory_entity_1 = require("../categories/subcategory.entity");
const type_entity_1 = require("../categories/type.entity");
const currency_module_1 = require("../currency/currency.module");
const auth_module_1 = require("../auth/auth.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const subcategory_parameter_entity_1 = require("../categories/subcategory-parameter.entity");
const product_parameter_entity_1 = require("./product-parameter.entity");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product, category_entity_1.Category, subcategory_entity_1.Subcategory, type_entity_1.Type, subcategory_parameter_entity_1.SubcategoryParameter, product_parameter_entity_1.ProductParameter,]),
            currency_module_1.CurrencyModule, auth_module_1.AuthModule,
            event_emitter_1.EventEmitterModule.forRoot(),
        ],
        providers: [products_service_1.ProductsService],
        controllers: [products_controller_1.ProductsController],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map