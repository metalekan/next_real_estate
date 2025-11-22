import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/mongodb/db';
import { requireAuth, requireRole } from '@/lib/auth/middleware';
import { AuthenticatedRequest } from '@/lib/auth/middleware';

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const property = await Property.findById(params.id)
      .populate('agentId', 'name email phone avatar')
      .lean();

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Increment views
    await Property.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return NextResponse.json(
      {
        success: true,
        data: property,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get property error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update property (requires authentication)
export const PUT = requireAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();
    await connectDB();

    // Find property
    const property = await Property.findById(params.id);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if user is the owner or admin
    if (
      property.agentId.toString() !== request.user!.userId &&
      request.user!.role !== 'admin'
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to update this property' },
        { status: 403 }
      );
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('agentId', 'name email phone avatar');

    return NextResponse.json(
      {
        success: true,
        data: updatedProperty,
        message: 'Property updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update property error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// DELETE /api/properties/[id] - Delete property (requires authentication)
export const DELETE = requireAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    // Find property
    const property = await Property.findById(params.id);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if user is the owner or admin
    if (
      property.agentId.toString() !== request.user!.userId &&
      request.user!.role !== 'admin'
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to delete this property' },
        { status: 403 }
      );
    }

    // Soft delete - just set isActive to false
    await Property.findByIdAndUpdate(params.id, { isActive: false });

    return NextResponse.json(
      {
        success: true,
        message: 'Property deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete property error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});