import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/db';
import Inquiry from '@/lib/mongodb/models/Inquiry';
import Property from '@/lib/mongodb/models/Property';
import { verifyToken } from '@/lib/auth/session';

// PATCH - Update inquiry status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['pending', 'contacted', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Find inquiry
    const inquiry = await Inquiry.findById(id).populate('property');
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Check authorization - only property owner/agent or admin can update
    const property = await Property.findById(inquiry.property);
    if (!property) {
      return NextResponse.json(
        { error: 'Associated property not found' },
        { status: 404 }
      );
    }

    if (
      property.agentId.toString() !== decoded.userId &&
      decoded.role !== 'admin'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to update this inquiry' },
        { status: 403 }
      );
    }

    // Update status
    inquiry.status = status;
    await inquiry.save();

    await inquiry.populate('property', 'title location price images');
    await inquiry.populate('user', 'name email');

    return NextResponse.json({
      message: 'Inquiry status updated successfully',
      inquiry
    });
  } catch (error: any) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// GET - Get single inquiry by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const { id } = params;

    // Find inquiry
    const inquiry = await Inquiry.findById(id)
      .populate('property', 'title location price images agentId')
      .populate('user', 'name email');

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Check authorization
    const canView =
      decoded.role === 'admin' ||
      // (inquiry.user && inquiry.user._id.toString() === decoded.userId) ||
      (inquiry.property as any).agentId.toString() === decoded.userId;

    if (!canView) {
      return NextResponse.json(
        { error: 'Unauthorized to view this inquiry' },
        { status: 403 }
      );
    }

    return NextResponse.json({ inquiry });
  } catch (error: any) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const { id } = params;

    // Find inquiry
    const inquiry = await Inquiry.findById(id).populate('property');
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Check authorization - only inquiry creator or admin can delete
    const canDelete =
      decoded.role === 'admin' ||
      (inquiry.user && inquiry.user.toString() === decoded.userId);

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this inquiry' },
        { status: 403 }
      );
    }

    await Inquiry.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Inquiry deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
