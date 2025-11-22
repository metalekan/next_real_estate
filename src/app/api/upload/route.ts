import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/config';

// Define the name of the cookie where the JWT is stored.
const TOKEN_COOKIE_NAME = 'authToken'; 


export async function POST(request: NextRequest) {
  try {
    let token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

    // Fallback to Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
   
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not Authorized' },
        { status: 401 } // Unauthorized
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'next-real-estate/properties';

    if (!file) {
        // console.log(file);
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
      // Pre-generate common sizes
      eager: [
        { width: 150, height: 150, crop: 'fill' },   // Thumbnail
        { width: 400, height: 300, crop: 'fill' },   // Card
        { width: 800, height: 600, crop: 'fill' },   // Detail
        { width: 1200, height: 800, crop: 'fill' },  // Full
      ],
      eager_async: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

// Delete image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 } // Unauthorized
      );
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Public ID required' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}