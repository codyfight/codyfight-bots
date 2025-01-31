import Position from '../map/position.js'
import GameMap from '../map/game-map.js'
import TileEffectResolver from '../map/tile/effects/tile-effect-resolver.js'
import GameError from '../utils/game-error.js'

class BFSPathFinder {
  constructor(
    private map: GameMap,
    private visited = new Set<string>(),
    private queue: Position[][] = [],
    private tileEffectResolver = new TileEffectResolver(map)
  ) {}

  public findPathToTarget(start: Position, target: Position): Position[] {
    this.queue.push([start])
    this.visited.add(start.toString())

    try {
      while (this.queue.length > 0) {
        const currentPath = this.processQueue(target)
        if (currentPath.length > 0) {
          return currentPath
        }
      }
    } catch (error) {
      throw new GameError(error, {
        Message: 'Error in findPathToTarget()',
        Start: start,
        Target: target
      })
    }

    return []
  }

  private processQueue(target: Position): Position[] {
    const currentPath = this.queue.shift()!
    const position = currentPath[currentPath.length - 1]
    const finalPosition = this.tileEffectResolver.resolve(position)

    if (finalPosition.equals(target)) {
      return currentPath
    }

    const neighbors = this.getNeighbors(finalPosition)
    this.processNeighbors(currentPath, neighbors, target)

    return []
  }

  private processNeighbors(
    currentPath: Position[],
    neighbors: Position[],
    target: Position
  ) {
    for (const position of neighbors) {
      if (this.isValidMove(position, target)) {
        this.visited.add(position.toString())
        const newPath = [...currentPath, position]
        this.queue.push(newPath)
      }
    }
  }

  private getNeighbors(position: Position): Position[] {
    return Position.getDirections().map((direction) => position.add(direction))
  }

  private isValidMove(position: Position, target: Position): boolean {
    // Check if the position was already visited
    if (this.visited.has(position.toString())) {
      return false
    }

    if (position.equals(target)) {
      return true
    }

    // is the tile occupied by another agent
    if (this.map.isPositionOccupied(position)) {
      return false
    }

    const tile = this.map.getTile(position)

    // is it a valid safe tile?
    if (!tile || !tile.isSafe()) {
      return false
    }

    return true
  }
}

export default BFSPathFinder
