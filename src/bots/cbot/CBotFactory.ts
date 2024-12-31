import { BotRepository } from '../../server/db/repository/BotRepository.js'
import CBot from './CBot.js'
import ICBotConfig from './ICBotConfig.js'


const botRepository = new BotRepository();

export class CBotFactory {

  static async createAllBots(): Promise<CBot[]> {
    const botConfigs: ICBotConfig[] = await botRepository.getAllBots();
    return botConfigs.map((config) => new CBot(config));
  }

}
