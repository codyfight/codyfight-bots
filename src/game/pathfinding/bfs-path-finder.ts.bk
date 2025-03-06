import Position from '../map/position.js'
import GameMap from '../map/game-map.js'
import TileEffectResolver from '../map/tile/effects/tile-effect-resolver.js'
import GameError from '../../errors/game-error.js'
import { IAgentState } from '../agents/game-agent.type.js'

class BFSPathFinder {

  constructor(
    private map: GameMap,
    private visited = new Set<string>(),
    private queue: IAgentState[][] = [],
    private tileEffectResolver = new TileEffectResolver(map)
  ) {}

  public findPathToTarget(initialAgentState: IAgentState, target: Position): IAgentState[] {
    this.queue.push([initialAgentState])
    this.visited.add(this.makeVisitedKey(initialAgentState))

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
        Start: initialAgentState,
        Target: target
      })
    }

    return []
  }

  private processQueue(target: Position): IAgentState[] {
    const path = this.queue.shift()!
    const state = path[path.length - 1]
    const finalState = this.tileEffectResolver.resolve(state)

    if (finalState.position.equals(target)) {
      return path
    }

    const neighbors = this.getNeighbors(finalState.position)
    this.processNeighbors(finalState, path, neighbors, target)

    return []
  }

  private processNeighbors(state: IAgentState, path: IAgentState[], neighbors: Position[], target: Position) {
    for (const position of neighbors) {

      const neighborState = { ...state, position }

      if (this.isValidMove(neighborState, target)) {

        this.visited.add(this.makeVisitedKey(neighborState))

        const newPath = [...path, neighborState]
        this.queue.push(newPath)
      }
    }
  }

  private isValidMove(state: IAgentState, target: Position): boolean {
    // Check if the position was already visited
    if (this.visited.has(this.makeVisitedKey(state))) {
      return false
    }

    if (state.position.equals(target)) {
      return true
    }

    const tile = this.map.getTile(state.position)

    // is it a valid tile?
    if (!tile || !tile.walkable) {
      return false
    }

    const result = tile.effect.apply(state)

    if(result.hitpoints <= 0){
      return false
    }

    return true
  }

  private getNeighbors(position: Position): Position[] {
    return Position.getDirections().map((direction) => position.add(direction))
  }

  private makeVisitedKey(agentState: IAgentState): string {
    const { position, hitpoints } = agentState
    return `${position.toString()}|HP=${hitpoints}`
  }
}

export default BFSPathFinder
