import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/db';
import Favorite from '@/lib/mongodb/models/Favorite';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

// GET /api/favorites/check/:propertyId - Check if property is favorited
export const GET = requireAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { propertyId: string } }
) => {
  try {
    await connectDB();

    const favorite = await Favorite.findOne({
      userId: request.user!.userId,
      propertyId: params.propertyId,
    });

    return NextResponse.json({
      success: true,
      data: {
        isFavorited: !!favorite,
        favoriteId: favorite?._id,
      },
    });
  } catch (error: any) {
    console.error('Check favorite error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
});
