import jwt from 'jsonwebtoken';
import { IUserResponse } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(user: IUserResponse): string {
  const payload: JWTPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

export const verifyToken = (token: string): Promise<JWTPayload> => {
    return new Promise((resolve, reject) => {
        if (!JWT_SECRET) {
            return reject(new Error("JWT_SECRET is not defined."));
        }
        
        // jwt.verify automatically checks the signature and expiration time
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Token verification error:', err);
                return reject(err);
            }
            
            // Ensure decoded token matches JWTPayload structure
            const payload = decoded as JWTPayload;
            // console.log('Decoded token payload:', payload);
            resolve(payload);
        });
    });
};

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}