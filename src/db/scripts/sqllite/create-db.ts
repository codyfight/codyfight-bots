import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('../bots.db')

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS bots (
        player_id INTEGER NOT NULL,
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
