import CastStrategy from './CastStrategy.js'
import Position from '../../game/entities/core/Position.js'
import Skill from '../../game/entities/core/Skill.js'
import GameState from '../../game/entities/core/GameState.js'
import { randomElement } from '../../utils/utils.js'


class RandomCastStrategy extends CastStrategy {
  determineCast(game: GameState): [Skill, Position] | null {
    const bearer = game.getBearer();
    const skills = bearer.getSkills();

    const castableSkills = skills.filter((skill) => skill.isReady());
    if (castableSkills.length === 0) return null;

    const randomSkill = randomElement(castableSkills);
    if (!randomSkill) return null;

    const randomTarget = randomElement(randomSkill.possibleTargets);
    if (!randomTarget) return null;

    return [randomSkill, randomTarget];
  }
}

export default RandomCastStrategy
