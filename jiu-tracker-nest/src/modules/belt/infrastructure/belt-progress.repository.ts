import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BeltProgress } from '../domain/belt-progress.entity';

@Injectable()
export class BeltProgressRepository {
  constructor(
    @InjectRepository(BeltProgress)
    private readonly repo: Repository<BeltProgress>,
  ) {}

  async createBeltProgress(
    beltProgress: Partial<BeltProgress>,
  ): Promise<BeltProgress> {
    const entity = this.repo.create(beltProgress);
    return this.repo.save(entity);
  }

  async findLatestByUserId(userId: string): Promise<BeltProgress | null> {
    const list = await this.repo.find({
      where: { userId },
      order: { earnedAt: 'DESC' },
      take: 1,
    });
    return list[0] ?? null;
  }
}
