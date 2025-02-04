import CBot from './c-bot/c-bot.js'
import CBotFactory from './c-bot/c-bot-factory.js'
import Logger from '../utils/logger.js'
import { getWaitTime, wait } from '../utils/utils.js'

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
    Logger.info('Running All Bots...')
    const cbots: CBot[] = await this.botFactory.createAllCBots()

    for (const bot of cbots) {
      try {
        this.registerAndStartBot(bot)
      } catch (error) {
        Logger.error('Error while creating or running bot:', error)
      }
    }
  }

  public async startBot(ckey: string) {
    const bot = await this.botFactory.createBot(ckey)
    this.registerAndStartBot(bot)
  }

  public stopBot(ckey: string) {
    const bot = this.activeBots.get(ckey)

    if (!bot) {
      throw new Error(`Bot "${ckey}" is not running.`)
    }

    bot.stop()
    this.activeBots.delete(ckey)
    Logger.info(`Bot ${ckey} stopped`)
  }

  public getBotStatus(ckey: string): object {
    const bot = this.activeBots.get(ckey);

    if (!bot) {
      return { error: `Bot "${ckey}" is not running.` };
    }

    return bot.getStatus();
  }


  /**
   * Registers the bot in activeBots, starts its infinite loop.
   */
  private registerAndStartBot(bot: CBot): void {
    if (this.activeBots.has(bot.ckey)) {
      throw new Error(`Bot "${bot.ckey}" is already running.`)
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
    if (!bot.isActive()) return

    try {
      Logger.info(`Running Bot: ${bot.toString()}`)
      await bot.run()
    } catch (error) {
      Logger.error(`Bot (${bot.toString()}) failed:`, error)
      const waitTime = getWaitTime(error)
      Logger.info(`Waiting for ${waitTime} ms`)
      await wait(waitTime)
      await this.runBot(bot)
    }
  }
}

const botManager = new CBotManager();
export default botManager;
