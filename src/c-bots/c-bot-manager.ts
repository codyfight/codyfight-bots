// c-bot-manager.ts

import CBot from './c-bot/c-bot.js'
import CBotFactory from './c-bot/c-bot-factory.js'
import Logger from '../utils/logger.js'
import { getWaitTime, wait } from '../utils/utils.js'
import { GameStatus } from '../game/state/game-state.type.js'
import { IBotFilter, ICBotRepository } from '../db/repository/c-bot-repository.interface.js'
import { createCBotRepository } from '../db/repository/create-c-bot-repository.js'
import { ICBotConfig } from './c-bot/c-bot-config.interface.js'

class CBotManager {
  private readonly botRepository: ICBotRepository
  private botFactory: CBotFactory

  private activeBots = new Map<string, CBot>()
  private runningBotPromises = new Map<string, Promise<void>>()

  constructor() {
    this.botRepository = createCBotRepository()
    this.botFactory = new CBotFactory(this.botRepository)
  }

  public async addBot(botData: any): Promise<void>{
    await this.botRepository.addBot(botData)
  }

  public async getAllBotConfigs(filter: IBotFilter): Promise<ICBotConfig[]> {
    return this.botRepository.getBots(filter)
  }

  public async updateBotConfig(ckey: string, bot: ICBotConfig): Promise<void> {
    await this.botRepository.updateBot(ckey, bot)
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
  public async getBotStatus(ckey: string): Promise<{ bot_state: string; game_state: GameStatus }> {
    const bot = await this.getBot(ckey)
    return bot.getStatus()
  }

  /**
   * Start the bot (if not already active).
   */
  public async startBot(ckey: string): Promise<void> {
    const bot = await this.getBot(ckey)

    // Check if it's already active
    if (this.activeBots.has(ckey)) {
      Logger.info(`Bot ${ckey} is already active.`)
      return
    }

    // Register and start
    await this.registerAndStartBot(bot)
  }

  /**
   * Stop an active bot.
   */
  public async stopBot(ckey: string): Promise<void> {
    try {
      const bot = await this.getBot(ckey)
      await bot.stop()
      this.activeBots.delete(ckey)
      Logger.info(`Bot ${ckey} stopped.`)
    } catch (error) {
      Logger.error(`Failed to stop bot ${ckey}:`, error)
      throw error
    }
  }

  /**
   * Stops all active bots.
   */
  public async stopAll(): Promise<void> {
    // Stop each bot
    for (const [ckey, bot] of this.activeBots.entries()) {
      await bot.stop()
      Logger.info(`Bot ${ckey} stopped.`)
    }

    // Wait for all run loops to finish
    await Promise.all([...this.runningBotPromises.values()])

    // Clear active maps
    this.activeBots.clear()
    this.runningBotPromises.clear()

    Logger.info('All bots have been stopped.')
  }

  /**
   * Fetch all bots from the DB and run them in infinite loops.
   */
  public async runAll(): Promise<void> {
    const cbots: CBot[] = await this.botFactory.createAllCBots()
    for (const bot of cbots) {
      try {
        await this.registerAndStartBot(bot)
      } catch (error) {
        Logger.error('Error while creating or running bot:', error)
      }
    }
  }

  /**
   * Places the bot in activeBots, then runs it in a loop (runBot).
   */
  private async registerAndStartBot(bot: CBot): Promise<void> {
    this.activeBots.set(bot.ckey(), bot)

    const runPromise = this.runBot(bot).catch((err) => {
      Logger.error(`Bot "${bot.ckey()}" crashed unexpectedly:`, err)
      this.activeBots.delete(bot.ckey())
      this.runningBotPromises.delete(bot.ckey())
    })

    this.runningBotPromises.set(bot.ckey(), runPromise)

    Logger.info(`Bot "${bot.ckey()}" started.`)
  }

  /**
   * Runs a bot in an infinite loop with error handling & retry.
   * If a bot crashes, we retry by calling runBot again.
   */
  private async runBot(bot: CBot): Promise<void> {
    try {
      Logger.info(`Running Bot: ${bot.toString()}`)
      await bot.run()
    } catch (error) {
      Logger.error(`Bot (${bot.toString()}) failed:`, error)
      const waitTime = getWaitTime(error)
      Logger.info(`Waiting for ${waitTime} ms before retry`)
      await wait(waitTime)
    }

    // If the bot "crashed" or finished, we attempt to run it again
    if(this.activeBots.has(bot.ckey())) {
      await this.runBot(bot)
    }
  }
}

const botManager = new CBotManager()
export default botManager
