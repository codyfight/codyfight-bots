import pkg from 'pg'
import { BotStatus, ICBotConfig } from '../../c-bots/c-bot/c-bot-config.interface.js'
import { IBotFilter, ICBotRepository } from './c-bot-repository.interface.js'
import Logger from '../../utils/logger.js'
import config from '../../config/env.js'
import ApiError from '../../errors/api-error.js'


const { Client } = pkg

export class PostgresCBotRepository implements ICBotRepository {
  private readonly client: any

  constructor() {
    const connectionString = config.POSTGRES_URL
    this.client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })

    this.client
      .connect()
      .then(() => Logger.debug('Connected to Postgres DB.'))
      .catch((err: Error) => {
        Logger.error('Postgres connection error:', err.message)
      })
  }

  /**
   * Adds a new bot to the database.
   */
  public async addBot(bot: ICBotConfig): Promise<void> {
    const query = `
    INSERT INTO bots (player_id, ckey, mode, environment, move_strategy, cast_strategy, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `

    try {
      await this.client.query(query, [
        bot.player_id,
        bot.ckey,
        bot.mode,
        bot.environment,
        bot.move_strategy,
        bot.cast_strategy,
        BotStatus.Stopped
      ])
    } catch (err) {
      Logger.error('Error adding bot:', err)
      throw new ApiError('Failed to add bot', 500, err)
    }
  }

  /**
   * Retrieves a single bot by ckey.
   * Throws an error if no bot is found.
   */
  public async getBot(ckey: string): Promise<ICBotConfig> {
    const result = await this.client.query(
      `SELECT * FROM bots WHERE ckey = $1`,
      [ckey]
    )

    if (result.rows.length === 0) {
      throw new ApiError(`Bot with ckey '${ckey}' not found.`)
    }

    return this.mapRow(result.rows[0])
  }

  /**
   * Retrieves all bots for a given player_id.
   */

  // TODO - just adding player id for now, but the filter should be more dynamic
  public async getBots(filter: IBotFilter): Promise<ICBotConfig[]> {
    const { player_id } = filter

    if (player_id) {
      const playerIdNum = parseInt(player_id, 10)
      if (isNaN(playerIdNum)) {
        throw new ApiError('Invalid player_id provided', 500)
      }

      const query = 'SELECT * FROM bots WHERE player_id = $1'
      const result = await this.client.query(query, [playerIdNum])
      return result.rows.map(this.mapRow)
    } else {
      const query = 'SELECT * FROM bots'
      const result = await this.client.query(query)
      return result.rows.map(this.mapRow)
    }
  }

  /**
   * Updates an existing bot by ckey.
   * Throws an error if the bot doesn't exist.
   */
  public async updateBot(ckey: string, bot: ICBotConfig): Promise<void> {
    const params: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (bot.player_id !== undefined) {
      params.push(`player_id = $${index}`);
      values.push(bot.player_id);
      index++;
    }

    if (bot.mode !== undefined) {
      params.push(`mode = $${index}`);
      values.push(bot.mode);
      index++;
    }

    if (bot.environment !== undefined) {
      params.push(`environment = $${index}`);
      values.push(bot.environment);
      index++;
    }

    if (bot.status !== undefined) {
      params.push(`status = $${index}`);
      values.push(bot.status);
      index++;
    }

    if (bot.move_strategy !== undefined) {
      params.push(`move_strategy = $${index}`);
      values.push(bot.move_strategy);
      index++;
    }

    if (bot.cast_strategy !== undefined) {
      params.push(`cast_strategy = $${index}`);
      values.push(bot.cast_strategy);
      index++;
    }

    if (params.length === 0) {
      throw new ApiError(`No fields provided to update for bot with ckey '${ckey}'.`);
    }

    values.push(ckey);
    const query = `UPDATE bots SET ${params.join(', ')} WHERE ckey = $${index}`;

    const result = await this.client.query(query, values);

    if (result.rowCount === 0) {
      throw new ApiError(`Bot with ckey '${ckey}' not found.`);
    }
  }


  /**
   * Deletes a bot by ckey.
   */
  public async deleteBot(ckey: string): Promise<void> {
    const query = `DELETE FROM bots WHERE ckey = $1`

    try {
      const result = await this.client.query(query, [ckey])

      if (result.rowCount === 0) {
        throw new ApiError(`Bot with ckey '${ckey}' not found`, 404)
      }

    } catch (err) {
      Logger.error('Error deleting bot:', err)
      throw ApiError.from(err, 'Failed to delete bot')
    }
  }


  /**
   * Utility method to map a DB row to ICBotConfig.
   */
  private mapRow(row: any): ICBotConfig {
    return {
      player_id: row.player_id,
      ckey: row.ckey,
      mode: row.mode,
      status: row.status,
      environment: row.environment,
      move_strategy: row.move_strategy,
      cast_strategy: row.cast_strategy
    }
  }
}
