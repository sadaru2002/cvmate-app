import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(req: NextRequest) {
  // Set a timeout for the entire PDF generation process
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('PDF generation timeout - process took too long')), 120000); // 2 minutes
  });

  try {
    // Race between PDF generation and timeout
    return await Promise.race([
      generatePDF(req),
      timeoutPromise
    ]) as NextResponse;
  } catch (error) {
    console.error('PDF generation failed:', error);
    
    if (error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'PDF generation timed out', details: 'The process took too long. Please try again.' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}

async function generatePDF(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT;

    // Use embedded critical CSS instead of filesystem reading for serverless compatibility
    const criticalCss = `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      
      /* Critical styles for PDF generation */
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
          "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        * { 
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      }
    `;

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
    /* Critical CSS for PDF generation */
    ${criticalCss}
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
      const maxRetries = 5;
      let lastError;
      
      console.log(`Environment detected: ${isServerless ? 'Serverless' : 'Local'}`);

      // Try to launch browser with retries and exponential backoff
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Launching browser (attempt ${attempt}/${maxRetries})...`);
          
          // Configure for serverless environment
          const launchOptions = {
            args: isServerless ? [
              ...chromium.args,
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--single-process',
              '--no-zygote',
              '--disable-web-security',
            ] : [
              '--no-sandbox',
              '--disable-setuid-sandbox'
            ],
            defaultViewport: { width: 1200, height: 1600 },
            executablePath: isServerless 
              ? await chromium.executablePath({
                  cacheDir: '/tmp/.chromium',
                }) 
              : undefined, // Let puppeteer find Chrome locally
            headless: true,
            ignoreHTTPSErrors: true,
            // Additional Vercel-specific options
            ...(isServerless && {
              pipe: true,
              dumpio: false,
            }),
          };
          
          browser = await puppeteer.launch(launchOptions);
          
          console.log('Browser launched successfully');
          break; // Success, exit retry loop
          
        } catch (error) {
          lastError = error;
          console.error(`Browser launch attempt ${attempt} failed:`, error.message);
          
          // Force garbage collection between attempts if available
          if (global.gc) {
            try {
              global.gc();
              console.log('Forced garbage collection');
            } catch (e) {
              // Ignore gc errors
            }
          }
          
          // Special handling for Vercel/serverless path errors
          if (error.message?.includes('input directory') || error.message?.includes('pnpm') || error.message?.includes('node_modules')) {
            console.log('Detected Vercel file system error, trying alternative path...');
            
            // Try with alternative chromium configuration
            try {
              const altLaunchOptions = {
                args: isServerless ? [
                  ...chromium.args,
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                  '--disable-dev-shm-usage',
                  '--disable-gpu',
                  '--single-process',
                  '--no-zygote',
                  '--disable-web-security',
                ] : [
                  '--no-sandbox',
                  '--disable-setuid-sandbox'
                ],
                defaultViewport: { width: 1200, height: 1600 },
                executablePath: isServerless 
                  ? await chromium.executablePath('/tmp')
                  : undefined,
                headless: true,
                ignoreHTTPSErrors: true,
                ...(isServerless && {
                  pipe: true,
                  dumpio: false,
                }),
              };
              browser = await puppeteer.launch(altLaunchOptions);
              console.log('Browser launched successfully with alternative path');
              break;
            } catch (altError) {
              console.error('Alternative path also failed:', altError.message);
            }
          }
          
          // Special handling for ETXTBSY errors (binary busy)
          if (error.message?.includes('ETXTBSY') || error.message?.includes('spawn')) {
            console.log('Detected ETXTBSY/spawn error, using longer delay...');
          }
          
          if (attempt < maxRetries) {
            // Exponential backoff with jitter: 1s, 2s, 4s, 8s + random
            const baseDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            const jitter = Math.random() * 1000; // Add up to 1s random delay
            const delay = baseDelay + jitter;
            console.log(`Retrying in ${Math.round(delay)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (!browser) {
        console.error('All browser launch attempts failed. Last error:', lastError?.message);
        
        // If serverless Chromium completely fails, return a fallback response
        if (isServerless) {
          console.log('Chromium launch failed in serverless environment, suggesting client-side fallback');
          return NextResponse.json({
            error: 'SERVER_PDF_UNAVAILABLE',
            message: 'Server-side PDF generation temporarily unavailable. Switching to client-side generation.',
            fallback: true
          }, { status: 503 });
        }
        
        throw lastError || new Error('Failed to launch browser after all retries');
      }

      console.log('Creating new page...');
      page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 1600 });
      
      console.log('Setting page content...');
      // Set content with complete HTML
      await page.setContent(fullHtml, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      console.log('Generating PDF...');
      // Generate PDF with optimized settings
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
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
      
      // Check if this is a browser launch error
      if (browserError.message?.includes('ETXTBSY') || browserError.message?.includes('spawn')) {
        console.error('ETXTBSY error detected - browser binary is busy in serverless environment');
        throw new Error('PDF generation temporarily unavailable. Please try again in a moment. (Browser binary busy)');
      } else if (browserError.message?.includes('browserType.launch')) {
        console.error('Browser launch failed:', browserError.message);
        throw new Error('PDF generation service unavailable. Please try again later.');
      } else {
        throw browserError;
      }
    } finally {
      // Ensure browser is always closed with aggressive cleanup
      if (page) {
        try {
          console.log('Closing page...');
          await page.close();
        } catch (e) {
          console.warn('Error closing page:', e);
        }
      }
      if (browser) {
        try {
          console.log('Closing browser...');
          await browser.close();
          
          // Additional cleanup for serverless environments
          if (isServerless) {
            // Wait a moment for browser process to fully terminate
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (e) {
          console.warn('Error closing browser:', e);
        }
      }
      
      // Force garbage collection after cleanup if available
      if (global.gc && isServerless) {
        try {
          global.gc();
          console.log('Post-cleanup garbage collection performed');
        } catch (e) {
          // Ignore gc errors
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
