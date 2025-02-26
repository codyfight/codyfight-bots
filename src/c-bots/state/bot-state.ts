import CBot from '../c-bot/c-bot.js'
import botManager from '../c-bot-manager.js'
import Logger from '../../utils/logger.js'
import { BotStatus, ICBotConfig } from '../c-bot/c-bot-config.interface.js'

abstract class BotState {
  public constructor(protected cBot: CBot) {}

  abstract get status(): BotStatus

  start(): void {
    // no-op
  }

  stop(): void {
    // no-op
  }

  async tick(): Promise<void> {
    // no-op
  }

  protected async transitionTo(newState: BotState): Promise<void> {
    Logger.debug(`Bot ${this.cBot.ckey} is transitioning from state ${this.status} to ${newState.status}`)
    this.cBot.state = newState

    await botManager.updateBotConfig(this.cBot.ckey, {
      ckey: this.cBot.ckey,
      status: newState.status
    } as ICBotConfig);
    
  }
}

export default BotState
