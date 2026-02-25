import { AnalyticService } from './analytic.service';
import { AnalyticRepository } from '../infrastructure/analytic.repository';
import { TrainingService } from '../../training/application/training.service';
import { TrainingSession } from '../../training/domain/training-session.entity';
import { Technique } from '../../technique/domain/technique.entity';
import { Category, Difficulty } from '@jiu-tracker/shared';

const baseTechnique: Technique = {
  id: 'tech-1',
  name: 'Armbar',
  namePortuguese: 'Chave de Braço',
  description: 'D',
  descriptionPortuguese: 'D',
  category: Category.Submission as unknown as Technique['category'],
  difficulty: Difficulty.Beginner as unknown as Technique['difficulty'],
};

function session(
  overrides: Partial<TrainingSession> & { userId: string; date: string },
): TrainingSession {
  return {
    id: 's1',
    userId: overrides.userId!,
    date: overrides.date!,
    is_open_mat: false,
    submit_using_options: [],
    tapped_by_options: [],
    duration: 60,
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('AnalyticService', () => {
  let service: AnalyticService;
  let mockAnalyticRepo: jest.Mocked<Pick<AnalyticRepository, 'findByUserId' | 'upsert'>>;
  let mockTrainingService: jest.Mocked<Pick<TrainingService, 'getTrainingsByUserId'>>;

  beforeEach(() => {
    mockAnalyticRepo = {
      findByUserId: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({}),
    };
    mockTrainingService = {
      getTrainingsByUserId: jest.fn().mockResolvedValue([]),
    };
    service = new AnalyticService(
      mockAnalyticRepo as unknown as AnalyticRepository,
      mockTrainingService as unknown as TrainingService,
    );
  });

  describe('recomputeForUser', () => {
    it('calls trainingService.getTrainingsByUserId and repo.upsert', async () => {
      mockTrainingService.getTrainingsByUserId.mockResolvedValue([]);
      await service.recomputeForUser('user-1');
      expect(mockTrainingService.getTrainingsByUserId).toHaveBeenCalledWith('user-1');
      expect(mockAnalyticRepo.findByUserId).toHaveBeenCalledWith('user-1');
      expect(mockAnalyticRepo.upsert).toHaveBeenCalled();
      const upsertArg = mockAnalyticRepo.upsert.mock.calls[0][0];
      expect(upsertArg.userId).toBe('user-1');
      expect(upsertArg.totalSessions).toBe(0);
      expect(upsertArg.totalMinutes).toBe(0);
      expect(upsertArg.currentStreak).toBe(0);
      expect(upsertArg.maxStreak).toBe(0);
    });

    it('computes totals from multiple sessions', async () => {
      mockTrainingService.getTrainingsByUserId.mockResolvedValue([
        session({ userId: 'user-1', date: '2025-01-01', duration: 60, is_open_mat: false }),
        session({ userId: 'user-1', date: '2025-01-02', duration: 90, is_open_mat: true }),
      ]);
      await service.recomputeForUser('user-1');
      const upsertArg = mockAnalyticRepo.upsert.mock.calls[0][0];
      expect(upsertArg.totalSessions).toBe(2);
      expect(upsertArg.openMatSessions).toBe(1);
      expect(upsertArg.totalMinutes).toBe(150);
      expect(upsertArg.daysTrained).toBe(2);
      expect(upsertArg.maxMinutesInOneDay).toBe(90);
    });

    it('computes win ratio from submit vs tapped', async () => {
      const t1 = { ...baseTechnique, id: 't1' };
      const t2 = { ...baseTechnique, id: 't2' };
      mockTrainingService.getTrainingsByUserId.mockResolvedValue([
        session({
          userId: 'user-1',
          date: '2025-01-01',
          submit_using_options: [t1, t2],
          tapped_by_options: [t1],
        }),
      ]);
      await service.recomputeForUser('user-1');
      const upsertArg = mockAnalyticRepo.upsert.mock.calls[0][0];
      expect(upsertArg.submissionsCount).toBe(2);
      expect(upsertArg.tappedByCount).toBe(1);
      expect(upsertArg.winRatio).toBeCloseTo(2 / 3);
    });

    it('reuses existing analytic id when present', async () => {
      mockAnalyticRepo.findByUserId.mockResolvedValue({
        id: 'existing-id',
        userId: 'user-1',
      } as any);
      mockTrainingService.getTrainingsByUserId.mockResolvedValue([]);
      await service.recomputeForUser('user-1');
      const upsertArg = mockAnalyticRepo.upsert.mock.calls[0][0];
      expect(upsertArg.id).toBe('existing-id');
    });
  });

  describe('getByUserId', () => {
    it('returns result from repository', async () => {
      const analytic = { id: 'a1', userId: 'user-1', totalSessions: 5 } as any;
      mockAnalyticRepo.findByUserId.mockResolvedValue(analytic);
      const result = await service.getByUserId('user-1');
      expect(result).toBe(analytic);
      expect(mockAnalyticRepo.findByUserId).toHaveBeenCalledWith('user-1');
    });

    it('returns null when repository returns null', async () => {
      mockAnalyticRepo.findByUserId.mockResolvedValue(null);
      const result = await service.getByUserId('user-1');
      expect(result).toBeNull();
    });
  });
});
