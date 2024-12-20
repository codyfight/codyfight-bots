
import Position from '../Position.js'
import { DANGEROUS_TILES, ITile, SAFE_TILES, TileType } from './tile.type.js'
import TileEffect from './effects/TileEffect.js'
import TileEffectFactory from './effects/TileEffectFactory.js'

class Tile {
  readonly id: number
  readonly name: string
  readonly type: TileType
  readonly position: Position

  readonly effect: TileEffect

  constructor(data: ITile) {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.position = new Position(data.position.x, data.position.y)
    this.effect = TileEffectFactory.create(this.type, data.config.is_charged)
  }

  update(data: ITile): void {
    //TODO
  }

  public equals(other : Tile) : boolean{
    return this.position.equals(other.position)
  }

  public isSafe(): boolean{
    return SAFE_TILES.has(this.type)
  }

  public isDangerous(): boolean {
    return DANGEROUS_TILES.has(this.type)
  }

  public getEffect() : TileEffect {
    return this.effect
  }

}

export default Tile
