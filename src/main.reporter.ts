import { NestFactory } from '@nestjs/core';
import { ReporterModule } from './reporter/reporter.module';

async function bootstrap() {
  const app = await NestFactory.create(ReporterModule);
  await app.listen(3002);
}
bootstrap();
