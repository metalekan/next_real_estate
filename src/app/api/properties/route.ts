import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/mongodb/db';
import { requireAuth, requireRole } from '@/lib/auth/middleware';
import { validateData, propertySchema } from '@/lib/utils/validation';
import { AuthenticatedRequest } from '@/lib/auth/middleware';

// GET /api/properties - Get all properties with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Build filter query
    const filter: any = { isActive: true };

    // Type filter
    const type = searchParams.get('type');
    if (type) filter.type = type;

    // Status filter
    const status = searchParams.get('status');
    if (status) filter.status = status;

    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Bedrooms filter
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) filter['features.bedrooms'] = { $gte: Number(bedrooms) };

    // Bathrooms filter
    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms) filter['features.bathrooms'] = { $gte: Number(bathrooms) };

    // Location filters
    const city = searchParams.get('city');
    if (city) filter['location.city'] = new RegExp(city, 'i');

    const state = searchParams.get('state');
    if (state) filter['location.state'] = new RegExp(state, 'i');

    // Text search
    const search = searchParams.get('search');
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    // Sorting
    const sort = searchParams.get('sort') || '-createdAt';

    // Execute query
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('agent', 'name email phone avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          properties,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get properties error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property (requires authentication)
export const POST = requireRole('agent', 'admin')(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateData(propertySchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    await connectDB();

    // Create property with authenticated user as agent
    const property = await Property.create({
      ...validation.data,
      agent: request.user!.userId,
    });

    // Populate agent details
    await property.populate('agent', 'name email phone avatar');

    return NextResponse.json(
      {
        success: true,
        data: property,
        message: 'Property created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create property error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
});