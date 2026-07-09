import { CurrencyService } from './currency.service';
export declare class CurrencyController {
    private currencyService;
    constructor(currencyService: CurrencyService);
    getRate(): Promise<{
        rate: number;
    }>;
    setRate(body: {
        rate: number;
    }): Promise<import("./currency.entity").Currency>;
}
