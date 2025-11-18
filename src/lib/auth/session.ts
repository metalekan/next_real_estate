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

// export function verifyToken(token: string): JWTPayload | null {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
//     return decoded;
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return null;
//   }
// }

export const verifyToken = (token: string): Promise<any> => {
  // console.log(JWT_SECRET);
    return new Promise((resolve, reject) => {
        if (!JWT_SECRET) {
            return reject(new Error("JWT_SECRET is not defined."));
        }
        
        // jwt.verify automatically checks the signature and expiration time
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err); // This throws the error if the token is invalid or expired
            }
            resolve(decoded);
        });
    });
};

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// export const verifyToken = (token: string): Promise<any> => {
//     return new Promise((resolve, reject) => {
//         if (!JWT_SECRET) {
//             return reject(new Error("JWT_SECRET is not defined."));
//         }
        
//         // jwt.verify automatically checks the signature and expiration time
//         jwt.verify(token, JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return reject(err); // This throws the error if the token is invalid or expired
//             }
//             resolve(decoded);
//         });
//     });
// };