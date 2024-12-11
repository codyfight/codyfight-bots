import Skill from '../entities/Skill.js'
import GameState from '../entities/GameState.js'
import Position from '../entities/Position.js'
import { randomElement } from '../utils/utils.js'

class StrategyManager {

  // TODO - Implement Strategy
  public determineMove(game: GameState): Position | null {
    const map = game.getMap();
    const bearer = game.getBearer();
    const possibleMoves = bearer.getPossibleMoves();

    const safeMoves = possibleMoves.filter((position) => {
      const tile = map.getTile(position);
      return !tile!.isDangerous();
    });

    return randomElement(safeMoves);
  }

  // TODO - Implement Strategy
  public determineCast(game: GameState): [Skill, Position] | null {
    const bearer = game.getBearer();
    const skills = bearer.getSkills();

    const castableSkills = skills.filter((skill) => skill.isReady());

    if (castableSkills.length < 1) return null;

    const randomSkill = randomElement(castableSkills);
    if (!randomSkill) return null;

    const randomTarget = randomElement(randomSkill.possibleTargets);
    if (!randomTarget) return null;

    return [randomSkill, randomTarget];
  }

}
 export default StrategyManager
