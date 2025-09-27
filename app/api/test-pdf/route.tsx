import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Simple health check for the PDF service
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "PDF service is running",
      environment: process.env.NODE_ENV || "development",
      version: "2.0.0-vercel-optimized"
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Simple test PDF generation with minimal data
    const testData = {
      profileInfo: {
        fullName: "Test User",
        designation: "Software Engineer",
        email: "test@example.com",
        phone: "+1234567890",
        summary: "This is a test resume generation."
      },
      workExperiences: [{
        role: "Software Engineer",
        company: "Test Company",
        startDate: "2020",
        endDate: "2024",
        description: "Worked on various projects"
      }],
      education: [{
        degree: "Bachelor of Science",
        institution: "Test University",
        startDate: "2016",
        endDate: "2020"
      }],
      skills: [
        { name: "JavaScript" },
        { name: "React" },
        { name: "Node.js" }
      ]
    };

    // For now, just return a simple success message
    // The actual PDF generation will be tested through the main endpoint
    return NextResponse.json({
      status: "test-ready",
      message: "Use the main /api/generate-pdf-react endpoint for actual PDF generation",
      testData: {
        profileInfo: testData.profileInfo,
        dataKeys: Object.keys(testData)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      status: "test-failed",
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}