import BotState from './bot-state.js'
import BotStartingState from './bot-starting-state.js'
import { GameStatus } from '../../game/state/game-state.type.js'
import BotStoppedState from './bot-stopped-state.js'
import { BotStatus } from '../c-bot/c-bot-config.interface.js'
import Logger from '../../utils/logger.js'

class BotStoppingState extends BotState{

  get status(): BotStatus {
    return BotStatus.Stopping
  }

  public async start() : Promise<void> {
    Logger.debug(`${this.cBot.ckey} - start request received in stopping state` )
    await this.transitionTo(new BotStartingState(this.cBot))
  }

  public async tick(): Promise<void> {
    const status = this.cBot.gameClient.status
    Logger.debug(`${this.cBot.ckey} - tick in stopping state, Game Status: ${status}` )
    switch (status) {

      case GameStatus.Uninitialised:
        await this.cBot.initialise('check');
        break

      case GameStatus.Empty:
      case GameStatus.Ended:
        await this.transitionTo(new BotStoppedState(this.cBot))
        break

      case GameStatus.Registering:
        await this.transitionTo(new BotStoppedState(this.cBot))
        await this.cBot.gameClient.surrender()
        break

      case GameStatus.Playing:
        await this.cBot.play()
        break
    }
  }

}
export default BotStoppingState
