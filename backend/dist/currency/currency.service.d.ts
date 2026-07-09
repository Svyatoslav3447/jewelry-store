import { Repository } from 'typeorm';
import { Currency } from './currency.entity';
export declare class CurrencyService {
    private currencyRepo;
    constructor(currencyRepo: Repository<Currency>);
    getCurrentRate(): Promise<number>;
    setRate(rate: number): Promise<Currency>;
}
