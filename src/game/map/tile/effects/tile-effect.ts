import Position from '../../position.js'

/**
 * Abstract base class for all tile effects.
 *
 * Key Responsibilities:
 * - Defines the structure for specific tile effects (e.g., sliders, teleports).
 * - Provides the `apply` method to calculate the new position based on the tile's effect.
 * - Tracks whether the effect is a "chain effect" (i.e., leads to another tile effect).
 *
 * Usage:
 * - This class is extended by concrete tile effects like `SliderEffect` and `TeleportEffect`.
 * - Effects can be enhanced in the future to include additional functionality, such as damaging or healing the player.
 */

abstract class TileEffect {
  /**
   * Indicates whether the effect chains to other tiles.
   * Effects like sliders should be true.
   */
  public readonly isChainEffect: boolean = false

  /**
   * Takes in a single parameter to indicate if the effect is charged
   */
  constructor(protected readonly isCharged: boolean) {}

  /**
   * Applies the effect, for now this just considers positions and movement
   * Later this can be extended to include effects like damaging or healing the player
   */
  public abstract apply(position: Position): Position
}

export default TileEffect
