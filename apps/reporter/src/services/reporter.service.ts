import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EventFilter, RevenueFilter, DemographicsFilter } from '../types/filters';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaClient) {}

  async getEventStats(filters: EventFilter) {
    try {
      const { from, to, source, funnelStage, eventType } = filters;
      const where: any = {};
      if (from) where.timestamp = { ...where.timestamp, gte: new Date(from) };
      if (to) where.timestamp = { ...where.timestamp, lte: new Date(to) };
      if (source) where.source = source;
      if (funnelStage) where.funnelStage = funnelStage;
      if (eventType) where.eventType = eventType;

      const events = await this.prisma.event.groupBy({
        by: ['eventType'],
        where,
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            eventType: 'desc',
          },
        },
      });

      return { events };
    } catch (error) {
      this.logger.error('Error fetching event stats', error);
      throw new InternalServerErrorException('Database query failed');
    }
  }

  async getRevenueStats(filters: RevenueFilter) {
    try {
      const { from, to, source, campaignId } = filters;
      const baseWhere: any = {};
      if (from) baseWhere.timestamp = { ...baseWhere.timestamp, gte: new Date(from) };
      if (to) baseWhere.timestamp = { ...baseWhere.timestamp, lte: new Date(to) };
      if (source) baseWhere.source = source;

      if (campaignId) {
        baseWhere.campaignId = campaignId;
      }

      const [fbSum, ttSum] = await Promise.all([
        this.prisma.facebookEventData.aggregate({
          _sum: { purchaseAmount: true },
          where: { event: baseWhere },
        }),
        this.prisma.tiktokEventData.aggregate({
          _sum: { purchaseAmount: true },
          where: { event: baseWhere },
        }),
      ]);

      return {
        facebook: fbSum._sum.purchaseAmount || 0,
        tiktok: ttSum._sum.purchaseAmount || 0,
      };
    } catch (error) {
      this.logger.error('Error fetching revenue stats', error);
      throw new InternalServerErrorException('Database query failed');
    }
  }
  
  async getDemographics(filters: DemographicsFilter) {
    try {
      const { from, to, source } = filters;
      const baseWhere: any = {};
      if (from) baseWhere.timestamp = { ...baseWhere.timestamp, gte: new Date(from) };
      if (to) baseWhere.timestamp = { ...baseWhere.timestamp, lte: new Date(to) };
      if (source) baseWhere.source = source;
  
      const [fbData, ttData] = await Promise.all([
        this.prisma.facebookEventData.groupBy({
          by: ['gender'],
          where: { event: baseWhere },
          _avg: { age: true },
          _count: { _all: true },
        }),
        this.prisma.tiktokEventData.groupBy({
          by: ['device'],
          where: { event: baseWhere },
          _avg: { followers: true },
          _count: { _all: true },
        }),
      ]);
  
      return {
        facebookDemographics: fbData,
        tiktokDemographics: ttData,
      };
    } catch (error) {
      this.logger.error('Error fetching demographic data', error);
      throw new InternalServerErrorException('Database query failed');
    }
  }
}