import sqlite3 from 'sqlite3'
import path from 'node:path'

const dbPath = path.resolve(process.cwd(), 'src/db/bots.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bots (
      ckey TEXT NOT NULL,
      player_id INTEGER NOT NULL,
      mode INTEGER NOT NULL,
      move_strategy TEXT NOT NULL,
      cast_strategy TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'stopped',
      PRIMARY KEY (ckey)
    );
  `);

  console.log('Database Created (SQLite)')
});

db.close();
