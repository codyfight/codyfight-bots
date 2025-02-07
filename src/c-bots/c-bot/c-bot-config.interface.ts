import { GameMode, IGameStatus } from '../../game/state/game-state.type.js'
import { MoveStrategyType } from '../strategies/move/move-strategy.type.js'
import { CastStrategyType } from '../strategies/cast/cast-strategy.type.js'

export interface ICBotConfig {
  player_id?: number
  ckey: string
  active?: boolean
  mode: GameMode
  url: string
  move_strategy: MoveStrategyType
  cast_strategy: CastStrategyType
}

export interface ICBotStatus {
  bot: ICBotConfig;
  game: IGameStatus;
}
