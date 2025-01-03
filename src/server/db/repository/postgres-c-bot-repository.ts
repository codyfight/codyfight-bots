import pkg from 'pg'
import ICBotConfig from '../../../c-bots/c-bot/c-bot-config.interface.js'
import { ICBotRepository } from './c-bot-repository.interface.js'
import { getEnvVar } from '../../../utils/utils.js'

const { Client } = pkg

export class PostgresCBotRepository implements ICBotRepository {
  private readonly client: any

  constructor() {
    const connectionString = getEnvVar('DATABASE_URL')
    this.client = new Client({
      connectionString
    })

    this.client
      .connect()
      .then(() => console.debug('Connected to Postgres DB.'))
      .catch((err: Error) => {
        console.error('Postgres connection error:', err.message)
      })
  }

  public async getAllBots(): Promise<ICBotConfig[]> {
    const result = await this.client.query('SELECT * FROM bots')
    return result.rows.map(this.mapRow)
  }

  public async addBot(bot: ICBotConfig): Promise<void> {
    await this.client.query(
      `INSERT INTO bots (ckey, mode, url, logging, move_strategy, cast_strategy)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        bot.ckey,
        bot.mode,
        bot.url,
        bot.logging,
        bot.move_strategy,
        bot.cast_strategy
      ]
    )
  }

  public async deleteBot(ckey: string): Promise<void> {
    await this.client.query(`DELETE FROM bots WHERE ckey = $1`, [ckey])
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
