import CastStrategy from './cast-strategy.js'
import GameState from '../../../game/state/game-state.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'

/**
 * Example CustomCastStrategy:
 *
 * Override `determineCast(game: GameState)` to define how this bot decides to cast skills.
 */
class CustomCastStrategy extends CastStrategy {
  /**
   * Determines which skill to cast, and on which position, for the given game state.
   * @param game The current GameState, including all agents, map, and turn info.
   * @returns A tuple [Skill, Position] to cast, or null if no skill should be cast.
   */
  public determineCast(game: GameState): [Skill, Position] | null {
    // 1. Retrieve info from `game`
    // 2. Decide which skill to cast, if any
    // 3. Decide the target position for the skill
    // 4. Return [skill, position] or null if no skill is cast

    return null // No casting by default
  }
}

export default CustomCastStrategy
