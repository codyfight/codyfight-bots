import TileEffect from './TileEffect.js'
import Position from '../../Position.js'

class TeleportEffect extends TileEffect {
  private destination: Position | null = null;

  public constructor(isCharged: boolean) {
    super(isCharged)
  }

  public setDestination(destination: Position) {
    this.destination = destination;
  }

  public apply(position: Position): Position {
    return this.isCharged ? (this.destination || position) : position;
  }
}

export default TeleportEffect
