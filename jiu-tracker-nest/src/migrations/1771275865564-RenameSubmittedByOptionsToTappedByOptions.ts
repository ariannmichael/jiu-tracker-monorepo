import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSubmittedByOptionsToTappedByOptions1771275865564
  implements MigrationInterface
{
  name = 'RenameSubmittedByOptionsToTappedByOptions1771275865564';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('training_session_submitted_by_options');
    if (table) {
      await queryRunner.renameTable(
        'training_session_submitted_by_options',
        'training_session_tapped_by_options',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('training_session_tapped_by_options');
    if (table) {
      await queryRunner.renameTable(
        'training_session_tapped_by_options',
        'training_session_submitted_by_options',
      );
    }
  }
}
