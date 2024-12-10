import log from './log.js'
import { GameStatus } from '../types/game/state.type.js'

/**
 * Wrapper function for API calls to log errors
 * @param fn - The function to execute.
 * @returns A promise resolving to the function's result or void if an error occurs.
 */
export async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | void> {
  try {
    return await fn()
  } catch (error) {
    log.apiError(`Error in ${fn.name}`, error)
  }
}

/**
 * Safely retrieves an environment variable, throwing an error if it's not set.
 *
 * @param name The name of the environment variable to retrieve.
 * @returns The value of the environment variable as a string.
 * @throws If the environment variable is not defined.
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (typeof value === 'undefined' || value === '') {
    throw new Error(`Environment variable ${name} is not defined.`);
  }
  return value;
}

/**
 * Returns a random element from an array.
 *
 * @param {T[]} array - The array to pick a random element from.
 * @returns {T | null} A random element from the array, or null if the array is empty.
 */
export function randomElement<T>(array: T[]): T | null {
  if (array.length === 0) return null
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

/**
 * Formats a name to uppercase, padded to 10 characters, or defaults to 'Player'.
 *
 * @param {string | null} name - The name to format.
 * @returns {string} The formatted name.
 */
export function formatName(name: string | null): string {
  return name ? String(name)?.padEnd(10)?.toUpperCase() : 'Player'
}


/**
 * Maps the Game status enum to a string value.
 *
 * @param {GameStatus } status - The status to map.
 * @returns {string} The formatted name.
 */
export function getGameStatusName(status: GameStatus): string {
  const statusMap: { [key in GameStatus]: string } = {
    [GameStatus.Terminated]: 'Terminated',
    [GameStatus.Empty]: 'Empty',
    [GameStatus.Registering]: 'Registering',
    [GameStatus.Playing]: 'Playing',
    [GameStatus.Ended]: 'Ended',
  };

  return statusMap[status] || `Unknown (${status})`;
}

/**
 * Delays execution for the specified number of milliseconds.
 *
 * @param {number} ms - The delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
