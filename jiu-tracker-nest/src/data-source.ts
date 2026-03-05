import { DataSource } from 'typeorm';
import path from 'path';

// Use process.cwd() when loaded by TypeORM CLI (__dirname can be undefined in that context)
const baseDir =
  typeof __dirname !== 'undefined' ? __dirname : path.join(process.cwd(), 'src');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '12345678',
  database: process.env.DB_NAME ?? 'jiu_tracker',
  entities: [baseDir + '/**/*.entity{.ts,.js}'],
  migrations: [baseDir + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
