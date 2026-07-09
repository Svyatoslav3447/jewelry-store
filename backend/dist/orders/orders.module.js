"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const order_entity_1 = require("./order.entity");
const product_entity_1 = require("../products/product.entity");
const user_entity_1 = require("../users/user.entity");
const auth_module_1 = require("../auth/auth.module");
const min_order_module_1 = require("../min-order/min-order.module");
const currency_module_1 = require("../currency/currency.module");
const subcategory_parameter_entity_1 = require("../categories/subcategory-parameter.entity");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, order_entity_1.OrderItem, product_entity_1.Product, user_entity_1.User, subcategory_parameter_entity_1.SubcategoryParameter]), min_order_module_1.MinOrderModule, currency_module_1.CurrencyModule, auth_module_1.AuthModule],
        providers: [orders_service_1.OrdersService],
        controllers: [orders_controller_1.OrdersController],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map