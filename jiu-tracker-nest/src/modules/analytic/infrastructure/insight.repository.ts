import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insight } from '../domain/insight.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InsightRepository {
  constructor(
    @InjectRepository(Insight)
    private readonly repo: Repository<Insight>,
  ) {}

  async save(insight: Partial<Insight>): Promise<Insight> {
    if (!insight.id) insight.id = uuidv4();
    const entity = this.repo.create(insight);
    return this.repo.save(entity);
  }

  async findByUserId(userId: string, limit = 50): Promise<Insight[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findOneById(id: string): Promise<Insight | null> {
    return this.repo.findOne({ where: { id } });
  }

  async markAsRead(id: string, userId: string): Promise<Insight | null> {
    const insight = await this.repo.findOne({ where: { id, userId } });
    if (!insight) return null;
    insight.isRead = true;
    return this.repo.save(insight);
  }

  async findRecentByType(
    userId: string,
    type: string,
    limit: number,
  ): Promise<Insight[]> {
    return this.repo.find({
      where: { userId, type },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
