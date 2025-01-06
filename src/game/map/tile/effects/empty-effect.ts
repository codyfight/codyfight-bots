import TileEffect from './tile-effect.js'
import Position from '../../position.js'

class EmptyEffect extends TileEffect {
  public apply(position: Position): Position {
    return position
  }
}

export default EmptyEffect
