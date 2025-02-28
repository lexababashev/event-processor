import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway/gateway.module';
import { Logger } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  // Создаем приложение на базе NestJS
  const app = await NestFactory.create(GatewayModule);
  // Увеличиваем максимальный допустимый размер JSON
  app.use(json({ limit: '100mb' }));

  // Стартуем на порте из переменных окружения (или 3000 по умолчанию)
  const port = process.env.GATEWAY_PORT || 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`✅ Gateway is running on http://localhost:${port}`);
}
bootstrap();