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
    const submitUsingTechniques =
      await this.techniqueService.getTechniquesByIds(
        dto.submit_using_options_ids,
      );
    const submittedByTechniques =
      await this.techniqueService.getTechniquesByIds(
        dto.submitted_by_options_ids,
      );

    const trainingSession: Partial<TrainingSession> = {
      userId: dto.user_id,
      submit_using_options: submitUsingTechniques,
      submitted_by_options: submittedByTechniques,
      duration: dto.duration,
      notes: dto.notes ?? '',
      is_open_mat: dto.is_open_mat,
      date: dto.date,
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
    const submitUsingTechniques =
      await this.techniqueService.getTechniquesByIds(
        dto.submit_using_options_ids,
      );
    const submittedByTechniques =
      await this.techniqueService.getTechniquesByIds(
        dto.submitted_by_options_ids,
      );

    training.is_open_mat = dto.is_open_mat;
    training.date = dto.date;
    training.submit_using_options = submitUsingTechniques;
    training.submitted_by_options = submittedByTechniques;
    training.duration = dto.duration;
    training.notes = dto.notes ?? training.notes;
    training.updatedAt = new Date();

    return this.trainingRepo.updateTrainingSession(training);
  }

  async deleteTraining(id: string): Promise<void> {
    return this.trainingRepo.deleteTrainingSession(id);
  }
}
