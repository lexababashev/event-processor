import { NestFactory } from '@nestjs/core';
import { TTKCollectorModule } from './src/ttk-collector.module';

async function bootstrap() {
  const app = await NestFactory.create(TTKCollectorModule);
  await app.listen(process.env.TTK_COLLECTOR_PORT || 3002);
}
bootstrap();
