import GameState from '../../game/entities/core/GameState.js'
import Skill from '../../game/entities/core/Skill.js'
import Position from '../../game/entities/core/Position.js'

export enum CastStrategyType {
  Random = 'Random',
}

abstract class CastStrategy {
  abstract determineCast(game: GameState): [Skill, Position] | null;
}

export default CastStrategy
