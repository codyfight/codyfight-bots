import { NextFunction, Request, Response } from 'express'
import { ERROR_WAIT_LONG, ERROR_WAIT_SHORT } from '../config/constants.js'
import GameError from '../errors/game-error.js'


/**
 * Wrapper function for API calls to log errors
 * @param fn - The function to execute.
 * @returns A promise resolving to the function's result or void if an error occurs.
 */
export async function safeApiCall<T>(fn: () => Promise<T>): Promise<T | void> {
  try {
    return await fn()
  } catch (error) {
    throw new GameError(error, {Message: `Error when calling ${fn.name}()`})
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

export function getWaitTime(error: unknown): number {
  const status = Number((error as any)?.response?.status);

  if (isNaN(status) || status >= 500) {
    return ERROR_WAIT_LONG;
  }

  return ERROR_WAIT_SHORT;
}
