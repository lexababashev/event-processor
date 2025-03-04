import { Module, OnModuleInit } from '@nestjs/common';
import { TtkCollectorService } from './services/ttk-collector.service';
import { TtkCollectorController } from './controllers/ttk-collector.controller';
import { NatsClientService } from '@app/common/nats-client.service';
import { PrismaService } from '@app/common/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TtkCollectorController],
  providers: [TtkCollectorService, NatsClientService, PrismaService],
})
export class TtkCollectorModule implements OnModuleInit {
  constructor(private readonly ttkCollectorService: TtkCollectorService) {}

  async onModuleInit() {
    await this.ttkCollectorService.subscribeToTiktokStream();
  }
}