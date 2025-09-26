import { renderToBuffer } from '@react-pdf/renderer';
// ...existing imports...

export default async function handler(req, res) {
  try {
    // ...existing code...

    // Generate PDF with error handling and retries
    let pdfBuffer;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        pdfBuffer = await renderToBuffer(
          <PDFDocument {...pdfProps} />,
          {
            // Use safe font configuration
            fontCallback: (font) => {
              // Skip problematic fonts that might cause buffer issues
              if (font && font.data && font.data.byteLength > 10485760) { // 10MB limit
                console.warn('Font too large, skipping:', font.name);
                return null;
              }
              return font;
            }
          }
        );
        break; // Success, exit retry loop
      } catch (fontError) {
        attempts++;
        console.warn(`PDF generation attempt ${attempts} failed:`, fontError.message);
        
        if (attempts >= maxAttempts) {
          // Final attempt with minimal font configuration
          try {
            pdfBuffer = await renderToBuffer(
              <PDFDocumentFallback {...pdfProps} />,
              { 
                // Disable font subsetting which can cause buffer issues
                fontSubsetting: false,
                compress: false
              }
            );
          } catch (fallbackError) {
            throw new Error(`PDF generation failed after ${maxAttempts} attempts: ${fallbackError.message}`);
          }
        }
      }
    }

    // ...existing response code...
  } catch (error) {
    console.error('PDF Generation Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}