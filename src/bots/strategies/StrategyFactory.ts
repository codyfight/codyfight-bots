import CastStrategy, { CastStrategyType } from './cast/CastStrategy.js'
import RandomCastStrategy from './cast/RandomCastStrategy.js'
import MoveStrategy, { MoveStrategyType } from './move/MoveStrategy.js'
import RandomMoveStrategy from './move/RandomMoveStrategy.js'
import ExitMoveStrategy from './move/ExitMoveStrategy.js'

export class StrategyFactory {
  static createCastStrategy(type: CastStrategyType): CastStrategy {
    switch (type) {
      case CastStrategyType.Random:
        return new RandomCastStrategy()
      default:
        throw new Error(`Unknown CastStrategyType: ${type}`)
    }
  }

  static createMoveStrategy(type: MoveStrategyType): MoveStrategy {
    switch (type) {
      case MoveStrategyType.Random:
        return new RandomMoveStrategy()
      case MoveStrategyType.Exit:
        return new ExitMoveStrategy()
      default:
        throw new Error(`Unknown MoveStrategyType: ${type}`)
    }
  }
}
