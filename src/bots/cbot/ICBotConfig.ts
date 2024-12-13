import { GameMode } from '../../game/state/game-state.type.js'
import { MoveStrategyType } from '../strategies/move/MoveStrategy.js'

interface ICBotConfig {
  ckey: string
  mode: GameMode
  url: string
  logging: boolean
  move_strategy: MoveStrategyType
}

export default ICBotConfig
