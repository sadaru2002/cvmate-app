import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resume from '@/lib/models/Resume';
import { verifyAuth } from '@/lib/auth';
import { resumeSchema } from '@/lib/validation/resume';
import mongoose from 'mongoose'; // Import mongoose

export async function POST(req: NextRequest) {
  const authResult = await verifyAuth(req);
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  const { userId } = authResult;

  try {
    await connectDB();

    const body = await req.json();
    const validatedData = resumeSchema.parse(body); // Validate incoming data

    const newResume = new Resume({
      ...validatedData,
      userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
    });

    await newResume.save();

    return NextResponse.json({ message: 'Resume created successfully', resume: newResume }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating resume:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating resume', error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  console.log('--- GET /api/resumes START ---');
  const authResult = await verifyAuth(req);
  if (authResult.error) {
    console.log('GET /api/resumes: Authentication failed:', authResult.error);
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  const { userId } = authResult;
  console.log('GET /api/resumes: Authenticated userId:', userId);

  try {
    await connectDB();
    console.log('GET /api/resumes: MongoDB connected.');

    const resumes = await Resume.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ updatedAt: -1 }); // Convert userId to ObjectId
    console.log('GET /api/resumes: Found resumes:', resumes.length);

    console.log('--- GET /api/resumes END (Success) ---');
    return NextResponse.json({ resumes }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/resumes: Error fetching resumes:', error);
    console.log('--- GET /api/resumes END (Error) ---');
    return NextResponse.json({ message: 'Error fetching resumes', error: error.message }, { status: 500 });
  }
}