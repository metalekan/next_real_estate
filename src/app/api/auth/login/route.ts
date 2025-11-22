// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/mongodb/db';
import { generateToken } from '@/lib/auth/session'; // Assumed function to create the JWT
import { validateData, loginSchema } from '@/lib/utils/validation';

// Define the name of the cookie where the JWT will be stored
const TOKEN_COOKIE_NAME = 'authToken'; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validation and Database Check (Unchanged)
    const validation = validateData(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data!;
    await connectDB();
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 2. Generate Token
    const token = generateToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    // 3. Prepare User Response (without password)
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

    const response = NextResponse.json({
      success: true,
      data: userResponse,
    });

    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}