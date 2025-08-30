import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { CustomJwtGuard } from './custom-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: 'client' | 'admin',
  ) {
    return this.authService.register(email, password, role);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @UseGuards(CustomJwtGuard)
  @Post('admin-test')
  adminTest(@Req() request: Request) {
    console.log('Request user in adminTest:', request.user);
    return { message: 'Admin-only route', user: request.user };
  }
}

