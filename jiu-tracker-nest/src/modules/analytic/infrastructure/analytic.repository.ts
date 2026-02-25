import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analytic } from '../domain/analytic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticRepository {
  constructor(
    @InjectRepository(Analytic)
    private readonly repo: Repository<Analytic>,
  ) {}

  async findByUserId(userId: string): Promise<Analytic | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async upsert(analytic: Partial<Analytic>): Promise<Analytic> {
    await this.repo.upsert(analytic as Analytic, {
      conflictPaths: ['userId'],
      skipUpdateIfNoValuesChanged: true,
    });
    const found = await this.findByUserId(analytic.userId!);
    if (!found) throw new Error(`Analytics upsert failed for user ${analytic.userId}`);
    return found;
  }
}
