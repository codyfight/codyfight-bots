import MoveStrategy from './move-strategy.js'
import { TileType } from '../../../game/map/tile/tile.type.js'
import { MoveStrategyType } from './move-strategy.type.js'

class ExitMoveStrategy extends MoveStrategy {

  public get description(): string {
    return 'Your bot will move towards the exit gate.'
  }

  public get type(): MoveStrategyType {
    return MoveStrategyType.Exit
  }

  protected setTargets(): void {
    const position = this.bearer.position
    const type = TileType.ExitGate

    // Find the closest exit gate
    const exit = this.map.findClosestTilePosition(type, position)

    if (exit) {
      this._targets.push(exit)
    }
  }
}

export default ExitMoveStrategy
