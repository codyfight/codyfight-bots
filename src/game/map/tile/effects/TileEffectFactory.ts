import { TileType } from '../tile.type.js'
import SliderEffect from './SliderEffect.js'
import TileEffect from './TileEffect.js'
import EmptyEffect from './EmptyEffect.js'
import TeleportEffect from './TeleportEffect.js'

class TileEffectFactory {
  public static create(type: TileType, isCharged: boolean): TileEffect {
    switch (type) {
      case TileType.DirectionalSliderUp:
      case TileType.DirectionalSliderDown:
      case TileType.DirectionalSliderLeft:
      case TileType.DirectionalSliderRight:
        return new SliderEffect(isCharged, type)

      case TileType.BidirectionalTeleport:
        return new TeleportEffect(isCharged);

      default:
        return new EmptyEffect(false)
    }
  }
}

export default TileEffectFactory
