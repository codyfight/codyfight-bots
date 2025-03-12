import CBot from './c-bot/c-bot.js'
import CBotFactory from './c-bot/c-bot-factory.js'
import Logger from '../utils/logger.js'
import { IBotFilter, IBotFilterCondition, ICBotRepository } from '../db/repository/c-bot-repository.interface.js'
import { createCBotRepository } from '../db/repository/create-c-bot-repository.js'
import { ICBotConfig, ICBotState } from './c-bot/c-bot-config.interface.js'

class CBotManager {
  private readonly botRepository: ICBotRepository
  private botFactory: CBotFactory

  private activeBots = new Map<string, CBot>()

  constructor() {
    this.botRepository = createCBotRepository()
    this.botFactory = new CBotFactory(this.botRepository)
  }

  public async addBot(botData: ICBotConfig): Promise<void> {
    Logger.debug(`addBot() called "${botData.ckey}"...`)
    await this.botRepository.addBot(botData)
  }

  public async getAllBotConfigs(filter: IBotFilterCondition[]): Promise<ICBotConfig[]> {
    Logger.debug(`getAllBotConfigs() called...`)
    return this.botRepository.getBots(filter)
  }

  public async updateBotConfig(ckey: string, params: IBotFilter): Promise<void> {
    Logger.debug(`updateBotConfig() called "${ckey}"...`)
    await this.botRepository.updateBot(ckey, params)
  }

  public async deleteBotConfig(ckey: string): Promise<void> {
    Logger.debug(`deleteBotConfig() called "${ckey}"...`)
    await this.botRepository.deleteBot(ckey)
  }

  /**
   * Returns a CBot instance, either from memory (activeBots) or by creating a new one.
   */
  public async getBot(ckey: string): Promise<CBot> {
    Logger.debug(`getBot() called "${ckey}"...`)
    return this.activeBots.get(ckey) || await this.botFactory.createBot(ckey)
  }

  /**
   * Return the bot's current status (bot_state + game_state).
   * If the bot isn't active or doesn't exist, default to "stopped".
   */
  public async getBotStatus(ckey: string): Promise<ICBotState> {
    Logger.debug(`getBotStatus() called "${ckey}"...`)
    const bot = await this.getBot(ckey)
    return bot.status
  }

  public async isBotActive(bot: CBot): Promise<boolean> {

    const inActiveBots = this.activeBots.has(bot.ckey)

    if (inActiveBots && bot.status.bot_state === 'stopped') {
      Logger.warn(`Stopped bot "${bot.ckey}" in activeBots`)
      this.removeActiveBot(bot.ckey)
      return false
    }

    return inActiveBots
  }

  /**
   * Start the bot (if not already active).
   */
  public async startBot(ckey: string): Promise<void> {
    try {
      Logger.info(`Starting bot "${ckey}"...`)
      const bot = await this.getBot(ckey)
      const isActive = await this.isBotActive(bot)

      if (isActive) {
        Logger.warn(`Bot "${ckey}" is already active with a status ${bot.status}`)
        return
      }

      this.attachCallbacks(bot)
      this.activeBots.set(ckey, bot)
      await bot.start()

      Logger.info(`Bot "${ckey}" has started.`)
    } catch (error) {
      Logger.error(`Failed to start bot ${ckey}:`, error)
    }
  }

  /**
   * Stop an active bot.
   */
  public async stopBot(ckey: string): Promise<void> {
    try {
      Logger.info(`Stopping bot "${ckey}"...`)
      const bot = await this.getBot(ckey)
      await bot.stop()

      Logger.info(`Bot "${ckey}" stopped.`)
    } catch (error) {
      Logger.error(`Failed to stop bot ${ckey}:`, error)
      throw error
    }
  }

  /**
   * Stops all active bots.
   */
  public async stopAll(): Promise<void> {
    for (const [ckey] of this.activeBots.entries()) {
      await this.stopBot(ckey)
    }
    Logger.info('All bots have been stopped.')
  }

  /**
   * Fetch all bots from the DB and run them in infinite loops.
   */
  public async runAll(): Promise<void> {
    const allBotConfigs = await this.getAllBotConfigs([])
    for (const config of allBotConfigs) {
      await this.startBot(config.ckey)
    }
  }

  public async resumeBots(): Promise<void> {
    const allBotConfigs = await this.getAllBotConfigs([{ field: 'status', operator: '!=', value: 'stopped' }])
    for (const config of allBotConfigs) {
      Logger.info(`Resuming bot "${config.ckey}..."`)
      await this.resumeBot(config.ckey)
    }
  }

  public async reloadBot(ckey: string): Promise<void> {

    const bot = await this.getBot(ckey)
    const active = await this.isBotActive(bot)
    
    if(active) {
      this.removeActiveBot(ckey)
      await this.resumeBot(ckey)
    }

  }

  private async resumeBot(ckey: string): Promise<void> {
    try {
      const bot = await this.getBot(ckey)
      this.attachCallbacks(bot)
      this.activeBots.set(ckey, bot)
      await bot.resume()
      Logger.info(`Bot "${ckey}" resumed successfully.`)
    } catch (error) {
      Logger.error(`Failed to resume bot ${ckey}:`, error)
    }
  }

  private attachCallbacks(bot: CBot): void {
    bot.on('stopped', (ckey: string) => this.removeActiveBot(ckey))
    bot.on('restart', async (ckey) => await this.restartBot(ckey))
  }

  private removeActiveBot(ckey: string): void {
    Logger.info(`Removing bot "${ckey}" from activeBots...`)
    this.activeBots.delete(ckey)
  }

  private async restartBot(ckey: string): Promise<void> {
    Logger.info(`Restarting bot "${ckey}"...`)
    this.removeActiveBot(ckey)
    await this.startBot(ckey)
  }

}

const botManager = new CBotManager()
export default botManager
