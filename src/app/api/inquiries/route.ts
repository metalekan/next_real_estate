import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/db';
import Inquiry from '@/lib/mongodb/models/Inquiry';
import Property from '@/lib/mongodb/models/Property';
import { verifyToken } from '@/lib/auth/session';

// POST - Create a new inquiry
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { propertyId, name, email, phone, message } = body;

    // Validate required fields
    if (!propertyId || !name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Get user from token if authenticated (optional)
    let userId = null;
    const token = request.cookies.get('authToken')?.value;
    if (token) {
      try {
        const decoded = await verifyToken(token);
        userId = decoded.userId;
      } catch (error) {
        // User not authenticated, continue without userId
      }
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      property: propertyId,
      user: userId,
      name,
      email,
      phone,
      message,
      status: 'pending'
    });

    // Populate property details
    await inquiry.populate('property', 'title location price');

    return NextResponse.json(
      {
        message: 'Inquiry submitted successfully',
        inquiry
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

// GET - Get inquiries (user's own inquiries or all if admin/agent)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');

    let query: any = {};

    // If propertyId is provided, get inquiries for that property
    if (propertyId) {
      query.property = propertyId;
      
      // Only property owner/agent can view property inquiries
      const property = await Property.findById(propertyId);
      if (!property) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }

      if (property.agentId.toString() !== decoded.userId && decoded.role !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized to view these inquiries' },
          { status: 403 }
        );
      }
    } else {
      // Regular users can only see their own inquiries
      if (decoded.role === 'user') {
        query.user = decoded.userId;
      }
      // Agents and admins can see all inquiries for their properties
      else if (decoded.role === 'agent') {
        const agentProperties = await Property.find({ agentId: decoded.userId }).select('_id');
        const propertyIds = agentProperties.map(p => p._id);
        query.property = { $in: propertyIds };
      }
      // Admin can see all inquiries (no additional filter)
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title location price images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // console.log(inquiries);

    return NextResponse.json({
      inquiries,
      count: inquiries.length
    });
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
