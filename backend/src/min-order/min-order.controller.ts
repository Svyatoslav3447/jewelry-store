import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { MinOrderService } from './min-order.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('min-order')
export class MinOrderController {
  constructor(private minOrderService: MinOrderService) {}

  @Get()
  getCurrent() {
    return this.minOrderService.getCurrent();
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Body() body: { amount: number; message: string }) {
    return this.minOrderService.set(body.amount, body.message);
  }
}