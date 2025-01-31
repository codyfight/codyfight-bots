import path from 'node:path'
import sqlite3 from 'sqlite3'
import ICBotConfig from '../../c-bots/c-bot/c-bot-config.interface.js'
import { ICBotRepository } from './c-bot-repository.interface.js'
import { getEnvVar } from '../../utils/utils.js'
import LOGGER from '../../utils/logger.js'

export class SqliteCBotRepository implements ICBotRepository {
  private readonly dbPath: string

  constructor() {
    this.dbPath = path.resolve(process.cwd(), getEnvVar('DB_PATH'))
    LOGGER.debug(`Database path: ${this.dbPath}`)
  }

  /**
   * Inserts a new bot into the database.
   */
  public async addBot(bot: ICBotConfig): Promise<void> {
    const query = `
      INSERT INTO bots (ckey, mode, url, move_strategy, cast_strategy)
      VALUES (?, ?, ?, ?, ?)
    `
    const params = [
      bot.ckey,
      bot.mode,
      bot.url,
      bot.move_strategy,
      bot.cast_strategy
    ]

    await this.runSql(query, params)
  }

  /**
   * Retrieves a single bot by its ckey.
   * Throws an error if the bot is not found.
   */
  public async getBot(ckey: string): Promise<ICBotConfig> {
    const query = `SELECT * FROM bots WHERE ckey = ?`
    const row = await this.runSqlGet(query, [ckey])

    if (!row) {
      throw new Error(`Bot with ckey '${ckey}' not found.`)
    }

    return this.mapRow(row)
  }

  /**
   * Retrieves all bots from the database.
   */
  public async getAllBots(): Promise<ICBotConfig[]> {
    const query = `SELECT * FROM bots`
    const rows = await this.runSqlAll(query)
    return rows.map(row => this.mapRow(row))
  }

  /**
   * Updates an existing bot by ckey.
   * Throws an error if the bot with the given ckey does not exist.
   */
  public async updateBot(bot: ICBotConfig): Promise<void> {
    const query = `
    UPDATE bots
    SET mode = ?,
        url = ?,
        move_strategy = ?,
        cast_strategy = ?
    WHERE ckey = ?
  `

    // Order of params matches the placeholders above
    const params = [
      bot.mode,
      bot.url,
      bot.move_strategy,
      bot.cast_strategy,
      bot.ckey
    ]

    // Use our helper method to run the update
    await this.runSql(query, params)
  }

  /**
   * Deletes a bot by its ckey.
   */
  public async deleteBot(ckey: string): Promise<void> {
    const query = `DELETE FROM bots WHERE ckey = ?`
    await this.runSql(query, [ckey])
  }

  /**
   * Converts a raw DB row into an ICBotConfig object.
   */
  private mapRow(row: any): ICBotConfig {
    return {
      ckey: row.ckey,
      mode: row.mode,
      url: row.url,
      move_strategy: row.move_strategy,
      cast_strategy: row.cast_strategy
    }
  }

  /**
   * Runs a SQL statement (INSERT, UPDATE, DELETE) without returning rows.
   */
  private runSql(query: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath)
      db.run(query, params, (err) => {
        db.close()

        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  /**
   * Runs a SQL statement expected to return a single row (e.g. SELECT one item).
   */
  private runSqlGet(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath)
      db.get(query, params, (err, row) => {
        db.close()

        if (err) {
          reject(err)
          return
        }
        resolve(row)
      })
    })
  }

  /**
   * Runs a SQL statement expected to return multiple rows (e.g. SELECT * FROM table).
   */
  private runSqlAll(query: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath)
      db.all(query, params, (err, rows) => {
        db.close()

        if (err) {
          reject(err)
          return
        }
        resolve(rows)
      })
    })
  }
}
