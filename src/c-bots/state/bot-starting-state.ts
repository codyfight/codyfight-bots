import BotState from './bot-state.js'
import { GameStatus } from '../../game/state/game-state.type.js'
import BotRunningState from './bot-running-state.js'
import { BotStatus } from '../c-bot/c-bot-config.interface.js'
import BotStoppingState from './bot-stopping-state.js'
import Logger from '../../utils/logger.js'

class BotStartingState extends BotState{

  get status(): BotStatus {
    return BotStatus.Starting
  }

  async tick(): Promise<void> {
    const status = this.cBot.gameClient.status
    Logger.debug(`${this.cBot.ckey} - tick in starting state: ${status}` )
    switch (status) {
      case GameStatus.Uninitialised:
        await this.cBot.initialise('check');
        break

      case GameStatus.Ended:
      case GameStatus.Empty:
        await this.cBot.initialise('init');
        break

      case GameStatus.Playing:
        await this.transitionTo(new BotRunningState(this.cBot))
        return

      case GameStatus.Registering:
        await this.cBot.gameClient.check()
        break
    }
  }

  public async stop(): Promise<void> {
    Logger.debug(`${this.cBot.ckey} - stop request received in starting state` )
    await this.transitionTo(new BotStoppingState(this.cBot))
  }
}

export default BotStartingState
