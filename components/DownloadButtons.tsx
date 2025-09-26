"use client"

import React, { useState } from 'react';
import { FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { saveAs } from 'file-saver';

// Lazy load client-side PDF generation
const loadClientPdfGenerator = async () => {
  const [jsPDF, html2canvas] = await Promise.all([
    import('jspdf').then(module => module.jsPDF),
    import('html2canvas')
  ]);
  return { jsPDF, html2canvas: html2canvas.default };
};

interface DownloadButtonsProps {
  resumeData: ResumeFormData;
  filename?: string;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  resumeData,
  filename = 'resume'
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    try {
      console.log('Starting PDF download...');
      
      // Get the HTML content from the preview element for identical rendering
      const resumeElement = document.getElementById('resume-template');
      if (!resumeElement) {
        throw new Error('Resume template not found. Please ensure the preview is loaded.');
      }

      try {
        // First try vector-based PDF generation (preserves text selection and links)
        await generatePdfVectorBased(resumeElement, filename);
        return;
      } catch (vectorError) {
        console.error('Vector PDF generation failed:', vectorError);
        toast.info('Trying alternative PDF generation method...');
      }

      // Fallback to server-side PDF generation
      const html = resumeElement.outerHTML;
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html }),
      });

      console.log('API Response status:', response.status);

      // Handle fallback scenario
      if (response.status === 503) {
        const errorData = await response.json();
        if (errorData.fallback) {
          console.log('Server suggested fallback, using client-side PDF generation...');
          return await generatePdfClientSide(resumeElement, filename);
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          
          // If it's a server-side generation error, try client-side fallback
          if (errorJson.error?.includes('serverless') || 
              errorJson.error?.includes('temporarily unavailable') ||
              errorJson.error?.includes('ETXTBSY')) {
            console.log('Server-side PDF failed, attempting client-side generation...');
            return await generatePdfClientSide(resumeElement, filename);
          }
          
          throw new Error(errorJson.error || `Server error: ${response.status}`);
        } catch {
          // Try client-side as final fallback for any server error
          console.log('Server error encountered, attempting client-side PDF generation as fallback...');
          try {
            return await generatePdfClientSide(resumeElement, filename);
          } catch (fallbackError) {
            throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
          }
        }
      }

      const blob = await response.blob();
      console.log('Received blob:', blob.type, blob.size);
      
      if (blob.type !== 'application/pdf') {
        console.error('Expected PDF, got:', blob.type);
        throw new Error('Invalid response type from PDF generation API.');
      }
      if (blob.size === 0) {
        throw new Error('Received empty PDF');
      }

      saveAs(blob, `${filename}.pdf`);
      toast.success('PDF downloaded successfully!');

    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(`Failed to download PDF: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const generatePdfVectorBased = async (resumeElement: HTMLElement, filename: string) => {
    try {
      toast.info('Generating high-quality PDF with selectable text and clickable links...');
      
      const htmlContent = resumeElement.outerHTML;
      
      const response = await fetch('/api/generate-pdf-vector', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          htmlContent,
          filename 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Vector PDF generation failed: ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      saveAs(blob, `${filename}.pdf`);
      toast.success('High-quality PDF generated! Text is selectable and links are clickable.');

    } catch (error) {
      console.error('Vector PDF generation failed:', error);
      throw error;
    }
  };

  const generatePdfClientSide = async (resumeElement: HTMLElement, filename: string) => {
    try {
      toast.info('Generating PDF using client-side method...');
      
      // Try a different approach: create a popup window with print styles
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        throw new Error('Pop-up blocked. Please allow pop-ups for this site.');
      }
      
      // Get all stylesheets from the current page
      const stylesheets = Array.from(document.styleSheets);
      let allStyles = '';
      
      stylesheets.forEach(stylesheet => {
        try {
          if (stylesheet.href && stylesheet.href.includes('tailwind')) {
            // Include Tailwind CSS
            allStyles += `<link rel="stylesheet" href="${stylesheet.href}">`;
          }
        } catch (e) {
          // Skip inaccessible stylesheets
        }
      });
      
      // Get inline styles and computed styles
      const computedStyles = window.getComputedStyle(resumeElement);
      
      const printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Resume PDF</title>
          <script src="https://cdn.tailwindcss.com"></script>
          ${allStyles}
          <style>
            * { 
              box-sizing: border-box; 
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            body { 
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: white;
              color: black;
            }
            
            @page { 
              size: A4; 
              margin: 0.5in; 
            }
            
            @media print {
              body { 
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              .no-print { display: none !important; }
              
              /* Preserve all colors and backgrounds */
              .bg-blue-100 { background-color: rgb(219, 234, 254) !important; }
              .bg-green-100 { background-color: rgb(220, 252, 231) !important; }
              .bg-purple-100 { background-color: rgb(243, 232, 255) !important; }
              .bg-yellow-100 { background-color: rgb(254, 249, 195) !important; }
              .bg-red-100 { background-color: rgb(254, 226, 226) !important; }
              
              .text-blue-800 { color: rgb(30, 64, 175) !important; }
              .text-green-800 { color: rgb(22, 101, 52) !important; }
              .text-purple-800 { color: rgb(107, 33, 168) !important; }
              .text-yellow-800 { color: rgb(133, 77, 14) !important; }
              .text-red-800 { color: rgb(153, 27, 27) !important; }
              
              .border-blue-500 { border-color: rgb(59, 130, 246) !important; }
              .border-green-500 { border-color: rgb(34, 197, 94) !important; }
            }
            
            /* Hide print button */
            .print-button { display: none; }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.print(); window.close();" class="print-button" 
                    style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              Print as PDF
            </button>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              Click "Print as PDF" and save as PDF. Text will be selectable and links clickable.
            </p>
          </div>
          ${resumeElement.outerHTML}
          <script>
            // Auto-trigger print dialog after a short delay
            setTimeout(() => {
              window.print();
            }, 1500);
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(printHtml);
      printWindow.document.close();
      
      toast.success('Print window opened! Use "Save as PDF" in the print dialog for selectable text and clickable links.');
      
    } catch (error) {
      console.error('Client-side PDF generation failed:', error);
      
      // Final fallback: use improved html2canvas method with better quality
      try {
        const { jsPDF, html2canvas } = await loadClientPdfGenerator();
        
        // Create a high-quality clone for PDF generation
        const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
        
        // Create a temporary high-resolution container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '210mm'; // A4 width
        tempContainer.style.maxWidth = '210mm';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '20px';
        tempContainer.style.zoom = '1.5'; // Increase resolution
        tempContainer.style.transform = 'scale(1)';
        
        // Improve text rendering
        clonedElement.style.width = '100%';
        (clonedElement.style as any).fontSmoothing = 'antialiased';
        (clonedElement.style as any).webkitFontSmoothing = 'antialiased';
        (clonedElement.style as any).textRendering = 'optimizeLegibility';
        
        tempContainer.appendChild(clonedElement);
        document.body.appendChild(tempContainer);
        
        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const canvas = await html2canvas(tempContainer, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: tempContainer.scrollWidth,
          height: tempContainer.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          removeContainer: false,
          imageTimeout: 30000,
          logging: false,
          onclone: (clonedDoc) => {
            // Ensure high quality rendering in clone
            const style = clonedDoc.createElement('style');
            style.textContent = `
              * {
                -webkit-font-smoothing: antialiased !important;
                font-smoothing: antialiased !important;
                text-rendering: optimizeLegibility !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        });
        
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png', 1.0); // Use PNG for better quality
        
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);
        
        const canvasRatio = canvas.height / canvas.width;
        let finalWidth = contentWidth;
        let finalHeight = contentWidth * canvasRatio;
        
        if (finalHeight > contentHeight) {
          finalHeight = contentHeight;
          finalWidth = contentHeight / canvasRatio;
        }
        
        const xOffset = margin + (contentWidth - finalWidth) / 2;
        const yOffset = margin;
        
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        pdf.save(`${filename}.pdf`);
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        toast.warning('PDF generated using image-based fallback. For selectable text and clickable links, please try again - the vector-based method should work.');
        
      } catch (fallbackError) {
        throw new Error('All PDF generation methods failed. Please try again later.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="gradient-glow"
        className="w-full"
        onClick={handleDownloadPdf}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <FileImage className="w-5 h-5 mr-2" />
        )}
        Download PDF
      </Button>
    </div>
  );
};