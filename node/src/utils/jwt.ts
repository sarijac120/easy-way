import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import type { Secret } from 'jsonwebtoken';

// Get JWT secret and expiry from environment variables
const jwt_secret = (process.env.JWT_SECRET as Secret) || 'default_secret';
const jwt_expires_in = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a JWT token for a user
 * @param userId - MongoDB ObjectId of the user
 * @param role - User role
 * @returns JWT token string
 */
export const signToken = (
  userId: Types.ObjectId | string,
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN'
): string => {
  // Use 'as any' to bypass type issue with expiresIn string values like '7d'
  return jwt.sign(
    { userId: userId.toString(), role },
    jwt_secret,
    { expiresIn: jwt_expires_in } as any
  );
};

/**
 * Verify a JWT token and extract payload
 * @param token - JWT token string
 * @returns Decoded payload with userId and role
 */
export const verifyToken = (
  token: string
): { userId: string; role: 'PASSENGER' | 'DRIVER' | 'ADMIN' } => {
  return jwt.verify(token, jwt_secret) as {
    userId: string;
    role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  };
};
