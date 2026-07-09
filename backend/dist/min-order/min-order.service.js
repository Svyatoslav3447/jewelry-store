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
exports.MinOrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const min_order_entity_1 = require("./min-order.entity");
let MinOrderService = class MinOrderService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getCurrent() {
        const last = await this.repo.find({
            order: { created_at: 'DESC' },
            take: 1,
        });
        return (last[0] || {
            amount: 500,
            message: 'Мінімальна сума замовлення — 500 ₴',
        });
    }
    async set(amount, message) {
        const last = await this.repo.find({
            order: { created_at: 'DESC' },
            take: 1,
        });
        let minOrder;
        if (last.length === 0) {
            minOrder = this.repo.create({ amount, message });
        }
        else {
            minOrder = last[0];
            minOrder.amount = amount;
            minOrder.message = message;
        }
        return this.repo.save(minOrder);
    }
};
exports.MinOrderService = MinOrderService;
exports.MinOrderService = MinOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(min_order_entity_1.MinOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MinOrderService);
//# sourceMappingURL=min-order.service.js.map