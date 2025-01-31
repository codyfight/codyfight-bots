import { NextFunction, Request, Response } from 'express'
import { AxiosError } from 'axios'
import { ERROR_WAIT_LONG, ERROR_WAIT_SHORT } from './constants.js'
import GameError from '../game/utils/game-error.js'


/**
 * Safely retrieves an environment variable, throwing an error if it's not set.
 *
 * @param name The name of the environment variable to retrieve.
 * @returns The value of the environment variable as a string.
 * @throws If the environment variable is not defined.
 */
export function getEnvVar(name: string): string {
  const value = process.env[name]
  if (typeof value === 'undefined' || value === '') {
    throw new Error(`Environment variable ${name} is not defined.`)
  }
  return value
}

/**
 * Wrapper function for API calls to log errors
 * @param fn - The function to execute.
 * @returns A promise resolving to the function's result or void if an error occurs.
 */
export async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | void> {
  try {
    return await fn()
  } catch (error) {
    throw new GameError(error, {Message: `Error in ${fn.name}`})
  }
}

/**
 * Wraps an async Express route handler in a try/catch
 * to forward errors to `next()`.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}


/** Helper to pause for a given number of milliseconds. */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns how long to wait (in ms) based on the error type/response. */
export function getWaitTime(error: unknown): number {
  if (error instanceof AxiosError) {
    // For 5xx or missing status, wait longer
    const status = error.status;
    if (!status || status >= 500) {
      return ERROR_WAIT_LONG;
    }
  }
  // Default short wait
  return ERROR_WAIT_SHORT;
}
