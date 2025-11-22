import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/db';
import Favorite from '@/lib/mongodb/models/Favorite';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth/middleware';

// GET /api/favorites - Get all favorites for the authenticated user
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();

    const favorites = await Favorite.find({ userId: request.user!.userId })
      .populate('propertyId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error: any) {
    console.error('Get favorites error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
});

// POST /api/favorites - Add a property to favorites
export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: request.user!.userId,
      propertyId,
    });

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'Property already in favorites' },
        { status: 409 }
      );
    }

    const favorite = await Favorite.create({
      userId: request.user!.userId,
      propertyId,
    });

    return NextResponse.json(
      {
        success: true,
        data: favorite,
        message: 'Property added to favorites',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add favorite error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
});

// DELETE /api/favorites - Remove a property from favorites
export const DELETE = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const favorite = await Favorite.findOneAndDelete({
      userId: request.user!.userId,
      propertyId,
    });

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Property removed from favorites',
    });
  } catch (error: any) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
});
