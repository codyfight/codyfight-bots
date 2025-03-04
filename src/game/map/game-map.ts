import IUpdatable from '../interfaces/updatable.interface.js'
import Tile from './tile/tile.js'
import Position from './position.js'
import { ITile, TileType } from './tile/tile.type.js'
import { findClosestPosition } from '../utils/game-utils.js'
import TeleportEffect from './tile/effects/teleport-effect.js'

class GameMap implements IUpdatable {
  private lastMapHash: string | null = null
  private tiles!: Tile[][]

  constructor(mapData: ITile[][]) {
    this.buildMap(mapData)
    this.lastMapHash = this.computeHash(mapData)
  }

  public update(mapData: ITile[][]): void {
    if(this.isMapUnchanged(mapData)) return

    this.buildMap(mapData)
    this.lastMapHash = this.computeHash(mapData)
  }

  public reset(mapData: ITile[][]): void {
    this.buildMap(mapData)
  }

  public getTile(position: Position): Tile | null {
    if (!this.tiles[position.x]?.[position.y]) {
      return null
    }
    return this.tiles[position.x][position.y]
  }

  public getTiles(type: TileType): Tile[] {
    const found: Tile[] = []
    for (const row of this.tiles) {
      for (const tile of row) {
        if (tile.type === type) {
          found.push(tile)
        }
      }
    }
    return found
  }

  public findClosestTilePosition(type: TileType, origin: Position): Position | null {
    const tiles = this.getTiles(type)

    if (tiles.length === 0) {
      return null
    }

    const targets = tiles.map((tile) => tile.position)

    return findClosestPosition(origin, targets)
  }

  private isMapUnchanged(mapData: ITile[][]): boolean {
    const newMapHash = this.computeHash(mapData)
    return this.lastMapHash === newMapHash
  }

  private buildMap(mapData: ITile[][]): void {
    this.tiles = mapData.map((rowData) =>
      rowData.map((tileData) => new Tile(tileData))
    )

    this.resolveTeleports()
  }

  // TODO - this code is a bit if work around, Ideally the teleport should store its own destination
  private resolveTeleports(): void {
    const teleports = this.getTiles(TileType.BidirectionalTeleport)
    if (teleports.length === 2) {
      const [t1, t2] = teleports

      const effect1 = t1.getEffect() as TeleportEffect
      const effect2 = t2.getEffect() as TeleportEffect

      effect1.setDestination(t2.position)
      effect2.setDestination(t1.position)
    }
  }

  private computeHash(mapData: ITile[][]): string {
    return JSON.stringify(mapData)
  }
}

export default GameMap
