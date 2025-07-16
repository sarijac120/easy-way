import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
    isEmailVerified: boolean

  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Not authorized (missing token)' } });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token); // מחזיר { userId, role }

    // נטען את המשתמש מהמסד כולל אימות מייל
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    req.user = {
      _id: user._id as string,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
};

export const restrictTo = (...roles: ('PASSENGER' | 'DRIVER' | 'ADMIN')[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    next();
  };
