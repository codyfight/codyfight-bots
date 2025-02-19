import GameState from '../../../game/state/game-state.js'
import Skill from '../../../game/skills/skill.js'
import Position from '../../../game/map/position.js'

export enum CastStrategyType {
  None = 'none',
  Random = 'random'
}

export interface ICastStrategy {
  determineCast(game: GameState): [Skill, Position] | null
}

// Options for dropdown
export const castStrategyOptions = Object.values(CastStrategyType).map(
  (value) => ({
    label: value,
    value: value
  })
)
