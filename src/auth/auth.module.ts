import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { CustomJwtGuard } from './custom-jwt.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = {
          secret: configService.get<string>('JWT_SECRET') || 'default-secret',
          signOptions: { expiresIn: '1h' },
        };
        console.log('JwtModule initialized with config:', jwtConfig);
        return jwtConfig;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CustomJwtGuard],
  exports: [AuthService, JwtStrategy, PassportModule, CustomJwtGuard],
})
export class AuthModule {}

