import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

/** Adapter so Nest can use PinoLogger (has info, not log) as LoggerService */
function pinoLoggerAdapter(pino: PinoLogger) {
  return {
    log: (message: unknown, ...args: unknown[]) => pino.info(message as string, ...args),
    error: (message: unknown, ...args: unknown[]) => pino.error(message as string, ...args),
    warn: (message: unknown, ...args: unknown[]) => pino.warn(message as string, ...args),
    debug: (message: unknown, ...args: unknown[]) => pino.debug(message as string, ...args),
    verbose: (message: unknown, ...args: unknown[]) => pino.debug(message as string, ...args),
    fatal: (message: unknown, ...args: unknown[]) => pino.fatal(message as string, ...args),
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const pinoLogger = await app.resolve(PinoLogger);
  pinoLogger.setContext(bootstrap.name);
  app.useLogger(pinoLoggerAdapter(pinoLogger));
  pinoLogger.info('Starting Jiu Tracker API...');

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
  pinoLogger.info(`Jiu Tracker API running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
