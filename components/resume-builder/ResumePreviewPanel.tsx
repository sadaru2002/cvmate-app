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
    <div className="flex h-full items-center justify-center p-6 bg-black/20 backdrop-blur-sm rounded-r-lg overflow-y-auto" ref={resumeRef}>
      <div ref={resumeDownloadRef} className="w-full h-full">
        <ResumePreview data={resumeData} className="w-full h-full" />
      </div>
    </div>
  );
}