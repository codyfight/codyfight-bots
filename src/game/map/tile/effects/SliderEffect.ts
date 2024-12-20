import TileEffect from './TileEffect.js'
import Position from '../../Position.js'
import { TileType } from '../tile.type.js'

const DIRECTION_OFFSETS: Partial<Record<TileType, Position>> = {
  [TileType.DirectionalSliderUp]: new Position(0, -1), // Up
  [TileType.DirectionalSliderDown]: new Position(0, 1), // down
  [TileType.DirectionalSliderLeft]: new Position(-1, 0), // left
  [TileType.DirectionalSliderRight]: new Position(1, 0) // right
}

class SliderEffect extends TileEffect {
  public readonly isChainEffect: boolean = true

  private readonly offset: Position

  constructor(isCharged: boolean, type: TileType) {
    super(isCharged)
    this.offset = DIRECTION_OFFSETS[type] || new Position(0, 0)
  }

  public apply(position: Position): Position {
    return this.isCharged ? position.add(this.offset) : position
  }
}

export default SliderEffect
