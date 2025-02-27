import { Controller, Post, Body, Logger } from '@nestjs/common';
import { NatsClientService } from '../../common/nats-client.service';
import { z } from 'zod';

const EventSchema = z.object({
  // Define the schema based on your event structure
});

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly natsClientService: NatsClientService) {}

  @Post()
  async handleEvent(@Body() body: any) {
    try {
      const parsedEvent = EventSchema.parse(body);
      await this.natsClientService.publish('event.topic', parsedEvent);
      this.logger.log('Event published to NATS');
    } catch (e) {
      this.logger.error('Invalid event format', e);
      throw e;
    }
  }
}
