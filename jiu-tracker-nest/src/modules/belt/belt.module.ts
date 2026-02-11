import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeltProgress } from './domain/belt-progress.entity';
import { BeltProgressRepository } from './infrastructure/belt-progress.repository';
import { BeltService } from './application/belt.service';

@Module({
  imports: [TypeOrmModule.forFeature([BeltProgress])],
  providers: [BeltProgressRepository, BeltService],
  exports: [BeltService],
})
export class BeltModule {}
