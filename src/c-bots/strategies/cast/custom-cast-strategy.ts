import CastStrategy from './cast-strategy.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'
import { CastStrategyType } from './cast-strategy.type.js'

/**
 * Example CustomCastStrategy:
 *
 * Override `determineCast(game: GameState)` to define how this bot decides to cast skills.
 */
class CustomCastStrategy extends CastStrategy {
  public readonly  type = CastStrategyType.None

  public get description(): string {
    return 'Your bot will not cast any skills.'
  }

  protected determineSkill(): Skill | null {
    // Decide which skill to cast, if any
    return null
  }

  protected determineTarget(): Position | null {
    // Decide the target position for the skill
    return null
  }
}

export default CustomCastStrategy
