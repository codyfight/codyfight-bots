import CastStrategy from './cast-strategy.js'
import { CastStrategyType } from './cast-strategy.type.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'
import { SkillCategory } from '../../../game/skills/skill-type.js'
import { randomElement } from '../../../game/utils/game-utils.js'

class UtilityCastStrategy extends CastStrategy {
  public readonly type = CastStrategyType.Utility

  protected determineSkill(): Skill | null {
    const utilitySkills = this.bearer.availableSkills.filter(
      s => s.category === SkillCategory.Utility
    )
    
    if (utilitySkills.length === 0) return null

    return randomElement(utilitySkills)
  }

  protected determineTarget(skill: Skill): Position | null {
    return this.getRandomTarget(skill)
  }
}

export default UtilityCastStrategy
