import ICBotConfig from '../../../bots/cbot/ICBotConfig.js'

export interface IBotRepository {
  getAllBots(): Promise<ICBotConfig[]>
  addBot(bot: ICBotConfig): Promise<void>
  deleteBot(ckey: string): Promise<void>
}
