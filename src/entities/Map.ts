import { ITileData } from '../types/game/map.type.js'
import Updatable from '../interfaces/Updatable.js'
import Tile from './Tile.js'

class Map implements Updatable {
  tiles: Tile[][]

  constructor(mapData: ITileData[][]) {
    this.tiles = mapData.map((rowData) =>
      rowData.map((tileData) => new Tile(tileData))
    )
  }

  update(mapData: ITileData[][]): void {
    for (let i = 0; i < mapData.length; i++) {
      for (let j = 0; j < mapData[i].length; j++) {
        const tileData = mapData[i][j]
        this.tiles[i][j].update(tileData)
      }
    }
  }
}

export default Map
