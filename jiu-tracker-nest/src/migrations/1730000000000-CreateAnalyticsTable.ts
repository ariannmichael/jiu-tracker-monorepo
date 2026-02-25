import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnalyticsTable1730000000000 implements MigrationInterface {
  name = 'CreateAnalyticsTable1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "analytic"`);
    await queryRunner.query(`
      CREATE TABLE "analytics" (
        "id" text NOT NULL,
        "user_id" text NOT NULL,
        "current_streak" integer NOT NULL DEFAULT 0,
        "max_streak" integer NOT NULL DEFAULT 0,
        "total_sessions" integer NOT NULL DEFAULT 0,
        "open_mat_sessions" integer NOT NULL DEFAULT 0,
        "total_minutes" integer NOT NULL DEFAULT 0,
        "days_trained" integer NOT NULL DEFAULT 0,
        "max_minutes_in_one_day" integer NOT NULL DEFAULT 0,
        "submissions_count" integer NOT NULL DEFAULT 0,
        "tapped_by_count" integer NOT NULL DEFAULT 0,
        "win_ratio" float NOT NULL DEFAULT 0,
        "unique_techniques_count" integer NOT NULL DEFAULT 0,
        "top_techniques" jsonb NOT NULL DEFAULT '[]',
        "category_breakdown" jsonb NOT NULL DEFAULT '{}',
        "last_computed_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_analytics_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_analytics_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "insights" (
        "id" text NOT NULL,
        "user_id" text NOT NULL,
        "type" text NOT NULL,
        "message" text NOT NULL,
        "metadata" jsonb NOT NULL DEFAULT '{}',
        "is_read" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_insights_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "insights"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "analytics"`);
    await queryRunner.query(`
      CREATE TABLE "analytic" (
        "id" text NOT NULL,
        "user_id" text NOT NULL,
        "daysStreak" bigint NOT NULL DEFAULT 0,
        "maxDaysStreak" bigint NOT NULL DEFAULT 0,
        "sessions" bigint NOT NULL DEFAULT 0,
        "winRatio" bigint NOT NULL DEFAULT 0,
        "giRation" bigint NOT NULL DEFAULT 0,
        "totalHours" bigint NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_analytic_id" PRIMARY KEY ("id")
      )
    `);
  }
}
