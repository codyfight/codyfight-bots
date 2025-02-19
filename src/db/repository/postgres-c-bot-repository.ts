import pkg from 'pg'
import { ICBotConfig } from '../../c-bots/c-bot/c-bot-config.interface.js'
import { IBotFilter, ICBotRepository } from './c-bot-repository.interface.js'
import Logger from '../../utils/logger.js'
import config from '../../config/env.js'
import ApiError from '../../errors/api-error.js'
import { BotStatus } from '../../game/state/game-state.type.js'


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
    INSERT INTO bots (player_id, ckey, mode, environment, move_strategy, cast_strategy)
    VALUES ($1, $2, $3, $4, $5, $6)
  `

    try {
      await this.client.query(query, [
        bot.player_id,
        bot.ckey,
        bot.mode,
        bot.environment,
        bot.move_strategy,
        bot.cast_strategy
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
  public async getBots(filter: IBotFilter): Promise<ICBotConfig[]> {
    const playerId = parseInt(filter.player_id as string)

    if (!playerId) {
      throw new ApiError('player_id is required', 500)
    }

    const query = `SELECT * FROM bots WHERE player_id = $1` // Use $1 for parameterized queries

    try {
      const result = await this.client.query(query, [playerId])
      return result.rows.map(this.mapRow)
    } catch (err) {
      Logger.error('Error retrieving bots:', err)
      throw ApiError.from(err, 'Failed to retrieve bots')
    }
  }


  /**
   * Updates an existing bot by ckey.
   * Throws an error if the bot doesn't exist.
   */
  public async updateBot(ckey: string, bot: ICBotConfig): Promise<void> {
    const result = await this.client.query(
      `UPDATE bots
       SET player_id = $1,
           mode = $2,
           environment = $3,
           move_strategy = $4,
           cast_strategy = $5
       WHERE ckey = $6`,
      [bot.player_id, bot.mode, bot.environment, bot.move_strategy, bot.cast_strategy, ckey]
    )

    if (result.rowCount === 0) {
      throw new ApiError(`Bot with ckey '${ckey}' not found.`)
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
      ckey: row.ckey,
      mode: row.mode,
      status: BotStatus.Stopped,
      environment: row.environment,
      move_strategy: row.move_strategy,
      cast_strategy: row.cast_strategy
    }
  }
}
