import MoveStrategy from './move-strategy.js'
import Position from '../../../game/map/position.js'
import { MoveStrategyType } from './move-strategy.type.js'

/**
 * Example CustomMoveStrategy:
 *
 * Override `setTargets()` to define which positions this bot will try to move towards.
 * The bot will attempt to reach each target in order until one is reachable.
 * Optionally override `getDefaultMove()` to define a fallback move.
 */
class CustomMoveStrategy extends MoveStrategy {

  public get description(): string {
    return 'Your bot will move to a random position.'
  }

  public get type(): MoveStrategyType {
    return MoveStrategyType.Idle
  }

  /**
   * Sets the `targets` array. The bot will try each target in order, using BFS pathfinding
   * to see if it can reach that position. If no path is found for any target,
   * the bot will perform the `getDefaultMove()`.
   */
  protected setTargets(): void {
    // Example: push two positions
    // 1) A random move
    // 2) The bot's current position (fallback)
    const position = this.bearer.position
    const move = this.getRandomMove()

    this._targets.push(move)
    this._targets.push(position)
  }

  /**
   * Returns a fallback move if no path can be found to any target.
   * Override this to provide a custom default move (e.g., move to (0,0)).
   */
  protected getDefaultMove(): Position {
    // logic to decide on default move position
    return new Position(0, 0)
  }
}

export default CustomMoveStrategy
