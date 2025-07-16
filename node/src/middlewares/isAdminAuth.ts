import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

// Middleware to check if the user is an admin
export const isAdminAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: { message: 'Access denied: Admins only' } });
  }
  next();
};