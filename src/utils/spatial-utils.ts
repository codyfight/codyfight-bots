import Position from '../game/map/position.js'
import MathUtils from './math-utils.js'
import GameMap from '../game/map/game-map.js'

class SpatialUtils {
  /**
   * Finds the closest position to a given origin from a list of target positions.
   * @param origin The starting position.
   * @param targets An array of potential target positions.
   * @returns The position closest to the origin.
   */
  public static findClosestPosition(
    origin: Position,
    targets: Position[]
  ): Position {
    return targets.reduce((closest, target) => {
      const currentDistance = MathUtils.euclideanDistance(origin, target)
      const closestDistance = MathUtils.euclideanDistance(origin, closest)
      return currentDistance < closestDistance ? target : closest
    })
  }

  /**
   * Filters out dangerous positions from the provided list based on the map's tiles.
   * @param map The game map to check tile properties.
   * @param positions The list of positions to filter.
   * @returns An array of positions that are considered safe.
   */
  public static filterSafeMoves(
    map: GameMap,
    positions: Position[]
  ): Position[] {
    return positions.filter((pos) => {
      const tile = map.getTile(pos)
      return tile && !tile.isDangerous()
    })
  }
}

export default SpatialUtils
