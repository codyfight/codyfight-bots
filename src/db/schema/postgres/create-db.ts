import pkg from 'pg'
import config from '../../../config/env.js'

const { Client } = pkg

const client = new Client({
  connectionString: config.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

await client.connect()

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS bots (
      ckey VARCHAR NOT NULL,
      player_id INT NOT NULL,
      environment VARCHAR NOT NULL DEFAULT 'production',
      mode INT NOT NULL,
      move_strategy VARCHAR NOT NULL,
      cast_strategy VARCHAR NOT NULL,
      status VARCHAR NOT NULL DEFAULT 'stopped',
      PRIMARY KEY (ckey)
    );
  `)

  console.log('Database Created (Postgres)')
} catch (err) {
  console.error('Error creating Postgres table:', err)
} finally {
  await client.end()
}
