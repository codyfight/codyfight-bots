import CastStrategy from './cast-strategy.js'
import { CastStrategyType } from './cast-strategy.type.js'
import GameState from '../../../game/state/game-state.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'

class NoCastStrategy extends CastStrategy{
  public readonly type = CastStrategyType.None

  public determineCast(game: GameState): [Skill, Position] | null {
    return null // No cast by default
  }

}

export default NoCastStrategy
