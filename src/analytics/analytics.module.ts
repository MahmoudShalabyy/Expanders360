import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../projects/entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentEntity, DocumentSchema } from '../documents/schemas/document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Project]),
    MongooseModule.forFeature([{ name: DocumentEntity.name, schema: DocumentSchema }]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}