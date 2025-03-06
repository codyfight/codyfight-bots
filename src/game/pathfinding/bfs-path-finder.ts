import GameMap from '../map/game-map.js'
import GameNode from './game-node.js'
import Position from '../map/position.js'
import { IAgentState } from '../agents/game-agent.type.js'


class BfsPathFinder {
  private readonly visited = new Set<string>()
  private readonly map: GameMap

  private readonly start: GameNode
  private readonly finish: Position

  private frontier: GameNode[] = []

  constructor(initialState: IAgentState, finish: Position, map: GameMap) {
    this.map = map
    this.start = new GameNode(null, initialState)
    this.finish = finish
  }

  public findPath(): GameNode | null {
    this.frontier.push(this.start)
    this.visited.add(this.start.toString())

    while (this.frontier.length > 0) {
      const currentPath = this.processQueue()
      if (currentPath !== null) {
        return currentPath
      }
    }

    return null
  }

  private processQueue() : GameNode | null {
    const current : GameNode = this.frontier.shift()!

    if(current.equals(this.finish)) {
      return current
    }

    // This will return all the valid neighbors of the current node
    // it includes tiles that can be reached via skill casting
    // it excludes tiles that will cause the agent to die
    const neighbors = current.expand(this.map)

    for (const neighbor of neighbors) {
      this.processNode(neighbor)
    }

    return null
  }

  private processNode(node: GameNode) {
    const key = node.toString()
    if (!this.visited.has(key)) {
      this.visited.add(key)
      this.frontier.push(node)
    }
  }

}

export default BfsPathFinder
