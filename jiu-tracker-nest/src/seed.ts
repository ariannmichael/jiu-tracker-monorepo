import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { Technique } from './modules/technique/domain/technique.entity';
import { techniqueFixtures } from './modules/technique/infrastructure/technique.fixtures';
import { secondaryTechniqueFixtures } from './modules/technique/infrastructure/technique.fixtures.secondary';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Technique]),
  ],
})
class SeedModule {}

async function seed() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const repo = app.get<Repository<Technique>>(getRepositoryToken(Technique));

  console.log(
    `Seeding ${techniqueFixtures.length + secondaryTechniqueFixtures.length} techniques...`,
  );

  let created = 0;
  let skipped = 0;

  for (const fixture of [...techniqueFixtures, ...secondaryTechniqueFixtures]) {
    const existing = await repo.findOne({ where: { id: fixture.id } });
    if (existing) {
      skipped++;
      continue;
    }
    const entity = repo.create(fixture);
    await repo.save(entity);
    created++;
  }

  console.log(
    `Done: ${created} created, ${skipped} skipped (already existed).`,
  );

  await app.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
