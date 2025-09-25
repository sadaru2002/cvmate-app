import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Function to find Microsoft Edge executable
function findEdge() {
  const possiblePaths = [
    // Windows Edge paths
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    `C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Microsoft\\Edge\\Application\\msedge.exe`,
    // Also try Chrome as fallback
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        console.log('Found browser at:', p);
        return p;
      }
    } catch (e) {
      // Continue to next path
    }
  }

  console.log('No browser found in common locations');
  return null;
}

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

    // Configure launch options for serverless or local environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    let launchOptions;

    if (isDevelopment) {
      // Development: Try to find local browser
      const browserPath = findEdge();
      console.log('Development mode - Using browser path:', browserPath || 'default browser');
      
      launchOptions = {
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
          '--no-first-run',
          '--disable-default-apps',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection'
        ],
        ...(browserPath && { executablePath: browserPath })
      };
    } else {
      // Production: Use serverless chromium
      console.log('Production mode - Using serverless chromium');
      launchOptions = {
        args: chromium.args,
        defaultViewport: { width: 1920, height: 1080 },
        executablePath: await chromium.executablePath(),
        headless: 'new' as const,
      };
    }

    console.log('Launching browser with options:', { 
      isDevelopment,
      headless: true 
    });

    // Launch browser
    browser = await puppeteer.launch(launchOptions);
    console.log('Browser launched successfully');

    const page = await browser.newPage();
    
    // Emulate print media type
    await page.emulateMediaType('print');

    // Set viewport to A4 size
    await page.setViewport({ 
      width: 794, 
      height: 1123,
      deviceScaleFactor: 1
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
              /* Removed overflow: hidden !important; to allow content to wrap */
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
            /* Removed overflow: hidden !important; from print media query as well */
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
    
    // TEMPORARY: Save a screenshot for debugging
    await page.screenshot({ path: 'debug_resume.png', fullPage: true });
    console.log('Screenshot saved to debug_resume.png');

    // Generate PDF with optimal settings
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false, // Let Puppeteer determine page size based on content and @page rules
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
        browserPath: findEdge(),
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