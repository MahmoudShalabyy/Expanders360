import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
    console.log('JwtStrategy initialized with secret:', configService.get<string>('JWT_SECRET'));
  }

  async validate(payload: { sub: number; email: string; role: string }) {
    console.log('JwtStrategy validate called with payload:', payload);
    const user = await this.authService.findUserById(payload.sub);
    console.log('User from DB:', user);
    if (!user) {
      console.log('No user found, throwing UnauthorizedException');
      throw new UnauthorizedException('Invalid token');
    }
    return { id: user.id, email: user.email, role: user.role };
  }

  // إضافة دالة للتحقق من الـ Token الخام
  getRequestToken(request: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    console.log('Raw token extracted:', token);
    return token;
  }
}