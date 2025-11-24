import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/mongodb/db';
import { requireAuth } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';

// GET /api/properties/my - Get properties for the authenticated user
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();

    const userId = request.user!.userId;

    // Find all properties created by this user
    const properties = await Property.find({ agentId: userId })
      .populate('agentId', 'name email phone avatar')
      .sort('-createdAt')
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: properties,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get my properties error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});
