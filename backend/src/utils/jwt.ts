import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type TokenPayload = {
  username: string;
};

/**
 * Signs a JWT token with the given payload and returns it as a string.
 * @param payload 
 * @returns A signed JWT token as a string.
 */
export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifies a JWT token and returns the decoded payload if valid, otherwise throws an error.
 * @param token 
 * @returns The decoded token payload.
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
