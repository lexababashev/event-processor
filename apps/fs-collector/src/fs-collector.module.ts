import { Module, OnModuleInit } from '@nestjs/common';
import { FsCollectorService } from './services/fs-collector.service';
import { FsCollectorController } from './controllers/fs-collector.controller';
import { NatsClientService } from '@app/common/nats-client.service';
import { PrismaService } from './services/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // .env file is loaded in the root module
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FsCollectorController],
  providers: [FsCollectorService, NatsClientService, PrismaService],
})
export class FsCollectorModule implements OnModuleInit {
  constructor(private readonly fsCollectorService: FsCollectorService) {}

  async onModuleInit() {
    await this.fsCollectorService.subscribeToFacebookStream();
  }
}
