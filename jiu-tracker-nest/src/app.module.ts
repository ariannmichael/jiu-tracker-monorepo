import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { TrainingModule } from './modules/training/training.module';
import { TechniqueModule } from './modules/technique/technique.module';
import { BeltModule } from './modules/belt/belt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    UserModule,
    TrainingModule,
    TechniqueModule,
    BeltModule,
  ],
})
export class AppModule {}
