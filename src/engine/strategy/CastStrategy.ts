import GameState from '../../entities/GameState.js'
import Skill from '../../entities/Skill.js'
import Position from '../../entities/Position.js'

abstract class CastStrategy {
  abstract determineCast(game: GameState): [Skill, Position] | null;
}

export default CastStrategy
