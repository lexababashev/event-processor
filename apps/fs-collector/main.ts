import { NestFactory } from '@nestjs/core';
import { FsCollectorModule } from './src/fs-collector.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(FsCollectorModule);
  const port = process.env.FS_COLLECTOR_PORT || 3002;

  await app.listen(port, '0.0.0.0');

  Logger.log(`✅ Facebook collector is running on http://localhost:${port}`);
}
bootstrap();
