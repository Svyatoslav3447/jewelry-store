"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinOrderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const min_order_entity_1 = require("./min-order.entity");
const min_order_service_1 = require("./min-order.service");
const min_order_controller_1 = require("./min-order.controller");
const auth_module_1 = require("../auth/auth.module");
let MinOrderModule = class MinOrderModule {
};
exports.MinOrderModule = MinOrderModule;
exports.MinOrderModule = MinOrderModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([min_order_entity_1.MinOrder]), auth_module_1.AuthModule],
        providers: [min_order_service_1.MinOrderService],
        controllers: [min_order_controller_1.MinOrderController],
        exports: [min_order_service_1.MinOrderService],
    })
], MinOrderModule);
//# sourceMappingURL=min-order.module.js.map