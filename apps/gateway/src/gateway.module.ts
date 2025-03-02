import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { NatsClientService } from '@app/common/nats-client.service';

@Module({
  imports: [
    // Загружаем переменные окружения из .env (при наличии)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService, NatsClientService],
})
export class GatewayModule {}