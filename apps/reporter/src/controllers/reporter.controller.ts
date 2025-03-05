import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reporter.service';
import { EventFilter, EventFilterSchema } from '../schemas/event-filter.schema';
import { RevenueFilterSchema } from '../schemas/revenue-filter.schema';
import { DemographicsFilterSchema } from '../schemas/demographics-filter.schema';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('events')
  async getEvents(@Query() query: Record<string, any>) {
    const result = EventFilterSchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }
    return this.reportsService.getEventStats(result.data);
  }

  @Get('revenue')
  async getRevenue(@Query() query: Record<string, any>) {
    const result = RevenueFilterSchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }
    return this.reportsService.getRevenueStats(result.data);
  }

  @Get('demographics')
  async getDemographics(@Query() query: Record<string, any>) {
    const result = DemographicsFilterSchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }
    return this.reportsService.getDemographics(result.data);
  }
}