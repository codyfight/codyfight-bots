import CBot from './CBot.js'
import ICBotConfig from './ICBotConfig.js'
import { createBotRepository } from '../../server/db/repository/index.js'

const botRepository = createBotRepository()

export class CBotFactory {
  static async createAllBots(): Promise<CBot[]> {
    const botConfigs: ICBotConfig[] = await botRepository.getAllBots()
    return botConfigs.map((config) => new CBot(config))
  }
}
