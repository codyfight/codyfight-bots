import CastStrategy, { CastStrategyType } from '../strategies/CastStrategy.js'
import RandomCastStrategy from '../strategies/RandomCastStrategy.js'
import MoveStrategy, { MoveStrategyType } from '../strategies/MoveStrategy.js'
import RandomMoveStrategy from '../strategies/RandomMoveStrategy.js'
import ExitMoveStrategy from '../strategies/ExitMoveStrategy.js'

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
