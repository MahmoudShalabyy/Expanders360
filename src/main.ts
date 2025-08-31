// Patch لو crypto مش موجود
import * as crypto from 'crypto';
(global as any).crypto = crypto;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug'] });
  logger.log('Application is starting...');
  app.enableCors(); // لو عايز تفعّل CORS
  await app.listen(3000);
  logger.log('Application is running on http://localhost:3000');
}
bootstrap();