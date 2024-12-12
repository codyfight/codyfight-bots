import Position from '../../game/entities/core/Position.js'
import GameState from '../../game/entities/core/GameState.js'
import MoveStrategy from './MoveStrategy.js'
import PlayerAgent from '../../game/entities/agents/PlayerAgent.js'
import GameMap from '../../game/entities/core/GameMap.js'
import { TileType } from '../../types/game/tile.type.js'
import MathUtils  from '../../utils/MathUtils.js'
import PathFinder from '../../utils/PathFinder.js'

class ExitMoveStrategy extends MoveStrategy {
  determineMove(game: GameState): Position {
    const map = game.getMap()
    const bearer = game.getBearer()
    const position = bearer.getPosition()
    const tile = map.getTile(position)
    const possibleMoves = bearer.getPossibleMoves()

    const exit = this.getClosestExit(bearer, map)

    if(!exit) {
      return this.getRandomMove(map, bearer)
    }

    const pathFinder = new PathFinder(map)
    const path = pathFinder.findPathToTarget(tile!.position, exit)

    if (path.length > 1) {
      const nextMove = path[1]
      // Check if nextMove is in possibleMoves
      const isPossibleMove = possibleMoves.some(move => move.equals(nextMove))
      if (isPossibleMove) {
        return nextMove
      }
    }

    return this.getRandomMove(map, bearer)
  }


  private getClosestExit(bearer: PlayerAgent, map: GameMap): Position | null {
    const exits = map.getTiles(TileType.ExitGate)

    if (exits.length === 0) {
      return null
    }

    const positions = exits.map((tile) => tile.position)
    return this.findClosestPosition(bearer.getPosition(), positions)
  }

  private findClosestPosition(origin: Position, targets: Position[]): Position {
    let closest = targets[0]
    let minDistance = Infinity

    for (const target of targets) {
      const distance = MathUtils.euclideanDistance(origin, target)

      if (distance < minDistance) {
        minDistance = distance
        closest = target
      }
    }

    return closest
  }
}

export default ExitMoveStrategy
