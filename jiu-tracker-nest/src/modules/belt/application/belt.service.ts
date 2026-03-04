import { Injectable } from '@nestjs/common';
import { BeltProgressRepository } from '../infrastructure/belt-progress.repository';
import { BeltProgress, Belt } from '../domain/belt-progress.entity';
import { CreateBeltProgressDto } from './dto/create-belt-progress.dto';
import { UpdateBeltProgressDto } from './dto/update-belt-progress.dto';

@Injectable()
export class BeltService {
  constructor(private readonly beltProgressRepo: BeltProgressRepository) {}

  getBeltByColor(color: string): Belt {
    switch (color.toLowerCase()) {
      case 'white belt':
        return Belt.White;
      case 'blue belt':
        return Belt.Blue;
      case 'purple belt':
        return Belt.Purple;
      case 'brown belt':
        return Belt.Brown;
      case 'black belt':
        return Belt.Black;
      default:
        throw new Error(`Invalid belt color: ${color}`);
    }
  }

  async createBeltProgress(dto: CreateBeltProgressDto): Promise<BeltProgress> {
    const belt = this.getBeltByColor(dto.color);

    const beltProgress: Partial<BeltProgress> = {
      userId: dto.userId,
      currentBelt: belt,
      stripeCount: dto.stripes,
    };

    return this.beltProgressRepo.createBeltProgress(beltProgress);
  }

  /** Returns belt color string (e.g. "Blue Belt") and stripe count for display. */
  beltToColorString(belt: Belt): string {
    switch (belt) {
      case Belt.White:
        return 'White Belt';
      case Belt.Blue:
        return 'Blue Belt';
      case Belt.Purple:
        return 'Purple Belt';
      case Belt.Brown:
        return 'Brown Belt';
      case Belt.Black:
        return 'Black Belt';
      default:
        return 'White Belt';
    }
  }

  async getLatestBeltForUser(userId: string): Promise<{
    belt_color: string;
    belt_stripe: number;
  } | null> {
    const progress: BeltProgress | null =
      await this.beltProgressRepo.findLatestByUserId(userId);
    if (!progress) return null;
    return {
      belt_color: this.beltToColorString(Number(progress.currentBelt)),
      belt_stripe: progress.stripeCount,
    };
  }

  async updateBeltProgress(dto: UpdateBeltProgressDto): Promise<BeltProgress> {
    const belt = this.getBeltByColor(dto.color);
    const beltProgress: Partial<BeltProgress> = {
      userId: dto.userId,
      currentBelt: belt,
      stripeCount: dto.stripes,
    };

    return this.beltProgressRepo.createBeltProgress(beltProgress);
  }
}
