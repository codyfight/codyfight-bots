import pkg from 'pg'
import ICBotConfig from '../../c-bots/c-bot/c-bot-config.interface.js'
import { ICBotRepository } from './c-bot-repository.interface.js'
import { getEnvVar } from '../../utils/utils.js'

const { Client } = pkg;

export class PostgresCBotRepository implements ICBotRepository {
  private readonly client: any;

  constructor() {
    const connectionString = getEnvVar('DATABASE_URL');
    this.client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    this.client
      .connect()
      .then(() => console.debug('Connected to Postgres DB.'))
      .catch((err: Error) => {
        console.error('Postgres connection error:', err.message);
      });
  }

  /**
   * Adds a new bot to the database.
   */
  public async addBot(bot: ICBotConfig): Promise<void> {
    await this.client.query(
      `INSERT INTO bots (ckey, mode, url, move_strategy, cast_strategy)
       VALUES ($1, $2, $3, $4, $5)`,
      [bot.ckey, bot.mode, bot.url, bot.move_strategy, bot.cast_strategy]
    );
  }

  /**
   * Retrieves a single bot by ckey.
   * Throws an error if no bot is found.
   */
  public async getBot(ckey: string): Promise<ICBotConfig> {
    const result = await this.client.query(
      `SELECT * FROM bots WHERE ckey = $1`,
      [ckey]
    );

    if (result.rows.length === 0) {
      throw new Error(`Bot with ckey '${ckey}' not found.`);
    }

    return this.mapRow(result.rows[0]);
  }

  /**
   * Retrieves all bots from the database.
   */
  public async getAllBots(): Promise<ICBotConfig[]> {
    const result = await this.client.query(`SELECT * FROM bots`);
    return result.rows.map(this.mapRow);
  }

  /**
   * Updates an existing bot by ckey.
   * Throws an error if the bot doesn't exist.
   */
  public async updateBot(bot: ICBotConfig): Promise<void> {
    const result = await this.client.query(
      `UPDATE bots
       SET mode = $1,
           url = $2,
           move_strategy = $3,
           cast_strategy = $4
       WHERE ckey = $5`,
      [bot.mode, bot.url, bot.move_strategy, bot.cast_strategy, bot.ckey]
    );
    
    if (result.rowCount === 0) {
      throw new Error(`Bot with ckey '${bot.ckey}' not found.`);
    }
  }

  /**
   * Deletes a bot by ckey.
   */
  public async deleteBot(ckey: string): Promise<void> {
    await this.client.query(`DELETE FROM bots WHERE ckey = $1`, [ckey]);
  }

  /**
   * Utility method to map a DB row to ICBotConfig.
   */
  private mapRow(row: any): ICBotConfig {
    return {
      ckey: row.ckey,
      mode: row.mode,
      url: row.url,
      move_strategy: row.move_strategy,
      cast_strategy: row.cast_strategy,
    };
  }
}
