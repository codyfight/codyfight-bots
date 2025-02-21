import CastStrategy from './cast-strategy.js'
import Position from '../../../game/map/position.js'
import Skill from '../../../game/skills/skill.js'
import GameState from '../../../game/state/game-state.js'
import { CastStrategyType } from './cast-strategy.type.js'

class RandomCastStrategy extends CastStrategy {
  public type = CastStrategyType.Random

  public determineCast(game: GameState): [Skill, Position] | null {
    return this.getRandomCast(game.getBearer())
  }
}

export default RandomCastStrategy
