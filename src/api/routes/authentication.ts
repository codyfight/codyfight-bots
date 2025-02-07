import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config/env.js'

export function authenticate(req: Request, res: Response, next: NextFunction) {

  if (config.NODE_ENV === 'development') {
    return next()
  }

  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied' })
  }

  const token = header.split(' ')[1]

  jwt.verify(token, config.API_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' })
    }

    // Attach user info from token to the request object
    (req as any).user = decoded
    next()
  })
}
