import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Analytic } from './domain/analytic.entity';
import { Insight } from './domain/insight.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnalyticController } from './presentation/analytic.controller';
import { AnalyticService } from './application/analytic.service';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { AnalyticRepository } from './infrastructure/analytic.repository';
import { UserModule } from '../user/user.module';
import { TrainingModule } from '../training/training.module';
import { ANALYTICS_QUEUE_NAME } from './application/listeners/training-event.listener';
import { TrainingEventListener } from './application/listeners/training-event.listener';
import { AnalyticsProcessor } from './application/processors/analytics.processor';
import { InsightRepository } from './infrastructure/insight.repository';
import { InsightService } from './application/insight.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analytic, Insight]),
    BullModule.registerQueue({ name: ANALYTICS_QUEUE_NAME }),
    PassportModule,
    UserModule,
    TrainingModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AnalyticController],
  providers: [
    AnalyticRepository,
    AnalyticService,
    InsightRepository,
    InsightService,
    JwtStrategy,
    TrainingEventListener,
    AnalyticsProcessor,
  ],
  exports: [AnalyticRepository, AnalyticService, InsightService],
})
export class AnalyticModule {}
