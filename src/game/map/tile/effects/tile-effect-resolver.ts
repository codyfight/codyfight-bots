import { IAgentState } from '../../../agents/game-agent.type.js'
import TileEffect from './tile-effect.js'
import GameMap from '../../game-map.js'

/**
 * Recursively applies tile effects to the given `agentState`.
 *
 * @param agentState The current agent state
 * @param visited A set of visited states
 */
export function resolveTileEffect(agentState: IAgentState, map : GameMap, visited: Set<string> = new Set()): IAgentState {
  const key = agentState.position.toString()

  if (visited.has(key)) return agentState

  visited.add(key)

  // Get the tile at the agent's position
  const tile = map.getTile(agentState.position)

  if (!tile) return agentState

  const effect: TileEffect = tile.effect
  const newAgentState = effect.apply(agentState)

  // If position hasn't changed or the effect is not chainable, we're done
  if (newAgentState.position.equals(agentState.position) || !effect.isChainEffect) {
    return newAgentState
  }

  // Otherwise, recurse for chain effects
  return resolveTileEffect(newAgentState, map, visited)
}
