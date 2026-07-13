import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export const signAccessToken = (payload: object): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
};

export const signRefreshToken = (payload: object): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string = env.JWT_SECRET): jwt.JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as jwt.JwtPayload;
  } catch {
    return null;
  }
};

// Kept for backward compatibility
export const signToken = signAccessToken;
