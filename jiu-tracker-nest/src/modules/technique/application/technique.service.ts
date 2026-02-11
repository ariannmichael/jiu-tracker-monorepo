import { Injectable } from '@nestjs/common';
import { TechniqueRepository } from '../infrastructure/technique.repository';
import {
  Technique,
  Category,
  Difficulty,
} from '../domain/technique.entity';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { UpdateTechniqueDto } from './dto/update-technique.dto';

@Injectable()
export class TechniqueService {
  constructor(private readonly techniqueRepo: TechniqueRepository) {}

  async createTechnique(dto: CreateTechniqueDto): Promise<Technique> {
    const technique: Partial<Technique> = {
      name: dto.name,
      namePortuguese: dto.name_portuguese,
      description: dto.description,
      descriptionPortuguese: dto.description_portuguese,
      category: dto.category as Category,
      difficulty: dto.difficulty as Difficulty,
    };
    return this.techniqueRepo.create(technique);
  }

  async updateTechnique(
    id: string,
    dto: UpdateTechniqueDto,
  ): Promise<Technique> {
    const technique = await this.techniqueRepo.findById(id);
    technique.name = dto.name;
    technique.namePortuguese = dto.name_portuguese;
    technique.description = dto.description;
    technique.descriptionPortuguese = dto.description_portuguese;
    technique.category = dto.category as Category;
    technique.difficulty = dto.difficulty as Difficulty;
    return this.techniqueRepo.update(technique);
  }

  async getTechniqueById(id: string): Promise<Technique> {
    return this.techniqueRepo.findById(id);
  }

  async getTechniquesByCategory(category: Category): Promise<Technique[]> {
    return this.techniqueRepo.findByCategory(category);
  }

  async getTechniquesByDifficulty(
    difficulty: Difficulty,
  ): Promise<Technique[]> {
    return this.techniqueRepo.findByDifficulty(difficulty);
  }

  async getTechniquesByIds(ids: string[]): Promise<Technique[]> {
    return this.techniqueRepo.findByIds(ids);
  }

  async getAllTechniques(): Promise<Technique[]> {
    return this.techniqueRepo.findAll();
  }
}
