import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose'; // Import mongoose

export async function PATCH(req: NextRequest) {
  const authResult = await verifyAuth(req);
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  const { userId } = authResult;

  const { name, email, profileImageUrl } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
  }

  try {
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
      { name, email, image: profileImageUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully', user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImageUrl: updatedUser.image
    } }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Error updating profile', error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  console.log('--- GET /api/auth/profile START ---');
  const authResult = await verifyAuth(req);
  if (authResult.error) {
    console.log('GET /api/auth/profile: Authentication failed:', authResult.error);
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  const { userId } = authResult;
  console.log('GET /api/auth/profile: Authenticated userId:', userId);

  try {
    await connectDB();
    console.log('GET /api/auth/profile: MongoDB connected.');

    const user = await User.findById(new mongoose.Types.ObjectId(userId)).select('-password'); // Convert userId to ObjectId
    if (!user) {
      console.log('GET /api/auth/profile: User not found for userId:', userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    console.log('GET /api/auth/profile: Found user:', user.email);

    console.log('--- GET /api/auth/profile END (Success) ---');
    return NextResponse.json({ user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.image
    } }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/auth/profile: Error fetching user profile:', error);
    console.log('--- GET /api/auth/profile END (Error) ---');
    return NextResponse.json({ message: 'Error fetching user profile', error: error.message }, { status: 500 });
  }
}