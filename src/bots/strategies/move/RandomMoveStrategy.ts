import Position from '../../../game/map/Position.js'
import GameState from '../../../game/state/GameState.js'
import MoveStrategy from './MoveStrategy.js'


class RandomMoveStrategy extends MoveStrategy {
  determineMove(game: GameState): Position {
    return this.getRandomMove(game.getMap(), game.getBearer())
  }
}

export default RandomMoveStrategy
