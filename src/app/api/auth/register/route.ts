import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/mongodb/db';
import { generateToken } from '@/lib/auth/session';
import { validateData, registerSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  // console.log(connectDB);
  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role } = validation.data!;

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user',
    });

    // Generate token
    const token = generateToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

        // 💡 NEW FIELDS FOR PASSWORD RESET
  passwordResetToken: user.passwordResetToken,
  passwordResetExpires: user.passwordResetExpires,


    });

    // Return user without password
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
        data: {
          user: userResponse,
          token,
        },
        message: 'Registration successful',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}