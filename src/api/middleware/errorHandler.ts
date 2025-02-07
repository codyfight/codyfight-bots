import { NextFunction, Request, Response } from 'express'
import Logger from '../../utils/logger.js'
import ApiError from '../../errors/api-error.js'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

  Logger.error(`Error occurred during request: ${req.method} ${req.originalUrl}`, err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }

  res.status(500).json({ error: 'Internal Server Error' });
}
