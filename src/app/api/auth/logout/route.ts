// app/api/auth/logout/route.ts
import { NextResponse, NextRequest } from 'next/server';

// Define the name of the cookie where the JWT is stored.
// NOTE: You must ensure this matches the name used by generateToken/session utility.
const TOKEN_COOKIE_NAME = 'authToken'; 

/**
 * Handles the logout process by deleting the authentication cookie.
 * @method GET
 * @returns {NextResponse} JSON response indicating success.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Create a response object
    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );

    // 2. Instruct the browser to delete the cookie by setting its value to empty
    //    and setting a past expiration date (maxAge: 0).
    response.cookies.set(TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict',
      maxAge: 0, // This is the key to expiring the cookie immediately
      path: '/', // Ensure the cookie is cleared across the whole site
    });

    return response;

  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during logout' },
      { status: 500 }
    );
  }
}

// NOTE: We use GET here because logout is generally an idempotent action (it just clears state)
// and doesn't require a request body, but POST is also acceptable.