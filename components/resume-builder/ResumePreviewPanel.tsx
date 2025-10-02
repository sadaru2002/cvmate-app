"use client"

import React, { useRef } from "react"
import { ResumePreview } from "@/components/resume-builder/ResumePreview"
import { useResumeContext } from "@/contexts/ResumeContext" // Import useResumeContext

export function ResumePreviewPanel() {
  const { resumeData } = useResumeContext(); // Use context instead of direct hook call or prop
  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeDownloadRef = useRef<HTMLDivElement>(null); // This ref is not used here, but kept for consistency if needed elsewhere

  // console.log("🔄 ResumePreviewPanel: Re-rendering. Current resumeData.profileInfo.fullName:", resumeData.profileInfo.fullName); // Removed log

  return (
    <div className="flex flex-col h-full">
      {/* Tip Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 m-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="text-blue-400 text-sm font-medium flex-shrink-0">💡 Tip:</div>
          <p className="text-blue-300 text-xs leading-relaxed">
            This preview may not show your resume's original look. Download as PDF to see the exact final appearance and formatting.
          </p>
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-6 pt-2 bg-black/20 backdrop-blur-sm rounded-r-lg overflow-y-auto" ref={resumeRef}>
        <div ref={resumeDownloadRef} className="w-full h-full">
          <ResumePreview data={resumeData} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}