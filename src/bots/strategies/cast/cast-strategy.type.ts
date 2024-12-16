import GameState from '../../../game/state/GameState.js'
import Skill from '../../../game/skills/Skill.js'
import Position from '../../../game/map/Position.js'

export enum CastStrategyType {
  None = 'None',
  Random = 'Random'
}

export interface ICastStrategy {
  determineCast(game: GameState): [Skill, Position] | null;
}
