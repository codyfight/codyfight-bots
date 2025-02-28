import CastStrategy from './cast-strategy.js'
import { CastStrategyType } from './cast-strategy.type.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'

// To Improve this strategy, the bot could take into account more factors such as
// We could take into account enemy health, e.g. target the enemy with the lowest health.
// We could take into account skills that will be available on the next turn (range, damage, etc)
// If we can do more damage on the next turn if we save energy or move closer maybe we should do that.

class AggressiveCastStrategy extends CastStrategy{
  public readonly type = CastStrategyType.Aggressive

  protected determineSkill(): Skill | null {
    const skills = this.bearer.availableSkills;
    return skills.length === 0 ? null : this.getSkillWithHighestDamage(skills);
  }

  protected determineTarget(skill: Skill): Position | null {
    const canTargetOpponent = skill.canTarget(this.opponent.position);
    return canTargetOpponent ? this.opponent.position : null;
  }

  private getSkillWithHighestDamage(skills: Skill[]): Skill {
    return skills.reduce((prevSkill, currentSkill) =>
      currentSkill.damage > prevSkill.damage ? currentSkill : prevSkill
    );
  }

}

export default AggressiveCastStrategy
