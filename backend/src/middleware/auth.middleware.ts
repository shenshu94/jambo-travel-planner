import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  // If no Authorization header is present, return 401 Unauthorized
  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const [scheme, token] = authorization.split(' ');

  // If the Authorization header does not follow the "Bearer <token>" format, return 401 Unauthorized
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
