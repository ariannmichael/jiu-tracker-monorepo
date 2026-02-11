import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingSession } from './domain/training-session.entity';
import { TrainingRepository } from './infrastructure/training.repository';
import { TrainingService } from './application/training.service';
import { TrainingController } from './presentation/training.controller';
import { TechniqueModule } from '../technique/technique.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingSession]), TechniqueModule],
  controllers: [TrainingController],
  providers: [TrainingRepository, TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
