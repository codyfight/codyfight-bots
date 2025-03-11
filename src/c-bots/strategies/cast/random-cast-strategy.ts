import CastStrategy from './cast-strategy.js'
import Position from '../../../game/map/position.js'
import Skill from '../../../game/skills/skill.js'
import { CastStrategyType } from './cast-strategy.type.js'

class RandomCastStrategy extends CastStrategy {
  public readonly type = CastStrategyType.Random

  public get description(): string {
    return 'Your bot will cast random skills at random targets.'
  }

  protected determineSkill(): Skill | null {
    return this.getRandomSkill()
  }

  protected determineTarget(skill: Skill): Position | null {
    return this.getRandomTarget(skill)
  }
}

export default RandomCastStrategy
