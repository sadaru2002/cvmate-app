"use client"

import React from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { AuthGuard } from "@/components/AuthGuard"
import { ResumeBuilderHeader } from "@/components/resume-builder/ResumeBuilderHeader"
import { ResumeFormPanel } from "@/components/resume-builder/ResumeFormPanel"
import { ResumePreviewPanel } from "@/components/resume-builder/ResumePreviewPanel"
import { ResumeProvider } from "@/contexts/ResumeContext" // Import the new provider

export default function EditResumePage() {
  // The useResumeBuilder hook is now called inside ResumeProvider,
  // so we remove the direct call here.

  return (
    <AuthGuard>
      <ResumeProvider> {/* Wrap the entire builder with the provider */}
        <div className="flex flex-1 flex-col">
          {/* Top Bar */}
          <ResumeBuilderHeader />

          {/* Main Content Area: 50-50 Split */}
          <div className="flex-1 p-6 lg:p-12 pt-0">
            <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-200px)] rounded-lg border border-white/20 overflow-hidden">
              {/* Left Panel: Forms */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <ResumeFormPanel />
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Right Panel: Resume Preview */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <ResumePreviewPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </ResumeProvider>
    </AuthGuard>
  );
}