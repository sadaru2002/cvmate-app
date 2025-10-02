import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resume from '@/lib/models/Resume';
import { verifyAuth } from '@/lib/auth';
import { resumeSchema } from '@/lib/validation/resume';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('--- GET /api/resumes/[id] START ---');
  const authResult = await verifyAuth(req);
  if (authResult.error) {
    console.log('GET /api/resumes/[id]: Authentication failed:', authResult.error);
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  const { userId } = authResult;
  const { id } = params;
  console.log('GET /api/resumes/[id]: Authenticated userId:', userId, 'Requested resume ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('GET /api/resumes/[id]: Invalid resume ID format:', id);
    return NextResponse.json({ message: 'Invalid resume ID format' }, { status: 400 });
  }

  try {
    await connectDB();
    console.log('GET /api/resumes/[id]: MongoDB connected.');

    const resume = await Resume.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) }); // Convert userId to ObjectId

    if (!resume) {
      console.log('GET /api/resumes/[id]: Resume not found or unauthorized for ID:', id, 'and userId:', userId);
      return NextResponse.json({ message: 'Resume not found or unauthorized' }, { status: 404 });
    }
    console.log('GET /api/resumes/[id]: Found resume with title:', resume.title);

    console.log('--- GET /api/resumes/[id] END (Success) ---');
    return NextResponse.json({ resume }, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/resumes/[id]: Error fetching resume:', error);
    console.log('--- GET /api/resumes/[id] END (Error) ---');
    return NextResponse.json({ message: 'Error fetching resume', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await verifyAuth(req);
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  const { userId } = authResult;
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid resume ID format' }, { status: 400 });
  }

  try {
    await connectDB();

    const body = await req.json();
    console.log("PATCH /api/resumes/[id]: Received body for update:", body);
    const validatedData = resumeSchema.partial().parse(body);

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) }, // Convert userId to ObjectId
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return NextResponse.json({ message: 'Resume not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resume updated successfully', resume: updatedResume }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating resume:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating resume', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await verifyAuth(req);
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }
  const { userId } = authResult;
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid resume ID format' }, { status: 400 });
  }

  try {
    await connectDB();

    const deletedResume = await Resume.findOneAndDelete({ _id: id, userId: new mongoose.Types.ObjectId(userId) }); // Convert userId to ObjectId

    if (!deletedResume) {
      return NextResponse.json({ message: 'Resume not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resume deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting resume:', error);
    return NextResponse.json({ message: 'Error deleting resume', error: error.message }, { status: 500 });
  }
}