import { NextRequest, NextResponse } from 'next/server';
import { launchChromium } from 'playwright-aws-lambda'; // For Vercel production
import * as playwright from 'playwright-core'; // For local development

export async function POST(req: NextRequest) {
  let browser = null;
  
  try {
    const body = await req.json();
    const { html, css } = body;

    console.log('PDF generation started...');
    console.log('Content sizes - HTML:', html?.length, 'CSS:', css?.length);

    // Validate input
    if (!html || !css) {
      return NextResponse.json({ error: 'Missing html or css' }, { status: 400 });
    }

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log('Development mode - Launching local Playwright Chromium');
      browser = await playwright.chromium.launch({
        headless: true,
        // You might need to specify executablePath for local dev if Playwright can't find it
        // For example: executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' on macOS
        // Playwright usually handles this automatically if Chrome/Chromium is installed.
      });
    } else {
      console.log('Production mode - Launching playwright-aws-lambda Chromium');
      browser = await launchChromium({
        headless: true, // Always headless in serverless
      });
    }

    console.log('Browser launched successfully');

    const page = await browser.newPage();
    
    // Emulate print media type
    await page.emulateMedia({ media: 'print' }); // Playwright equivalent

    // Set viewport to A4 size
    await page.setViewportSize({ 
      width: 794, // A4 width at 96 DPI
      height: 1123, // A4 height at 96 DPI
    });
    
    // Create complete HTML with better CSS handling and font imports
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume</title>
          <!-- Explicitly import Geist Sans and Geist Mono from Google Fonts -->
          <link href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400&display=swap" rel="stylesheet" font-display="swap">
          <style>
            /* Aggressive reset for html and body to prevent unwanted margins/padding */
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              box-sizing: border-box !important;
              height: 100% !important; /* Ensure html and body take full height */
            }
            * { 
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body { 
              font-family: 'Geist Sans', sans-serif !important; /* Use Geist Sans as primary font */
              background: white !important;
              color: black !important;
              font-size: 14px !important;
              line-height: 1.5 !important;
              width: 794px !important;
              min-height: 1123px !important;
            }
            @page {
              size: A4;
              margin: 0;
            }
            /* Include the extracted CSS */
            ${css}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    
    console.log('Setting page content...');
    
    // Set content with extended timeout
    await page.setContent(fullHtml, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 60000 // 60 second timeout
    });

    console.log('Content set, waiting for resources (fonts, images)...');

    // Wait for fonts and images to load
    await page.evaluate(() => {
      return Promise.all([
        document.fonts.ready, // Wait for all @font-face to be loaded
        ...Array.from(document.images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
            // Timeout individual images after 5 seconds to prevent indefinite waiting
            setTimeout(resolve, 5000);
          });
        })
      ]);
    });

    // Add print-specific styles and layout stabilization
    await page.addStyleTag({
      content: `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important; /* Ensure consistent box model */
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 794px !important;
            min-height: 1123px !important;
            height: 100% !important; /* Ensure html and body take full height in print media */
          }
          
          /* Force consistent measurements */
          .grid {
            display: grid !important;
          }
          
          .flex {
            display: flex !important;
          }
          
          /* Ensure the root resume element takes full height */
          #resume-template-for-download { /* Assuming RESUME_ELEMENT_ID is defined and passed correctly */
            height: 100% !important;
            display: flex !important; /* Ensure it's a flex container if its children use flex/height */
            flex-direction: column !important;
          }

          /* Prevent page breaks in critical areas */
          .resume-section {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important; /* Also avoid breaking after a section */
            page-break-before: avoid !important; /* Also avoid breaking before a section */
          }
        }
        
        /* Layout stabilization: Remove animations/transitions that might interfere with static rendering */
        * {
          transform: none !important;
          transition: none !important;
          animation: none !important;
        }
      `
    });

    // A final, longer wait to ensure all rendering and layout calculations are complete
    await new Promise(resolve => setTimeout(resolve, 5000)); // Increased wait time to 5 seconds

    // Force layout recalculation (reflow)
    await page.evaluate(() => {
      document.body.offsetHeight; // Trigger reflow
      
      // Re-apply display properties for flex/grid elements to ensure correct calculation
      const layoutElements = document.querySelectorAll('[style*="display: flex"], [style*="display: grid"], .flex, .grid');
      layoutElements.forEach(el => {
        const style = (el as HTMLElement).style;
        const originalDisplay = style.display;
        style.display = 'none'; // Temporarily hide
        (el as HTMLElement).offsetHeight; // Trigger reflow
        style.display = originalDisplay; // Restore display
      });
    });
    
    console.log('Generating PDF...');
    
    // Generate PDF with optimal settings
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false, // Let Playwright determine page size based on content and @page rules
      margin: {
        top: '0mm',
        right: '0mm', 
        bottom: '0mm',
        left: '0mm'
      },
      displayHeaderFooter: false,
      timeout: 60000, // 60 second timeout for PDF generation
    });
    
    console.log('PDF generated successfully, size:', pdf.length, 'bytes');
    
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Content-Length': pdf.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    
  } catch (error: any) {
    console.error('PDF generation error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'PDF generation failed', 
        message: error.message,
        details: 'Check server console for detailed error information',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed successfully');
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
}