import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

// For Vercel deployment, we'll use a different approach
// Since Puppeteer doesn't work reliably on Vercel serverless functions,
// we'll return the HTML and let the client handle PNG generation
const getTemplateHTML = async (resumeData: any): Promise<string> => {
  try {
    // Make internal API call to render-template
    const renderResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/render-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData }),
    });

    if (!renderResponse.ok) {
      throw new Error(`Template rendering failed: ${renderResponse.status}`);
    }

    const htmlContent = await renderResponse.text();
    return htmlContent;
  } catch (error) {
    console.error('Error fetching template HTML:', error);
    throw new Error('Failed to render template HTML');
  }
};

export async function POST(req: NextRequest) {
  console.log('🚀 API: generate-png POST request received');
  
  try {
    const body = await req.json();
    const { resumeData, filename = "resume" } = body;

    if (!resumeData) {
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }
    
    // Get the exact same HTML that's used in the preview
    const htmlContent = await getTemplateHTML(resumeData);

    // Return the HTML to be processed by the client
    // This avoids Puppeteer issues on Vercel
    return NextResponse.json({
      success: true,
      html: htmlContent,
      filename
    });
    
  } catch (error: any) {
    console.error("❌ PNG generation error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to generate PNG from preview",
      details: error?.message,
    }, { status: 500 });
  }
}