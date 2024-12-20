import Position from '../../../game/map/Position.js'
import MoveStrategy from './MoveStrategy.js'
import { TileType } from '../../../game/map/tile/tile.type.js'
import MathUtils from '../../../utils/MathUtils.js'

class ExitMoveStrategy extends MoveStrategy {
  protected getTarget(): Position {
    const closestExit = this.getClosestExit()
    return closestExit ?? this.getRandomMove()
  }

  // TODO - I think the map should handle this logic
  protected getClosestExit(): Position | null {
    const exits = this.map.getTiles(TileType.ExitGate)
    if (exits.length === 0) return null

    const exitPositions = exits.map((tile) => tile.position)
    return this.findClosestPosition(this.bearer.getPosition(), exitPositions)
  }

  private findClosestPosition(origin: Position, targets: Position[]): Position {
    return targets.reduce((closest, target) => {
      const currentDistance = MathUtils.euclideanDistance(origin, target)
      const closestDistance = MathUtils.euclideanDistance(origin, closest)
      return currentDistance < closestDistance ? target : closest
    })
  }
}

export default ExitMoveStrategy
