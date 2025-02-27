import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { NatsClientService } from '../common/nats-client.service';

@Module({
  controllers: [EventsController],
  providers: [
    NatsClientService,
    {
      provide: 'NATS_SERVICE',
      useClass: NatsClientService,
    },
  ],
  exports: ['NATS_SERVICE'],
})
export class GatewayModule {}
