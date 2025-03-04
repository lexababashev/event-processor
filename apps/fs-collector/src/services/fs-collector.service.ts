import { Injectable, Logger } from '@nestjs/common';
import { JSONCodec } from 'nats';
import { PrismaService } from './prisma.service';
import { NatsClientService } from '@app/common/nats-client.service';
import { FacebookEvent } from '@app/common/types/event';
import {
  Browser,
  ClickPosition,
  Device,
  FacebookReferrer,
  Gender,
  Prisma,
} from '@prisma/client';
import { AckPolicy, DeliverPolicy } from 'nats';

@Injectable()
export class FsCollectorService {
  private readonly logger = new Logger(FsCollectorService.name);
  private readonly codec = JSONCodec<FacebookEvent>();

  constructor(
    private readonly natsClientService: NatsClientService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Subscribes exclusively to the "FB_EVENTS.new" subject from JetStream.
   */
  async subscribeToFacebookStream(): Promise<void> {
    try {
      const jetStream = this.natsClientService.getJetStream();
      const jsm = await this.natsClientService.getJetStreamManager();

      // Создаем consumer (если он не существует)
      await jsm.consumers.add('FB_EVENTS', {
        durable_name: 'facebook-events-consumer',
        ack_policy: AckPolicy.Explicit,
        deliver_policy: DeliverPolicy.All,
      });

      this.logger.log('✅ Consumer created for FB_EVENTS');

      // Подключаемся к созданному consumer
      const consumer = await jetStream.consumers.get(
        'FB_EVENTS',
        'facebook-events-consumer',
      );
      this.logger.log('✅ Consumer "facebook-events-consumer" attached');

      // Читаем сообщения потоком
      const sub = await consumer.consume();
      this.logger.log('✅ Subscribed to FB_EVENTS.new');

      (async () => {
        for await (const msg of sub) {
          try {
            const eventData = this.codec.decode(msg.data);

            //this.logger.debug(`Received FB event: ${eventData.eventId}`,);

            await this.storeFacebookEvent(eventData);
            msg.ack();

            //this.logger.log(`✅ Event ${eventData.eventId} acknowledged`);
          } catch (err) {
            this.logger.error(`❌ Failed to process FB event: ${err.message}`);
          }
        }
      })();
    } catch (error) {
      this.logger.error(
        `❌ Error subscribing to Facebook events: ${error.message}`,
      );
    }
  }

  /**
   * Stores a Facebook event in the database using Prisma.
   */
  private async storeFacebookEvent(event: FacebookEvent) {
    try {
      const { user, engagement } = event.data;

      const result = await this.prisma.event.create({
        data: {
          eventId: event.eventId,
          timestamp: new Date(event.timestamp),
          source: 'facebook',
          funnelStage: event.funnelStage,
          eventType: event.eventType,
          facebookEventData: {
            create: {
              userId: user.userId,
              name: user.name,
              age: user.age,
              gender:
                user.gender === 'non-binary'
                  ? 'non_binary'
                  : (user.gender as Gender),
              locCountry: user.location.country,
              locCity: user.location.city,
              actionTime:
                'actionTime' in engagement && engagement.actionTime
                  ? new Date(engagement.actionTime)
                  : null,
              referrer:
                'referrer' in engagement
                  ? (engagement.referrer as FacebookReferrer)
                  : null,
              videoId: 'videoId' in engagement ? engagement.videoId : null,
              adId: 'adId' in engagement ? engagement.adId : null,
              campaignId:
                'campaignId' in engagement ? engagement.campaignId : null,
              clickPosition:
                'clickPosition' in engagement
                  ? (engagement.clickPosition as ClickPosition)
                  : null,
              device:
                'device' in engagement ? (engagement.device as Device) : null,
              browser:
                'browser' in engagement
                  ? (engagement.browser as Browser)
                  : null,
              purchaseAmount:
                'purchaseAmount' in engagement && engagement.purchaseAmount
                  ? new Prisma.Decimal(engagement.purchaseAmount)
                  : null,
            },
          },
        },
        include: {
          facebookEventData: true,
        },
      });

      //this.logger.log(`Stored Facebook event [${event.eventId}] successfully.`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to store Facebook event ${event.eventId}: ${error.message}`,
      );
      throw new Error(`Database transaction failed: ${error.message}`);
    }
  }

  /**
   * A simple test method to manually insert a sample Facebook event into the DB.
   */
  async testStoreEvent(eventData: FacebookEvent) {
    this.logger.log(`Received test event: ${eventData.eventId}`);
    try {
      const result = await this.storeFacebookEvent(eventData);
      this.logger.log('Test event stored successfully');
      return {
        success: true,
        message: 'Event stored successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Test event storage failed: ${error.message}`);
      return {
        success: false,
        message: `Failed to store event: ${error.message}`,
      };
    }
  }
}
