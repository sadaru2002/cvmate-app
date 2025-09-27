import { NextRequest, NextResponse } from "next/server";
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const maxDuration = 60;

const generatePDFFromURL = async (resumeData: any, baseUrl: string): Promise<Buffer> => {
  let browser;
  
  try {
    console.log('🚀 Starting Puppeteer browser for URL capture...');
    
    // Launch browser
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    
    // Set A4 page size
    await page.setViewport({ width: 794, height: 1123 });
    
    // Create a temporary preview URL with the resume data
    // We'll use the same preview-download page but in PDF mode
    const previewUrl = `${baseUrl}/api/render-template?template=${encodeURIComponent(resumeData?.template || 'TemplateOne')}&data=${encodeURIComponent(JSON.stringify(resumeData))}`;
    
    console.log('📄 Navigating to preview URL...');
    await page.goto(previewUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for the template to render
    await page.waitForSelector('#resume-template', { timeout: 10000 });
    
    // Generate PDF
    console.log('🖨️ Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    console.log('✅ PDF generated successfully');
    return Buffer.from(pdfBuffer);
    
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export async function POST(req: NextRequest) {
  console.log('🚀 API: generate-pdf-preview POST request received');
  
  try {
    const body = await req.json();
    const { resumeData, filename = "resume" } = body;

    if (!resumeData) {
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }

    // Get the base URL from the request
    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    
    // Generate PDF from preview URL
    const pdfBuffer = await generatePDFFromURL(resumeData, baseUrl);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
    
  } catch (error: any) {
    console.error("❌ PDF generation error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to generate PDF from preview",
      details: error?.message,
    }, { status: 500 });
  }
}