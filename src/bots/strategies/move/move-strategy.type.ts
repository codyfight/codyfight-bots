import GameState from '../../../game/state/GameState.js'
import Position from '../../../game/map/Position.js'

export enum MoveStrategyType {
  None = 'None',
  Random = 'Random',
  Exit = 'Exit',
}

export interface IMoveStrategy {
  determineMove(game: GameState): Position;
}
