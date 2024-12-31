import ICBotConfig from '../../../bots/cbot/ICBotConfig.js'

export interface IBotRepository {
  getAllBots(): Promise<ICBotConfig[]>;
}
