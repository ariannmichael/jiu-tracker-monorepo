import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technique } from './domain/technique.entity';
import { TechniqueRepository } from './infrastructure/technique.repository';
import { TechniqueService } from './application/technique.service';
import { TechniqueController } from './presentation/technique.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Technique])],
  controllers: [TechniqueController],
  providers: [TechniqueRepository, TechniqueService],
  exports: [TechniqueService],
})
export class TechniqueModule {}
