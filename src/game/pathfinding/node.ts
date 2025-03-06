import { IAgentState } from '../agents/game-agent.type.js'
import GameMap from '../map/game-map.js'
import Position from '../map/position.js'

class Node {

  public constructor(
    public readonly parent: Node | null, // Parent node
    // Agent state contains position, health and skills
    public readonly state: IAgentState
  ) {}

  public toString(): string {
    return this.state.position.toString()
  }

  public equals(other: Node): boolean {
    return this.state.position.equals(other.state.position)
  }

  public expand(map: GameMap): Node[] {

    // get array of valid reachable positions

    // get array of nodes with agent states at those positions

    // make sure to exclude invalid states


    return []
  }

  private neighbours(map: GameMap): Node [] {
    const adjacent= this.getAdjacentNodes(map)
    const skillReachable = this.getSkillReachablePositions(map)

    return [...adjacent, ...skillReachable]
  }

  private getAdjacentNodes(map: GameMap): Node[] {

    // Position.getDirections().map((direction) => position.add(direction))
    // This should get adjacent positions
    // Filter positions that are out of bounds

    // For each position, create the agent state for that position
    // this.createNodeFromPosition(position, this.state)

    return []
  }

  private getSkillReachablePositions(map: GameMap): Node[] {

    // Get ready skills that are of type movement
    // get the targets for each of these skills
    // Create a node from each target and make sure to set skill state to used

    return []
  }

  private createNodeFromPosition(position: Position, state: IAgentState) : Node {
    // Here we should add some logic for the hitpoints etc..
    const newState = {...state, position }
    return new Node(this, newState)
  }

  private fliterInvalidStates(nodes: Node[]): Node[] {

    // loop through all the nodes
    // process the states and remove invalid states

    return []
  }


  public get path(): Node[] {
    const path: Node[] = []
    let current = this.parent

    while (this.parent !== null) {
      path.unshift(current!)
      current = current!.parent
    }

    return path
  }

}

export default Node
