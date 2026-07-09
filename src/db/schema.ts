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
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS user_xpand_presets (
      uid TEXT NOT NULL,
      category TEXT NOT NULL,
      preset_name TEXT NOT NULL,
      is_owned INTEGER DEFAULT 1,
      last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (uid, category, preset_name)
    )
  `);
  console.log('Database initialized');
}
