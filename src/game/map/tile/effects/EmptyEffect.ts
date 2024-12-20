import TileEffect from './TileEffect.js'
import Position from '../../Position.js'

class EmptyEffect extends TileEffect {
  public apply(position: Position) : Position {
    return position
  }
}

export default EmptyEffect
