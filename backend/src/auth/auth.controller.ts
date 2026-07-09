import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { phone: string; password: string; firstName?: string; lastName?: string }) {
    return this.authService.register(body.phone, body.password, body.firstName, body.lastName);
  }

  @Post('login')
  login(@Body() body: { phone: string; password: string }) {
    return this.authService.login(body.phone, body.password);
  }
}