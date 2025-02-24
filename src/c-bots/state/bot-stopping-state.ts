import BotState from './bot-state.js'
import BotStartingState from './bot-starting-state.js'
import { GameStatus } from '../../game/state/game-state.type.js'
import BotStoppedState from './bot-stopped-state.js'

class BotStoppingState extends BotState{

  status(): string {
    return 'stopping'
  }

  public async start() : Promise<void> {
    await this.transitionTo(new BotStartingState(this.cBot))
  }

  public async tick(): Promise<void> {
    const status = this.cBot.gameClient.status()

    switch (status) {
      case GameStatus.Empty:
      case GameStatus.Ended:
      case GameStatus.Registering:
        await this.transitionTo(new BotStoppedState(this.cBot))
        break

      case GameStatus.Playing:
        await this.cBot.play()
        break
    }
  }

}
export default BotStoppingState
