import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
export declare enum OrderStatus {
    PENDING = "\u041D\u043E\u0432\u0435",
    PROCESSING = "\u0412 \u043E\u0431\u0440\u043E\u0431\u0446\u0456",
    COMPLETED = "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E",
    CANCELLED = "\u0412\u0456\u0434\u043C\u0456\u043D\u0435\u043D\u043E"
}
export declare class Order {
    id: number;
    user?: User;
    firstName: string;
    lastName?: string;
    phone: string;
    delivery?: string;
    city?: string;
    npBranch?: string;
    payment?: string;
    callConfirm?: string;
    comment?: string;
    status: OrderStatus;
    total_after_discount: number;
    discount_percent: number;
    created_at: Date;
    items: OrderItem[];
}
export declare class OrderItem {
    id: number;
    order: Order;
    product: Product;
    quantity: number;
    price_usd: number;
    selectedParams: Record<number, string>;
    selectedParamsNames?: Record<number, string>;
}
