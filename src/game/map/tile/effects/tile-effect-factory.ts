import { TileType } from '../tile.type.js'
import SliderEffect from './slider-effect.js'
import TileEffect from './tile-effect.js'
import EmptyEffect from './empty-effect.js'
import TeleportEffect from './teleport-effect.js'
import DamageEffect from './damage-effect.js'

/**
 * Factory function to create a TileEffect based on the type and charge state.
 * @param type - The type of the tile.
 * @param isCharged - Whether the tile is charged or not.
 * @returns An instance of the corresponding TileEffect.
 */
export function createTileEffect(type: TileType, isCharged: boolean): TileEffect {
  switch (type) {
    case TileType.DirectionalSliderUp:
    case TileType.DirectionalSliderDown:
    case TileType.DirectionalSliderLeft:
    case TileType.DirectionalSliderRight:
      return new SliderEffect(isCharged, type);

    case TileType.BidirectionalTeleport:
      return new TeleportEffect(isCharged);

    case TileType.DeathPit:
    case TileType.ProximityMine:
    case TileType.BoobyTrap:
    case TileType.ZapTrap:
      return new DamageEffect(isCharged, type)

    default:
      return new EmptyEffect(false);
  }
}
