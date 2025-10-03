import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAuth } from '@/lib/auth';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose'; // Import mongoose

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  console.log('🔄 Image upload route called');
  
  const authResult = await verifyAuth(req);
  console.log('🔐 Auth result:', { 
    hasError: !!authResult.error, 
    hasUserId: !!authResult.userId,
    error: authResult.error,
    status: authResult.status 
  });
  
  if (authResult.error) {
    console.log('❌ Authentication failed:', authResult.error);
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  const { userId } = authResult;
  console.log('✅ Authentication successful, user ID:', userId);

  try {
    await connectDB();

    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ message: 'No image file provided' }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'cvmate_avatars',
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
      { image: (result as any).secure_url },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('✅ Image upload successful:', {
      profileImageUrl: (result as any).secure_url,
      userId: updatedUser._id
    });
    
    return NextResponse.json({ 
      message: 'Image uploaded successfully', 
      profileImageUrl: (result as any).secure_url, 
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImageUrl: updatedUser.image
      } 
    }, { status: 200 });
  } catch (error: any) {
    console.error('💥 Error uploading image:', error);
    console.error('💥 Error stack:', error.stack);
    return NextResponse.json({ 
      message: 'Error uploading image', 
      error: error.message 
    }, { status: 500 });
  }
}