import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrainingSessionDateClassTimeRollingOpenMat1739250000000
  implements MigrationInterface
{
  name = 'AddTrainingSessionDateClassTimeRollingOpenMat1739250000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('training_sessions');
    if (!table) return;

    if (!table.findColumnByName('date')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" ADD "date" text NOT NULL DEFAULT ''`,
      );
    }
    if (!table.findColumnByName('class_time')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" ADD "class_time" text NOT NULL DEFAULT ''`,
      );
    }
    if (!table.findColumnByName('rolling_open_mat')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" ADD "rolling_open_mat" boolean NOT NULL DEFAULT false`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('training_sessions');
    if (!table) return;

    if (table.findColumnByName('rolling_open_mat')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" DROP COLUMN "rolling_open_mat"`,
      );
    }
    if (table.findColumnByName('class_time')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" DROP COLUMN "class_time"`,
      );
    }
    if (table.findColumnByName('date')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" DROP COLUMN "date"`,
      );
    }
  }
}
