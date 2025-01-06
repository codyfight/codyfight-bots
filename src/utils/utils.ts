import { NextFunction, Request, Response } from 'express'

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
    console.error(`Error in ${fn.name}`, error)
    throw error
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
