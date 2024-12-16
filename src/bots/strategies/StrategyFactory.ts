import { CastStrategyType } from './cast/cast-strategy.type.js'
import CastStrategy from './cast/CastStrategy.js'
import RandomCastStrategy from './cast/RandomCastStrategy.js'
import { MoveStrategyType } from './move/move-strategy.type.js'
import MoveStrategy from './move/MoveStrategy.js'
import RandomMoveStrategy from './move/RandomMoveStrategy.js'
import ExitMoveStrategy from './move/ExitMoveStrategy.js'


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
      case  MoveStrategyType.None:
        return new MoveStrategy()
      case MoveStrategyType.Random:
        return new RandomMoveStrategy()
      case MoveStrategyType.Exit:
        return new ExitMoveStrategy()
      default:
        throw new Error(`Unknown MoveStrategyType: ${type}`)
    }
  }
}
