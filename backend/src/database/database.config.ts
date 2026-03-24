import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: true,
    };
  }

  // Local development: SQLite with a predictable absolute path
  const dbPath = path.join(__dirname, '..', '..', 'hope_dev.db');
  return {
    type: 'better-sqlite3',
    database: dbPath,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  };
};
