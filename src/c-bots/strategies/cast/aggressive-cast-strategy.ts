import CastStrategy from './cast-strategy.js'
import { CastStrategyType } from './cast-strategy.type.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'

class AggressiveCastStrategy extends CastStrategy{
  public readonly type = CastStrategyType.Aggressive

  protected determineSkill(): Skill | null {
    // Decide which skill to cast, if any
    return null
  }

  protected determineTarget(): Position | null {
    // Decide the target position for the skill
    return null
  }
}

export default AggressiveCastStrategy
