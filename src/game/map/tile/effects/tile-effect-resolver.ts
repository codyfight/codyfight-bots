import GameMap from '../../game-map.js'
import { IAgentState } from '../../../agents/game-agent.type.js'
import TileEffect from './tile-effect.js'

class TileEffectResolver {
  constructor(private map: GameMap) {}

  /**
   * Recursively applies tile effects to the given `agentState`.
   *
   * @param agentState The current agent state
   * @param visited A set of visited states
   */
  public resolve(agentState: IAgentState, visited: Set<string> = new Set()): IAgentState {
    const key = this.makeKey(agentState)

    if (visited.has(key)) return agentState

    visited.add(key)

    // Get the tile at the agent's position
    const tile = this.map.getTile(agentState.position)

    if (!tile) return agentState

    const effect: TileEffect = tile.effect
    const newAgentState = effect.apply(agentState)

    // If position hasn't changed or the effect is not chainable, we're done
    if (newAgentState.position.equals(agentState.position) || !effect.isChainEffect) {
      return newAgentState
    }

    // Otherwise, recurse for chain effects
    return this.resolve(newAgentState, visited)
  }

  /**
   * Builds a unique key for visited states
   */
  private makeKey(agentState: IAgentState): string {
    const { position, hitpoints } = agentState
    return `${position.toString()}|HP=${hitpoints}`
  }
}

export default TileEffectResolver
