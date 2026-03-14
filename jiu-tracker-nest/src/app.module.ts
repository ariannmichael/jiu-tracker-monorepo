import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { TerminusModule } from '@nestjs/terminus';
import { getDatabaseConfig } from './config/database.config';
import { pinoLoggerConfig } from './common/logging/pino.config';
import { UserModule } from './modules/user/user.module';
import { TrainingModule } from './modules/training/training.module';
import { TechniqueModule } from './modules/technique/technique.module';
import { BeltModule } from './modules/belt/belt.module';
import { AnalyticModule } from './modules/analytic/analytic.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { HealthController } from './health.controller';
import { MetricsModule } from './metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MetricsModule,
    LoggerModule.forRoot(pinoLoggerConfig),
    TerminusModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    TrainingModule,
    TechniqueModule,
    BeltModule,
    AnalyticModule,
    SubscriptionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
