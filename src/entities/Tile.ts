import { DANGEROUS_TILES, ITileData, TileType } from '../types/game/map.type.js'
import Position from './Position.js'

class Tile {
  readonly id: number
  readonly name: string
  readonly type: TileType
  readonly position: Position
  private isCharged: boolean
  private isArmed: boolean

  constructor(data: ITileData) {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.position = new Position(data.position.x, data.position.y)
    this.isCharged = data.config?.is_charged || false
    this.isArmed = data.config?.is_armed || false
  }

  update(data: ITileData): void {
    this.isCharged = data.config?.is_charged || false
    this.isArmed = data.config?.is_armed || false
  }

  get charged(): boolean {
    return this.isCharged
  }

  get armed(): boolean {
    return this.isArmed
  }

  public isDangerous(): boolean {
    return DANGEROUS_TILES.has(this.type)
  }
}

export default Tile
