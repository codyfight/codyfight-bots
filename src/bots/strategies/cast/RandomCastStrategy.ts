import CastStrategy from './CastStrategy.js'
import Position from '../../../game/map/Position.js'
import Skill from '../../../game/skills/Skill.js'
import GameState from '../../../game/state/GameState.js'


class RandomCastStrategy extends CastStrategy {
  public determineCast(game: GameState): [Skill, Position] | null {
    return this.getRandomCast(game.getBearer())
  }
}

export default RandomCastStrategy
