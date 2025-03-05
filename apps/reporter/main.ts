import { NestFactory } from '@nestjs/core';
import { ReporterModule } from './src/reporter.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ReporterModule);
  const port = process.env.REPORTER_PORT || 3003;

  await app.listen(port, '0.0.0.0');

  Logger.log(`✅ Reporter is running on http://localhost:${port}`);
}
bootstrap();
