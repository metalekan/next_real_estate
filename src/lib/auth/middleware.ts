import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './session';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ success: boolean; user?: JWTPayload; error?: string }> {
  // 1. Try header
  const authHeader = request.headers.get('authorization');
  let token = extractTokenFromHeader(authHeader || '');

  // 2. Try cookie
  if (!token) {
    const cookie = request.cookies.get('authToken');
    if (cookie) token = cookie.value;
  }

  if (!token) {
    return { success: false, error: 'No token provided' };
  }

  try {
    const user = await verifyToken(token);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Invalid or expired token' };
  }
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