import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Technique, Category, Difficulty } from '../domain/technique.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TechniqueRepository {
  constructor(
    @InjectRepository(Technique)
    private readonly repo: Repository<Technique>,
  ) {}

  async create(technique: Partial<Technique>): Promise<Technique> {
    const existing = await this.repo.findOne({
      where: { name: technique.name },
    });
    if (existing) {
      throw new Error(`Technique with name ${technique.name} already exists`);
    }

    technique.id = uuidv4();
    const entity = this.repo.create(technique);
    return this.repo.save(entity);
  }

  async update(technique: Technique): Promise<Technique> {
    return this.repo.save(technique);
  }

  async findById(id: string): Promise<Technique> {
    const technique = await this.repo.findOne({ where: { id } });
    if (!technique) {
      throw new Error(`Failed to find technique with id ${id}`);
    }
    return technique;
  }

  async findByIds(ids: string[]): Promise<Technique[]> {
    return this.repo.find({ where: { id: In(ids) } });
  }

  async findByCategory(category: Category): Promise<Technique[]> {
    return this.repo.find({ where: { category } });
  }

  async findByDifficulty(difficulty: Difficulty): Promise<Technique[]> {
    return this.repo.find({ where: { difficulty } });
  }

  async findAll(): Promise<Technique[]> {
    return this.repo.find();
  }
}
