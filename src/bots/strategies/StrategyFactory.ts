import { CastStrategyType } from './cast/cast-strategy.type.js'
import CastStrategy from './cast/CastStrategy.js'
import RandomCastStrategy from './cast/RandomCastStrategy.js'
import { MoveStrategyType } from './move/move-strategy.type.js'
import MoveStrategy from './move/MoveStrategy.js'
import RandomMoveStrategy from './move/RandomMoveStrategy.js'
import ExitMoveStrategy from './move/ExitMoveStrategy.js'
import IdleMoveStrategy from './move/IdleMoveStrategy.js'
import AggressiveMoveStrategy from './move/AggressiveMoveStrategy.js'
import DynamicMoveStrategy from './move/DynamicMoveStrategy.js'


export class StrategyFactory {
  static createCastStrategy(type: CastStrategyType): CastStrategy {
    switch (type) {
      case CastStrategyType.None:
        return new CastStrategy()
      case CastStrategyType.Random:
        return new RandomCastStrategy()
      default:
        throw new Error(`Unknown CastStrategyType: ${type}`)
    }
  }

  static createMoveStrategy(type: MoveStrategyType): MoveStrategy {
    switch (type) {
      case  MoveStrategyType.Idle:
        return new IdleMoveStrategy()
      case MoveStrategyType.Random:
        return new RandomMoveStrategy()
      case MoveStrategyType.Exit:
        return new ExitMoveStrategy()
      case MoveStrategyType.Aggressive:
        return new AggressiveMoveStrategy()
      case MoveStrategyType.Dynamic:
        return new DynamicMoveStrategy()
      default:
        throw new Error(`Unknown MoveStrategyType: ${type}`)
    }
  }
}
