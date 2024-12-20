import Position from '../../../game/map/Position.js'
import MoveStrategy from './MoveStrategy.js'


class RandomMoveStrategy extends MoveStrategy {
  protected getTarget(): Position {
    return this.getRandomMove()
  }
}

export default RandomMoveStrategy
