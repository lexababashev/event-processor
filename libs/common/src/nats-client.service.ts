import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import {
  connect,
  NatsConnection,
  JetStreamClient,
  JSONCodec,
  RetentionPolicy,
  StorageType,
  DiscardPolicy,
} from 'nats';
import { ConfigService } from '@nestjs/config';
import { Event } from './types/event';

@Injectable()
export class NatsClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NatsClientService.name);
  private natsConnection!: NatsConnection;
  private jetStream!: JetStreamClient;
  private readonly codec = JSONCodec();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const natsUrl = this.configService.get<string>(
      'NATS_URL',
      'nats://localhost:4222',
    );
    this.natsConnection = await connect({ servers: natsUrl });
    this.jetStream = this.natsConnection.jetstream();

    await this.ensureStreamExists('FB_EVENTS', ['FB_EVENTS.*']);
    await this.ensureStreamExists('TT_EVENTS', ['TT_EVENTS.*']);

    this.logger.log('✅ Connected to NATS and JetStream is set up');
  }

  getJetStream(): JetStreamClient {
    return this.jetStream;
  }

  getJetStreamManager() {
    return this.natsConnection.jetstreamManager();
  }

  async ensureStreamExists(streamName: string, subjects: string[]) {
    try {
      const jsm = await this.natsConnection.jetstreamManager();
      const info = await jsm.streams.info(streamName);
      this.logger.log(
        `Stream [${streamName}] already exists (subjects: ${info.config.subjects.join(', ')})`,
      );
    } catch (error) {
      if (error.message.includes('stream not found')) {
        try {
          const jsm = await this.natsConnection.jetstreamManager();
          await jsm.streams.add({
            name: streamName,
            subjects,
            retention: RetentionPolicy.Limits,
            max_msgs: 300000,
            max_bytes: 1024 * 1024 * 1024 * 0.75, // 0.75GB limit
            discard: DiscardPolicy.Old,
            storage: StorageType.File,
          });
          this.logger.log(
            `✅ Created stream [${streamName}] with subjects: ${subjects.join(', ')}`,
          );
        } catch (createError) {
          this.logger.error(
            `Failed to create stream [${streamName}]: ${createError.message}`,
          );
        }
      } else {
        this.logger.error(
          `Error checking stream [${streamName}]: ${error.message}`,
        );
      }
    }
  }

  async publishEvent(event: Event) {
    const subject = this.getSubject(event);
    if (!subject) {
      this.logger.error(`Unknown event source: ${event.source}`);
      return;
    }
    try {
      await this.jetStream.publish(subject, this.codec.encode(event));
    } catch (err: any) {
      this.logger.error(
        `❌ Failed to publish event to subject [${subject}]: ${err.message}`,
      );
      throw err;
    }
  }

  private getSubject(event: Event): string | null {
    if (event.source === 'facebook') return 'FB_EVENTS.new';
    if (event.source === 'tiktok') return 'TT_EVENTS.new';
    return null;
  }

  async onModuleDestroy() {
    try {
      this.logger.log('Draining NATS connection...');
      await this.natsConnection.drain();
      await this.natsConnection.close();
      this.logger.log('✅ NATS connection closed gracefully');
    } catch (err) {
      this.logger.error(`❌ Error on closing NATS connection: ${err.message}`);
    }
  }
}
