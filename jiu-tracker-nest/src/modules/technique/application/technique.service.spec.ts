import { TechniqueService } from './technique.service';
import { TechniqueRepository } from '../infrastructure/technique.repository';
import {
  Technique,
  Category,
  Difficulty,
} from '../domain/technique.entity';
import { CreateTechniqueDto } from './dto/create-technique.dto';
import { UpdateTechniqueDto } from './dto/update-technique.dto';

describe('TechniqueService', () => {
  let service: TechniqueService;
  let mockRepo: jest.Mocked<{
    create: jest.Mock;
    update: jest.Mock;
    findById: jest.Mock;
    findByIds: jest.Mock;
    findByCategory: jest.Mock;
    findByDifficulty: jest.Mock;
    findAll: jest.Mock;
  }>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByIds: jest.fn(),
      findByCategory: jest.fn(),
      findByDifficulty: jest.fn(),
      findAll: jest.fn(),
    };
    service = new TechniqueService(mockRepo as unknown as TechniqueRepository);
  });

  describe('createTechnique', () => {
    it('successful creation', async () => {
      const dto: CreateTechniqueDto = {
        name: 'Armbar',
        name_portuguese: 'Chave de Braço',
        description: 'A submission technique',
        description_portuguese: 'Uma técnica de finalização',
        category: Category.Submission,
        difficulty: Difficulty.Beginner,
      };
      const saved: Technique = {
        id: 'test-id-1',
        ...dto,
        namePortuguese: dto.name_portuguese,
        descriptionPortuguese: dto.description_portuguese,
      };
      mockRepo.create.mockResolvedValue(saved);

      const result = await service.createTechnique(dto);

      expect(result).toEqual(saved);
      expect(result.name).toBe(dto.name);
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('propagates repository error', async () => {
      const dto: CreateTechniqueDto = {
        name: 'Armbar',
        name_portuguese: 'Chave de Braço',
        description: 'A submission technique',
        description_portuguese: 'Uma técnica de finalização',
        category: Category.Submission,
        difficulty: Difficulty.Beginner,
      };
      mockRepo.create.mockRejectedValue(new Error('database error'));

      await expect(service.createTechnique(dto)).rejects.toThrow(
        'database error',
      );
    });
  });

  describe('updateTechnique', () => {
    it('successful update', async () => {
      const id = 'test-id';
      const dto: UpdateTechniqueDto = {
        name: 'Updated Armbar',
        name_portuguese: 'Chave de Braço Atualizada',
        description: 'Updated description',
        description_portuguese: 'Descrição atualizada',
        category: Category.Submission,
        difficulty: Difficulty.Intermediate,
      };
      const existing: Technique = {
        id,
        name: 'Armbar',
        namePortuguese: 'Chave de Braço',
        description: 'A submission technique',
        descriptionPortuguese: 'Uma técnica de finalização',
        category: Category.Submission,
        difficulty: Difficulty.Beginner,
      };
      const updated = { ...existing, ...dto, namePortuguese: dto.name_portuguese, descriptionPortuguese: dto.description_portuguese };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(updated);

      const result = await service.updateTechnique(id, dto);

      expect(result.name).toBe(dto.name);
      expect(mockRepo.update).toHaveBeenCalled();
    });

    it('propagates repository error on find', async () => {
      mockRepo.findById.mockRejectedValue(new Error('technique not found'));

      await expect(
        service.updateTechnique('non-existent', {
          name: 'X',
          name_portuguese: 'X',
          description: 'X',
          description_portuguese: 'X',
          category: Category.Submission,
          difficulty: Difficulty.Beginner,
        }),
      ).rejects.toThrow('technique not found');
    });

    it('propagates repository error on update', async () => {
      const existing: Technique = {
        id: 'test-id',
        name: 'Armbar',
        namePortuguese: 'Chave de Braço',
        description: 'Desc',
        descriptionPortuguese: 'Desc',
        category: Category.Submission,
        difficulty: Difficulty.Beginner,
      };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.update.mockRejectedValue(new Error('database error'));

      await expect(
        service.updateTechnique('test-id', {
          name: 'Updated',
          name_portuguese: 'Up',
          description: 'Up',
          description_portuguese: 'Up',
          category: Category.Submission,
          difficulty: Difficulty.Intermediate,
        }),
      ).rejects.toThrow('database error');
    });
  });

  describe('getTechniqueById', () => {
    it('successful retrieval', async () => {
      const technique: Technique = {
        id: 'test-id',
        name: 'Armbar',
        namePortuguese: 'Chave de Braço',
        description: 'Desc',
        descriptionPortuguese: 'Desc',
        category: Category.Submission,
        difficulty: Difficulty.Beginner,
      };
      mockRepo.findById.mockResolvedValue(technique);

      const result = await service.getTechniqueById('test-id');

      expect(result).toEqual(technique);
      expect(result?.id).toBe('test-id');
    });

    it('propagates not found', async () => {
      mockRepo.findById.mockRejectedValue(new Error('Failed to find technique'));

      await expect(service.getTechniqueById('non-existent')).rejects.toThrow();
    });

    it('propagates repository error', async () => {
      mockRepo.findById.mockRejectedValue(new Error('database error'));

      await expect(service.getTechniqueById('test-id')).rejects.toThrow(
        'database error',
      );
    });
  });

  describe('getAllTechniques', () => {
    it('successful retrieval', async () => {
      const techniques: Technique[] = [
        {
          id: '1',
          name: 'Armbar',
          namePortuguese: 'Chave de Braço',
          description: 'D',
          descriptionPortuguese: 'D',
          category: Category.Submission,
          difficulty: Difficulty.Beginner,
        },
        {
          id: '2',
          name: 'Triangle',
          namePortuguese: 'Triângulo',
          description: 'D',
          descriptionPortuguese: 'D',
          category: Category.Submission,
          difficulty: Difficulty.Beginner,
        },
      ];
      mockRepo.findAll.mockResolvedValue(techniques);

      const result = await service.getAllTechniques();

      expect(result).toHaveLength(2);
    });

    it('returns empty list', async () => {
      mockRepo.findAll.mockResolvedValue([]);

      const result = await service.getAllTechniques();

      expect(result).toHaveLength(0);
    });

    it('propagates repository error', async () => {
      mockRepo.findAll.mockRejectedValue(new Error('database error'));

      await expect(service.getAllTechniques()).rejects.toThrow(
        'database error',
      );
    });
  });

  describe('getTechniquesByCategory', () => {
    it('successful retrieval', async () => {
      const techniques: Technique[] = [
        {
          id: '1',
          name: 'Armbar',
          namePortuguese: 'Chave de Braço',
          description: 'D',
          descriptionPortuguese: 'D',
          category: Category.Submission,
          difficulty: Difficulty.Beginner,
        },
      ];
      mockRepo.findByCategory.mockResolvedValue(techniques);

      const result = await service.getTechniquesByCategory(Category.Submission);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe(Category.Submission);
    });

    it('propagates repository error', async () => {
      mockRepo.findByCategory.mockRejectedValue(new Error('database error'));

      await expect(
        service.getTechniquesByCategory(Category.Submission),
      ).rejects.toThrow('database error');
    });
  });

  describe('getTechniquesByDifficulty', () => {
    it('successful retrieval', async () => {
      const techniques: Technique[] = [
        {
          id: '1',
          name: 'Armbar',
          namePortuguese: 'Chave de Braço',
          description: 'D',
          descriptionPortuguese: 'D',
          category: Category.Submission,
          difficulty: Difficulty.Beginner,
        },
      ];
      mockRepo.findByDifficulty.mockResolvedValue(techniques);

      const result =
        await service.getTechniquesByDifficulty(Difficulty.Beginner);

      expect(result).toHaveLength(1);
      expect(result[0].difficulty).toBe(Difficulty.Beginner);
    });

    it('propagates repository error', async () => {
      mockRepo.findByDifficulty.mockRejectedValue(
        new Error('database error'),
      );

      await expect(
        service.getTechniquesByDifficulty(Difficulty.Beginner),
      ).rejects.toThrow('database error');
    });
  });

  describe('getTechniquesByIds', () => {
    it('successful retrieval', async () => {
      const techniques: Technique[] = [
        {
          id: '1',
          name: 'Armbar',
          namePortuguese: 'Chave de Braço',
          description: 'D',
          descriptionPortuguese: 'D',
          category: Category.Submission,
          difficulty: Difficulty.Beginner,
        },
        {
          id: '2',
          name: 'Triangle',
          namePortuguese: 'Triângulo',
          description: 'D',
          descriptionPortuguese: 'D',
          category: Category.Submission,
          difficulty: Difficulty.Beginner,
        },
      ];
      mockRepo.findByIds.mockResolvedValue(techniques);

      const result = await service.getTechniquesByIds(['1', '2']);

      expect(result).toHaveLength(2);
    });

    it('partial match returns what repo returns', async () => {
      mockRepo.findByIds.mockResolvedValue([
        {
          id: '1',
          name: 'Armbar',
          namePortuguese: 'Chave de Braço',
          description: 'D',
          descriptionPortuguese: 'D',
          category: Category.Submission,
          difficulty: Difficulty.Beginner,
        },
      ]);

      const result = await service.getTechniquesByIds(['1', '3']);

      expect(result).toHaveLength(1);
    });

    it('propagates repository error', async () => {
      mockRepo.findByIds.mockRejectedValue(new Error('database error'));

      await expect(service.getTechniquesByIds(['1'])).rejects.toThrow(
        'database error',
      );
    });
  });
});
