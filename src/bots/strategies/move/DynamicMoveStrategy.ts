import Position from '../../../game/map/Position.js'
import ExitMoveStrategy from './ExitMoveStrategy.js'

class DynamicMoveStrategy extends ExitMoveStrategy {
  protected getTarget(): Position {
    return this.getClosestExit() ?? this.getSecondaryTarget();
  }

  protected getSecondaryTarget(): Position {
    return this.opponent.getPosition();
  }
}


export default DynamicMoveStrategy
