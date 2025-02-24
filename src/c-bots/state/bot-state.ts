import CBot from '../c-bot/c-bot.js'
import botManager from '../c-bot-manager.js'

abstract class BotState {
  public constructor(protected cBot: CBot) {}

  abstract status(): string

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
    this.cBot.setState(newState)
    await botManager.updateBotConfig(this.cBot.ckey(), this.cBot.toJSON())
  }
}

export default BotState
