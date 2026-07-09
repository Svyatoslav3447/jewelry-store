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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const product_entity_1 = require("../products/product.entity");
const user_entity_1 = require("../users/user.entity");
const min_order_service_1 = require("../min-order/min-order.service");
const currency_service_1 = require("../currency/currency.service");
const subcategory_parameter_entity_1 = require("../categories/subcategory-parameter.entity");
const typeorm_3 = require("typeorm");
let OrdersService = class OrdersService {
    orderRepo;
    orderItemRepo;
    productRepo;
    userRepo;
    subParamRepo;
    minOrderService;
    currencyService;
    constructor(orderRepo, orderItemRepo, productRepo, userRepo, subParamRepo, minOrderService, currencyService) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.subParamRepo = subParamRepo;
        this.minOrderService = minOrderService;
        this.currencyService = currencyService;
    }
    async create(userId, items, firstName, phone, lastName, delivery, city, npBranch, payment, callConfirm, comment, discount_percent, total_after_discount) {
        if (!firstName?.trim())
            throw new common_1.BadRequestException("Ім'я обов'язкове");
        if (!phone?.trim())
            throw new common_1.BadRequestException("Телефон обов'язковий");
        if (!items.length)
            throw new common_1.BadRequestException("Кошик порожній");
        let user;
        if (userId) {
            const foundUser = await this.userRepo.findOneBy({ id: userId });
            if (!foundUser)
                throw new Error("User not found");
            user = foundUser;
        }
        const products = await Promise.all(items.map(async (item) => {
            const product = await this.productRepo.findOneBy({ id: item.productId });
            if (!product)
                throw new common_1.BadRequestException(`Product ${item.productId} not found`);
            return { product, quantity: item.quantity, price_usd: product.price_usd, selectedParams: item.selectedParams };
        }));
        const order = this.orderRepo.create({
            user: userId ? { id: userId } : undefined,
            firstName,
            lastName,
            phone,
            delivery,
            city,
            npBranch,
            payment,
            callConfirm,
            comment,
            discount_percent: discount_percent ?? 0,
            total_after_discount: total_after_discount ?? 0,
            items: [],
        });
        for (const item of products) {
            const orderItem = this.orderItemRepo.create({
                product: item.product,
                quantity: item.quantity,
                price_usd: item.price_usd,
                selectedParams: item.selectedParams ?? {},
            });
            order.items.push(orderItem);
        }
        const savedOrder = await this.orderRepo.save(order);
        return savedOrder;
    }
    async findAll() {
        return this.orderRepo.find({ relations: ['user', 'items', 'items.product'] });
    }
    async findOne(id) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product'],
        });
        if (!order)
            throw new Error('Order not found');
        for (const item of order.items) {
            if (item.selectedParams && Object.keys(item.selectedParams).length) {
                const paramIds = Object.keys(item.selectedParams).map(Number);
                const params = await this.subParamRepo.findBy({ id: (0, typeorm_3.In)(paramIds) });
                item.selectedParamsNames = params.reduce((acc, p) => {
                    acc[p.id] = p.name;
                    return acc;
                }, {});
            }
            else {
                item.selectedParamsNames = {};
            }
        }
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['items', 'items.product'],
        });
        if (!order)
            throw new Error('Order not found');
        order.status = status;
        return this.orderRepo.save(order);
    }
    async findByUser(userId) {
        return this.orderRepo.find({
            where: { user: { id: userId } },
            relations: ['user', 'items', 'items.product'],
        });
    }
    async findOneByUser(orderId, userId) {
        return this.orderRepo.findOne({
            where: { id: orderId, user: { id: userId } },
            relations: ['user', 'items', 'items.product'],
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(subcategory_parameter_entity_1.SubcategoryParameter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        min_order_service_1.MinOrderService,
        currency_service_1.CurrencyService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map