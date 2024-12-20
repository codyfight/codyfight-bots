import GameState from '../../../game/state/GameState.js'
import Position from '../../../game/map/Position.js'

export enum MoveStrategyType {
  Idle = 'Idle',
  Random = 'Random',
  Exit = 'Exit',
  Aggressive = 'Aggressive',
  Dynamic = 'Dynamic'
}

export interface IMoveStrategy {
  determineMove(game: GameState): Position;
}
