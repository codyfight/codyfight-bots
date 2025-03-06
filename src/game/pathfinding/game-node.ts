import { IAgentState } from '../agents/game-agent.type.js'
import GameMap from '../map/game-map.js'
import Position from '../map/position.js'
import { resolveTileEffect } from '../map/tile/effects/tile-effect-resolver.js'

class GameNode {

  public constructor(
    public readonly parent: GameNode | null,  // Parent node
    public readonly state: IAgentState    // Agent state contains position, health and skills
  ) {}

  /**
   * Recursively constructs the path from the root ancestor to this node.
   */
  public get path(): GameNode[] {
    return this.parent ? [...this.parent.path, this] : [];
  }

  /**
   * Returns a string representation of the current node (position).
   */
  public toString(): string {
    return this.state.position.toString();
  }

  /**
   * Checks if the given position is the same as this node's position.
   */
  public equals(position: Position): boolean {
    return this.state.position.equals(position);
  }

  /**
   * Expands from the current node to produce all valid child nodes.
   */
  public expand(map: GameMap): GameNode[] {
    const neighbors = this.getNeighbors(map);
    return this.filterInvalidStates(neighbors);
  }

  /**
   * Retrieves neighbors by combining adjacent nodes and skill-based movement.
   */
  private getNeighbors(map: GameMap): GameNode[] {
    return [
      ...this.getAdjacentNodes(map),
      ...this.getSkillNodes(map)
    ];
  }

  /**
   * Creates child nodes from the positions immediately adjacent to the current node.
   */
  private getAdjacentNodes(map: GameMap): GameNode[] {
    return Position.getDirections()
      .map(direction => this.state.position.add(direction))
      .map(pos => this.createChildNode(pos, map))
      .filter((child): child is GameNode => child !== null);
  }

  /**
   * A small helper to create a new child node if the target tile is valid.
   */
  private createChildNode(position: Position, map: GameMap): GameNode | null {
    const tile = map.getTile(position);

    if (!tile || !tile.walkable) {
      return null; // not a valid tile or not walkable
    }

    // Apply tile effects (e.g. damage, movement, etc.)
    const newState = resolveTileEffect({...this.state, position}, map)

    return new GameNode(this, newState);
  }


  private getSkillNodes(map: GameMap): GameNode[] {

    // Get ready skills that are of type movement
    // get the targets for each of these skills
    // Create a node from each target and make sure to set skill state to used

    return []
  }

  private filterInvalidStates(nodes: GameNode[]): GameNode[] {
    return nodes.filter(node => node.state.hitpoints > 0);
  }

}

export default GameNode
