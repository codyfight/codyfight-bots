import GameMap from '../../game-map.js'
import Position from '../../position.js'

/**
 * The TileEffectResolver class determines the final position of a player after interacting with tiles on the game map.
 *
 * Key Responsibilities:
 * - Resolves tile effects recursively to simulate the player's movement across the map.
 * - Handles "chain effects" where one tile effect (e.g., a slider) leads to another tile.
 * - Prevents infinite loops by tracking visited tiles during resolution.
 *
 * Usage:
 * - This class is mainly used by pathfinding algorithms to determine where a player will ultimately end up
 *   after stepping on a tile with an effect.
 *
 * Example:
 * - A slider moves the player to another tile, which could have another effect (e.g., teleporting).
 * - The resolve method keeps applying effects until the player "settles" at a final position.
 */

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
    const effect = tile.effect
    const result = effect.apply({ position: position, hitpoints: 0 })
    const newPosition = result.position

    // Stop if position hasn't changed, or the effect does not chain
    if (newPosition.equals(position) || !effect.isChainEffect) {
      return newPosition
    }

    // Continue resolving position
    return this.resolve(newPosition, visited)
  }
}

export default TileEffectResolver
