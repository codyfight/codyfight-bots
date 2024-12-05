import { ITileData } from '../types/game/map.type.js'
import Updatable from '../interfaces/Updatable.js'
import Tile from './Tile.js'
import Position from './Position.js'

class GameMap implements Updatable {
  private lastMapHash: string | null = null
  private tiles: Tile[][]

  constructor(mapData: ITileData[][]) {
    this.tiles = this.buildMap(mapData)
    this.lastMapHash = this.computeHash(mapData)
  }

  public update(mapData: ITileData[][]): void {
    if (this.isMapUnchanged(mapData)) return

    this.updateTiles(mapData)
    this.lastMapHash = this.computeHash(mapData)
  }

  public reset(mapData: ITileData[][]): void {
    console.debug('MAP DATA: ', mapData)
    this.tiles = this.buildMap(mapData)
  }

  public getTile(position: Position) {
    return this.tiles[position.x][position.y]
  }

  private updateTiles(mapData: ITileData[][]): void {
    for (let y = 0; y < mapData.length; y++) {
      this.updateRow(mapData[y], y)
    }
  }

  private updateRow(rowData: ITileData[], y: number): void {
    const tileRow = this.tiles[y]
    for (let x = 0; x < rowData.length; x++) {
      tileRow[x].update(rowData[x])
    }
  }

  private isMapUnchanged(mapData: ITileData[][]): boolean {
    const newMapHash = this.computeHash(mapData)
    return this.lastMapHash === newMapHash
  }

  private buildMap(mapData: ITileData[][]): Tile[][] {
    return mapData.map((rowData) =>
      rowData.map((tileData) => new Tile(tileData))
    )
  }

  private computeHash(mapData: ITileData[][]): string {
    return JSON.stringify(mapData)
  }
}

export default GameMap
