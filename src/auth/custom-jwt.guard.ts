import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class CustomJwtGuard extends AuthGuard('jwt') {
  canActivate(context) {
    console.log('CustomJwtGuard canActivate called');
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    console.log('CustomJwtGuard canActivate - Raw token:', token || 'No token found');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    console.log('CustomJwtGuard handleRequest:', { err, user, info });
    if (err || !user) {
      console.log('Authentication failed:', { err, info });
      throw err || new UnauthorizedException('Invalid JWT token');
    }
    return user;
  }
}