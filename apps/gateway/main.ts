import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './src/gateway.module';
import { Logger } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.use(json({ limit: '100mb' }));

  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`✅ Gateway is running on http://localhost:${port}`);
}
bootstrap();
