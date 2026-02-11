import { BeltService } from './belt.service';
import { BeltProgressRepository } from '../infrastructure/belt-progress.repository';
import { Belt, BeltProgress } from '../domain/belt-progress.entity';
import { CreateBeltProgressDto } from './dto/create-belt-progress.dto';

describe('BeltService', () => {
  let service: BeltService;
  let mockRepo: jest.Mocked<Pick<BeltProgressRepository, 'createBeltProgress'>>;

  beforeEach(() => {
    mockRepo = {
      createBeltProgress: jest.fn(),
    };
    service = new BeltService(mockRepo as BeltProgressRepository);
  });

  describe('getBeltByColor', () => {
    it.each([
      ['white', Belt.White],
      ['blue', Belt.Blue],
      ['purple', Belt.Purple],
      ['brown', Belt.Brown],
      ['black', Belt.Black],
      ['WHITE', Belt.White],
      ['Blue', Belt.Blue],
    ])('returns correct belt for color "%s"', (color, expected) => {
      expect(service.getBeltByColor(color)).toBe(expected);
    });

    it('throws for invalid color', () => {
      expect(() => service.getBeltByColor('red')).toThrow(
        'Invalid belt color: red',
      );
    });

    it('throws for empty color', () => {
      expect(() => service.getBeltByColor('')).toThrow(
        'Invalid belt color: ',
      );
    });
  });

  describe('createBeltProgress', () => {
    it('successful creation - white belt', async () => {
      const dto: CreateBeltProgressDto = {
        userId: 'test-user-id',
        color: 'white',
        stripes: 0,
      };
      const saved: BeltProgress = {
        id: 1,
        userId: dto.userId,
        user: '',
        currentBelt: Belt.White,
        stripeCount: 0,
        earnedAt: new Date(),
      };
      mockRepo.createBeltProgress.mockResolvedValue(saved);

      const result = await service.createBeltProgress(dto);

      expect(result).toEqual(saved);
      expect(mockRepo.createBeltProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: dto.userId,
          currentBelt: Belt.White,
          stripeCount: 0,
        }),
      );
    });

    it('successful creation - blue belt with stripes', async () => {
      const dto: CreateBeltProgressDto = {
        userId: 'test-user-id',
        color: 'blue',
        stripes: 2,
      };
      const saved: BeltProgress = {
        id: 1,
        userId: dto.userId,
        user: '',
        currentBelt: Belt.Blue,
        stripeCount: 2,
        earnedAt: new Date(),
      };
      mockRepo.createBeltProgress.mockResolvedValue(saved);

      const result = await service.createBeltProgress(dto);

      expect(result.userId).toBe(dto.userId);
      expect(result.stripeCount).toBe(dto.stripes);
    });

    it('throws for invalid belt color', async () => {
      const dto: CreateBeltProgressDto = {
        userId: 'test-user-id',
        color: 'red',
        stripes: 0,
      };

      await expect(service.createBeltProgress(dto)).rejects.toThrow(
        'Invalid belt color: red',
      );
      expect(mockRepo.createBeltProgress).not.toHaveBeenCalled();
    });

    it('propagates repository error', async () => {
      const dto: CreateBeltProgressDto = {
        userId: 'test-user-id',
        color: 'white',
        stripes: 0,
      };
      mockRepo.createBeltProgress.mockRejectedValue(new Error('database error'));

      await expect(service.createBeltProgress(dto)).rejects.toThrow(
        'database error',
      );
    });
  });
});
