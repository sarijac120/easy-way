import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const jwt_secret = process.env.JWT_SECRET as string;
const jwr_expires_in = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (
  userId: Types.ObjectId,
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN'
): string => {
  return jwt.sign({ userId, role }, jwt_secret, {
    expiresIn: jwr_expires_in,
  });
};

export const verifyToken = (
  token: string
): { userId: string; role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } => {
  return jwt.verify(token, jwt_secret) as {
    userId: string;
    role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  };
};
