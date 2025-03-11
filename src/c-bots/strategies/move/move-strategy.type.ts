import Position from '../../../game/map/position.js'
import GameNode from '../../../game/pathfinding/game-node.js'

export enum MoveStrategyType {
  Idle = 'idle',
  Random = 'random',
  Exit = 'exit',
  Ryo = 'ryo',
  Aggressive = 'aggressive',
  Dynamic = 'dynamic'
}

export interface IMoveStrategy {
  determineMove(path: GameNode []): Position
}

// Options for dropdown
export const moveStrategyOptions = Object.values(MoveStrategyType).map(
  (value) => ({
    label: value,
    value: value
  })
)
