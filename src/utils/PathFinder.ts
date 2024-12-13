import Position from '../game/map/Position.js'
import GameMap from '../game/map/GameMap.js'

class PathFinder {
  constructor(
    private map: GameMap,
    private visited = new Set<string>(),
    private queue: Position[][] = []
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
      console.error("Error in findPathToTarget()");
      console.error("start position:", start);
      console.error("Target position:", target);
      throw error;
    }

    return []
  }

  private processQueue(target: Position): Position[] {
    const currentPath = this.queue.shift()!
    const position = currentPath[currentPath.length - 1]

    if (position.equals(target)) {
      return currentPath
    }

    const neighbors = this.getNeighbors(position)
    this.processNeighbors(currentPath, neighbors)

    return []
  }

  private processNeighbors(currentPath: Position[], neighbors: Position[]) {
    for (const position of neighbors) {
      if (this.isValidMove(position)) {
        this.visited.add(position.toString())
        const newPath = [...currentPath, position]
        this.queue.push(newPath)
      }
    }
  }

  private getNeighbors(position: Position): Position[] {
    return Position.getDirections().map(direction => position.add(direction));
  }

  private isValidMove(position: Position): boolean {

    // Check if the position was already visited
    if(this.visited.has(position.toString())){
      return false
    }

    // is the tile occupied by another agent
    if(this.map.isPositionOccupied(position)){
      return false
    }

    const tile = this.map.getTile(position)

    // is it a valid safe tile?
    if (!tile || !tile.isSafe()) {
      return false;
    }

    return true
  }
}

export default PathFinder
