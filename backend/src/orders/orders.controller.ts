import { Controller, Get, Post, Body, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './order.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() body: {
      userId?: number;
      items: { productId: number; quantity: number; selectedParams?: Record<number, string> }[];
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
    },
  ) {
    const savedOrder: Order = await this.ordersService.create(
      body.userId ?? null, // ✅ undefined замість null
      body.items,
      body.firstName,
      body.phone,
      body.lastName,
      body.delivery,
      body.city,
      body.npBranch,
      body.payment,
      body.callConfirm,
      body.comment,
      body.discount_percent,
      body.total_after_discount,
    );
  
    return {
      id: savedOrder.id,
      total_after_discount: savedOrder.total_after_discount,
      discount_percent: savedOrder.discount_percent,
      items: savedOrder.items.map(i => ({
        id: i.id,
        productId: i.product.id,
        quantity: i.quantity,
        price_usd: i.price_usd,
        selectedParams: i.selectedParams,
      })),
    };
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Req() req) {
    if (req.user.role === 'ADMIN') return this.ordersService.findAll();
    return this.ordersService.findByUser(req.user.id); // <-- тут id
  }
  
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOne(@Param('id') id: string, @Req() req) {
    const orderId = Number(id);
    if (req.user.role === 'ADMIN') return this.ordersService.findOne(orderId);
    return this.ordersService.findOneByUser(orderId, req.user.id); // <-- тут id
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(Number(id), status);
  }
}
