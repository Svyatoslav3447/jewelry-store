import { BadRequestException, Body, Controller, Get, NotFoundException, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() req) {
    return req.user; // вже повний користувач
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() body: Partial<User>) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new NotFoundException('User not found');

    // оновлюємо поля
    Object.assign(user, body);
    return this.usersService.save(user); // додати метод save в UsersService
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async changePassword(@Req() req, @Body() body: { oldPassword: string; newPassword: string }) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new BadRequestException('User not found');

    // Перевіряємо старий пароль
    const match = await bcrypt.compare(body.oldPassword, user.password);
    if (!match) throw new BadRequestException('Старий пароль неправильний');

    // Хешуємо новий пароль
    user.password = await bcrypt.hash(body.newPassword, 10);
    await this.usersService.save(user);

    return { message: 'Пароль змінено' };
  }
}