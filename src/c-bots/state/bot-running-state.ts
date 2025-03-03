import BotState from './bot-state.js'
import { GameStatus } from '../../game/state/game-state.type.js'
import BotStartingState from './bot-starting-state.js'
import BotStoppingState from './bot-stopping-state.js'
import { BotStatus } from '../c-bot/c-bot-config.interface.js'
import Logger from '../../utils/logger.js'

class BotRunningState extends BotState{

  get status(): BotStatus {
    return BotStatus.Running
  }

  async tick(): Promise<void> {
    const status = this.cBot.gameClient.status
    Logger.debug(`${this.cBot.ckey} - tick in running state, Game Status: ${status}` )

    switch (status) {
      case GameStatus.Uninitialised:
        await this.cBot.initialise('check');
        break

      case GameStatus.Empty:
      case GameStatus.Ended:
        await this.transitionTo(new BotStartingState(this.cBot))
        this.cBot.finishGame()
        break
      
      case GameStatus.Playing:
        await this.cBot.play()
        break

      case GameStatus.Registering:
        await this.transitionTo(new BotStartingState(this.cBot))
        break
    }
  }

  async stop(): Promise<void> {
    Logger.debug(`${this.cBot.ckey} - stop request received in running state` )
    await this.transitionTo(new BotStoppingState(this.cBot))
  }

}

export default BotRunningState
