import Position from '../../entities/Position.js'
import GameState from '../../entities/GameState.js'
import MoveStrategy from './MoveStrategy.js'
import PlayerAgent from '../../entities/Agents/PlayerAgent.js'
import GameMap from '../../entities/GameMap.js'
import { TileType } from '../../types/game/map.type.js'
import { MathHelper } from '../../helpers/MathHelper.js'
import PathFinder from '../../helpers/PathFinder.js'

class ExitMoveStrategy extends MoveStrategy {
  determineMove(game: GameState): Position {
    const map = game.getMap()
    const bearer = game.getBearer()
    const position = bearer.getPosition()
    const tile = map.getTile(position)
    const possibleMoves = bearer.getPossibleMoves()

    const exit = this.getClosestExit(bearer, map)

    if(!exit){
      return this.getRandomMove(map, bearer)
    }

    const pathFinder = new PathFinder()
    const path = pathFinder.findPathToTarget(map, tile!.position, exit, possibleMoves)

    if(path.length > 0){
      return path[1]
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
      const distance = MathHelper.euclideanDistance(origin, target)

      if (distance < minDistance) {
        minDistance = distance
        closest = target
      }
    }

    return closest
  }
}

export default ExitMoveStrategy
