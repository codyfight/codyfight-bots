import CastStrategy from './cast-strategy.js'
import { CastStrategyType } from './cast-strategy.type.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'
import { SpecialAgentType } from '../../../game/agents/game-agent.type.js'

class RyoCastStrategy extends CastStrategy{
  public readonly type = CastStrategyType.Ryo

  protected determineSkill(): Skill | null {
    const ryoAgents = this.specialAgents.get(SpecialAgentType.MrRyo);
    if (!ryoAgents || ryoAgents.length === 0) return null;

    const ryoPosition = ryoAgents[0].position;

    const skills = this.bearer.availableSkills.filter(skill =>
      skill.possibleTargets.some(target =>
        target.equals(ryoPosition) || target.adjacent(ryoPosition)
      )
    );

    return skills.length > 0 ? skills[0] : null;
  }
  
  protected determineTarget(skill: Skill): Position | null {
    return this.getRandomTarget(skill)
  }
}

export default RyoCastStrategy
