// import { DataSource } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import * as dotenv from 'dotenv';

// // Load .env file
// dotenv.config();

// const configService = new ConfigService();

// export const AppDataSource = new DataSource({
//   type: 'mysql',
//   host: process.env.MYSQL_HOST,
//   port: Number(process.env.MYSQL_PORT) || 3306,
//   username: process.env.MYSQL_USERNAME,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   entities: ['src/**/*.entity{.ts,.js}'],
//   migrations: ['src/migrations/*{.ts,.js}'],
// });

import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env' });

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('MYSQL_HOST'), // بدل MYSQL_HOST
  port: 41188, // Railway internal mysql port
  username: 'root', // Railway root user
  password: configService.get('MYSQL_PASSWORD'), // بدل MYSQL_PASSWORD
  database: configService.get('MYSQL_DATABASE') || 'railway',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
});

