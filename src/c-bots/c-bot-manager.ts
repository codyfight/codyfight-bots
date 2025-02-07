import CBot from './c-bot/c-bot.js'
import CBotFactory from './c-bot/c-bot-factory.js'
import Logger from '../utils/logger.js'
import { getWaitTime, wait } from '../utils/utils.js'
import ApiError from '../errors/api-error.js'

class CBotManager {
  private botFactory: CBotFactory
  private activeBots = new Map<string, CBot>()

  constructor() {
    this.botFactory = new CBotFactory()
  }

  /**
   * Fetch all bots and run each bot in an infinite loop
   * Intended for local use only
   */
  public async runAll(): Promise<void> {

    const cbots: CBot[] = await this.botFactory.createAllCBots()

    for (const bot of cbots) {
      try {
        this.registerAndStartBot(bot)
      } catch (error) {
        Logger.error('Error while creating or running bot:', error)
      }
    }
  }

  /**
   * Retrieves a single bot instance,
   * registers it with the running bots and starts a game
   */
  public async startBot(ckey: string) {
    const bot = await this.botFactory.createBot(ckey)
    this.registerAndStartBot(bot)
  }

  /**
   * Stops am active bot instance, and removes it from the running bots
   */
  public stopBot(ckey: string) {
    const bot = this.activeBots.get(ckey)

    if (!bot) {
      throw new ApiError(`Unable to stop bot with ckey ${ckey}, it is not currently running.`, 404);
    }

    bot.stop()
    this.activeBots.delete(ckey)
    Logger.info(`Bot ${ckey} stopped`)
  }

  /**
   * Returns the status of a bot, weather it's running or not
   * TODO - tidy this up, returning a tuple here is not the best implementation
   */
  public async getBotStatus(ckey: string): Promise<{ status: object; active: boolean }> {
    const botInstance = this.activeBots.get(ckey) ?? await this.botFactory.createBot(ckey);
    return { status: botInstance.getStatus(), active: botInstance.isActive() };
  }

  /**
   * Registers the bot in activeBots, starts its infinite loop.
   */
  private registerAndStartBot(bot: CBot): void {
    if (this.activeBots.has(bot.ckey)) {
      throw new ApiError(`Bot ${bot.ckey} is already running.`, 409)
    }

    this.activeBots.set(bot.ckey, bot)

    // Start in the background; remove on crash
    this.runBot(bot).catch(err => {
      Logger.error(`Bot "${bot.ckey}" crashed unexpectedly:`, err)
      this.activeBots.delete(bot.ckey)
    })

    Logger.info(`Bot "${bot.ckey}" started`)
  }

  /** Runs a single bot in an infinite loop with error handling & retry. */
  private async runBot(bot: CBot): Promise<void> {

    try {
      Logger.info(`Running Bot: ${bot.toString()}`)
      await bot.run()
    } catch (error) {
      Logger.error(`Bot (${bot.toString()}) failed:`, error)
      const waitTime = getWaitTime(error)
      Logger.info(`Waiting for ${waitTime} ms`)
      await wait(waitTime)
    }

    // if the bot crashes we want to retry
    if (bot.isActive()){
      await this.runBot(bot)
    }
  }
}

const botManager = new CBotManager();
export default botManager;
