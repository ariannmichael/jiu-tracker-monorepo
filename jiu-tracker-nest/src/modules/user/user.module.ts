import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { User } from './domain/user.entity';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './application/user.service';
import { UserController } from './presentation/user.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { BeltModule } from '../belt/belt.module';
import { Insight } from '../analytic/domain/insight.entity';
import { Analytic } from '../analytic/domain/analytic.entity';
import { TrainingSession } from '../training/domain/training-session.entity';
import { BeltProgress } from '../belt/domain/belt-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Insight,
      Analytic,
      TrainingSession,
      BeltProgress,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    BeltModule,
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService, JwtStrategy],
  exports: [UserService, UserRepository],
})
export class UserModule {}
