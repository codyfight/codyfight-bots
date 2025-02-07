import ICBotConfig from '../../c-bots/c-bot/c-bot-config.interface.js'
import { IBotFilter } from '../../api/interfaces/bot-api.interface.js'

export interface ICBotRepository {
  addBot(bot: ICBotConfig): Promise<void>
  getBot(ckey: string): Promise<ICBotConfig>
  getBots(filter: IBotFilter): Promise<ICBotConfig[]>
  updateBot(ckey: string, bot: ICBotConfig): Promise<void>
  deleteBot(ckey: string): Promise<void>
}
