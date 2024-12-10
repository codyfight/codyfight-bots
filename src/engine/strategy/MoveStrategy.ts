import Position from '../../entities/Position.js'
import GameState from '../../entities/GameState.js'

abstract class MoveStrategy {
  abstract determineMove(game: GameState): Position | null;
}

export default MoveStrategy
