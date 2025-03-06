import { IBotFilter, IBotFilterCondition, ICBotRepository } from './c-bot-repository.interface.js'
import { ICBotConfig } from '../../c-bots/c-bot/c-bot-config.interface.js'
import mysql from 'mysql2/promise'
import config from '../../config/env.js'
import Logger from '../../utils/logger.js'
import ApiError from '../../errors/api-error.js'


class MysqlCBotRepository implements ICBotRepository {

  private pool: mysql.Pool

  constructor() {

    const host = config.MYSQL.HOST
    const user = config.MYSQL.USER
    const password = config.MYSQL.PASSWORD
    const database = config.MYSQL.DB
    const connectionLimit = config.MYSQL.CONNECTION_LIMIT

    this.pool = mysql.createPool({
      host: host,
      user: user,
      password: password,
      database: database,
      connectionLimit: connectionLimit
    })
  }

  async addBot(bot: ICBotConfig): Promise<void> {

    const query = `
      INSERT INTO bots (player_id, ckey, mode, move_strategy, cast_strategy)
      VALUES (?, ?, ?, ?, ?)`

    const params = [
      bot.player_id,
      bot.ckey,
      bot.mode,
      bot.move_strategy,
      bot.cast_strategy
    ]

    try {
      const connection = await this.pool.getConnection()
      await connection.execute(query, params)
      connection.release()
    } catch (err) {
      Logger.error('Error inserting bot:', err)
      throw new ApiError('Failed to add bot', 500, err);
    }
  }

  async deleteBot(ckey: string): Promise<void> {
    const query = `DELETE FROM bots WHERE ckey = ?`;

    try {
      const connection = await this.pool.getConnection();
      await connection.execute(query, [ckey]);
      connection.release();
    } catch (err) {
      Logger.error('Error deleting bot:', err);
      throw new ApiError('Failed to delete bot', 500, err);
    }
  }

  async getBot(ckey: string): Promise<ICBotConfig> {

    const query = `SELECT * FROM bots WHERE ckey = ? LIMIT 1`

    try {
      const connection = await this.pool.getConnection()
      const [rows] = await connection.execute(query, [ckey])
      connection.release()

      if (!Array.isArray(rows) || rows.length === 0) {
        throw new ApiError('Bot not found', 404)
      }

      return rows[0] as ICBotConfig
    } catch (err) {
      Logger.error('Error retrieving bot:', err)
      throw ApiError.from(err, 'Failed to retrieve bot');
    }
  }

  async getBots(filter: IBotFilterCondition[]): Promise<ICBotConfig[]> {
    let query = 'SELECT * FROM bots';
    const values: any[] = [];

    if (filter && filter.length > 0) {
      const conditions = filter.map(cond => {
        values.push(cond.value);
        return `${cond.field} ${cond.operator} ?`;
      });
      query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
      const connection = await this.pool.getConnection();
      const [rows] = await connection.execute(query, values);
      connection.release();
      return rows as ICBotConfig[];
    } catch (err) {
      Logger.error('Error retrieving bots:', err);
      throw ApiError.from(err, 'Failed to retrieve bots');
    }
  }

  async updateBot(ckey: string, bot: IBotFilter): Promise<void> {
    const query = `
    UPDATE bots 
    SET mode = ?, move_strategy = ?, cast_strategy = ?
    WHERE ckey = ?
  `

    const params = [
      bot.mode,
      bot.move_strategy,
      bot.cast_strategy,
      ckey
    ]

    try {
      const connection = await this.pool.getConnection()
      const [result] = await connection.execute(query, params)

      if ((result as any).affectedRows === 0) {
        throw new ApiError('No rows updated, ckey not found', 404)
      }

      connection.release()
    } catch (err) {
      Logger.error('Error updating bot:', err)
      throw ApiError.from(err, 'Failed to update bot');
    }
  }

}

export default MysqlCBotRepository
