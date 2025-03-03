import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { Event } from '@app/common/types/event';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async handleEvents(@Body() incoming: Event | Event[]) {
    const events = Array.isArray(incoming) ? incoming : [incoming];

    this.logger.log(`Received ${events.length} events`);

    await this.eventsService.handleEvents(events);

    return { status: 'ok', received: events.length };
  }
}
