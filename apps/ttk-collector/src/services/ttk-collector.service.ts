import { Injectable, Logger } from '@nestjs/common';
import { JSONCodec } from 'nats';
import { PrismaService } from '@app/common/prisma.service';
import { NatsClientService } from '@app/common/nats-client.service';
import { TiktokEvent } from '@app/common/types/event';
import { TiktokDevice, Prisma } from '@prisma/client';
import { AckPolicy, DeliverPolicy } from 'nats';

@Injectable()
export class TtkCollectorService {
  private readonly logger = new Logger(TtkCollectorService.name);
  private readonly codec = JSONCodec<TiktokEvent>();

  constructor(
    private readonly natsClientService: NatsClientService,
    private readonly prisma: PrismaService,
  ) {}

  async subscribeToTiktokStream(): Promise<void> {
    try {
      const jetStream = this.natsClientService.getJetStream();
      const jsm = await this.natsClientService.getJetStreamManager();

      await jsm.consumers.add('TT_EVENTS', {
        durable_name: 'tiktok-events-consumer',
        ack_policy: AckPolicy.Explicit,
        deliver_policy: DeliverPolicy.All,
      });

      this.logger.log('✅ Consumer created for TT_EVENTS');

      const consumer = await jetStream.consumers.get(
        'TT_EVENTS',
        'tiktok-events-consumer',
      );
      this.logger.log('✅ Consumer "tiktok-events-consumer" attached');

      const sub = await consumer.consume();
      this.logger.log('✅ Subscribed to TT_EVENTS.new');

      (async () => {
        for await (const msg of sub) {
          try {
            const eventData = this.codec.decode(msg.data);

            //this.logger.debug(`Received TT event: ${eventData.eventId}`,);

            await this.storeTiktokEvent(eventData);
            msg.ack();

            //this.logger.log(`✅ Event ${eventData.eventId} acknowledged`);
            
          } catch (err) {
            this.logger.error(`❌ Failed to process TT event: ${err.message}`);
          }
        }
      })();
    } catch (error) {
      this.logger.error(
        `❌ Error subscribing to Tiktok events: ${error.message}`,
      );
    }
  }

  private async storeTiktokEvent(event: TiktokEvent) {
    try {
      const { user, engagement } = event.data;

      const result = await this.prisma.event.create({
        data: {
          eventId: event.eventId,
          timestamp: new Date(event.timestamp),
          source: 'tiktok',
          funnelStage: event.funnelStage,
          eventType: event.eventType,
          tiktokEventData: {
            create: {
              userId: user.userId,
              username: user.username,
              followers: user.followers,
              watchTime:
                'watchTime' in engagement ? engagement.watchTime : null,
              percentageWatched:
                'percentageWatched' in engagement
                  ? engagement.percentageWatched
                  : null,
              device:
                'device' in engagement
                  ? (engagement.device as TiktokDevice)
                  : null,
              country: 'country' in engagement ? engagement.country : null,
              videoId: 'videoId' in engagement ? engagement.videoId : null,
              actionTime:
                'actionTime' in engagement
                  ? new Date(engagement.actionTime)
                  : null,
              profileId:
                'profileId' in engagement ? engagement.profileId : null,
              purchasedItem:
                'purchasedItem' in engagement ? engagement.purchasedItem : null,
              purchaseAmount:
                'purchaseAmount' in engagement && engagement.purchaseAmount
                  ? new Prisma.Decimal(engagement.purchaseAmount)
                  : null,
            },
          },
        },
        include: {
          tiktokEventData: true,
        },
      });

      //this.logger.log(`Stored TT event [${event.eventId}] successfully.`);

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to store Tiktok event ${event.eventId}: ${error.message}`,
      );
      throw new Error(`Database transaction failed: ${error.message}`);
    }
  }

  async testStoreEvent(eventData: TiktokEvent) {
    this.logger.log(`Received test event: ${eventData.eventId}`);
    try {
      const result = await this.storeTiktokEvent(eventData);
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
