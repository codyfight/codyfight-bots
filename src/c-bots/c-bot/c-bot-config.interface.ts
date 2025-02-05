import { GameMode } from '../../game/state/game-state.type.js'
import { MoveStrategyType } from '../strategies/move/move-strategy.type.js'
import { CastStrategyType } from '../strategies/cast/cast-strategy.type.js'

interface ICBotConfig {
  ckey: string
  mode: GameMode
  active: boolean
  url: string
  move_strategy: MoveStrategyType
  cast_strategy: CastStrategyType
}

export default ICBotConfig
