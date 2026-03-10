import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIsPremium1771400000000 implements MigrationInterface {
  name = 'AddUserIsPremium1771400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "is_premium" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "is_premium"
    `);
  }
}
