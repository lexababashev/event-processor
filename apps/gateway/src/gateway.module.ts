import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { NatsClientService } from '@app/common/nats-client.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    // .env file is loaded in the root module
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register(),
  ],
  controllers: [EventsController],
  providers: [EventsService, NatsClientService],
})
export class GatewayModule {}
