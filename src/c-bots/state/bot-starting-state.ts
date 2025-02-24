import BotState from './bot-state.js'
import { GameStatus } from '../../game/state/game-state.type.js'
import BotRunningState from './bot-running-state.js'
import BotStoppedState from './bot-stopped-state.js'

class BotStartingState extends BotState{

  status(): string {
    return 'starting'
  }

  async tick(): Promise<void> {
    const status = this.cBot.gameClient.status()

    switch (status) {
      case GameStatus.Empty:
      case GameStatus.Ended:
        await this.cBot.init()
        break

      case GameStatus.Playing:
        await this.transitionTo(new BotRunningState(this.cBot))
        return
      case GameStatus.Registering:
      default:
        await this.cBot.gameClient.check()
        break
    }
  }

  public async stop(): Promise<void> {
    await this.cBot.gameClient.surrender()
    await this.transitionTo(new BotStoppedState(this.cBot))
  }
}

export default BotStartingState
