import BotState from './bot-state.js'
import BotStartingState from './bot-starting-state.js'

class BotStoppedState extends BotState{

  status(): string {
    return 'stopped'
  }

  public async start(): Promise<void> {
    await this.transitionTo(new BotStartingState(this.cBot))
  }
}

export default BotStoppedState
