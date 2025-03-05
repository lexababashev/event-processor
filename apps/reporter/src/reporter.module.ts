import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reporter.controller';
import { ReportsService } from './services/reporter.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  controllers: [ReportsController],
  providers: [ReportsService, PrismaClient],
})
export class ReporterModule {}