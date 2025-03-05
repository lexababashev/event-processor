import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  controllers: [ReportsController],
  providers: [ReportsService, PrismaClient],
})
export class ReporterModule {}