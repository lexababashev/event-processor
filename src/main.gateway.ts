import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway/gateway.module';
import { json } from 'express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.use(json({ limit: '100mb' }));

  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Gateway is running on http://localhost:${port}`);
}
bootstrap();
