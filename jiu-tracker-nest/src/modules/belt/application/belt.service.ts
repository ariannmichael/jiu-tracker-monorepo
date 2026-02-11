import { Injectable } from '@nestjs/common';
import { BeltProgressRepository } from '../infrastructure/belt-progress.repository';
import { BeltProgress, Belt } from '../domain/belt-progress.entity';
import { CreateBeltProgressDto } from './dto/create-belt-progress.dto';

@Injectable()
export class BeltService {
  constructor(private readonly beltProgressRepo: BeltProgressRepository) {}

  getBeltByColor(color: string): Belt {
    switch (color.toLowerCase()) {
      case 'white':
        return Belt.White;
      case 'blue':
        return Belt.Blue;
      case 'purple':
        return Belt.Purple;
      case 'brown':
        return Belt.Brown;
      case 'black':
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
}
