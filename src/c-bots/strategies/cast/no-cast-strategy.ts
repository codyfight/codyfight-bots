import CastStrategy from './cast-strategy.js'
import { CastStrategyType } from './cast-strategy.type.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'

class NoCastStrategy extends CastStrategy{
  public readonly type = CastStrategyType.None

  protected determineSkill(): Skill | null {
    return null
  }

  protected determineTarget(): Position | null {
    return null
  }
}

export default NoCastStrategy
