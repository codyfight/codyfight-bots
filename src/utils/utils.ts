import log from './log.js'

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
 * Delays execution for the specified number of milliseconds.
 *
 * @param {number} ms - The delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
