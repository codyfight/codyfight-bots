import sqlite3 from 'sqlite3'
import path from 'node:path'

const dbPath = path.resolve(process.cwd(), 'src/db/bots.db');

const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS bots (
        ckey TEXT PRIMARY KEY,
        mode INTEGER NOT NULL,
        url TEXT NOT NULL,
        move_strategy TEXT NOT NULL,
        cast_strategy TEXT NOT NULL
      );
  `)

  console.log('Database Created')
})

db.close()
