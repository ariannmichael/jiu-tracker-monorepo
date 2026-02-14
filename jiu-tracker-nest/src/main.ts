import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);

  logger.log('Starting Jiu Tracker API...');

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
  logger.log(`Jiu Tracker API running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
