import { ITileData } from '../types/game/map.type.js'
import Updatable from '../interfaces/Updatable.js'
import Tile from './Tile.js'

class Map implements Updatable {
  tiles!: Tile[][]

  constructor(mapData: ITileData[][]) {
    this.update(mapData)
  }

  update(mapData: ITileData[][]): void {
    this.tiles = mapData.map((rowData) =>
      rowData.map((tileData) => new Tile(tileData))
    )
  }
}

export default Map
