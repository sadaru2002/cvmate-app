import { NextRequest, NextResponse } from 'next/server';
import playwright from 'playwright-aws-lambda';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Read the globals.css file for full styling consistency
    let cssContent = '';
    try {
      const cssPath = path.join(process.cwd(), 'app', 'globals.css');
      cssContent = await fs.readFile(cssPath, 'utf-8');
    } catch (error) {
      console.warn('Could not read globals.css:', error);
    }

    // Create complete HTML with Tailwind CDN and local styles
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume PDF</title>
  <!-- Tailwind CSS CDN for consistency -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Local styles from globals.css */
    ${cssContent}
    
    /* Additional print optimizations */
    @media print {
      body { -webkit-print-color-adjust: exact; }
      * { print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    // Generate PDF using Playwright
    const browser = await playwright.launchChromium({
      headless: true,
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewportSize({ width: 1200, height: 1600 });
    
    // Set content with complete HTML
    await page.setContent(fullHtml, { waitUntil: 'networkidle' });

    // Generate PDF with optimized settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    await browser.close();

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}
