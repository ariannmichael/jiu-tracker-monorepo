import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Technique, Category, Difficulty } from '../domain/technique.entity';
import { v4 as uuidv4 } from 'uuid';
import { TechniqueListDto } from '../application/dto/list-technique.dto';

export interface TechniqueNameRow {
  id: string;
  name: string;
  namePortuguese: string;
}

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

  /** Explicit column selection so "name" is always the DB "name" column (English) and "name_portuguese" is Portuguese. */
  async findNamesByIds(ids: string[]): Promise<TechniqueNameRow[]> {
    if (ids.length === 0) return [];
    const rows = await this.repo
      .createQueryBuilder('t')
      .select('t.id', 'id')
      .addSelect('t.name', 'name')
      .addSelect('t.namePortuguese', 'namePortuguese')
      .where('t.id IN (:...ids)', { ids })
      .getRawMany<{ id: string; name: string; namePortuguese: string }>();
    return rows;
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

  async findAllList(): Promise<TechniqueListDto[]> {
    return this.repo.find({
      select: ['id', 'name', 'namePortuguese'],
    }) as unknown as Promise<TechniqueListDto[]>;
  }
}
