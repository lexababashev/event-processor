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
import { Event } from '../types/event';

@Injectable()
export class NatsClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NatsClientService.name);
  private natsConnection!: NatsConnection;
  private jetStream!: JetStreamClient;
  private readonly codec = JSONCodec();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // Инициируем соединение с NATS
    const natsUrl = this.configService.get<string>('NATS_URL', 'nats://localhost:4222');
    this.natsConnection = await connect({ servers: natsUrl });
    this.jetStream = this.natsConnection.jetstream();

    // Убеждаемся, что JetStream-сервисы готовы
    await this.ensureStreamExists('FB_EVENTS', ['FB_EVENTS.*']);
    await this.ensureStreamExists('TT_EVENTS', ['TT_EVENTS.*']);

    this.logger.log('✅ Connected to NATS and JetStream is set up');
  }

  async ensureStreamExists(streamName: string, subjects: string[]) {
    try {
      const jsm = await this.natsConnection.jetstreamManager();
      // Проверяем, существует ли стрим
      const info = await jsm.streams.info(streamName);
      this.logger.log(`Stream [${streamName}] already exists (subjects: ${info.config.subjects.join(', ')})`);
    } catch (error) {
      // Если стрима нет, пытаемся создать
      if (error.message.includes('stream not found')) {
        try {
          const jsm = await this.natsConnection.jetstreamManager();
          await jsm.streams.add({
            name: streamName,
            subjects,
            retention: RetentionPolicy.Limits,
            max_msgs: 4000000,
            max_bytes: 1024 * 1024 * 1024 * 10, // 10GB limit
            discard: DiscardPolicy.Old,
            storage: StorageType.File,
          });
          this.logger.log(`✅ Created stream [${streamName}] with subjects: ${subjects.join(', ')}`);
        } catch (createError) {
          this.logger.error(`Failed to create stream [${streamName}]: ${createError.message}`);
        }
      } else {
        this.logger.error(`Error checking stream [${streamName}]: ${error.message}`);
      }
    }
  }

  /**
   * Публикуем событие в JetStream
   */
  async publishEvent(event: Event) {
    // Определяем сабджект в зависимости от source
    const subject = this.getSubject(event);
    if (!subject) {
      this.logger.error(`Unknown event source: ${event.source}`);
      return;
    }
    try {
      // Публикуем
      await this.jetStream.publish(subject, this.codec.encode(event));
    } catch (err: any) {
      this.logger.error(`❌ Failed to publish event to subject [${subject}]: ${err.message}`);
      throw err;
    }
  }

  private getSubject(event: Event): string | null {
    if (event.source === 'facebook') return 'FB_EVENTS.new';
    if (event.source === 'tiktok') return 'TT_EVENTS.new';
    return null;
  }

  async onModuleDestroy() {
    // Корректно завершаем соединение
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