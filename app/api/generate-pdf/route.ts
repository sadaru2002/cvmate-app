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
      
      /* Exact preview styles */
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
          "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: white;
        color: inherit;
      }
      
      /* Preserve exact layout from preview */
      #resume-template {
        width: 100% !important;
        max-width: none !important;
        height: auto !important;
        overflow: visible !important;
        position: relative !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }
      
      /* Maintain all Tailwind classes as-is */
      .max-w-4xl { max-width: 56rem !important; }
      .mx-auto { margin-left: auto !important; margin-right: auto !important; }
      .bg-white { background-color: rgb(255, 255, 255) !important; }
      .p-8 { padding: 2rem !important; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important; }
      
      .mb-6 { margin-bottom: 1.5rem !important; }
      .mb-4 { margin-bottom: 1rem !important; }
      .mb-2 { margin-bottom: 0.5rem !important; }
      .mb-3 { margin-bottom: 0.75rem !important; }
      .mt-2 { margin-top: 0.5rem !important; }
      
      .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
      .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
      .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
      .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
      
      .font-bold { font-weight: 700 !important; }
      .font-semibold { font-weight: 600 !important; }
      .font-medium { font-weight: 500 !important; }
      
      .text-gray-800 { color: rgb(31 41 55) !important; }
      .text-gray-700 { color: rgb(55 65 81) !important; }
      .text-gray-600 { color: rgb(75 85 99) !important; }
      .text-gray-500 { color: rgb(107 114 128) !important; }
      
      .text-blue-500 { color: rgb(59 130 246) !important; }
      .text-green-500 { color: rgb(34 197 94) !important; }
      .text-blue-800 { color: rgb(30 64 175) !important; }
      .text-green-800 { color: rgb(22 101 52) !important; }
      .text-purple-800 { color: rgb(107 33 168) !important; }
      .text-yellow-800 { color: rgb(133 77 14) !important; }
      .text-red-800 { color: rgb(153 27 27) !important; }
      
      .bg-blue-100 { background-color: rgb(219 234 254) !important; }
      .bg-green-100 { background-color: rgb(220 252 231) !important; }
      .bg-purple-100 { background-color: rgb(243 232 255) !important; }
      .bg-yellow-100 { background-color: rgb(254 249 195) !important; }
      .bg-red-100 { background-color: rgb(254 226 226) !important; }
      
      .border-b-2 { border-bottom-width: 2px !important; }
      .border-blue-500 { border-color: rgb(59 130 246) !important; }
      .border-green-500 { border-color: rgb(34 197 94) !important; }
      .pb-1 { padding-bottom: 0.25rem !important; }
      
      .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
      .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
      .rounded-full { border-radius: 9999px !important; }
      
      .flex { display: flex !important; }
      .flex-wrap { flex-wrap: wrap !important; }
      .gap-2 { gap: 0.5rem !important; }
      
      .list-disc { list-style-type: disc !important; }
      .ml-5 { margin-left: 1.25rem !important; }
      
      /* Links should remain clickable */
      a {
        color: inherit !important;
        text-decoration: none !important;
      }
      
      a:hover {
        text-decoration: underline !important;
      }
      
      @media print {
        body { 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        * { 
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        @page {
          size: A4;
          margin: 0.5in;
        }
        
        /* Remove shadows for print */
        .shadow-lg {
          box-shadow: none !important;
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
              ? await chromium.executablePath() 
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
      
      // Wait additional time for fonts and rendering to complete
      console.log('Waiting for rendering to complete...');
      await page.waitForTimeout(2000);
      
      // Add CSS to fix any remaining layout issues
      await page.addStyleTag({
        content: `
          body { zoom: 1 !important; }
          * { 
            visibility: visible !important; 
            opacity: 1 !important;
            position: relative !important;
          }
        `
      });

      console.log('Generating PDF...');
      // Generate PDF with optimized settings for text preservation
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        // Preserve text selectability and quality
        scale: 1.0, // Keep original scale for exact match
        preferCSSPageSize: false,
        displayHeaderFooter: false,
        // Enable text selection and links
        tagged: true, // Enable for accessibility and text selection
        outline: false, // Disable outline to reduce file size
        // Ensure links remain clickable
        omitBackground: false,
        waitForFonts: true
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
