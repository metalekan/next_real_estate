import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './session';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ success: boolean; user?: JWTPayload; error?: string }> {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader || '');

  if (!token) {
    return { success: false, error: 'No token provided' };
  }

  const user = verifyToken(token);

  if (!user) {
    return { success: false, error: 'Invalid or expired token' };
  }

  return { success: true, user };
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const authResult = await authenticateRequest(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Attach user to request
    (request as AuthenticatedRequest).user = authResult.user;

    return handler(request, context);
  };
}

export function requireRole(...roles: string[]) {
  return (handler: Function) => {
    return async (request: NextRequest, context?: any) => {
      const authResult = await authenticateRequest(request);

      if (!authResult.success) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      if (!roles.includes(authResult.user!.role)) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Insufficient permissions' },
          { status: 403 }
        );
      }

      (request as AuthenticatedRequest).user = authResult.user;

      return handler(request, context);
    };
  };
}