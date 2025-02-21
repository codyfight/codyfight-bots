import CBot from './c-bot/c-bot.js'
import CBotFactory from './c-bot/c-bot-factory.js'
import Logger from '../utils/logger.js'
import { getWaitTime, wait } from '../utils/utils.js'
import { BotStatus } from '../game/state/game-state.type.js'


class CBotManager {
  private botFactory: CBotFactory
  private activeBots = new Map<string, CBot>()
  private runningBotPromises = new Map<string, Promise<void>>()

  constructor() {
    this.botFactory = new CBotFactory()
  }

  public async getBot(ckey: string): Promise<CBot> {
    const bot = this.activeBots.get(ckey) || await this.botFactory.createBot(ckey)

    if (!bot) {
      throw new Error(`Bot with ckey ${ckey} not found.`)
    }

    return bot
  }

  /**
   * Fetch all bots and run each bot in an infinite loop
   * Intended for local use only
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
   * Retrieves a single bot instance,
   * registers it with the running bots and starts a game
   */
  public async startBot(ckey: string): Promise<void> {
    const bot = await this.getBot(ckey)

    // Check if bot is in active bots
    if (this.activeBots.get(ckey)) {
      Logger.info(`Bot ${ckey} already active`)
      return
    }

    await this.registerAndStartBot(bot)
  }

  /**
   * Stops am active bot instance, and removes it from the running bots
   */
  public async stopBot(ckey: string, method: string): Promise<void> {
    try {
      const bot = await this.getBot(ckey)
      if (bot.getStatus() === BotStatus.Stopped) {
        Logger.info(`Bot ${ckey} already stopped`)
        return
      }

      const newStatus = method === 'surrender'
        ? BotStatus.Surrendering
        : BotStatus.Finishing

      bot.setStatus(newStatus)
      Logger.info(`Bot ${ckey} status updated to ${newStatus}`)
    } catch (error: unknown) {
      Logger.error(`Failed to stop bot ${ckey}:`, error)
      throw error
    }
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
    try {
      const bot = await this.getBot(ckey)
      return bot.getStatus()
    } catch {
      return BotStatus.Stopped
    }
  }

  /**
   * Registers the bot in activeBots, starts its infinite loop.
   */
  private async registerAndStartBot(bot: CBot): Promise<void> {
    // Update factory on status changes
    bot.onStatusChange = () => {
      this.botFactory.updateBot(bot)
    }

    bot.setStatus(BotStatus.Initialising)
    await this.botFactory.updateBot(bot)

    // Make sure it’s in activeBots
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
    await this.restartBot(bot)
  }

  private async restartBot(bot: CBot) {
    const ckey = bot.ckey()
    this.activeBots.delete(ckey)
    this.runningBotPromises.delete(ckey)

    const newBot = await this.botFactory.createBot(ckey)
    if (newBot.isPlaying()) {
      Logger.info(`Restarting bot ${ckey}`)
      await this.registerAndStartBot(newBot)
    }
  }
}

const botManager = new CBotManager()
export default botManager
