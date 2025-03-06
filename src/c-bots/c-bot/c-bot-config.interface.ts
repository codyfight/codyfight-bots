import { GameMode, GameStatus } from '../../game/state/game-state.type.js'
import { MoveStrategyType } from '../strategies/move/move-strategy.type.js'
import { CastStrategyType } from '../strategies/cast/cast-strategy.type.js'

export interface ICBotConfig {
  ckey: string
  player_id?: number
  mode: GameMode
  move_strategy: MoveStrategyType
  cast_strategy: CastStrategyType
  status: BotStatus
}

export interface ICBotState {
  bot_state: BotStatus;
  game_state: GameStatus;
}

export enum BotStatus {
  Stopped = 'stopped',
  Starting = 'starting',
  Running = 'running',
  Stopping = 'stopping',
}
