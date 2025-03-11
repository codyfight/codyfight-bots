import { IAgentState, ISkillState } from '../agents/game-agent.type.js'
import GameMap from '../map/game-map.js'
import Position from '../map/position.js'
import { resolveTileEffect } from '../map/tile/effects/tile-effect-resolver.js'

class GameNode {

  public constructor(
    public readonly parent: GameNode | null,  // Parent node
    public readonly position: Position,       // Position of the node
    public readonly state: IAgentState,       // Agent state contains position, health and skills
    public readonly action: any = null        // Action taken to reach this node
  ) {}

  /**
   * Recursively constructs the path from the root ancestor to this node.
   */
  public get path(): GameNode[] {
    return this.parent ? [...this.parent.path, this] : []
  }

  /**
   * Returns a string representation of the current node (position).
   */
  public get key(): string {
    return this.state.position.toString()
  }

  /**
   * Checks if the given position is the same as this node's position.
   */
  public equals(position: Position): boolean {
    return this.state.position.equals(position)
  }

  /**
   * Expands from the current node to produce all valid child nodes.
   */
  public expand(map: GameMap): GameNode[] {
    const neighbors = this.getNeighbors(map)
    return this.filterInvalidStates(neighbors)
  }

  /**
   * Retrieves neighbors by combining adjacent nodes and skill-based movement.
   */
  private getNeighbors(map: GameMap): GameNode[] {
    return [
      ...this.getAdjacentNodes(map),
      ...this.getSkillNodes(map)
    ]
  }

  /**
   * Creates child nodes from the positions immediately adjacent to the current node.
   */
  private getAdjacentNodes(map: GameMap): GameNode[] {
    return Position.getDirections()
      .map(direction => this.state.position.add(direction))
      .map(pos => this.createChildNode(pos, map))
      .filter((child): child is GameNode => child !== null)
  }

  /**
   * Helper to create a new child node if the target tile is valid.
   */
  private createChildNode(position: Position, map: GameMap): GameNode | null {
    const tile = map.getTile(position)

    if (!tile || !tile.walkable) {
      return null // not a valid tile or not walkable
    }

    // Apply tile effects (e.g. damage, movement, etc.)
    const newState = resolveTileEffect({ ...this.state, position }, map)

    return new GameNode(this, position, newState)
  }

  /**
   * Generates child nodes based on using each skill’s targets for movement.
   */
  private getSkillNodes(map: GameMap): GameNode[] {
    // TODO - Skills available targets are only from agents position
    // For this to work correctly with pathfinding we need the targets from the nodes position
    return this.state.skills.flatMap(skill => this.createNodesForSkill(skill))
  }

  /**
   * Create new node(s) for every target associated with the given skill.
   */
  private createNodesForSkill(skill: ISkillState): GameNode[] {
    return skill.targets.map(target => this.createNodeForSkillTarget(skill, target));
  }

  /**
   * Creates a new node after "using" a skill to move to the given target.
   * In this example, we remove the used skill from the agent’s skill list.
   */
  private createNodeForSkillTarget(skill: ISkillState, target: Position): GameNode {
    // Remove or mark as used the skill that was just utilized
    const updatedSkills = this.state.skills.filter(s => s.id !== skill.id);

    const newState: IAgentState = {
      ...this.state,
      position: target,
      skills: updatedSkills // updated skill set
    };

    // "action" can store the used skill to help track how we reached this node
    return new GameNode(this, target, newState, skill);
  }

  private filterInvalidStates(nodes: GameNode[]): GameNode[] {
    return nodes.filter(node => node.state.hitpoints > 0)
  }

}

export default GameNode
