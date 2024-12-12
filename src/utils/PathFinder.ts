import Tile from '../game/entities/core/Tile.js'
import Position from '../game/entities/core/Position.js'
import GameMap from '../game/entities/core/GameMap.js'


class PathFinder {
  public findPathToTarget(
    map: GameMap,
    start: Position,
    target: Position,
    possibleMoves: Position[] = []
  ): Position[] {
    const visited = new Set<Position>()
    const queue: Position[][] = []

    queue.push([start])
    visited.add(start)

    while (queue.length > 0) {
      const currentPath = queue.shift()!
      const position = currentPath[currentPath.length - 1]

      if (position.equals(target)) {
        return currentPath
      }

      const neighbors = this.getNeighbors(map, position)

      for (const neighbor of neighbors) {
        if (this.isValidMove(neighbor, possibleMoves, visited, currentPath.length)) {
          visited.add(neighbor.position)
          const newPath = [...currentPath, neighbor.position]
          queue.push(newPath)
        }
      }

    }

    return []
  }

  private getNeighbors(map: GameMap, position: Position): Tile[] {
    const neighbors: Tile[] = []

    const directions = [
      new Position(0, 1),
      new Position(1, 0),
      new Position(0, -1),
      new Position(-1, 0)
    ]

    for (const direction of directions) {
      const neighbor = map.getTile(position.add(direction))
      if (neighbor !== null) {
        neighbors.push(neighbor)
      }
    }

    return neighbors
  }

  private isValidMove(neighbor: Tile, possibleMoves: Position[], visited: Set<Position>, currentPathLength: number): boolean {

    const movePossible =
      currentPathLength === 1
        ? possibleMoves.some((move) => move.equals(neighbor.position))
        : true

    const notVisited = !visited.has(neighbor.position)
    const validMove = neighbor.isSafe()

    return movePossible && notVisited && validMove
  }
}

export default PathFinder
