import { Injectable } from '@nestjs/common';
import { NatsClientService } from '../../common/nats-client.service';
import { Event } from '../../common/types/event';

@Injectable()
export class EventsService {
  constructor(private readonly natsClient: NatsClientService) {}

  async handleEvent(event: Event) {
    const topic = `events.${event.source}`;
    //await this.natsClient.publish(topic, event);
    console.log(event);
    console.log(`Event published to ${topic}`);
  }
}