import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { Event } from '../../common/types/event';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async handleEvent(@Body() event: Event) {
    await this.eventsService.handleEvent(event);
    return { status: 'Event received' };
  }
}