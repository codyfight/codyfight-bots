import sqlite3 from 'sqlite3';

//todo set db in .env
const db = new sqlite3.Database('../bots.db');

const botsToInsert = [
  {
    ckey: '1234',
    mode: 3,
    url: 'https://game.codyfight.com/',
    logging: 0,
    move_strategy: 'Dynamic',
    cast_strategy: 'Random',
  },
  {
    ckey: '5678',
    mode: 8,
    url: 'https://game.codyfight.com/',
    logging: 0,
    move_strategy: 'Random',
    cast_strategy: 'None',
  },
];

db.serialize(() => {
  botsToInsert.forEach((bot) => {
    db.run(
      `INSERT OR REPLACE INTO bots (ckey, mode, url, logging, move_strategy, cast_strategy)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        bot.ckey,
        bot.mode,
        bot.url,
        bot.logging,
        bot.move_strategy,
        bot.cast_strategy,
      ]
    );
  });
  console.log('Database Seeded');
});

db.close();
