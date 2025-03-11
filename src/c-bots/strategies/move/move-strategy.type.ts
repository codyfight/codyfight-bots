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

// 1) Create a dictionary of MoveStrategyType → description
const moveStrategyDescriptions: Record<MoveStrategyType, string> = {
  [MoveStrategyType.Idle]: 'Your bot will not move.',
  [MoveStrategyType.Random]: 'Your bot chooses moves at random.',
  [MoveStrategyType.Exit]: 'Your bot tries to find the nearest exit.',
  [MoveStrategyType.Ryo]: 'Your bot chases after Ryo relentlessly.',
  [MoveStrategyType.Aggressive]: 'Your bot charges head-first into combat!',
  [MoveStrategyType.Dynamic]: 'Your bot adapts its movement based on the situation.'
}

// 2) Build your moveStrategyOptions array using the dictionary
export const moveStrategyOptions = Object.values(MoveStrategyType).map((type) => ({
  label: type,
  value: type,
  description: moveStrategyDescriptions[type]
}))
