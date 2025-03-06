import path from 'node:path'
import sqlite3 from 'sqlite3'
import { ICBotConfig } from '../../c-bots/c-bot/c-bot-config.interface.js'
import { IBotFilter, IBotFilterCondition, ICBotRepository } from './c-bot-repository.interface.js'
import config from '../../config/env.js'
import ApiError from '../../errors/api-error.js'


export class SqliteCBotRepository implements ICBotRepository {
  private readonly dbPath: string

  constructor() {
    this.dbPath = path.resolve(process.cwd(), config.SQLITE_DB_PATH)
  }

  /**
   * Inserts a new bot into the database.
   */
  public async addBot(bot: ICBotConfig): Promise<void> {
    const query = `
      INSERT INTO bots (ckey, mode, move_strategy, cast_strategy)
      VALUES (?, ?, ?, ?)
    `
    const params = [
      bot.ckey,
      bot.mode,
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
      throw new ApiError(`Bot with ckey '${ckey}' not found.`, 404)
    }

    return this.mapRow(row)
  }

  /**
   * Retrieves all bots from the database.
   */
  public async getBots(filter: IBotFilterCondition[]): Promise<ICBotConfig[]> {
    const query = `SELECT * FROM bots`

    const rows = await this.runSqlAll(query)
    return rows.map(row => this.mapRow(row))
  }

  /**
   * Updates an existing bot by ckey.
   * Throws an error if the bot with the given ckey does not exist.
   */
  public async updateBot(ckey: string, bot: IBotFilter): Promise<void> {
    const query = `
    UPDATE bots
    SET 
        mode = ?,
        move_strategy = ?,
        cast_strategy = ?
    WHERE ckey = ?
  `;

    const params = [
      bot.mode,
      bot.move_strategy,
      bot.cast_strategy,
      ckey
    ];

    const changes = await this.runSql(query, params);

    if (changes === 0) {
      throw new ApiError(`Bot with ckey ${ckey} not found`, 404);
    }
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
      status: row.status,
      move_strategy: row.move_strategy,
      cast_strategy: row.cast_strategy
    }
  }

  /**
   * Runs a SQL statement (INSERT, UPDATE, DELETE) without returning rows.
   */
  private runSql(query: string, params: any[] = []): Promise<number> {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);

      db.run(query, params, function (err) {  // Use function() to access `this.changes`
        db.close();

        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes);
      });
    });
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
