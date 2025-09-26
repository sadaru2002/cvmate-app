import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer'; // Changed to standard puppeteer
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  let browser = null;
  
  try {
    const body = await req.json();
    const { html } = body;

    console.log('PDF generation started...');
    console.log('Content sizes - HTML:', html?.length);

    if (!html) {
      return NextResponse.json({ error: 'Missing html' }, { status: 400 });
    }

    const cssPath = path.join(process.cwd(), 'app', 'globals.css');
    let globalCss = '';
    try {
      globalCss = await fs.readFile(cssPath, 'utf8');
      console.log('Global CSS loaded successfully, size:', globalCss.length);
    } catch (cssError) {
      console.error('Failed to load global CSS:', cssError);
    }

    console.log('Launching Puppeteer Chromium...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Disable /dev/shm usage
        '--disable-gpu', // Disable GPU hardware acceleration
        '--no-zygote', // Disable the zygote process
        '--single-process', // Use a single process for the browser
        '--disable-web-security', // Disable web security (use with caution)
        '--font-render-hinting=none', // Disable font hinting for consistent rendering
      ],
      // executablePath: process.env.CHROME_EXECUTABLE_PATH || undefined, // Uncomment if you need to specify path
    });

    console.log('Browser launched successfully');

    const page = await browser.newPage();
    
    await page.emulateMedia({ media: 'print' });

    await page.setViewport({ 
      width: 794, // A4 width at 96 DPI
      height: 1123, // A4 height at 96 DPI
      deviceScaleFactor: 1, // Ensure 1:1 pixel ratio
    });
    
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume</title>
          <link href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400&display=swap" rel="stylesheet" font-display="swap">
          <style>
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              box-sizing: border-box !important;
              height: 100% !important;
            }
            * { 
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body { 
              font-family: 'Geist Sans', sans-serif !important;
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
            ${globalCss}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    
    console.log('Setting page content...');
    
    await page.setContent(fullHtml, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 60000
    });

    console.log('Content set, waiting for resources (fonts, images)...');

    await page.evaluate(() => {
      return Promise.all([
        document.fonts.ready,
        ...Array.from(document.images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
            setTimeout(resolve, 5000);
          });
        })
      ]);
    });

    await page.addStyleTag({
      content: `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 794px !important;
            min-height: 1123px !important;
            height: 100% !important;
          }
          
          .grid {
            display: grid !important;
          }
          
          .flex {
            display: flex !important;
          }
          
          #resume-template {
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }

          .resume-section {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
        }
        
        * {
          transform: none !important;
          transition: none !important;
          animation: none !important;
        }
      `
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    await page.evaluate(() => {
      document.body.offsetHeight;
      
      const layoutElements = document.querySelectorAll('[style*="display: flex"], [style*="display: grid"], .flex, .grid');
      layoutElements.forEach(el => {
        const style = (el as HTMLElement).style;
        const originalDisplay = style.display;
        style.display = 'none';
        (el as HTMLElement).offsetHeight;
        style.display = originalDisplay;
      });
    });
    
    console.log('Generating PDF...');
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '0mm',
        right: '0mm', 
        bottom: '0mm',
        left: '0mm'
      },
      displayHeaderFooter: false,
      timeout: 60000,
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