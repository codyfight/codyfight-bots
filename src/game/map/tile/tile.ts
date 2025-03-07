import Position from '../position.js'
import { DANGEROUS_TILES, ITile, TileType } from './tile.type.js'
import TileEffect from './effects/tile-effect.js'
import { createTileEffect } from './effects/tile-effect-factory.js'

class Tile {
  readonly id: number
  readonly name: string
  readonly type: TileType
  readonly position: Position
  readonly _walkable: boolean

  readonly _effect: TileEffect

  constructor(data: ITile) {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.position = new Position(data.position.x, data.position.y)
    this._walkable = data.is_walkable
    this._effect = createTileEffect(this.type, data.config.is_charged)
  }

  public equals(other: Tile): boolean {
    return this.position.equals(other.position)
  }

  public get walkable(): boolean {
    return this._walkable
  }

  public isDangerous(): boolean {
    return DANGEROUS_TILES.has(this.type)
  }

  public get effect(): TileEffect {
    return this._effect
  }
}

export default Tile

// Tile class updates
// I need to store if a tile is walkable or not, meaning a player can move to it and its a valid move, this should not consider the effect of the tile
// Next I need to store the effect of a tile, if it will damage the player, or give them a boost to health etc..
// Then when I am searching for a path I can first check if the tile is walkable

// Traits needed:
// isWalkable: boolean
// Effect: TileEffect

// {
//   type: health
//   value: -10
//   target: {x: 1, y: 1}
// }
//
// effect{
//   effect: health
//   amount: +10
//   target: player
// }

// Then I want to check if the tile will damage the player - hard code this to a value like 50% of the players health to start and later make it configurable
// If it damages the player more than the configured amount, don't consider it a valid move

// Next, when finding a path, the bot should consider detours,
// for example if the tile will give the player a boost to health, it should consider moving to that tile even if it is not the shortest path
// This could either be encoded in the pathfinding algorithm or by doing a quick check on neighbouring tiles before running the pathfinding
// Make sure to include the distance to the goal, if the player is close to the exit for example, it should not consider detours

// With the above updates, we can make the bot more configurable, for example if the bot highly risky it will consider tiles that damage the player,
// if they are not very risky they will always take detours to tiles that heal the player
