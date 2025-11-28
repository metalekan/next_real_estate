import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/db';
import Inquiry from '@/lib/mongodb/models/Inquiry';
import Property from '@/lib/mongodb/models/Property';
import { verifyToken } from '@/lib/auth/session';

// GET - Get inquiry statistics for agent/admin
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

    // Only agents and admins can view statistics
    if (decoded.role === 'user') {
      return NextResponse.json(
        { error: 'Unauthorized to view statistics' },
        { status: 403 }
      );
    }

    let query: any = {};

    // Agents can only see stats for their properties
    if (decoded.role === 'agent') {
      const agentProperties = await Property.find({ agentId: decoded.userId }).select('_id');
      const propertyIds = agentProperties.map(p => p._id);
      query.property = { $in: propertyIds };
    }
    // Admin can see all stats (no filter)

    // Get counts by status
    const [total, pending, contacted, closed] = await Promise.all([
      Inquiry.countDocuments(query),
      Inquiry.countDocuments({ ...query, status: 'pending' }),
      Inquiry.countDocuments({ ...query, status: 'contacted' }),
      Inquiry.countDocuments({ ...query, status: 'closed' })
    ]);

    // Get recent inquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = await Inquiry.countDocuments({
      ...query,
      createdAt: { $gte: sevenDaysAgo }
    });

    return NextResponse.json({
      statistics: {
        total,
        pending,
        contacted,
        closed,
        recentCount
      }
    });
  } catch (error: any) {
    console.error('Error fetching inquiry statistics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
