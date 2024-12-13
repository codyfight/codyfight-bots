import GameState from '../../../game/state/GameState.js'
import Skill from '../../../game/skills/Skill.js'
import Position from '../../../game/map/Position.js'

export enum CastStrategyType {
  Random = 'Random',
}

abstract class CastStrategy {
  abstract determineCast(game: GameState): [Skill, Position] | null;
}

export default CastStrategy
