import Position from '../../../game/map/Position.js'
import MoveStrategy from './MoveStrategy.js'

class AggressiveMoveStrategy extends MoveStrategy {
  protected getTarget(): Position {
    return this.opponent.getPosition()
  }
}

export default AggressiveMoveStrategy
