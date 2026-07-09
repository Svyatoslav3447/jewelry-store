import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './order.entity';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(body: {
        userId?: number;
        items: {
            productId: number;
            quantity: number;
            selectedParams?: Record<number, string>;
        }[];
        firstName: string;
        lastName?: string;
        phone: string;
        delivery?: string;
        city?: string;
        npBranch?: string;
        payment?: string;
        callConfirm?: string;
        comment?: string;
        discount_percent?: number;
        total_after_discount?: number;
    }): Promise<{
        id: number;
        total_after_discount: number;
        discount_percent: number;
        items: {
            id: number;
            productId: number;
            quantity: number;
            price_usd: number;
            selectedParams: Record<number, string>;
        }[];
    }>;
    getAll(req: any): Promise<Order[]>;
    getOne(id: string, req: any): Promise<Order | null>;
    updateStatus(id: string, status: OrderStatus): Promise<Order>;
}
