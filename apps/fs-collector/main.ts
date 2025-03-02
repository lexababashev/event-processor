import { NestFactory } from '@nestjs/core';
import { FSCollectorModule } from './src/fs-collector.module';

async function bootstrap() {
  const app = await NestFactory.create(FSCollectorModule);
  await app.listen(process.env.FS_COLLECTOR_PORT || 3001);
}
bootstrap();
