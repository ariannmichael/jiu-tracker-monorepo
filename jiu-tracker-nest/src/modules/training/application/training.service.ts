import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrainingRepository } from '../infrastructure/training.repository';
import { TechniqueService } from '../../technique/application/technique.service';
import { TrainingSession } from '../domain/training-session.entity';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import {
  TrainingCreatedEvent,
  TrainingUpdatedEvent,
  TrainingDeletedEvent,
} from '../domain/events';

@Injectable()
export class TrainingService {
  private readonly logger = new Logger(TrainingService.name);

  constructor(
    private readonly trainingRepo: TrainingRepository,
    private readonly techniqueService: TechniqueService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createTraining(dto: CreateTrainingDto): Promise<TrainingSession> {
    this.logger.debug({
      event: 'training.create.requested',
      userId: dto.user_id,
      duration: dto.duration,
      submitTechniqueCount: dto.submit_using_options_ids.length,
      tappedByTechniqueCount: dto.tapped_by_options_ids.length,
    });

    try {
      const submitUsingTechniques =
        await this.techniqueService.getTechniquesByIds(
          dto.submit_using_options_ids,
        );
      const tappedByTechniques = await this.techniqueService.getTechniquesByIds(
        dto.tapped_by_options_ids,
      );

      const trainingSession: Partial<TrainingSession> = {
        userId: dto.user_id,
        submit_using_options: submitUsingTechniques,
        tapped_by_options: tappedByTechniques,
        duration: dto.duration,
        notes: dto.notes ?? '',
        is_open_mat: dto.is_open_mat,
        is_gi: dto.is_gi ?? true,
        date: dto.date,
      };

      const training =
        await this.trainingRepo.createTrainingSession(trainingSession);
      const idempotencyKey = `training.created:${training.id}`;
      this.eventEmitter.emit(
        'training.created',
        new TrainingCreatedEvent(dto.user_id, training.id, idempotencyKey),
      );

      this.logger.log({
        event: 'training.create.completed',
        trainingId: training.id,
        userId: dto.user_id,
      });

      return training;
    } catch (error) {
      this.logger.error({
        err: error,
        event: 'training.create.failed',
        userId: dto.user_id,
      });
      throw error;
    }
  }

  async getTrainingById(id: string): Promise<TrainingSession> {
    return this.trainingRepo.getTrainingSessionById(id);
  }

  async getAllTrainings(): Promise<TrainingSession[]> {
    return this.trainingRepo.getAllTrainingSessions();
  }

  async getTrainingsByUserId(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<{ trainings: TrainingSession[]; total: number }> {
    const { trainings, total } =
      await this.trainingRepo.getTrainingSessionsByUserId(
        userId,
        limit,
        offset,
      );
    return { trainings, total };
  }

  async updateTraining(
    id: string,
    dto: UpdateTrainingDto,
  ): Promise<TrainingSession> {
    this.logger.debug({
      event: 'training.update.requested',
      trainingId: id,
      duration: dto.duration,
      submitTechniqueCount: dto.submit_using_options_ids.length,
      tappedByTechniqueCount: dto.tapped_by_options_ids.length,
    });

    try {
      const training = await this.trainingRepo.getTrainingSessionById(id);
      const submitUsingTechniques =
        await this.techniqueService.getTechniquesByIds(
          dto.submit_using_options_ids,
        );
      const tappedByTechniques = await this.techniqueService.getTechniquesByIds(
        dto.tapped_by_options_ids,
      );

      training.is_open_mat = dto.is_open_mat;
      if (dto.is_gi !== undefined) training.is_gi = dto.is_gi;
      training.date = dto.date;
      training.submit_using_options = submitUsingTechniques;
      training.tapped_by_options = tappedByTechniques;
      training.duration = dto.duration;
      training.notes = dto.notes ?? training.notes;
      training.updatedAt = new Date();

      const updated = await this.trainingRepo.updateTrainingSession(training);
      const idempotencyKey = `training.updated:${id}`;
      this.eventEmitter.emit(
        'training.updated',
        new TrainingUpdatedEvent(training.userId, id, idempotencyKey),
      );

      this.logger.log({
        event: 'training.update.completed',
        trainingId: id,
        userId: training.userId,
      });

      return updated;
    } catch (error) {
      this.logger.error({
        err: error,
        event: 'training.update.failed',
        trainingId: id,
      });
      throw error;
    }
  }

  async deleteTraining(id: string): Promise<void> {
    this.logger.debug({
      event: 'training.delete.requested',
      trainingId: id,
    });

    try {
      const training = await this.trainingRepo.getTrainingSessionById(id);
      const userId = training.userId;
      await this.trainingRepo.deleteTrainingSession(id);
      const idempotencyKey = `training.deleted:${id}`;
      this.eventEmitter.emit(
        'training.deleted',
        new TrainingDeletedEvent(userId, id, idempotencyKey),
      );

      this.logger.warn({
        event: 'training.delete.completed',
        trainingId: id,
        userId,
      });
    } catch (error) {
      this.logger.error({
        err: error,
        event: 'training.delete.failed',
        trainingId: id,
      });
      throw error;
    }
  }
}
