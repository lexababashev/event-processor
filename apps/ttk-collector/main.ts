import { NestFactory } from '@nestjs/core';
import { TtkCollectorModule } from './src/ttk-collector.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TtkCollectorModule);
  const port = process.env.TTK_COLLECTOR_PORT || 3001;

  await app.listen(port, '0.0.0.0');

  Logger.log(`✅ Tiktok collector is running on http://localhost:${port}`);
}
bootstrap();
