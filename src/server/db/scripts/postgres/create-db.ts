import pkg from 'pg'

const { Client } = pkg

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ??
    'postgresql://username:password@localhost:5432/codyfight_bots',
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
      url TEXT NOT NULL,
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
