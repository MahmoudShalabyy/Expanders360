import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DocumentEntity } from '../documents/schemas/document.schema';
import { Model } from 'mongoose';
import { DataSource } from 'typeorm';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // 🌟 MongoDB
  const documentModel = app.get<Model<DocumentEntity>>(getModelToken(DocumentEntity.name));

  await documentModel.insertMany([
    { title: 'Seed Document 1', file_path: '/uploads/seed1.pdf', tags: ['seed'], projectId: 1 },
    { title: 'Seed Document 2', file_path: '/uploads/seed2.pdf', tags: ['seed'], projectId: 2 },
  ]);
  console.log('✅ MongoDB seeding completed.');

  // 🌟 MySQL
  const configService = app.get(ConfigService);
  const dataSource = new DataSource({
    type: 'mysql',
    host: configService.get('MYSQL_HOST'),
    port: Number(configService.get('MYSQL_PORT')),
    username: configService.get('MYSQL_USERNAME'),
    password: configService.get('MYSQL_PASSWORD'),
    database: configService.get('MYSQL_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
  });

  await dataSource.initialize();

  // Seed Clients
  await dataSource
    .createQueryBuilder()
    .insert()
    .into('client')
    .values([
      { company_name: 'Tech Corp', contact_email: 'tech@corp.com' },
      { company_name: 'Innovate Inc', contact_email: 'innovate@inc.com' },
    ])
    .execute();

  // Seed Projects
  await dataSource
    .createQueryBuilder()
    .insert()
    .into('project')
    .values([
      { country: 'Egypt', services_needed: JSON.stringify(['web_development', 'consulting']), budget: 10000, status: 'active', clientId: 1 },
      { country: 'UAE', services_needed: JSON.stringify(['mobile_development', 'marketing']), budget: 15000, status: 'active', clientId: 2 },
    ])
    .execute();

  // Seed Vendors
  await dataSource
    .createQueryBuilder()
    .insert()
    .into('vendor')
    .values([
      { name: 'Vendor A', countries_supported: JSON.stringify(['Egypt', 'UAE']), services_offered: JSON.stringify(['web_development', 'consulting']), rating: 4.5, response_sla_hours: 24 },
      { name: 'Vendor B', countries_supported: JSON.stringify(['UAE', 'KSA']), services_offered: JSON.stringify(['mobile_development', 'marketing']), rating: 4.0, response_sla_hours: 48 },
    ])
    .execute();

  console.log('✅ MySQL seeding completed.');

  await dataSource.destroy();
  await app.close();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
});
