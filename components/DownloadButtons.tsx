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
      
      // Get the actual dimensions of the resume element
      const rect = resumeElement.getBoundingClientRect();
      
      // Convert HTML to canvas with optimized settings
      const canvas = await html2canvas(resumeElement, {
        scale: 1.5, // Reduced from 2 for smaller file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: rect.width,
        height: rect.height,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: rect.width,
        windowHeight: rect.height,
        // Optimize for better quality/size ratio
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('#resume-template');
          if (clonedElement) {
            // Ensure the cloned element has the same dimensions
            (clonedElement as HTMLElement).style.width = `${rect.width}px`;
            (clonedElement as HTMLElement).style.height = `${rect.height}px`;
            (clonedElement as HTMLElement).style.transform = 'none';
            (clonedElement as HTMLElement).style.position = 'relative';
          }
        }
      });
      
      // Calculate proper PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF with proper orientation
      const orientation = imgHeight > pageHeight ? 'portrait' : 'portrait';
      const pdf = new jsPDF(orientation, 'mm', 'a4');
      
      // Convert canvas to compressed image data
      const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with compression
      
      // Fit content to single page if possible
      if (imgHeight <= pageHeight) {
        // Content fits in one page
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        // Content is too tall, scale it down to fit one page
        const scaleFactor = pageHeight / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = pageHeight;
        
        // Center the scaled image
        const xOffset = (imgWidth - scaledWidth) / 2;
        
        pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledWidth, scaledHeight);
      }
      
      // Save the PDF
      pdf.save(`${filename}.pdf`);
      toast.success('PDF generated successfully using client-side method!');
      
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