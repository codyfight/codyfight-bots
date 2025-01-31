import sqlite3 from 'sqlite3'
import { getEnvVar } from '../../../utils/utils.js'

const db = new sqlite3.Database(getEnvVar('DB_PATH'))

const botsToInsert = [
  {
    ckey: '1234',
    mode: 3,
    url: 'https://game.codyfight.com/',
    move_strategy: 'Dynamic',
    cast_strategy: 'Random'
  },
  {
    ckey: '5678',
    mode: 8,
    url: 'https://game.codyfight.com/',
    move_strategy: 'Random',
    cast_strategy: 'None'
  }
]

db.serialize(() => {
  botsToInsert.forEach((bot) => {
    db.run(
      `INSERT OR REPLACE INTO bots (ckey, mode, url, logging, move_strategy, cast_strategy)
       VALUES (?, ?, ?, ?, ?)`,
      [bot.ckey, bot.mode, bot.url, bot.move_strategy, bot.cast_strategy]
    )
  })
  console.log('Database Seeded')
})

db.close()
