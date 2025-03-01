import { Injectable, Logger } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { NatsClientService } from '../../common/nats-client.service';
import { Event } from '../../common/types/event';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private eventQueue: Queue;

  constructor(private readonly natsClientService: NatsClientService) {
    this.eventQueue = new Queue('eventsQueue', {
      connection: { host: 'localhost', port: 6379 },
    });

    new Worker(
      'eventsQueue',
      async (job) => {
        const event: Event = job.data;
        try {
          await this.natsClientService.publishEvent(event);
        } catch (error) {
          this.logger.error(`Failed to publish event: ${error.message}`, error.stack);
          throw error; // Чтобы повторить попытку при сбоях
        }
      },
      {
        connection: { host: 'localhost', port: 6379 },
        concurrency: 10, // Количество параллельных обработчиков
      },
    );
  }

  async handleEvents(events: Event[]): Promise<void> {
    this.logger.log(`Processing ${events.length} events...`);
  
    const chunkSize = 500; // Размер батча
    for (let i = 0; i < events.length; i += chunkSize) {
      const batch = events.slice(i, i + chunkSize);
      await this.eventQueue.addBulk(
        batch.map((event) => ({
          name: 'publishEvent',
          data: event,
        }))
      );
    }
  
    this.logger.log(`✅ Added ${events.length} events to queue`);
  }  
}
