import { Injectable } from '@nestjs/common';
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
  constructor(
    private readonly trainingRepo: TrainingRepository,
    private readonly techniqueService: TechniqueService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createTraining(dto: CreateTrainingDto): Promise<TrainingSession> {
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
      date: dto.date,
    };

    const training =
      await this.trainingRepo.createTrainingSession(trainingSession);
    const idempotencyKey = `training.created:${training.id}`;
    this.eventEmitter.emit(
      'training.created',
      new TrainingCreatedEvent(dto.user_id, training.id, idempotencyKey),
    );
    return training;
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
    const training = await this.trainingRepo.getTrainingSessionById(id);
    const submitUsingTechniques =
      await this.techniqueService.getTechniquesByIds(
        dto.submit_using_options_ids,
      );
    const tappedByTechniques = await this.techniqueService.getTechniquesByIds(
      dto.tapped_by_options_ids,
    );

    training.is_open_mat = dto.is_open_mat;
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
    return updated;
  }

  async deleteTraining(id: string): Promise<void> {
    const training = await this.trainingRepo.getTrainingSessionById(id);
    const userId = training.userId;
    await this.trainingRepo.deleteTrainingSession(id);
    const idempotencyKey = `training.deleted:${id}`;
    this.eventEmitter.emit(
      'training.deleted',
      new TrainingDeletedEvent(userId, id, idempotencyKey),
    );
  }
}
