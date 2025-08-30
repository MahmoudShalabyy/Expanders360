import { Controller, Post, Body, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CustomJwtGuard } from '../auth/custom-jwt.guard';

@Controller('projects')
@UseGuards(CustomJwtGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('clients')
  async createClient(
    @Body('company_name') company_name: string,
    @Body('contact_email') contact_email: string,
  ) {
    return this.projectsService.createClient(company_name, contact_email);
  }

  @Post('projects')
  async createProject(
    @Body('clientId', ParseIntPipe) clientId: number,
    @Body('country') country: string,
    @Body('services_needed') services_needed: string[],
    @Body('budget', ParseIntPipe) budget: number,
    @Body('status') status: string,
  ) {
    return this.projectsService.createProject(clientId, country, services_needed, budget, status);
  }

  @Get('clients/:clientId/projects')
  async getProjectsByClient(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.projectsService.getProjectsByClient(clientId);
  }

  @Post('vendors')
  async createVendor(
    @Body('name') name: string,
    @Body('countries_supported') countries_supported: string[],
    @Body('services_offered') services_offered: string[],
    @Body('rating', ParseIntPipe) rating: number,
    @Body('response_sla_hours', ParseIntPipe) response_sla_hours: number,
  ) {
    return this.projectsService.createVendor(name, countries_supported, services_offered, rating, response_sla_hours);
  }

  @Get('vendors')
  async getAllVendors() {
    return this.projectsService.getAllVendors();
  }

  @Post('matches')
  async createMatch(
    @Body('projectId', ParseIntPipe) projectId: number,
    @Body('vendorId', ParseIntPipe) vendorId: number,
    @Body('score', ParseIntPipe) score: number,
  ) {
    return this.projectsService.createMatch(projectId, vendorId, score);
  }

  @Get('test-matches/:projectId')
async getMatchesByProject(@Param('projectId', ParseIntPipe) projectId: number) {
  return this.projectsService.getMatchesByProject(projectId);
}

@Post(':id/matches/rebuild')
  async rebuildMatches(@Param('id', ParseIntPipe) projectId: number) {
    return this.projectsService.rebuildMatches(projectId);
  }
}