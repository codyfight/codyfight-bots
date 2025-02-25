import BotState from './bot-state.js'
import BotStartingState from './bot-starting-state.js'
import { BotStatus } from '../c-bot/c-bot-config.interface.js'
import CBot from '../c-bot/c-bot.js'

class BotStoppedState extends BotState{
  public constructor(protected cBot: CBot) {
    super(cBot)
    this.cBot.active = false
  }

  get status(): BotStatus {
    return BotStatus.Stopped
  }

  public async tick(): Promise<void> {
    throw new Error('Bot is stopped, you should not be ticking')
  }

  public async start(): Promise<void> {
    await this.transitionTo(new BotStartingState(this.cBot))
  }
}

export default BotStoppedState
