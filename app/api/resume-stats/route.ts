import { NextRequest, NextResponse } from 'next/server';
import { resumeOptimizer } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { resumeData } = await request.json();
    
    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    const stats = await resumeOptimizer.generateStats(resumeData);
    
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    console.error('Resume stats generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate resume stats. Please try again.' },
      { status: 500 }
    );
  }
}