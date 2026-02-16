import { MigrationInterface, QueryRunner } from "typeorm";

export class GeneratedMigration1771275865563 implements MigrationInterface {
    name = 'GeneratedMigration1771275865563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" DROP CONSTRAINT "FK_submit_using_training"`);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" DROP CONSTRAINT "FK_submit_using_technique"`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" DROP CONSTRAINT "FK_submitted_by_training"`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" DROP CONSTRAINT "FK_submitted_by_technique"`);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" RENAME COLUMN "techniqueId" TO "techniquesId"`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" RENAME COLUMN "techniqueId" TO "techniquesId"`);
        await queryRunner.query(`ALTER TABLE "training_sessions" DROP COLUMN "user"`);
        await queryRunner.query(`CREATE INDEX "IDX_8446ac6c8b32f65847dd331423" ON "training_session_submit_using_options" ("training_session_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c08f577f5fefba99f1a8e542a" ON "training_session_submit_using_options" ("techniquesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_19c8478dfb21883460716c9bf4" ON "training_session_submitted_by_options" ("training_session_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ccf328bda667d9cc92c970c26e" ON "training_session_submitted_by_options" ("techniquesId") `);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" ADD CONSTRAINT "FK_8446ac6c8b32f65847dd331423d" FOREIGN KEY ("training_session_id") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" ADD CONSTRAINT "FK_2c08f577f5fefba99f1a8e542ae" FOREIGN KEY ("techniquesId") REFERENCES "techniques"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" ADD CONSTRAINT "FK_19c8478dfb21883460716c9bf48" FOREIGN KEY ("training_session_id") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" ADD CONSTRAINT "FK_ccf328bda667d9cc92c970c26e5" FOREIGN KEY ("techniquesId") REFERENCES "techniques"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" DROP CONSTRAINT "FK_ccf328bda667d9cc92c970c26e5"`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" DROP CONSTRAINT "FK_19c8478dfb21883460716c9bf48"`);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" DROP CONSTRAINT "FK_2c08f577f5fefba99f1a8e542ae"`);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" DROP CONSTRAINT "FK_8446ac6c8b32f65847dd331423d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ccf328bda667d9cc92c970c26e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19c8478dfb21883460716c9bf4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c08f577f5fefba99f1a8e542a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8446ac6c8b32f65847dd331423"`);
        await queryRunner.query(`ALTER TABLE "training_sessions" ADD "user" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" RENAME COLUMN "techniquesId" TO "techniqueId"`);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" RENAME COLUMN "techniquesId" TO "techniqueId"`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" ADD CONSTRAINT "FK_submitted_by_technique" FOREIGN KEY ("techniqueId") REFERENCES "techniques"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_session_submitted_by_options" ADD CONSTRAINT "FK_submitted_by_training" FOREIGN KEY ("training_session_id") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" ADD CONSTRAINT "FK_submit_using_technique" FOREIGN KEY ("techniqueId") REFERENCES "techniques"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_session_submit_using_options" ADD CONSTRAINT "FK_submit_using_training" FOREIGN KEY ("training_session_id") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
