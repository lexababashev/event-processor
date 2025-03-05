import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

interface EventFilter {
  from?: string;
  to?: string;
  source?: string;
  funnelStage?: string;
  eventType?: string;
}

interface RevenueFilter {
  from?: string;
  to?: string;
  source?: string;
  campaignId?: string;
}

interface DemographicsFilter {
  from?: string;
  to?: string;
  source?: string;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Aggregated event statistics with optional filters.
   */
  async getEventStats(filters: EventFilter) {
    const { from, to, source, funnelStage, eventType } = filters;

    // Example: use date range and optional filters for events
    const where: any = {};
    if (from) where.timestamp = { ...where.timestamp, gte: new Date(from) };
    if (to) where.timestamp = { ...where.timestamp, lte: new Date(to) };
    if (source) where.source = source;
    if (funnelStage) where.funnelStage = funnelStage;
    if (eventType) where.eventType = eventType;

    // Simple count and group by example
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
  }

  /**
   * Aggregated revenue data from Facebook / Tiktok events.
   * For example, sum related fields in facebook or tiktok data.
   */
  async getRevenueStats(filters: RevenueFilter) {
    const { from, to, source, campaignId } = filters;
    const baseWhere: any = {};
    if (from) baseWhere.timestamp = { ...baseWhere.timestamp, gte: new Date(from) };
    if (to) baseWhere.timestamp = { ...baseWhere.timestamp, lte: new Date(to) };
    if (source) baseWhere.source = source;

    // Example for summing purchaseAmount from Facebook or Tiktok
    // If campaignId is provided, filter further (e.g., only for facebookEventData).
    if (campaignId) {
      baseWhere.facebookEventData = { campaignId };
    }

    // Sum from Facebook
    const fbSum = await this.prisma.facebookEventData.aggregate({
      _sum: { purchaseAmount: true },
      where: {
        ...baseWhere.facebookEventData,
        event: baseWhere,
      },
    });

    // Sum from Tiktok
    const ttSum = await this.prisma.tiktokEventData.aggregate({
      _sum: { purchaseAmount: true },
      where: {
        event: baseWhere,
      },
    });

    return {
      facebook: fbSum._sum.purchaseAmount || 0,
      tiktok: ttSum._sum.purchaseAmount || 0,
    };
  }

  /**
   * Returns user demographic data with filters depending on source.
   */
  async getDemographics(filters: DemographicsFilter) {
    const { from, to, source } = filters;
    const baseWhere: any = {};
    if (from) baseWhere.timestamp = { ...baseWhere.timestamp, gte: new Date(from) };
    if (to) baseWhere.timestamp = { ...baseWhere.timestamp, lte: new Date(to) };
    if (source) baseWhere.source = source;

    // Example approach:
    // For Facebook events, gather average age, gender distribution...
    const fbData = await this.prisma.facebookEventData.groupBy({
      by: ['gender'],
      where: {
        event: baseWhere,
      },
      _avg: {
        age: true,
      },
      _count: {
        _all: true,
      },
    });

    // For Tiktok, gather total followers, etc.
    const ttData = await this.prisma.tiktokEventData.groupBy({
      by: ['device'],
      where: {
        event: baseWhere,
      },
      _avg: {
        followers: true,
      },
      _count: {
        _all: true,
      },
    });

    return {
      facebookDemographics: fbData,
      tiktokDemographics: ttData,
    };
  }
}