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
      console.log('Starting PDF download...');
      
      toast.info('Generating PDF...');
      
      const response = await fetch('/api/generate-pdf-react', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resumeData,
          filename 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(errorData.error || `PDF generation failed: ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      saveAs(blob, `${filename}.pdf`);
      toast.success(' PDF downloaded successfully!');

    } catch (error: any) {
      console.error("PDF Download error:", error);
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
