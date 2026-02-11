import { Injectable } from '@nestjs/common';
import { TrainingRepository } from '../infrastructure/training.repository';
import { TechniqueService } from '../../technique/application/technique.service';
import { TrainingSession } from '../domain/training-session.entity';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

@Injectable()
export class TrainingService {
  constructor(
    private readonly trainingRepo: TrainingRepository,
    private readonly techniqueService: TechniqueService,
  ) {}

  async createTraining(dto: CreateTrainingDto): Promise<TrainingSession> {
    const techniques = await this.techniqueService.getTechniquesByIds(
      dto.techniques_ids,
    );

    const trainingSession: Partial<TrainingSession> = {
      userId: dto.user_id,
      user: '',
      techniques,
      duration: dto.duration,
      notes: dto.notes ?? '',
    };

    return this.trainingRepo.createTrainingSession(trainingSession);
  }

  async getTrainingById(id: string): Promise<TrainingSession> {
    return this.trainingRepo.getTrainingSessionById(id);
  }

  async getAllTrainings(): Promise<TrainingSession[]> {
    return this.trainingRepo.getAllTrainingSessions();
  }

  async updateTraining(
    id: string,
    dto: UpdateTrainingDto,
  ): Promise<TrainingSession> {
    const training = await this.trainingRepo.getTrainingSessionById(id);
    const techniques = await this.techniqueService.getTechniquesByIds(
      dto.techniques_ids,
    );

    training.techniques = techniques;
    training.duration = dto.duration;
    training.notes = dto.notes ?? training.notes;

    return this.trainingRepo.updateTrainingSession(training);
  }

  async deleteTraining(id: string): Promise<void> {
    return this.trainingRepo.deleteTrainingSession(id);
  }
}
