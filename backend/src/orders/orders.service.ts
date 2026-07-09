import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, OrderStatus } from './order.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { MinOrderService } from '../min-order/min-order.service';
import { CurrencyService } from '../currency/currency.service';
import { SubcategoryParameter } from '../categories/subcategory-parameter.entity';
import { In } from 'typeorm';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(SubcategoryParameter)
    private subParamRepo: Repository<SubcategoryParameter>,

    private minOrderService: MinOrderService,
    private currencyService: CurrencyService, // 🔹 додаємо сервіс валют
  ) {}

  async create(
    userId: number | null,
    items: { productId: number; quantity: number; selectedParams?: Record<number, string> }[],
    firstName: string,
    phone: string,
    lastName?: string,
    delivery?: string,
    city?: string,
    npBranch?: string,
    payment?: string,
    callConfirm?: string,
    comment?: string,
    discount_percent?: number,
    total_after_discount?: number,
  ) {
    if (!firstName?.trim()) throw new BadRequestException("Ім'я обов'язкове");
    if (!phone?.trim()) throw new BadRequestException("Телефон обов'язковий");
    if (!items.length) throw new BadRequestException("Кошик порожній");

    let user: User | undefined;
    if (userId) {
      const foundUser = await this.userRepo.findOneBy({ id: userId });
      if (!foundUser) throw new Error("User not found");
      user = foundUser;
    }

    const products = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepo.findOneBy({ id: item.productId });
        if (!product) throw new BadRequestException(`Product ${item.productId} not found`);
        return { product, quantity: item.quantity, price_usd: product.price_usd, selectedParams: item.selectedParams };
      }),
    );

  const order = this.orderRepo.create({
    user: userId ? { id: userId } : undefined, // ✅
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

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new Error('Order not found');

    // для кожного item формуємо selectedParamsNames
    for (const item of order.items) {
      if (item.selectedParams && Object.keys(item.selectedParams).length) {
        const paramIds = Object.keys(item.selectedParams).map(Number);
        const params = await this.subParamRepo.findBy({ id: In(paramIds) }); // 🔹 In()
        item.selectedParamsNames = params.reduce((acc, p) => {
          acc[p.id] = p.name;
          return acc;
        }, {} as Record<number, string>);
      } else {
        item.selectedParamsNames = {};
      }
    }

    return order;
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new Error('Order not found');

    order.status = status;
    return this.orderRepo.save(order);
  }

  async findByUser(userId: number) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findOneByUser(orderId: number, userId: number) {
    return this.orderRepo.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
  }
}
