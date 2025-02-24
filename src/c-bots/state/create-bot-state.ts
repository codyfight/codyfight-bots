import { BotStatus } from '../c-bot/c-bot-config.interface.js'
import CBot from '../c-bot/c-bot.js'
import BotState from './bot-state.js'
import BotStartingState from './bot-starting-state.js'
import BotRunningState from './bot-running-state.js'
import BotStoppingState from './bot-stopping-state.js'
import BotStoppedState from './bot-stopped-state.js'

function createBotState(bot: CBot, status: BotStatus): BotState {
  switch (status) {
    case BotStatus.Starting:
      return new BotStartingState(bot)
    case BotStatus.Running:
      return new BotRunningState(bot)
    case BotStatus.Stopping:
      return new BotStoppingState(bot)
    case BotStatus.Stopped:
    default:
      return new BotStoppedState(bot)
  }
}

export default createBotState
