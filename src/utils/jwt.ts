import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET: jwt.Secret = (process.env.JWT_SECRET as string) || 'change_this_secret';
const EXPIRES = process.env.JWT_EXPIRES_IN || '1h';

export const signToken = (payload: object): string => {
  return jwt.sign(payload as jwt.JwtPayload | string, SECRET, { expiresIn: EXPIRES as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, SECRET);
};
