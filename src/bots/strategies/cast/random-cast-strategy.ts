import CastStrategy from './cast-strategy.js'
import Position from '../../../game/map/position.js'
import Skill from '../../../game/skills/skill.js'
import GameState from '../../../game/state/game-state.js'

class RandomCastStrategy extends CastStrategy {
  public determineCast(game: GameState): [Skill, Position] | null {
    return this.getRandomCast(game.getBearer())
  }
}

export default RandomCastStrategy
