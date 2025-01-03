import ICBotConfig from '../../../c-bots/c-bot/c-bot-config.interface.js'

export interface ICBotRepository {
  getAllBots(): Promise<ICBotConfig[]>
  addBot(bot: ICBotConfig): Promise<void>
  deleteBot(ckey: string): Promise<void>
}
