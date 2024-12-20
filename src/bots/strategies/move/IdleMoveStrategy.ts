import Position from '../../../game/map/Position.js'
import MoveStrategy from './MoveStrategy.js'

class IdleMoveStrategy extends MoveStrategy {
  protected getTarget(): Position {
    return this.bearer.getPosition()
  }
}

export default IdleMoveStrategy
