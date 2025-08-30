import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CustomJwtGuard } from '../auth/custom-jwt.guard';

@Controller('analytics')
@UseGuards(CustomJwtGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  async getTopVendors() {
    return this.analyticsService.getTopVendors();
  }
}