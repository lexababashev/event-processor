import { Injectable, Logger } from '@nestjs/common';
import { NatsClientService } from '@app/common/nats-client.service';
import { Event } from '@app/common/types/event';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly BATCH_SIZE = 1000;

  constructor(private readonly natsClientService: NatsClientService) {}

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async handleEvents(events: Event[]): Promise<void> {
    this.logger.log(`Publishing ${events.length} events to NATS...`);

    try {
      for (let i = 0; i < events.length; i += this.BATCH_SIZE) {
        const batch = events.slice(i, i + this.BATCH_SIZE);
        await Promise.all(batch.map((event) => this.natsClientService.publishEvent(event)));
        await this.delay(1000);
        this.logger.log(`✅ Successfully published ${this.BATCH_SIZE} events`);
      }
      this.logger.log(`✅ Successfully published TOTAL: ${events.length} events`);
    } catch (error) {
      this.logger.error(`Failed to publish events: ${error.message}`, error.stack);
      throw error;
    }
  }
}
