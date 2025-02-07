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

await client.connect()

try {
  for (const bot of botsToInsert) {
    await client.query(
      `
        INSERT INTO bots (ckey, mode, url, move_strategy, cast_strategy)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (ckey)
        DO UPDATE SET
          mode = EXCLUDED.mode,
          url = EXCLUDED.url,
          move_strategy = EXCLUDED.move_strategy,
          cast_strategy = EXCLUDED.cast_strategy;
      `,
      [bot.ckey, bot.mode, bot.url, bot.move_strategy, bot.cast_strategy]
    )
  }

  console.log('Database Seeded (Postgres)')
} catch (err) {
  console.error('Error seeding Postgres database:', err)
} finally {
  await client.end()
}
