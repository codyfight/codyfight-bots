import Position from '../../position.js'

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
