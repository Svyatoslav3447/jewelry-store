import { Repository } from 'typeorm';
import { Order, OrderItem, OrderStatus } from './order.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { MinOrderService } from '../min-order/min-order.service';
import { CurrencyService } from '../currency/currency.service';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';
export declare class OrdersService {
    private orderRepo;
    private orderItemRepo;
    private productRepo;
    private userRepo;
    private subParamRepo;
    private minOrderService;
    private currencyService;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>, productRepo: Repository<Product>, userRepo: Repository<User>, subParamRepo: Repository<SubcategoryParameter>, minOrderService: MinOrderService, currencyService: CurrencyService);
    create(userId: number | null, items: {
        productId: number;
        quantity: number;
        selectedParams?: Record<number, string>;
    }[], firstName: string, phone: string, lastName?: string, delivery?: string, city?: string, npBranch?: string, payment?: string, callConfirm?: string, comment?: string, discount_percent?: number, total_after_discount?: number): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    updateStatus(id: number, status: OrderStatus): Promise<Order>;
    findByUser(userId: number): Promise<Order[]>;
    findOneByUser(orderId: number, userId: number): Promise<Order | null>;
}
