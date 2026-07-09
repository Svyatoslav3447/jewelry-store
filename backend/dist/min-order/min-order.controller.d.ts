import { MinOrderService } from './min-order.service';
export declare class MinOrderController {
    private minOrderService;
    constructor(minOrderService: MinOrderService);
    getCurrent(): Promise<import("./min-order.entity").MinOrder>;
    update(body: {
        amount: number;
        message: string;
    }): Promise<import("./min-order.entity").MinOrder>;
}
