import { NestFactory } from '@nestjs/core';
import { CollectorsModule } from './collectors/collectors.module';

async function bootstrap() {
  const app = await NestFactory.create(CollectorsModule);
  await app.listen(3001);
}
bootstrap();
