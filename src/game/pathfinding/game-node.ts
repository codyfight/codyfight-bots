import { IAgentState, ISkillState } from '../agents/game-agent.type.js'
import GameMap from '../map/game-map.js'
import Position from '../map/position.js'
import { resolveTileEffect } from '../map/tile/effects/tile-effect-resolver.js'

class GameNode {

  public constructor(
    public readonly parent: GameNode | null,  // Parent node
    public readonly position: Position,       // Position of the node
    public readonly state: IAgentState        // Agent state contains position, health and skills
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
  public get key(): string {
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

    return new GameNode(this, position, newState);
  }

  // Returns a list of nodes that can be reached by using a skill
  private getSkillNodes(map: GameMap): GameNode[] {

    // uncomment to exclude skill based path finding
    // return []

    const readySkills = this.state.skillsState.filter(skill => skill.ready);
    const nodes = readySkills.flatMap(skill => this.createNodesForSkill(skill));

    return nodes
  }

  // Creates a list of nodes for each target of a skill
  private createNodesForSkill(skill: ISkillState): GameNode[] {
    const updatedSkills = this.getUpdatedSkillsForUsedSkill(skill);
    const nodes = skill.targets.map(target => this.createNodeForTarget(target, updatedSkills));
    return nodes
  }

  // Returns a list of skills with the used skill marked as not ready
  private getUpdatedSkillsForUsedSkill(usedSkill: ISkillState): ISkillState[] {

    const updatedSkills = this.state.skillsState.map(skill =>
      skill.id === usedSkill.id ? { ...skill, ready: false } : skill
    );

    return updatedSkills
  }

  // Creates a new node with the target position and updated skills
  private createNodeForTarget(target: Position, updatedSkills: ISkillState[]): GameNode {
    const newState: IAgentState = {
      ...this.state,      // preserve any additional properties
      position: target,   // update to the target position
      skillsState: updatedSkills
    };
    return new GameNode(this, target, newState);
  }

  private filterInvalidStates(nodes: GameNode[]): GameNode[] {
    return nodes.filter(node => node.state.hitpoints > 0);
  }

}

export default GameNode
