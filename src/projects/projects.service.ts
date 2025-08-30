import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Vendor } from './entities/vendor.entity';
import { Match } from './entities/match.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private notificationsService: NotificationsService,
  ) {}

  async createClient(company_name: string, contact_email: string) {
    const client = this.clientRepository.create({ company_name, contact_email });
    return this.clientRepository.save(client);
  }

  async createProject(
    clientId: number,
    country: string,
    services_needed: string[],
    budget: number,
    status: string,
  ) {
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    const project = this.projectRepository.create({
      client,
      country,
      services_needed,
      budget,
      status,
    });
    return this.projectRepository.save(project);
  }

  async getProjectsByClient(clientId: number) {
    const projects = await this.projectRepository.find({
      where: { client: { id: clientId } },
      relations: ['client'],
    });
    return projects;
  }

  async createVendor(
    name: string,
    countries_supported: string[],
    services_offered: string[],
    rating: number,
    response_sla_hours: number,
  ) {
    const vendor = this.vendorRepository.create({
      name,
      countries_supported,
      services_offered,
      rating,
      response_sla_hours,
    });
    return this.vendorRepository.save(vendor);
  }

  async getAllVendors() {
    return this.vendorRepository.find();
  }

  async createMatch(projectId: number, vendorId: number, score: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    const match = this.matchRepository.create({
      project,
      vendor,
      score,
      created_at: new Date(),
    });
    return this.matchRepository.save(match);
  }

async getMatchesByProject(projectId: number) {
  return this.matchRepository.find({
    where: { project: { id: projectId } },
    relations: ['project', 'vendor'],
  });
}

async rebuildMatches(projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const vendors = await this.vendorRepository.find();
    const matches: Match[] = [];

    for (const vendor of vendors) {
      if (!vendor.countries_supported.includes(project.country)) continue;

      const servicesOverlap = project.services_needed.filter((service) =>
        vendor.services_offered.includes(service),
      ).length;

      if (servicesOverlap === 0) continue;

      const slaWeight = vendor.response_sla_hours <= 24 ? 1 : 0.5;
      const score = servicesOverlap * 2 + vendor.rating + slaWeight;

      const existingMatch = await this.matchRepository.findOne({
        where: { project: { id: projectId }, vendor: { id: vendor.id } },
      });

      if (existingMatch) {
        existingMatch.score = score;
        await this.matchRepository.save(existingMatch);
        matches.push(existingMatch);
      } else {
        const match = this.matchRepository.create({
          project,
          vendor,
          score,
          created_at: new Date(),
        });
        await this.matchRepository.save(match);
        matches.push(match);
        try {
          await this.notificationsService.sendMatchNotification(
            `Project-${project.id}`,
            vendor.name || `Vendor-${vendor.id}`,
            'test@example.com'
          );
          console.log('Notification sent for match:', match.id);
        } catch (error) {
          console.error('Failed to send notification:', error.message);
        }
      }
    }

    return matches;
  }
}