import { Injectable, Logger } from '@nestjs/common';
import { NatsClientService } from '../../common/nats-client.service';
import { Event } from '../../common/types/event';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly natsClientService: NatsClientService) {}

  async handleEvents(events: Event[]): Promise<void> {
    this.logger.log(`Processing ${events.length} events...`);

    // Публикуем события в NATS параллельно
    await Promise.all(events.map((event) => this.natsClientService.publishEvent(event)));

    this.logger.log(`✅ Published ${events.length} events to NATS`);
  }
}