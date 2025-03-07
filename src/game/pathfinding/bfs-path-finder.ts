import GameMap from '../map/game-map.js'
import GameNode from './game-node.js'
import Position from '../map/position.js'
import { IAgentState } from '../agents/game-agent.type.js'

export default class BFSPathfinder {
  private readonly visited = new Set<string>();
  private readonly frontier: GameNode[] = [];

  private readonly startNode: GameNode;
  private readonly goalPosition: Position;

  constructor(initialState: IAgentState, goalPosition: Position, private readonly map: GameMap) {
    this.startNode = new GameNode(null, initialState);
    this.goalPosition = goalPosition;
  }

  /**
   * Performs a BFS to find a path from the start node to the goal position.
   * Returns the ending node if a path is found, otherwise null.
   */
  public findPath(): GameNode | null {
    this.frontier.push(this.startNode);
    this.visited.add(this.startNode.key);

    while (this.frontier.length > 0) {
      const currentNode = this.frontier.shift()!;

      if (currentNode.equals(this.goalPosition)) {
        return currentNode;
      }

      this.processNeighbors(currentNode);
    }

    return null;
  }

  private processNeighbors(currentNode: GameNode): void {
    for (const neighbor of currentNode.expand(this.map)){
      this.enqueueIfUnvisited(neighbor);
    }
  }

  /**
   * Adds a node to the frontier if it hasn't been visited yet.
   */
  private enqueueIfUnvisited(node: GameNode): void {
    if (this.visited.has(node.key)) return

    this.visited.add(node.key);
    this.frontier.push(node);
  }
}
