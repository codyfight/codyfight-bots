import GameMap from '../../game-map.js'
import Position from '../../position.js'

class TileEffectResolver {
  constructor(private map: GameMap) {}

  public resolve(
    position: Position,
    visited: Set<string> = new Set()
  ): Position {
    const key = position.toString()

    // Check for loops
    if (visited.has(key)) return position

    // Mark position as visited
    visited.add(key)

    const tile = this.map.getTile(position)

    // If the tile is invalid, return the current position
    if (!tile) return position

    // Get the tiles effect and apply it, for now this just works with positions
    const effect = tile.getEffect()
    const newPosition = effect.apply(position)

    // Stop if position hasn't changed, or the effect does not chain
    if (newPosition.equals(position) || !effect.isChainEffect) {
      return newPosition
    }

    // Continue resolving position
    return this.resolve(newPosition, visited)
  }
}

export default TileEffectResolver
