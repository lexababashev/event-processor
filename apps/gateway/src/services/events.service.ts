import { Injectable, Logger } from '@nestjs/common';
import { NatsClientService } from '@app/common/nats-client.service';
import { Event } from '@app/common/types/event';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly natsClientService: NatsClientService) {}

  async handleEvents(events: Event[]): Promise<void> {
    this.logger.log(`Publishing ${events.length} events to NATS...`);
    
    try {
      await Promise.all(events.map(event => this.natsClientService.publishEvent(event)));
      this.logger.log(`✅ Successfully published ${events.length} events`);
    } catch (error) {
      this.logger.error(`Failed to publish events: ${error.message}`, error.stack);
      throw error;
    }
  }
}
