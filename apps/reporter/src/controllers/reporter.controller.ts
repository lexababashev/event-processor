import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reporter.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('events')
  async getEvents(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('source') source?: string,
    @Query('funnelStage') funnelStage?: string,
    @Query('eventType') eventType?: string,
  ) {
    return this.reportsService.getEventStats({ from, to, source, funnelStage, eventType });
  }

  @Get('revenue')
  async getRevenue(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('source') source?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.reportsService.getRevenueStats({ from, to, source, campaignId });
  }

  @Get('demographics')
  async getDemographics(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('source') source?: string,
  ) {
    return this.reportsService.getDemographics({ from, to, source });
  }
}