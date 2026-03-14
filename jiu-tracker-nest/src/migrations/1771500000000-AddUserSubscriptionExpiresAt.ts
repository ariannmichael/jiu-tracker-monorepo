import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserSubscriptionExpiresAt1771500000000
  implements MigrationInterface
{
  name = 'AddUserSubscriptionExpiresAt1771500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "subscription_expires_at" TIMESTAMP WITH TIME ZONE NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "subscription_expires_at"
    `);
  }
}
