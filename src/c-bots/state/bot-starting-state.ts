import BotState from './bot-state.js'
import { GameStatus } from '../../game/state/game-state.type.js'
import BotRunningState from './bot-running-state.js'
import BotStoppedState from './bot-stopped-state.js'
import { BotStatus } from '../c-bot/c-bot-config.interface.js'

class BotStartingState extends BotState{

  get status(): BotStatus {
    return BotStatus.Starting
  }

  async tick(): Promise<void> {
    const status = this.cBot.gameClient.status()

    switch (status) {

      case GameStatus.Ended:
      case GameStatus.Empty:
        await this.cBot.gameClient.init()
        this.cBot.initialise()
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
    this.cBot.setActive(false)
    await this.transitionTo(new BotStoppedState(this.cBot))
  }
}

export default BotStartingState
