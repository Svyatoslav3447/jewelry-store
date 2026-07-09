import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Get()
  async getRate() {
    const rate = await this.currencyService.getCurrentRate();
    return { rate };
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  setRate(@Body() body: { rate: number }) {
    return this.currencyService.setRate(body.rate);
  }
}