import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.API_SECRET || 'development';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied' });
  }

  const token = header.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {

    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }

    // Attach user info from token to the request object
    (req as any).user = decoded;
    next();
  });
}
