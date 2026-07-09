import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinOrder } from './min-order.entity';
@Injectable()
export class MinOrderService {
  constructor(
    @InjectRepository(MinOrder)
    private repo: Repository<MinOrder>,
  ) {}

  async getCurrent() {
    const last = await this.repo.find({
      order: { created_at: 'DESC' },
      take: 1,
    });

    return (
      last[0] || {
        amount: 500,
        message: 'Мінімальна сума замовлення — 500 ₴',
      }
    );
  }

  async set(amount: number, message: string) {
    // беремо останній запис
    const last = await this.repo.find({
      order: { created_at: 'DESC' },
      take: 1,
    });

    let minOrder: MinOrder;

    if (last.length === 0) {
      // якщо немає запису, створюємо новий
      minOrder = this.repo.create({ amount, message });
    } else {
      // оновлюємо існуючий
      minOrder = last[0];
      minOrder.amount = amount;
      minOrder.message = message;
    }

    return this.repo.save(minOrder);
  }
}