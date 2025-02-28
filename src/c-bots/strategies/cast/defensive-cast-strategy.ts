import CastStrategy from './cast-strategy.js'
import { CastStrategyType } from './cast-strategy.type.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'
import { SkillCategory } from '../../../game/skills/skill-type.js'

class DefensiveCastStrategy extends CastStrategy {
  public readonly type = CastStrategyType.Defensive

  protected determineSkill(): Skill | null {

    const healingSkills = this.bearer.availableSkills.filter(
      s => s.getCategory() === SkillCategory.Healing && s.isReady()
    );

    // Filter and sort all healing skills by healing amount
    const hpRestoreSkills = healingSkills.filter(s => s.getHealing() > 0);
    hpRestoreSkills.sort((a, b) => b.getHealing() - a.getHealing());

    // Return the first effective healing skill
    for (const skill of hpRestoreSkills) {
      if (this.bearer.isHitpointsRestoreEffective(skill.getHealing())) {
        return skill;
      }
    }

    // Filter and sort all healing skills by armor amount
    const armorRestoreSkills = healingSkills.filter(s => s.getArmor() > 0);
    armorRestoreSkills.sort((a, b) => b.getArmor() - a.getArmor());

    // Return the first effective armor skill
    for (const skill of armorRestoreSkills) {
      if (this.bearer.isArmorRestoreEffective(skill.getArmor())) {
        return skill;
      }
    }

   // If there is a skill available to move the enemy away find and return it
    const movementSkills = this.bearer.availableSkills.filter(
      s => s.getCategory() === SkillCategory.MovementEnemy && s.isReady()
    );

    return movementSkills.length > 0 ? movementSkills[0] : null;
  }

  protected determineTarget(skill: Skill): Position | null {
    if (skill.getCategory() === SkillCategory.Healing) {
      if (skill.possibleTargets.some(pos => pos.equals(this.bearer.position))) {
        return this.bearer.position;
      }
    }

    return this.getRandomTarget(skill)
  }
}

export default DefensiveCastStrategy;
