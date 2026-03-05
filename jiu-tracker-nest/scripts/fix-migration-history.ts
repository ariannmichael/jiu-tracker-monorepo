/**
 * One-time script: insert the missing migration record for CreateAnalyticsTable1730000000000
 * so that "npm run migration:run" only runs the newer migration (AddWinLostTechniquesAndGiNogi).
 *
 * Run from repo root: cd jiu-tracker-nest && npx ts-node -r tsconfig-paths/register scripts/fix-migration-history.ts
 */
import { AppDataSource } from '../src/data-source';

const MISSING_MIGRATION = {
  timestamp: 1730000000000,
  name: 'CreateAnalyticsTable1730000000000',
};

async function main() {
  await AppDataSource.initialize();
  const qr = AppDataSource.createQueryRunner();
  try {
    const existing = await qr.manager.query(
      `SELECT 1 FROM migrations WHERE name = $1`,
      [MISSING_MIGRATION.name],
    );
    if (existing.length > 0) {
      console.log('Migration record already exists, nothing to do.');
      return;
    }
    await qr.manager.query(
      `INSERT INTO migrations (timestamp, name) VALUES ($1, $2)`,
      [MISSING_MIGRATION.timestamp, MISSING_MIGRATION.name],
    );
    console.log(
      `Inserted migration record: ${MISSING_MIGRATION.name}. You can now run: npm run migration:run`,
    );
  } finally {
    await qr.release();
    await AppDataSource.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
