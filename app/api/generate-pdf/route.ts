import { NextRequest, NextResponse } from 'next/server';
import { launchChromium } from 'playwright-aws-lambda';
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
    let browser;
    let page;
    
    try {
      console.log('Launching browser...');
      browser = await launchChromium({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ]
      });

      console.log('Creating new page...');
      page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewportSize({ width: 1200, height: 1600 });
      
      console.log('Setting page content...');
      // Set content with complete HTML
      await page.setContent(fullHtml, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      console.log('Generating PDF...');
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

      console.log('PDF generated successfully, size:', pdfBuffer.length);
      return new NextResponse(pdfBuffer as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="resume.pdf"',
          'Content-Length': pdfBuffer.length.toString(),
        },
      });

    } catch (browserError) {
      console.error('Browser/PDF generation error:', browserError);
      throw browserError;
    } finally {
      // Ensure browser is always closed
      if (page) {
        try {
          await page.close();
        } catch (e) {
          console.warn('Error closing page:', e);
        }
      }
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.warn('Error closing browser:', e);
        }
      }
    }

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}
