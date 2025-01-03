import { CastStrategyType } from './cast/cast-strategy.type.js'
import CastStrategy from './cast/cast-strategy.js'
import RandomCastStrategy from './cast/random-cast-strategy.js'

import { MoveStrategyType } from './move/move-strategy.type.js'
import MoveStrategy from './move/move-strategy.js'
import RandomMoveStrategy from './move/random-move-strategy.js'
import ExitMoveStrategy from './move/exit-move-strategy.js'
import IdleMoveStrategy from './move/idle-move-strategy.js'
import AggressiveMoveStrategy from './move/aggressive-move-strategy.js'
import DynamicMoveStrategy from './move/dynamic-move-strategy.js'

/**
 * Factory function to create a CastStrategy based on the given type.
 * @param type - The type of CastStrategy to create.
 * @returns An instance of the corresponding CastStrategy.
 */
export function createCastStrategy(type: CastStrategyType): CastStrategy {
  switch (type) {
    case CastStrategyType.None:
      return new CastStrategy();
    case CastStrategyType.Random:
      return new RandomCastStrategy();
    default:
      throw new Error(`Unknown CastStrategyType: ${type}`);
  }
}

/**
 * Factory function to create a MoveStrategy based on the given type.
 * @param type - The type of MoveStrategy to create.
 * @returns An instance of the corresponding MoveStrategy.
 */
export function createMoveStrategy(type: MoveStrategyType): MoveStrategy {
  switch (type) {
    case MoveStrategyType.Idle:
      return new IdleMoveStrategy();
    case MoveStrategyType.Random:
      return new RandomMoveStrategy();
    case MoveStrategyType.Exit:
      return new ExitMoveStrategy();
    case MoveStrategyType.Aggressive:
      return new AggressiveMoveStrategy();
    case MoveStrategyType.Dynamic:
      return new DynamicMoveStrategy();
    default:
      throw new Error(`Unknown MoveStrategyType: ${type}`);
  }
}
