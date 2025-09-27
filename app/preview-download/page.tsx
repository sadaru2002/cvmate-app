"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { ResumePreview } from "@/components/resume-builder/ResumePreview"
import { Check, Download, Copy, Share2, Brain, FileText, ArrowLeft, AlertCircle } from "lucide-react" // Added AlertCircle icon
import { AuthGuard } from "@/components/AuthGuard" // Import AuthGuard
import { toast } from "sonner" // Import toast for notifications
import { ResumeFormData } from "@/hooks/use-resume-builder" // Import the comprehensive ResumeFormData type
import { DownloadButtons } from "@/components/DownloadButtons" // Import the new DownloadButtons component
import { useRouter } from 'next/navigation'; // Import useRouter
import { useResumeOptimization } from '@/hooks/useResumeOptimization'; // Import the hook

export default function PreviewDownloadPage() {
  const [resumeData, setResumeData] = useState<ResumeFormData | null>(null);
  const router = useRouter(); // Initialize useRouter
  const { generateResumeStats, isGeneratingStats, resumeStats, statsError } = useResumeOptimization(); // Use the hook

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("resumeFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setResumeData(parsedData);
        // Generate stats when resumeData is loaded
        generateResumeStats(parsedData);
      }
    }
  }, []); // Empty dependency array to run once on mount

  // Define the ID for the resume template element
  const RESUME_ELEMENT_ID = "resume-template";

  if (!resumeData) {
    return (
      <AuthGuard> {/* Wrap content with AuthGuard */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <GlassCard className="relative z-10 p-8 text-center text-gray-300">
            <h1 className="text-3xl font-bold text-white mb-4">Loading Resume...</h1>
            <p>Please ensure you've built a resume first.</p>
            <Link href="/resume-builder" passHref>
              <Button variant="gradient-glow" className="mt-6">
                Go to Resume Builder
              </Button>
            </Link>
          </GlassCard>
        </div>
      </AuthGuard>
    );
  }

  // Derive filename from resume title, replacing spaces with underscores
  const filename = resumeData.title.replace(/\s+/g, '_').toLowerCase() || 'resume';

  const handleBackToEditor = () => {
    if (resumeData._id) {
      sessionStorage.setItem('cameFromPreview', 'true'); // Set flag
      router.push(`/resume-builder?id=${resumeData._id}`);
    } else {
      toast.error("Resume ID not found. Cannot go back to editor.");
      router.push("/dashboard");
    }
  };

  return (
    <AuthGuard> {/* Wrap content with AuthGuard */}
      <div className="relative flex flex-col flex-1">
        <main className="relative z-10 max-w-7xl mx-auto flex-1 p-6 lg:p-12">
          <div className="text-center mb-12">
            <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white lg:text-5xl mb-4 leading-tight glow-text">
              Your{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                Resume is Ready!
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Download your professional, ATS-optimized resume in seconds and start landing those interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Resume Preview */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Resume Preview</h2>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400" onClick={handleBackToEditor}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </div>
                {/* Pass the RESUME_ELEMENT_ID to ResumePreview so it can be applied to the template */}
                <ResumePreview data={resumeData} className="h-[calc(100%-60px)]" resumeElementId={RESUME_ELEMENT_ID} />
              </GlassCard>
            </div>

            {/* Right Column: Download Options, Share, Next Steps, Stats */}
            <div className="lg:col-span-1 space-y-8">
              {/* Download Options */}
              <GlassCard className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
                  Download Options
                </h2>
                <DownloadButtons
                  resumeData={resumeData}
                  filename={filename}
                />
              </GlassCard>

              {/* Next Steps */}
              <GlassCard className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
                  Next Steps
                </h2>
                <p className="text-gray-300 text-sm">
                  Want to optimize for a different job? Our AI can help you tailor your resume for specific positions.
                </p>
                <Button
                  onClick={() => router.push(`/optimize?id=${resumeData._id}`)} // Pass resume ID to optimize page
                  variant="gradient-glow"
                  className="w-full"
                >
                  <Brain className="w-5 h-5 mr-2" /> AI Optimization
                </Button>
                <Button
                  onClick={handleBackToEditor}
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back to Editor
                </Button>
              </GlassCard>

              {/* Resume Stats */}
              <GlassCard className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">
                  Resume Stats
                </h2>
                {isGeneratingStats ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                    <p className="ml-3 text-gray-300">Generating stats...</p>
                  </div>
                ) : statsError ? (
                  <div className="text-center text-red-400 py-4">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>{statsError}</p>
                  </div>
                ) : resumeStats ? (
                  <div className="space-y-4">
                    <div className="flex justify-around text-center">
                      <div>
                        <p className="text-4xl font-bold text-cyan-400">{resumeStats.atsScore}</p>
                        <p className="text-gray-300 text-sm">ATS Score</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-purple-400">{resumeStats.keywordsCount}</p>
                        <p className="text-gray-300 text-sm">Keywords Found</p>
                      </div>
                    </div>
                    {resumeStats.keywordsList && resumeStats.keywordsList.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-white mb-2">Top Keywords:</h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeStats.keywordsList.map((keyword, index) => (
                            <span key={index} className="bg-purple-900/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>Stats will appear here after generation.</p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}