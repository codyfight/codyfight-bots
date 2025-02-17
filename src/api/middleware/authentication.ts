import config from '../../config/env.js'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

/**
 * Basic Authentication Middleware
 * Protects the index page by requiring a username & password.
 */
export function basicAuthMiddleware(req: Request, res : Response, next : NextFunction) {

  if(config.NODE_ENV === 'development') return next()

  const authUser = config.USER;
  const authPass = config.PASSWORD;

  const authHeader = req.headers.authorization || '';
  const base64Credentials = authHeader.split(' ')[1] || '';
  const credentials = Buffer.from(base64Credentials, 'base64').toString().split(':');
  const user = credentials[0];
  const pass = credentials[1];


  if (user === authUser && pass === authPass) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Protected"');
  return res.status(401).send('Authentication required to access this page.');
}

/**
 * JWT Authentication Middleware
 * Protects API routes by requiring a valid Bearer token.
 */
export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (config.NODE_ENV === 'development') return next();

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
