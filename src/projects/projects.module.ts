import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Vendor } from './entities/vendor.entity';
import { Match } from './entities/match.entity';
import { NotificationsModule } from '../notifications/notifications.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Client, Project, Vendor, Match]), NotificationsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}