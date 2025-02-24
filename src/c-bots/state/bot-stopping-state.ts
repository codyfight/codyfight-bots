import BotState from './bot-state.js'
import BotStartingState from './bot-starting-state.js'
import { GameStatus } from '../../game/state/game-state.type.js'
import BotStoppedState from './bot-stopped-state.js'
import { BotStatus } from '../c-bot/c-bot-config.interface.js'

class BotStoppingState extends BotState{

  get status(): BotStatus {
    return BotStatus.Stopping
  }

  public async start() : Promise<void> {
    await this.transitionTo(new BotStartingState(this.cBot))
  }

  public async tick(): Promise<void> {
    const status = this.cBot.gameClient.status()

    switch (status) {

      case GameStatus.Empty:
      case GameStatus.Ended:
        await this.transitionTo(new BotStoppedState(this.cBot))
        break

      case GameStatus.Registering:
        await this.cBot.gameClient.surrender()
        await this.transitionTo(new BotStoppedState(this.cBot))
        break

      case GameStatus.Playing:
        await this.cBot.play()
        break

      default:
        await this.cBot.gameClient.check()
        break
    }
  }

}
export default BotStoppingState
