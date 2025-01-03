import MoveStrategy from './MoveStrategy.js'
import { TileType } from '../../../game/map/tile/tile.type.js'

class ExitMoveStrategy extends MoveStrategy {

  protected setTargets(): void {
    const position = this.bearer.getPosition();
    const type = TileType.ExitGate;

    // Find the closest exit gate
    const exit = this.map.findClosestTilePosition(type, position);

    if (exit) {
      this.targets.push(exit)
    }
  }
}

export default ExitMoveStrategy;
