import { Controller, Post, Body, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ZodError, z } from 'zod';

const facebookEventSchema = z.object({
  platform: z.literal('facebook'),
  eventType: z.string(),
  data: z.any(),
});

const tiktokEventSchema = z.object({
  platform: z.literal('tiktok'),
  eventType: z.string(),
  data: z.any(),
});

const eventSchema = z.union([facebookEventSchema, tiktokEventSchema]);

@Controller('events')
export class EventsController {
  private logger = new Logger(EventsController.name);

  constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) {}

  @Post()
  async receiveEvent(@Body() body: any) {
    try {
      const event = eventSchema.parse(body);

      const topic = event.platform === 'facebook' ? 'facebook.events' : 'tiktok.events';

      this.logger.log(`Publishing event to ${topic}: ${JSON.stringify(event)}`);
      await this.natsClient.emit(topic, event);
      return { success: true };
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.warn(`Validation error: ${error.message}`);
        return { success: false, error: error.errors };
      }
      this.logger.error('Unexpected error processing event', error);
      throw error;
    }
  }
}
