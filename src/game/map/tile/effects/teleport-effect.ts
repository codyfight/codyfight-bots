import TileEffect from './tile-effect.js'
import Position from '../../position.js'
import { IAgentState } from '../../../agents/game-agent.type.js'

/**
 * Represents a teleport effect that moves the player to a specific destination.
 *
 * Key Features:
 * - Teleports the player to a pre-defined position if the tile is "charged."
 * - If no destination is set, the player remains in their current position.
 *
 * Example:
 * - A teleport tile is configured to move the player to `(5, 5)`.
 * - If the teleport is charged, the player is moved to `(5, 5)`. Otherwise, the player stays in place.
 */

class TeleportEffect extends TileEffect {
  private destination: Position | null = null

  public constructor(isCharged: boolean) {
    super(isCharged)
  }

  public setDestination(destination: Position) {
    this.destination = destination
  }

  public apply(agentState: IAgentState): IAgentState  {
    const position = agentState.position
    const newPosition = this.isCharged ? this.destination || position : position

    return {
      ...agentState,
      position: newPosition
    }
  }
}

export default TeleportEffect
