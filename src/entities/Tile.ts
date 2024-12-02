import Position from './Position.ts'
import { TileType } from '../types/game/map.type.ts'

class Tile {
  id: number
  name: string
  type: TileType
  position: Position
  isCharged: boolean
  isArmed: boolean

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.position = new Position(data.position.x, data.position.y)
    this.isCharged = data.is_charged || false
    this.isArmed = data.is_armed || false
  }

  isWalkable(): boolean {
    return (
      this.type !== TileType.Obstacle &&
      this.type !== TileType.Wall &&
      this.type !== TileType.DeathPit
    )
  }
}

export default Tile
