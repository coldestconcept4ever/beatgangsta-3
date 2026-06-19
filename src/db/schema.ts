import { turso } from './turso';

export async function initDb() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      terms_accepted BOOLEAN DEFAULT FALSE,
      accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS reaper_syncs (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      pin TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Database initialized');
}
