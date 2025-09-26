import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const maxDuration = 60; // Allow up to 60 seconds for PDF generation

export async function POST(req: NextRequest) {
  let browser = null;

  try {
    const { htmlContent, filename = 'resume' } = await req.json();

    if (!htmlContent) {
      return NextResponse.json(
        { success: false, error: 'HTML content is required' },
        { status: 400 }
      );
    }

    console.log('Starting vector PDF generation...');

    // Enhanced HTML with comprehensive styling for exact preview matching
    const enhancedHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume PDF</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 0.5in;
          }

          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          html, body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background: white;
            font-size: 14px;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }

          /* Preserve all Tailwind colors */
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-blue-100 { background-color: #dbeafe !important; }
          .bg-green-50 { background-color: #ecfdf5 !important; }
          .bg-green-100 { background-color: #dcfce7 !important; }
          .bg-purple-50 { background-color: #faf5ff !important; }
          .bg-purple-100 { background-color: #f3e8ff !important; }
          .bg-yellow-50 { background-color: #fefce8 !important; }
          .bg-yellow-100 { background-color: #fef3c7 !important; }
          .bg-red-50 { background-color: #fef2f2 !important; }
          .bg-red-100 { background-color: #fee2e2 !important; }
          .bg-indigo-50 { background-color: #eef2ff !important; }
          .bg-indigo-100 { background-color: #e0e7ff !important; }

          /* Text colors */
          .text-gray-900 { color: #111827 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-blue-600 { color: #2563eb !important; }
          .text-blue-700 { color: #1d4ed8 !important; }
          .text-blue-800 { color: #1e40af !important; }
          .text-green-600 { color: #16a34a !important; }
          .text-green-700 { color: #15803d !important; }
          .text-green-800 { color: #166534 !important; }
          .text-purple-600 { color: #9333ea !important; }
          .text-purple-700 { color: #7c3aed !important; }
          .text-purple-800 { color: #6b21a8 !important; }

          /* Border colors */
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-gray-300 { border-color: #d1d5db !important; }
          .border-blue-500 { border-color: #3b82f6 !important; }
          .border-green-500 { border-color: #10b981 !important; }
          .border-purple-500 { border-color: #8b5cf6 !important; }

          /* Layout utilities */
          .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
          .grid { display: grid; }
          .flex { display: flex; }
          .hidden { display: none; }
          .block { display: block; }
          .inline-block { display: inline-block; }

          /* Spacing */
          .p-4 { padding: 1rem !important; }
          .p-6 { padding: 1.5rem !important; }
          .p-8 { padding: 2rem !important; }
          .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
          .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .m-4 { margin: 1rem !important; }
          .mb-2 { margin-bottom: 0.5rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .mb-6 { margin-bottom: 1.5rem !important; }
          .mr-2 { margin-right: 0.5rem !important; }
          .mt-4 { margin-top: 1rem !important; }

          /* Typography */
          .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
          .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
          .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
          .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
          .font-medium { font-weight: 500 !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-bold { font-weight: 700 !important; }

          /* Border utilities */
          .border { border-width: 1px !important; }
          .border-2 { border-width: 2px !important; }
          .border-t { border-top-width: 1px !important; }
          .border-b { border-bottom-width: 1px !important; }
          .border-l { border-left-width: 1px !important; }
          .border-r { border-right-width: 1px !important; }
          .rounded { border-radius: 0.25rem !important; }
          .rounded-lg { border-radius: 0.5rem !important; }
          .rounded-full { border-radius: 9999px !important; }

          /* Flexbox */
          .justify-between { justify-content: space-between !important; }
          .justify-center { justify-content: center !important; }
          .items-center { align-items: center !important; }
          .items-start { align-items: flex-start !important; }
          .flex-col { flex-direction: column !important; }
          .flex-wrap { flex-wrap: wrap !important; }
          .gap-2 { gap: 0.5rem !important; }
          .gap-4 { gap: 1rem !important; }

          /* Width/Height */
          .w-full { width: 100% !important; }
          .w-auto { width: auto !important; }
          .h-full { height: 100% !important; }
          .max-w-4xl { max-width: 56rem !important; }
          .min-h-screen { min-height: 100vh !important; }

          /* Position */
          .relative { position: relative !important; }
          .absolute { position: absolute !important; }
          .static { position: static !important; }

          /* Text alignment */
          .text-left { text-align: left !important; }
          .text-center { text-align: center !important; }
          .text-right { text-align: right !important; }

          /* Links should be clickable and styled */
          a {
            color: #2563eb !important;
            text-decoration: underline !important;
            cursor: pointer !important;
          }
          
          a:hover {
            color: #1d4ed8 !important;
            text-decoration: underline !important;
          }

          /* Ensure all text is selectable */
          * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
          }

          /* Print optimizations */
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            a {
              color: #2563eb !important;
              text-decoration: underline !important;
            }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    // Configure Puppeteer for both development and production
    let browser;
    
    if (process.env.NODE_ENV === 'production') {
      // Production: Use @sparticuz/chromium
      browser = await puppeteer.launch({
        args: [...chromium.args, '--disable-dev-shm-usage'],
        defaultViewport: { width: 1200, height: 1600 },
        executablePath: await chromium.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true,
      });
    } else {
      // Development: Use regular puppeteer with local Chrome
      try {
        const puppeteerRegular = await import('puppeteer');
        browser = await puppeteerRegular.default.launch({
          headless: true,
          defaultViewport: { width: 1200, height: 1600 },
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
          ignoreHTTPSErrors: true,
        });
      } catch (devError) {
        console.log('Regular puppeteer not available, trying puppeteer-core with manual Chrome path...');
        
        // Fallback to puppeteer-core with manual Chrome paths
        const possiblePaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser'
        ];
        
        let executablePath = null;
        for (const path of possiblePaths) {
          try {
            const fs = require('fs');
            if (fs.existsSync(path)) {
              executablePath = path;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (!executablePath) {
          throw new Error('Chrome/Chromium not found. Please install Google Chrome or set CHROME_EXECUTABLE_PATH environment variable.');
        }
        
        browser = await puppeteer.launch({
          executablePath,
          headless: true,
          defaultViewport: { width: 1200, height: 1600 },
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
          ignoreHTTPSErrors: true,
        });
      }
    }

    console.log('Browser launched successfully');

    console.log('Creating new page...');
    const page = await browser.newPage();
    
    // Set content and wait for fonts
    await page.setContent(enhancedHtml, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000 
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Additional wait for rendering
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
      preferCSSPageSize: true,
      tagged: true, // This enables text selection and accessibility
      displayHeaderFooter: false,
      scale: 1.0, // Exact scale for precise matching
      waitForFonts: true, // Wait for web fonts
    });

    console.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Vector PDF generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });

  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
}