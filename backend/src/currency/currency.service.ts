import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepo: Repository<Currency>,
  ) {}

  async getCurrentRate(): Promise<number> {
    const lastRate = await this.currencyRepo.find({
      order: { created_at: 'DESC' },
      take: 1,
    });
    return lastRate[0]?.rate || 1; // дефолт 1
  }

  async setRate(rate: number): Promise<Currency> {
    const newRate = this.currencyRepo.create({ rate });
    return this.currencyRepo.save(newRate);
  }
}