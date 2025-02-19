import CBot from './c-bot/c-bot.js'
import CBotFactory from './c-bot/c-bot-factory.js'
import Logger from '../utils/logger.js'
import { getWaitTime, wait } from '../utils/utils.js'
import ApiError from '../errors/api-error.js'
import { BotStatus } from '../game/state/game-state.type.js'

class CBotManager {
  private botFactory: CBotFactory
  private activeBots = new Map<string, CBot>()
  private runningBotPromises = new Map<string, Promise<void>>()

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
  public stopBot(ckey: string, method: string) {
    const bot = this.activeBots.get(ckey)

    if (!bot) {
      throw new ApiError(`Unable to stop bot with ckey ${ckey}, it is not currently running.`, 404)
    }

    bot.setStatus((method === 'surrender') ? BotStatus.Surrendering : BotStatus.Finishing)

    this.activeBots.delete(ckey)
    this.runningBotPromises.delete(ckey)
    Logger.info(`Bot ${ckey} stopped`)
  }

  /**
   * Stops all bots by setting their active flag to false,
   * Then awaits all run() loops to end.
   */
  public async stopAll(): Promise<void> {

    for (const bot of this.activeBots.values()) {
      bot.setStatus(BotStatus.Finishing)
    }

    await Promise.all([...this.runningBotPromises.values()])

    this.activeBots.clear()
    this.runningBotPromises.clear()
    Logger.info('All bots have been stopped.')
  }

  public async getBotStatus(ckey: string): Promise<BotStatus> {
    const botInstance = this.activeBots.get(ckey) ?? await this.botFactory.createBot(ckey)
    return botInstance.getStatus()
  }

  /**
   * Registers the bot in activeBots, starts its infinite loop.
   */
  private registerAndStartBot(bot: CBot): void {
    if (this.activeBots.has(bot.ckey())) {
      throw new ApiError(`Bot is already running.`, 409)
    }

    this.activeBots.set(bot.ckey(), bot)

    const runPromise = this.runBot(bot).catch(err => {
      Logger.error(`Bot "${bot.ckey()}" crashed unexpectedly:`, err)
      this.activeBots.delete(bot.ckey())
      this.runningBotPromises.delete(bot.ckey())
    })

    this.runningBotPromises.set(bot.ckey(), runPromise)

    Logger.info(`Bot "${bot.ckey()}" started`)
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
    if (bot.isPlaying()) {
      await this.runBot(bot)
    }
  }
}

const botManager = new CBotManager()
export default botManager
