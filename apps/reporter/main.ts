import { NestFactory } from '@nestjs/core';
import { ReporterModule } from './src/reporter.module';

async function bootstrap() {
  const app = await NestFactory.create(ReporterModule);
  await app.listen(process.env.REPORTER_PORT || 3003);
}
bootstrap();
