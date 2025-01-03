import TileEffect from './tile-effect.js'
import Position from '../../position.js'
import { TileType } from '../tile.type.js'

/**
 * Represents a slider effect that moves the player in a specific direction (up, down, left, or right).
 *
 * Key Features:
 * - Chains to other tiles by moving the player to a new position (if the slider is "charged").
 * - Movement direction is determined by the tile type (e.g., `DirectionalSliderUp`).
 *
 * Example:
 * - A `DirectionalSliderRight` moves the player from `(2, 3)` to `(3, 3)`.
 * - If the slider is not charged, the player remains in the same position.
 */

const DIRECTION_OFFSETS: Partial<Record<TileType, Position>> = {
  [TileType.DirectionalSliderUp]: new Position(0, -1), // Up
  [TileType.DirectionalSliderDown]: new Position(0, 1), // down
  [TileType.DirectionalSliderLeft]: new Position(-1, 0), // left
  [TileType.DirectionalSliderRight]: new Position(1, 0) // right
}

class SliderEffect extends TileEffect {
  public readonly isChainEffect: boolean = true

  private readonly offset: Position

  constructor(isCharged: boolean, type: TileType) {
    super(isCharged)
    this.offset = DIRECTION_OFFSETS[type] || new Position(0, 0)
  }

  public apply(position: Position): Position {
    return this.isCharged ? position.add(this.offset) : position
  }
}

export default SliderEffect
