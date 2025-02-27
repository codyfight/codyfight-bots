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
    await this.botRepository.addBot(botData)
  }

  public async getAllBotConfigs(filter: IBotFilterCondition[]): Promise<ICBotConfig[]> {
    return this.botRepository.getBots(filter)
  }

  public async updateBotConfig(ckey: string, params: IBotFilter): Promise<void> {
    await this.botRepository.updateBot(ckey, params)
  }

  public async deleteBotConfig(ckey: string): Promise<void> {
    await this.botRepository.deleteBot(ckey)
  }

  /**
   * Returns a CBot instance, either from memory (activeBots) or by creating a new one.
   */
  public async getBot(ckey: string): Promise<CBot> {
    return this.activeBots.get(ckey) || await this.botFactory.createBot(ckey)
  }

  /**
   * Return the bot's current status (bot_state + game_state).
   * If the bot isn't active or doesn't exist, default to "stopped".
   */
  public async getBotStatus(ckey: string): Promise<ICBotState> {
    const bot = await this.getBot(ckey)
    return bot.status
  }

  public async isBotActive(ckey: string): Promise<boolean> {
    const status = await this.getBotStatus(ckey)
    const isActive = this.activeBots.has(ckey)

    return isActive || status.bot_state !== 'stopped'
  }

  /**
   * Start the bot (if not already active).
   */
  public async startBot(ckey: string): Promise<void> {
    try {
      const bot = await this.getBot(ckey)
      this.attachCallbacks(bot)

      if (this.activeBots.has(ckey)) {
        Logger.info(`Bot "${ckey}" is already active.`)
        return
      }

      this.activeBots.set(ckey, bot)
      await bot.start()

      Logger.info(`Bot "${ckey}" has started.`)
    } catch (error) {
      Logger.error(`Failed to start bot ${ckey}:`, error)
    }
  }

  private async restart(ckey: string): Promise<void> {
    this.activeBots.delete(ckey)
    await this.startBot(ckey)
  }

  private attachCallbacks(bot: CBot): void {
    bot.restart = () => this.restart(bot.ckey)
  }

  /**
   * Stop an active bot.
   */
  public async stopBot(ckey: string): Promise<void> {
    try {
      const bot = await this.getBot(ckey)
      await bot.stop()
      this.activeBots.delete(ckey)
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
    const allBotConfigs = await this.getAllBotConfigs([{ field: 'status', operator: '!=', value: 'stopped' }])
    for (const config of allBotConfigs) {
      await this.startBot(config.ckey)
    }
  }

  public async resumeBots(): Promise<void> {
    const allBotConfigs = await this.getAllBotConfigs([{ field: 'status', operator: '!=', value: 'stopped' }])
    for (const config of allBotConfigs) {
      await this.resumeBot(config.ckey)
    }
  }

  private async resumeBot(ckey: string): Promise<void> {
    try {
      const bot = await this.getBot(ckey)
      this.attachCallbacks(bot)
      this.activeBots.set(ckey, bot)
      await bot.resume()
      Logger.info(`Bot "${ckey}" resumed.`)
    } catch (error) {
      Logger.error(`Failed to resume bot ${ckey}:`, error)
    }
  }

}

const botManager = new CBotManager()
export default botManager
