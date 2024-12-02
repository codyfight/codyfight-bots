import Tile from './Tile.ts'


class Map {
  tiles: Tile[][];

  constructor(mapData: any[][]) {
    this.tiles = mapData.map((rowData) =>
      rowData.map((tileData: any) => new Tile(tileData))
    );
  }

}

export default Map;
