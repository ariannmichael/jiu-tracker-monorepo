import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWinLostTechniquesAndGiNogi1771300000000
  implements MigrationInterface
{
  name = 'AddWinLostTechniquesAndGiNogi1771300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // training_sessions: add is_gi (default true so existing sessions count as Gi)
    await queryRunner.query(`
      ALTER TABLE "training_sessions"
      ADD COLUMN IF NOT EXISTS "is_gi" boolean NOT NULL DEFAULT true
    `);

    // analytics: add top_win_techniques, top_lost_techniques, gi_sessions, nogi_sessions
    await queryRunner.query(`
      ALTER TABLE "analytics"
      ADD COLUMN IF NOT EXISTS "top_win_techniques" jsonb NOT NULL DEFAULT '[]'
    `);
    await queryRunner.query(`
      ALTER TABLE "analytics"
      ADD COLUMN IF NOT EXISTS "top_lost_techniques" jsonb NOT NULL DEFAULT '[]'
    `);
    await queryRunner.query(`
      ALTER TABLE "analytics"
      ADD COLUMN IF NOT EXISTS "gi_sessions" integer NOT NULL DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE "analytics"
      ADD COLUMN IF NOT EXISTS "nogi_sessions" integer NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "analytics" DROP COLUMN IF EXISTS "nogi_sessions"
    `);
    await queryRunner.query(`
      ALTER TABLE "analytics" DROP COLUMN IF EXISTS "gi_sessions"
    `);
    await queryRunner.query(`
      ALTER TABLE "analytics" DROP COLUMN IF EXISTS "top_lost_techniques"
    `);
    await queryRunner.query(`
      ALTER TABLE "analytics" DROP COLUMN IF EXISTS "top_win_techniques"
    `);
    await queryRunner.query(`
      ALTER TABLE "training_sessions" DROP COLUMN IF EXISTS "is_gi"
    `);
  }
}
