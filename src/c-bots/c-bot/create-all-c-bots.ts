import CBot from './c-bot.js'
import ICBotConfig from './c-bot-config.interface.js'
import { createCBotRepository } from '../../db/repository/create-c-bot-repository.js'

export async function createAllCBots(): Promise<CBot[]> {
  const botRepository = createCBotRepository()
  const botConfigs: ICBotConfig[] = await botRepository.getAllBots()
  return botConfigs.map((config) => new CBot(config))
}
