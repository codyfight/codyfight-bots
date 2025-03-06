import { IAgentState } from '../agents/game-agent.type.js'
import GameMap from '../map/game-map.js'
import Position from '../map/position.js'

class Node {

  public constructor(
    public readonly parent: Node | null,  // Parent node
    public readonly state: IAgentState    // Agent state contains position, health and skills
  ) {}

  public toString(): string {
    return this.state.position.toString()
  }

  public equals(other: Node): boolean {
    return this.state.position.equals(other.state.position)
  }

  public get path(): Node[] {

    if (!this.parent) {
      return [];
    }

    return [...this.parent.path, this];
  }




  public expand(map: GameMap): Node[] {
    // Get array of all reachable positions
    const allNeighbors = this.getNeighbors(map)

    // Filter invalid states (like HP <= 0, or out-of-bounds)
    const validNeighbors = this.filterInvalidStates(allNeighbors, map)

    return validNeighbors
  }

  private getNeighbors(map: GameMap): Node [] {
    const adjacentNodes = this.getAdjacentNodes(map)
    const skillNodes = this.getSkillNodes(map)

    return [...adjacentNodes, ...skillNodes]
  }

  private getAdjacentNodes(map: GameMap): Node[] {
    // Get positions adjacent to the current state.position
    const adjacentPositions = Position.getDirections().map(dir =>
      this.state.position.add(dir)
    );

    const nodes: Node[] = [];

    // For each adjacent position, try to create a valid node
    for (const pos of adjacentPositions) {
      const node = this.createNode(pos, map);
      if (node) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  private createNode(position: Position, map: GameMap): Node | null {
    const tile = map.getTile(position);

    // If the tile doesn't exist or isn't walkable, return null
    if (!tile || !tile.walkable) {
      return null;
    }

    // Apply the tile effect to update the agent state at the new position
    const newState = tile.effect.apply({ ...this.state, position });
    return new Node(this, newState);
  }


  private getSkillNodes(map: GameMap): Node[] {

    // Get ready skills that are of type movement
    // get the targets for each of these skills
    // Create a node from each target and make sure to set skill state to used

    return []
  }

  private filterInvalidStates(nodes: Node[], map: GameMap): Node[] {

    const valid: Node[] = []

    for (const node of nodes) {
      const { hitpoints } = node.state

      if (hitpoints <= 0) {
        // Agent died - TODO - We could configure an agents tolerance to damage here
        continue
      }

      valid.push(node)
    }

    return valid
  }

}

export default Node
