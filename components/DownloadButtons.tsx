"use client"

import React, { useState } from 'react';
import { FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { saveAs } from 'file-saver';

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
      console.log('Starting PDF download using @react-pdf/renderer...');
      
      const response = await fetch('/api/generate-pdf-react', { // Call the new API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          template: resumeData.template || 'TemplateOne',
          colorPalette: resumeData.colorPalette || []
        }),
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || `Server error: ${response.status}`);
        } catch {
          throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
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