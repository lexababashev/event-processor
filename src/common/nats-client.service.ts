import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, NatsConnection, JSONCodec } from 'nats';

@Injectable()
export class NatsClientService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private jsonCodec = JSONCodec();

  async onModuleInit() {
    this.nc = await connect({ servers: process.env.NATS_URL });
    console.log('Connected to NATS');
  }

  async onModuleDestroy() {
    await this.nc.close();
    console.log('Disconnected from NATS');
  }

  async publish(topic: string, data: any) {
    this.nc.publish(topic, this.jsonCodec.encode(data));
  }

  async subscribe(topic: string, callback: (data: any) => void) {
    const sub = this.nc.subscribe(topic);
    for await (const msg of sub) {
      callback(this.jsonCodec.decode(msg.data));
    }
  }
}