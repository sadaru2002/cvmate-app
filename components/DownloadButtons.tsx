"use client"

import React, { useState } from 'react';
import { FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { createRoot } from 'react-dom/client';
import { saveAs } from 'file-saver';

interface DownloadButtonsProps {
  resumeData: ResumeFormData;
  filename?: string;
}

// Define the ID for the resume template element
const RESUME_ELEMENT_ID = "resume-template-for-download";

// Pre-process HTML for PDF Generation
function prepareHtmlForPdf(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove problematic attributes and elements
  const walker = document.createTreeWalker(
    clone,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );
  
  let node = walker.currentNode as HTMLElement;
  while (node) {
    // Remove problematic attributes
    ['data-*', 'contenteditable', 'draggable', 'spellcheck'].forEach(attr => {
      if (node.hasAttribute && node.hasAttribute(attr)) {
        node.removeAttribute(attr);
      }
    });
    
    // Fix common layout issues
    if (node.classList?.contains('grid') && !node.style.gridTemplateColumns) {
      const cols = Array.from(node.classList).find(c => c.startsWith('grid-cols-'));
      if (cols) {
        const colCount = cols.split('-')[2];
        node.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
      }
    }
    
    // Ensure flex containers have proper display
    if (node.classList?.contains('flex')) {
      node.style.display = 'flex';
    }
    
    node = walker.nextNode() as HTMLElement;
  }
  
  return clone.outerHTML;
}

// Enhanced CSS extraction: Collects all rules from all stylesheets
async function extractAllStyles(): Promise<string> {
  let allStyles = '';
  
  try {
    const styleSheets = Array.from(document.styleSheets);
    
    for (const sheet of styleSheets) {
      try {
        // Only process stylesheets from the same origin or inline styles
        if (sheet.href && !sheet.href.startsWith(window.location.origin)) {
          continue;
        }
        
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          // Exclude @import rules as they are handled by the browser/Puppeteer directly
          if (rule.cssText && !rule.cssText.includes('@import')) {
            allStyles += rule.cssText + '\n';
          }
        }
      } catch (e) {
        console.warn('Skipped stylesheet due to CORS or access restrictions:', sheet.href || 'inline style');
      }
    }
  } catch (error) {
    console.warn('Error during CSS extraction:', error);
  }
  
  return allStyles;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  resumeData,
  filename = 'resume'
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    let tempDiv: HTMLDivElement | null = null;
    let root: ReturnType<typeof createRoot> | null = null;

    try {
      console.log('Starting PDF download...');
      // 1. Create a temporary, hidden div to render the resume for HTML/CSS extraction
      tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px'; // Move off-screen
      tempDiv.style.width = '794px'; // A4 width at 96 DPI
      tempDiv.style.height = '1123px'; // A4 height at 96 DPI
      tempDiv.style.overflow = 'hidden';
      document.body.appendChild(tempDiv);

      // 2. Render ResumePreview into the temporary div
      root = createRoot(tempDiv);
      root.render(<ResumePreview data={resumeData} downloadMode={true} resumeElementId={RESUME_ELEMENT_ID} />);

      // 3. Give React a moment to render and the browser to update the DOM
      // Also wait for fonts to be ready
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 200)), // Small delay to ensure rendering
        document.fonts.ready // Wait for all fonts to be loaded
      ]);

      // 4. Extract HTML and CSS
      const resumeElement = tempDiv.querySelector(`#${RESUME_ELEMENT_ID}`) as HTMLElement;
      if (!resumeElement) {
        throw new Error("Could not find the resume template element in the temporary div.");
      }
      
      // Use the new HTML preprocessing function
      const cleanedHtml = prepareHtmlForPdf(resumeElement);
      const css = await extractAllStyles();

      console.log('Extracted content:', {
        htmlLength: cleanedHtml.length,
        cssLength: css.length,
        htmlPreview: cleanedHtml.substring(0, 200) + '...',
      });

      // 5. Send HTML and CSS to the API route
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: cleanedHtml, css }),
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // Try to parse as JSON for error details
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || `Server error: ${response.status}`);
        } catch {
          throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
        }
      }

      // 6. Download the PDF blob
      const blob = await response.blob();
      console.log('Received blob:', blob.type, blob.size);
      
      // Verify it's actually a PDF
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
      // 7. Clean up the temporary div and unmount the React root
      if (root && tempDiv && document.body.contains(tempDiv)) {
        root.unmount();
        document.body.removeChild(tempDiv);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="gradient-glow"
        className="w-full"
        onClick={handleDownload}
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