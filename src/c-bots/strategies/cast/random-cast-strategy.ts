import CastStrategy from './cast-strategy.js'
import Position from '../../../game/map/position.js'
import Skill from '../../../game/skills/skill.js'
import { CastStrategyType } from './cast-strategy.type.js'

class RandomCastStrategy extends CastStrategy {
  public readonly type = CastStrategyType.Random

  protected determineSkill(): Skill | null {
    return this.getRandomSkill()
  }

  protected determineTarget(skill: Skill): Position | null {
    return this.getRandomTarget(skill)
  }
}

export default RandomCastStrategy
