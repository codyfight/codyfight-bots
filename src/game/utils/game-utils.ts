import Position from '../map/position.js'
import GameMap from '../map/game-map.js'
import GameError from '../../errors/game-error.js'
import PlayerAgent from '../agents/player-agent.js'

/**
 * Calculates the Euclidean distance between two positions.
 * @param pos1 The first position.
 * @param pos2 The second position.
 * @returns The Euclidean distance between the two positions.
 */
export function euclideanDistance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Returns a random element from an array.
 *
 * @param {T[]} array - The array to pick a random element from.
 * @returns {T | null} A random element from the array, or null if the array is empty.
 */
export function randomElement<T>(array: T[]): T {

  if (array.length === 0) {
    throw new GameError('randomElement() was called with an empty array');
  }

  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

/**
 * Finds the closest position to a given origin from a list of target positions.
 * @param origin The starting position.
 * @param targets An array of potential target positions.
 * @returns The position closest to the origin.
 */
export function findClosestPosition(origin: Position, targets: Position[]): Position {
  return targets.reduce((closest, target) => {
    const currentDistance = euclideanDistance(origin, target);
    const closestDistance = euclideanDistance(origin, closest);
    return currentDistance < closestDistance ? target : closest;
  });
}

/**
 * Filters out dangerous positions from the provided list based on the map's tiles.
 * @param map The game map to check tile properties.
 * @param positions The list of positions to filter.
 * @returns An array of positions that are considered safe.
 */
export function filterSafeMoves(map: GameMap, positions: Position[]): Position[] {
  return positions.filter((pos) => {
    const tile = map.getTile(pos);
    return tile && !tile.isDangerous();
  });
}


export function isRestoreEffective(value: number, max: number, restore: number, threshold: number): boolean {
  const missing = max - value;
  if (missing <= 0) return false;

  const utilization = missing / restore;
  return utilization >= threshold;
}

class AgentState {
}

export function createAgentState(agent: PlayerAgent) : AgentState {
  return {
    hitpoints: agent.hitpoints,
    skillsState: agent.availableSkills.map(skill => ({
      id: skill.id,
      ready: skill.ready
    }))
  };
}
