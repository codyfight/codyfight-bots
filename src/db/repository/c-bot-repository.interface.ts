import ICBotConfig from '../../c-bots/c-bot/c-bot-config.interface.js'

export interface ICBotRepository {
  addBot(bot: ICBotConfig): Promise<void>
  getBot(ckey: string): Promise<ICBotConfig>
  getAllBots(): Promise<ICBotConfig[]>
  updateBot(ckey: string, bot: ICBotConfig): Promise<void>
  deleteBot(ckey: string): Promise<void>
}
