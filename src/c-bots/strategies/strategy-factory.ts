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
import RyoMoveStrategy from './move/ryo-move-strategy.js'
import NoCastStrategy from './cast/no-cast-strategy.js'
import DefensiveCastStrategy from './cast/defensive-cast-strategy.js'
import AggressiveCastStrategy from './cast/aggressive-cast-strategy.js'
import RyoCastStrategy from './cast/ryo-cast-strategy.js'

/**
 * Factory function to create a CastStrategy based on the given type.
 * @param type - The type of CastStrategy to create.
 * @returns An instance of the corresponding CastStrategy.
 */
export function createCastStrategy(type: CastStrategyType): CastStrategy {
  switch (type) {
    case CastStrategyType.None:
      return new NoCastStrategy();
    case CastStrategyType.Random:
      return new RandomCastStrategy();
    case CastStrategyType.Aggressive:
      return new AggressiveCastStrategy();
    case CastStrategyType.Defensive:
      return new DefensiveCastStrategy();
    case CastStrategyType.Ryo:
      return new RyoCastStrategy();

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
    case MoveStrategyType.Ryo:
      return new RyoMoveStrategy();
    case MoveStrategyType.Aggressive:
      return new AggressiveMoveStrategy();
    case MoveStrategyType.Dynamic:
      return new DynamicMoveStrategy();
    default:
      throw new Error(`Unknown MoveStrategyType: ${type}`);
  }
}
