import { TrainingService } from './training.service';
import { TrainingRepository } from '../infrastructure/training.repository';
import { TechniqueService } from '../../technique/application/technique.service';
import { TrainingSession } from '../domain/training-session.entity';
import {
  Technique,
  Category,
  Difficulty,
} from '../../technique/domain/technique.entity';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

const baseTechnique: Technique = {
  id: 'tech-1',
  name: 'Armbar',
  namePortuguese: 'Chave de Braço',
  description: 'D',
  descriptionPortuguese: 'D',
  category: Category.Submission,
  difficulty: Difficulty.Beginner,
};

describe('TrainingService', () => {
  let service: TrainingService;
  let mockTrainingRepo: jest.Mocked<{
    createTrainingSession: jest.Mock;
    getTrainingSessionById: jest.Mock;
    getAllTrainingSessions: jest.Mock;
    updateTrainingSession: jest.Mock;
    deleteTrainingSession: jest.Mock;
  }>;
  let mockTechniqueService: jest.Mocked<Pick<TechniqueService, 'getTechniquesByIds'>>;

  beforeEach(() => {
    mockTrainingRepo = {
      createTrainingSession: jest.fn(),
      getTrainingSessionById: jest.fn(),
      getAllTrainingSessions: jest.fn(),
      updateTrainingSession: jest.fn(),
      deleteTrainingSession: jest.fn(),
    };
    mockTechniqueService = {
      getTechniquesByIds: jest.fn(),
    };
    service = new TrainingService(
      mockTrainingRepo as unknown as TrainingRepository,
      mockTechniqueService as unknown as TechniqueService,
    );
  });

  describe('createTraining', () => {
    it('successful creation', async () => {
      const dto: CreateTrainingDto = {
        user_id: 'test-user-id',
        techniques_ids: ['tech-1', 'tech-2'],
        duration: 60,
        notes: 'Great training session',
      };
      const techniques: Technique[] = [
        baseTechnique,
        { ...baseTechnique, id: 'tech-2', name: 'Triangle', namePortuguese: 'Triângulo' },
      ];
      mockTechniqueService.getTechniquesByIds.mockResolvedValue(techniques);
      const saved: TrainingSession = {
        id: 'training-id',
        userId: dto.user_id,
        user: '',
        techniques,
        duration: dto.duration,
        notes: dto.notes ?? '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTrainingRepo.createTrainingSession.mockResolvedValue(saved);

      const result = await service.createTraining(dto);

      expect(result.userId).toBe(dto.user_id);
      expect(result.duration).toBe(60);
      expect(mockTechniqueService.getTechniquesByIds).toHaveBeenCalledWith(
        dto.techniques_ids,
      );
      expect(mockTrainingRepo.createTrainingSession).toHaveBeenCalled();
    });

    it('propagates technique service error', async () => {
      const dto: CreateTrainingDto = {
        user_id: 'test-user-id',
        techniques_ids: ['tech-1'],
        duration: 60,
        notes: '',
      };
      mockTechniqueService.getTechniquesByIds.mockRejectedValue(
        new Error('technique not found'),
      );

      await expect(service.createTraining(dto)).rejects.toThrow(
        'technique not found',
      );
      expect(mockTrainingRepo.createTrainingSession).not.toHaveBeenCalled();
    });

    it('propagates repository error', async () => {
      const dto: CreateTrainingDto = {
        user_id: 'test-user-id',
        techniques_ids: ['tech-1'],
        duration: 60,
        notes: 'Great session',
      };
      mockTechniqueService.getTechniquesByIds.mockResolvedValue([baseTechnique]);
      mockTrainingRepo.createTrainingSession.mockRejectedValue(
        new Error('database error'),
      );

      await expect(service.createTraining(dto)).rejects.toThrow(
        'database error',
      );
    });
  });

  describe('getTrainingById', () => {
    it('successful retrieval', async () => {
      const session: TrainingSession = {
        id: 'test-training-id',
        userId: 'test-user-id',
        user: '',
        techniques: [],
        duration: 60,
        notes: 'Great session',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTrainingRepo.getTrainingSessionById.mockResolvedValue(session);

      const result = await service.getTrainingById('test-training-id');

      expect(result.id).toBe('test-training-id');
      expect(result.duration).toBe(60);
    });

    it('propagates not found', async () => {
      mockTrainingRepo.getTrainingSessionById.mockRejectedValue(
        new Error('Failed to find training session'),
      );

      await expect(
        service.getTrainingById('non-existent'),
      ).rejects.toThrow();
    });

    it('propagates repository error', async () => {
      mockTrainingRepo.getTrainingSessionById.mockRejectedValue(
        new Error('database error'),
      );

      await expect(service.getTrainingById('test-id')).rejects.toThrow(
        'database error',
      );
    });
  });

  describe('getAllTrainings', () => {
    it('successful retrieval', async () => {
      const sessions: TrainingSession[] = [
        {
          id: '1',
          userId: 'user-1',
          user: '',
          techniques: [],
          duration: 60,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user-2',
          user: '',
          techniques: [],
          duration: 90,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockTrainingRepo.getAllTrainingSessions.mockResolvedValue(sessions);

      const result = await service.getAllTrainings();

      expect(result).toHaveLength(2);
    });

    it('returns empty list', async () => {
      mockTrainingRepo.getAllTrainingSessions.mockResolvedValue([]);

      const result = await service.getAllTrainings();

      expect(result).toHaveLength(0);
    });

    it('propagates repository error', async () => {
      mockTrainingRepo.getAllTrainingSessions.mockRejectedValue(
        new Error('database error'),
      );

      await expect(service.getAllTrainings()).rejects.toThrow(
        'database error',
      );
    });
  });

  describe('updateTraining', () => {
    it('successful update', async () => {
      const id = 'test-training-id';
      const dto: UpdateTrainingDto = {
        techniques_ids: ['tech-1', 'tech-2'],
        duration: 90,
        notes: 'Updated notes',
      };
      const existing: TrainingSession = {
        id,
        userId: 'test-user-id',
        user: '',
        techniques: [baseTechnique],
        duration: 60,
        notes: 'Old notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const techniques: Technique[] = [
        baseTechnique,
        { ...baseTechnique, id: 'tech-2', name: 'Triangle', namePortuguese: 'Triângulo' },
      ];
      mockTrainingRepo.getTrainingSessionById.mockResolvedValue(existing);
      mockTechniqueService.getTechniquesByIds.mockResolvedValue(techniques);
      const updated: TrainingSession = {
        ...existing,
        techniques,
        duration: dto.duration,
        notes: dto.notes ?? '',
      };
      mockTrainingRepo.updateTrainingSession.mockResolvedValue(updated);

      const result = await service.updateTraining(id, dto);

      expect(result.duration).toBe(dto.duration);
      expect(result.notes).toBe(dto.notes);
    });

    it('propagates training not found', async () => {
      mockTrainingRepo.getTrainingSessionById.mockRejectedValue(
        new Error('Failed to find training session'),
      );

      await expect(
        service.updateTraining('non-existent', {
          techniques_ids: ['tech-1'],
          duration: 90,
          notes: 'Updated',
        }),
      ).rejects.toThrow();
    });

    it('propagates technique service error', async () => {
      const existing: TrainingSession = {
        id: 'test-training-id',
        userId: 'test-user-id',
        user: '',
        techniques: [],
        duration: 60,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTrainingRepo.getTrainingSessionById.mockResolvedValue(existing);
      mockTechniqueService.getTechniquesByIds.mockRejectedValue(
        new Error('technique not found'),
      );

      await expect(
        service.updateTraining('test-training-id', {
          techniques_ids: ['tech-1'],
          duration: 90,
          notes: 'Updated',
        }),
      ).rejects.toThrow('technique not found');
    });

    it('propagates repository update error', async () => {
      const existing: TrainingSession = {
        id: 'test-training-id',
        userId: 'test-user-id',
        user: '',
        techniques: [],
        duration: 60,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTrainingRepo.getTrainingSessionById.mockResolvedValue(existing);
      mockTechniqueService.getTechniquesByIds.mockResolvedValue([baseTechnique]);
      mockTrainingRepo.updateTrainingSession.mockRejectedValue(
        new Error('database error'),
      );

      await expect(
        service.updateTraining('test-training-id', {
          techniques_ids: ['tech-1'],
          duration: 90,
          notes: 'Updated',
        }),
      ).rejects.toThrow('database error');
    });
  });

  describe('deleteTraining', () => {
    it('successful deletion', async () => {
      mockTrainingRepo.deleteTrainingSession.mockResolvedValue(undefined);

      await service.deleteTraining('test-training-id');

      expect(mockTrainingRepo.deleteTrainingSession).toHaveBeenCalledWith(
        'test-training-id',
      );
    });

    it('propagates repository error', async () => {
      mockTrainingRepo.deleteTrainingSession.mockRejectedValue(
        new Error('database error'),
      );

      await expect(service.deleteTraining('test-id')).rejects.toThrow(
        'database error',
      );
    });
  });
});
