import pkg from 'pg'
import config from '../../../config/env.js'

const { Client } = pkg

const client = new Client({
  connectionString:
    config.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

await client.connect()

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS bots (
      ckey TEXT PRIMARY KEY,
      mode INTEGER NOT NULL,
      move_strategy TEXT NOT NULL,
      cast_strategy TEXT NOT NULL
    );
  `)

  console.log('Database Created (Postgres)')
} catch (err) {
  console.error('Error creating Postgres table:', err)
} finally {
  await client.end()
}
