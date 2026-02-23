import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingSession } from '../domain/training-session.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrainingRepository {
  constructor(
    @InjectRepository(TrainingSession)
    private readonly repo: Repository<TrainingSession>,
  ) {}

  async createTrainingSession(
    trainingSession: Partial<TrainingSession>,
  ): Promise<TrainingSession> {
    trainingSession.id = uuidv4();
    const entity = this.repo.create(trainingSession);
    return this.repo.save(entity);
  }

  async getTrainingSessionById(id: string): Promise<TrainingSession> {
    const session = await this.repo.findOne({
      where: { id },
      relations: ['submit_using_options', 'tapped_by_options'],
    });
    if (!session) {
      throw new Error(`Failed to find training session with id ${id}`);
    }
    return session;
  }

  async getAllTrainingSessions(): Promise<TrainingSession[]> {
    return this.repo.find({
      relations: ['submit_using_options', 'tapped_by_options'],
      order: { date: 'DESC' },
    });
  }

  async updateTrainingSession(
    trainingSession: TrainingSession,
  ): Promise<TrainingSession> {
    return this.repo.save(trainingSession);
  }

  async deleteTrainingSession(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
