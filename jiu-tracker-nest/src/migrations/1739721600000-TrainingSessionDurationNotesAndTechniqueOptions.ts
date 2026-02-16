import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrainingSessionDurationNotesAndTechniqueOptions1739721600000
  implements MigrationInterface
{
  name = 'TrainingSessionDurationNotesAndTechniqueOptions1739721600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('training_sessions');
    if (!table) return;

    // Rename rolling_open_mat -> is_open_mat (if rolling_open_mat exists)
    if (table.findColumnByName('rolling_open_mat')) {
      await queryRunner.renameColumn(
        'training_sessions',
        'rolling_open_mat',
        'is_open_mat',
      );
    } else if (!table.findColumnByName('is_open_mat')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" ADD "is_open_mat" boolean NOT NULL DEFAULT false`,
      );
    }

    // Drop class_time (replaced by duration)
    if (table.findColumnByName('class_time')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" DROP COLUMN "class_time"`,
      );
    }

    // Add duration (bigint, minutes)
    if (!table.findColumnByName('duration')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" ADD "duration" bigint NOT NULL DEFAULT 0`,
      );
    }

    // Add notes
    if (!table.findColumnByName('notes')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" ADD "notes" text NOT NULL DEFAULT ''`,
      );
    }

    // Create join table: training_session_submit_using_options
    const submitUsingTable = await queryRunner.getTable(
      'training_session_submit_using_options',
    );
    if (!submitUsingTable) {
      await queryRunner.query(`
        CREATE TABLE "training_session_submit_using_options" (
          "training_session_id" text NOT NULL,
          "techniqueId" text NOT NULL,
          CONSTRAINT "PK_training_session_submit_using_options" PRIMARY KEY ("training_session_id", "techniqueId"),
          CONSTRAINT "FK_submit_using_training" FOREIGN KEY ("training_session_id") REFERENCES "training_sessions"("id") ON DELETE CASCADE,
          CONSTRAINT "FK_submit_using_technique" FOREIGN KEY ("techniqueId") REFERENCES "techniques"("id") ON DELETE CASCADE
        )
      `);
    }

    // Create join table: training_session_submitted_by_options
    const submittedByTable = await queryRunner.getTable(
      'training_session_submitted_by_options',
    );
    if (!submittedByTable) {
      await queryRunner.query(`
        CREATE TABLE "training_session_submitted_by_options" (
          "training_session_id" text NOT NULL,
          "techniqueId" text NOT NULL,
          CONSTRAINT "PK_training_session_submitted_by_options" PRIMARY KEY ("training_session_id", "techniqueId"),
          CONSTRAINT "FK_submitted_by_training" FOREIGN KEY ("training_session_id") REFERENCES "training_sessions"("id") ON DELETE CASCADE,
          CONSTRAINT "FK_submitted_by_technique" FOREIGN KEY ("techniqueId") REFERENCES "techniques"("id") ON DELETE CASCADE
        )
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop join tables
    await queryRunner.query(
      `DROP TABLE IF EXISTS "training_session_submitted_by_options"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "training_session_submit_using_options"`,
    );

    const table = await queryRunner.getTable('training_sessions');
    if (!table) return;

    if (table.findColumnByName('notes')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" DROP COLUMN "notes"`,
      );
    }
    if (table.findColumnByName('duration')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" DROP COLUMN "duration"`,
      );
    }
    if (table.findColumnByName('is_open_mat')) {
      await queryRunner.renameColumn(
        'training_sessions',
        'is_open_mat',
        'rolling_open_mat',
      );
    }
    if (!table.findColumnByName('class_time')) {
      await queryRunner.query(
        `ALTER TABLE "training_sessions" ADD "class_time" text NOT NULL DEFAULT ''`,
      );
    }
  }
}
