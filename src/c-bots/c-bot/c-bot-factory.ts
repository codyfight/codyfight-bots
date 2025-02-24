import { ICBotRepository } from '../../db/repository/c-bot-repository.interface.js'
import CBot from './c-bot.js'

class CBotFactory {
  
  constructor(private botRepository: ICBotRepository) {}

  /**
   * Create CBot instances for all bots belonging to player_id = "1"
   */
  public async createAllCBots(): Promise<CBot[]> {
    const botConfigs = await this.botRepository.getBots({ player_id: '1' })
    if (!botConfigs || botConfigs.length === 0) {
      throw new Error('No bot configurations found in the repository.')
    }
    return botConfigs.map((config) => new CBot(config))
  }

  /**
   * Create a single CBot instance for the given ckey
   */
  public async createBot(ckey: string): Promise<CBot> {
    const config = await this.botRepository.getBot(ckey)
    if (!config) {
      throw new Error(`No bot configuration found for ckey: ${ckey}`)
    }
    return new CBot(config)
  }
}

export default CBotFactory
