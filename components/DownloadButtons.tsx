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
      console.log('Starting PDF download using server-side generation...');
      
      // Get the HTML content from the preview element for identical rendering
      const resumeElement = document.getElementById('resume-template');
      if (!resumeElement) {
        throw new Error('Resume template not found. Please ensure the preview is loaded.');
      }

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

  const generatePdfClientSide = async (resumeElement: HTMLElement, filename: string) => {
    try {
      toast.info('Generating PDF using client-side method...');
      
      const { jsPDF, html2canvas } = await loadClientPdfGenerator();
      
      // Create a clean clone of the resume element for PDF generation
      const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
      
      // Create a temporary container for clean rendering
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.maxWidth = '210mm';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000';
      
      // Apply clean styles to the cloned element
      clonedElement.style.width = '100%';
      clonedElement.style.maxWidth = '100%';
      clonedElement.style.height = 'auto';
      clonedElement.style.overflow = 'visible';
      clonedElement.style.transform = 'none';
      clonedElement.style.position = 'relative';
      
      // Fix text overlapping by adding proper spacing
      const allElements = clonedElement.querySelectorAll('*');
      allElements.forEach((el) => {
        const element = el as HTMLElement;
        element.style.position = 'relative';
        element.style.float = 'none';
        element.style.clear = 'both';
        
        // Fix specific layout issues
        if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
          element.style.marginBottom = '8px';
          element.style.marginTop = '12px';
          element.style.lineHeight = '1.2';
        }
        
        if (element.tagName === 'P' || element.tagName === 'DIV') {
          element.style.marginBottom = '4px';
          element.style.lineHeight = '1.4';
        }
        
        // Remove problematic CSS
        element.style.position = 'relative';
        element.style.zIndex = 'auto';
        element.style.transform = 'none';
      });
      
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);
      
      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // Convert to canvas with optimized settings
        const canvas = await html2canvas(tempContainer, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: tempContainer.offsetWidth,
          height: tempContainer.offsetHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          removeContainer: false,
          imageTimeout: 15000,
          logging: false,
          onclone: (clonedDoc) => {
            // Ensure all text is visible in the clone
            const clonedElements = clonedDoc.querySelectorAll('*');
            clonedElements.forEach((el) => {
              const element = el as HTMLElement;
              element.style.visibility = 'visible';
              element.style.opacity = '1';
              element.style.display = element.style.display === 'none' ? 'block' : element.style.display;
            });
          }
        });
        
        // Create PDF with proper dimensions
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const margin = 10; // 10mm margin
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);
        
        // Calculate scaling to fit content
        const canvasRatio = canvas.height / canvas.width;
        const contentRatio = contentHeight / contentWidth;
        
        let finalWidth = contentWidth;
        let finalHeight = contentWidth * canvasRatio;
        
        // If content is too tall, scale it down
        if (finalHeight > contentHeight) {
          finalHeight = contentHeight;
          finalWidth = contentHeight / canvasRatio;
        }
        
        // Center the content
        const xOffset = margin + (contentWidth - finalWidth) / 2;
        const yOffset = margin + (contentHeight - finalHeight) / 2;
        
        // Convert to JPEG for smaller file size
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        
        // Add image to PDF
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
        
        // Save the PDF
        pdf.save(`${filename}.pdf`);
        toast.success('PDF generated successfully using client-side method!');
        
      } finally {
        // Clean up temporary element
        document.body.removeChild(tempContainer);
      }
      
    } catch (error) {
      console.error('Client-side PDF generation failed:', error);
      throw new Error('Both server-side and client-side PDF generation failed. Please try again later.');
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