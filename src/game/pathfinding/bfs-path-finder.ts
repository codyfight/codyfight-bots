import GameMap from '../map/game-map.js'
import GameNode from './game-node.js'
import Position from '../map/position.js'
import { IAgentState } from '../agents/game-agent.type.js'

type GoalTest = (state: IAgentState, target: Position) => boolean;

// This algorithm is a breadth-first search, it does not use a heuristic to determine the best path, it assumes that every step is equal to the next.
// This means that the agent sees casting a movement skill as one step, and moving to the target position as one step.
// So it is finding the shortest distance but not the optimal path,
// Ideally if we wanted to improve this so the agent would find the route to the target in the shortest amount of turns,
// we would use uniform cost or A* search, this includes a path cost function that would determine the cost of each step.
// E.G. Casting a skill to move = 0 cost, Moving to a position = 1 cost, the cost is the use of a turn.

export default class BFSPathfinder {
  private readonly visited = new Set<string>();
  private readonly frontier: GameNode[] = [];

  private readonly startNode: GameNode;
  private readonly goalPosition: Position;

  constructor(initialState: IAgentState, goalPosition: Position, private readonly map: GameMap) {
    this.startNode = new GameNode(null, initialState.position, initialState);
    this.goalPosition = goalPosition;
  }

  /**
   * Performs a BFS to find a path from the start node to the goal position.
   * Returns the ending node if a path is found, otherwise null.
   */
  public findPath(isGoal: GoalTest): GameNode | null {
    this.frontier.push(this.startNode);
    this.visited.add(this.startNode.key);

    while (this.frontier.length > 0) {
      const currentNode = this.frontier.shift()!;

      if (isGoal(currentNode.state, this.goalPosition)) {
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
