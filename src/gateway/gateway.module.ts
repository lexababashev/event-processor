import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { NatsClientService } from '../common/nats-client.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, NatsClientService],
})
export class GatewayModule {}