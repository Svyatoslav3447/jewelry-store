"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const categories_module_1 = require("./categories/categories.module");
const products_module_1 = require("./products/products.module");
const orders_module_1 = require("./orders/orders.module");
const currency_module_1 = require("./currency/currency.module");
const slider_module_1 = require("./slider/slider.module");
const min_order_module_1 = require("./min-order/min-order.module");
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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT) || 5432,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
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
                synchronize: false,
                logging: ['error', 'warn'],
                migrationsRun: true,
                migrations: ['dist/migrations/*.js'],
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            currency_module_1.CurrencyModule,
            slider_module_1.SliderModule,
            min_order_module_1.MinOrderModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map