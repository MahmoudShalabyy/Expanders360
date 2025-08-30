import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.NODE_ENV === 'migration' ? 'localhost' : configService.get('MYSQL_HOST'),
  port: configService.get('MYSQL_PORT') || 3306,
  username: configService.get('MYSQL_USERNAME'),
  password: configService.get('MYSQL_PASSWORD'),
  database: configService.get('MYSQL_DATABASE'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
});