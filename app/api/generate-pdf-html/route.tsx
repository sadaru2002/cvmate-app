import { NextRequest, NextResponse } from "next/server";
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const maxDuration = 60;

// HTML template that recreates the preview page structure
const createPreviewHTML = (resumeData: any) => {
  // Extract template component based on selected template
  const getTemplateHTML = (data: any, template: string, colorPalette: string[]) => {
    // This will be populated with the actual template HTML
    // For now, return a placeholder that matches the structure
    return `
      <div id="resume-template" class="bg-white text-gray-900 w-full h-full p-8">
        <!-- Template content will be rendered here -->
        <div class="template-${template.toLowerCase()}" style="--color-1: ${colorPalette[0]}; --color-2: ${colorPalette[1]}; --color-3: ${colorPalette[2]}; --color-4: ${colorPalette[3]}; --color-5: ${colorPalette[4]};">
          <!-- Content will be dynamically generated based on template -->
        </div>
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume PDF</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: white;
        }
        .a4-page {
          width: 210mm;
          height: 297mm;
          overflow: hidden;
        }
        /* Custom CSS variables for dynamic colors */
        :root {
          --template-color-1: ${resumeData?.colorPalette?.[0] || '#EBFDFF'};
          --template-color-2: ${resumeData?.colorPalette?.[1] || '#A1FAFD'};
          --template-color-3: ${resumeData?.colorPalette?.[2] || '#ACEAFE'};
          --template-color-4: ${resumeData?.colorPalette?.[3] || '#008899'};
          --template-color-5: ${resumeData?.colorPalette?.[4] || '#4A5568'};
        }
      </style>
    </head>
    <body>
      <div class="a4-page">
        ${getTemplateHTML(resumeData, resumeData?.template || 'TemplateOne', resumeData?.colorPalette || ['#EBFDFF', '#A1FAFD', '#ACEAFE', '#008899', '#4A5568'])}
      </div>
    </body>
    </html>
  `;
};

const generateHTMLToPDF = async (resumeData: any): Promise<Buffer> => {
  let browser;
  
  try {
    // Configure Puppeteer for Vercel
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    // Set page size to A4
    await page.setViewport({ width: 794, height: 1123 }); // A4 in pixels at 96 DPI
    
    // Generate HTML content
    const htmlContent = createPreviewHTML(resumeData);
    
    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF with A4 format
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      }
    });

    return Buffer.from(pdfBuffer);
    
  } catch (error) {
    console.error('HTML to PDF generation error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export async function POST(req: NextRequest) {
  console.log('API: generate-pdf-html POST request received.');
  
  try {
    const body = await req.json();
    const { resumeData, filename = "resume" } = body;

    console.log('API: Request body keys:', Object.keys(body || {}));
    console.log('API: Template:', resumeData?.template);
    console.log('API: Color palette:', resumeData?.colorPalette);

    if (!resumeData) {
      console.error('API: Resume data is missing from request body');
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }

    // Generate PDF using HTML to PDF conversion
    console.log('API: Starting HTML to PDF generation...');
    const pdfBuffer = await generateHTMLToPDF(resumeData);
    console.log('API: PDF generation completed successfully, size:', pdfBuffer.length);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
    
  } catch (error: any) {
    console.error("API: HTML to PDF generation error:", error);
    console.error("API: Error message:", error?.message);
    console.error("API: Error stack:", error?.stack);
    
    return NextResponse.json({
      success: false,
      error: "Failed to generate PDF from HTML",
      details: error?.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}