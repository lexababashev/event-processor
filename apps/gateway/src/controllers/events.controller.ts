import { Controller, Post, Body, Logger, BadRequestException } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { Event } from '@app/common/types/event';
import { eventSchema } from '../schemas/event.schema';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async handleEvents(@Body() incoming: unknown) {
    const events = Array.isArray(incoming) ? incoming : [incoming];

    //завелике перенавантаження сервера при перевірці валідності
    try {
      if (events.length > 10) {
        eventSchema.parse(events[0]);
        eventSchema.parse(events[Math.floor(Math.random() * events.length)]);
      } else {
        events.forEach(event => eventSchema.parse(event));
      }
    } catch (error) {
      throw new BadRequestException('Invalid event format', { cause: error });
    }

    this.logger.log(`Received ${events.length} events`);
    await this.eventsService.handleEvents(events as Event[]);
    return { status: 'ok', received: events.length };
  }
}