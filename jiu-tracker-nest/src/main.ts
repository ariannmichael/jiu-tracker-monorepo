import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { Logger, PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  // Allow larger JSON payloads (e.g. avatar as base64) – default is 100kb
  app.useBodyParser('json', { limit: '10mb' });
  app.useLogger(app.get(Logger));
  app.flushLogs();

  const pinoLogger = await app.resolve(PinoLogger);
  pinoLogger.setContext('Bootstrap');
  pinoLogger.info('Starting Jiu Tracker API');

  // Enable validation pipes (equivalent to Gin's ShouldBindJSON validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for mobile app
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Enable cookie parsing (for JWT auth via cookies, matching Go backend)
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3006);

  await app.listen(port);
  pinoLogger.info({ port }, 'Jiu Tracker API listening');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
