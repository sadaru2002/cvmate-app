import { NextRequest, NextResponse } from 'next/server';
import { resumeOptimizer } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobDescription } = await request.json();
    
    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume data and job description are required' },
        { status: 400 }
      );
    }

    if (jobDescription.length < 50) {
      return NextResponse.json(
        { error: 'Job description is too short. Please provide a detailed job posting.' },
        { status: 400 }
      );
    }

    const analysis = await resumeOptimizer.analyzeResumeForJob(resumeData, jobDescription);
    
    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Resume optimization error:', error);
    // Return the specific error message from the Gemini service
    return NextResponse.json(
      { error: error.message || 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}