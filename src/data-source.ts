import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env' });

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('MYSQL_HOST'), // استخدام MYSQL_HOST بدل MYSQLHOST
  port: Number(configService.get('MYSQL_PORT')) || 3306, // Port ديناميكي
  username: configService.get('MYSQL_USERNAME'), // Username من Railway
  password: configService.get('MYSQL_PASSWORD'), // Password من Railway
  database: configService.get('MYSQL_DATABASE') || 'railway', // Database من Railway
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  extra: {
    connectionLimit: 3, // عدد الـ Connections المتزامنة
    connectTimeout: 30000, // 30 ثانية
    acquireTimeout: 30000, // 30 ثانية
    queueLimit: 0, // إزالة الحد الأقصى للـ Queue
  },
});