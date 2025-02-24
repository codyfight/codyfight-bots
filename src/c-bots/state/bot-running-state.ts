import BotState from './bot-state.js'
import { GameStatus } from '../../game/state/game-state.type.js'
import BotStartingState from './bot-starting-state.js'
import BotStoppingState from './bot-stopping-state.js'

class BotRunningState extends BotState{

  status(): string {
    return 'running'
  }

  async tick(): Promise<void> {
    const status = this.cBot.gameClient.status()

    switch (status) {
      case GameStatus.Empty:
      case GameStatus.Ended:
        await this.transitionTo(new BotStartingState(this.cBot))
        break

      case GameStatus.Playing:
        await this.cBot.play()
        break

      case GameStatus.Registering:
      default:
        await this.cBot.gameClient.check()
        break
    }
  }

  async stop(): Promise<void> {
    await this.transitionTo(new BotStoppingState(this.cBot))
  }
}

export default BotRunningState
