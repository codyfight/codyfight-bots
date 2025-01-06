import path from 'node:path'
import sqlite3 from 'sqlite3'
import ICBotConfig from '../../../c-bots/c-bot/c-bot-config.interface.js'
import { ICBotRepository } from './c-bot-repository.interface.js'
import { getEnvVar } from '../../../utils/utils.js'

export class SqliteCBotRepository implements ICBotRepository {
  private readonly dbPath: string

  constructor() {
    this.dbPath = path.resolve(process.cwd(), getEnvVar('DB_PATH'))
    console.debug(`Database path: ${this.dbPath}`)
  }

  public getAllBots(): Promise<ICBotConfig[]> {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath)

      db.all('SELECT * FROM bots', (err, rows) => {
        db.close()

        if (err) return reject(err)

        const bots = rows.map((row) => this.mapRow(row))

        resolve(bots)
      })
    })
  }

  public addBot(bot: ICBotConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath)

      const query = `
          INSERT INTO bots (ckey, mode, url, logging, move_strategy, cast_strategy)
          VALUES (?, ?, ?, ?, ?, ?)
      `

      db.run(
        query,
        [
          bot.ckey,
          bot.mode,
          bot.url,
          bot.logging ? 1 : 0,
          bot.move_strategy,
          bot.cast_strategy
        ],
        (err) => {
          db.close()
          if (err) return reject(err)
          resolve()
        }
      )
    })
  }

  public deleteBot(ckey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath)

      const query = `DELETE
                     FROM bots
                     WHERE ckey = ?`

      db.run(query, [ckey], (err) => {
        db.close()
        if (err) return reject(err)
        resolve()
      })
    })
  }

  private mapRow(row: any): ICBotConfig {
    return {
      ckey: row.ckey,
      mode: row.mode,
      url: row.url,
      logging: Boolean(row.logging),
      move_strategy: row.move_strategy,
      cast_strategy: row.cast_strategy
    }
  }
}
