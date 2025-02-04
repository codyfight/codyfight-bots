import { ICBotRepository } from '../../db/repository/c-bot-repository.interface.js'
import CBot from './c-bot.js'
import { createCBotRepository } from '../../db/repository/create-c-bot-repository.js'


class CBotFactory {
  private botRepository: ICBotRepository;

  constructor() {
    this.botRepository = createCBotRepository();
  }

  public async createAllCBots(): Promise<CBot[]> {
    const botConfigs = await this.botRepository.getAllBots();

    if (!botConfigs || botConfigs.length === 0) {
      throw new Error('No bot configurations found in the repository.');
    }

    return botConfigs.map((config) => new CBot(config));
  }


  public async createBot(ckey: string): Promise<CBot> {
    const config = await this.botRepository.getBot(ckey);

    if (!config) {
      throw new Error(`No bot configuration found for ckey: ${ckey}`);
    }

    return new CBot(config);
  }

}

export default CBotFactory;
