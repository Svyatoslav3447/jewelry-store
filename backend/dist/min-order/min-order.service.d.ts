import { Repository } from 'typeorm';
import { MinOrder } from './min-order.entity';
export declare class MinOrderService {
    private repo;
    constructor(repo: Repository<MinOrder>);
    getCurrent(): Promise<MinOrder>;
    set(amount: number, message: string): Promise<MinOrder>;
}
