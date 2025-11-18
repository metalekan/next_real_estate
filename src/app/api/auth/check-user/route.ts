// app/api/auth/check-auth/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/session'; // Assumed utility for JWT verification
import { connectDB, User } from '@/lib/mongodb/db';

// Define the name of the cookie where the JWT is stored.
const TOKEN_COOKIE_NAME = 'authToken'; 

/**
 * Checks for a valid authentication token in cookies and returns the user data.
 * @method GET
 * @returns {NextResponse} JSON response with user data or an error.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Retrieve the token from the secure cookie
    const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 } // Unauthorized
      );
    }

    // 2. Verify the token signature and extract the payload
    // The verifyToken utility uses the JWT_SECRET to check signature and expiration.
    const decodedPayload: any = await verifyToken(token); 
    // console.log(decodedPayload);
    if (!decodedPayload || !decodedPayload.userId) {
        // Token verification failed (expired, invalid signature)
        return NextResponse.json(
            { success: false, message: 'Invalid or expired token' },
            { status: 401 }
        );
    }
    
    // 3. (Optional but recommended) Fetch the latest user data from the database
    // This ensures the user hasn't been deactivated or changed roles since login.
    await connectDB();
    
    // Fetch the user data excluding the password field
    const user = await User.findById(decodedPayload.userId).select('-password');
    
    if (!user) {
        return NextResponse.json(
            { success: false, message: 'User not found' },
            { status: 404 }
        );
    }
    
    // 4. Return the clean user data
    const userResponse = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    return NextResponse.json(
      { 
        success: true, 
        data: { user: userResponse },
        message: 'User authenticated',
      },
      { status: 200 }
    );

  } catch (error: any) {
    // Catch errors thrown by jwt.verify (e.g., TokenExpiredError)
    console.error('Check Auth error:', error.message);
    
    // Return unauthorized for any authentication-related failure
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}