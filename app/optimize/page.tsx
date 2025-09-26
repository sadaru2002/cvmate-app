"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Brain, Copy, Check, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useResumeBuilder } from '@/hooks/use-resume-builder';
import { useResumeOptimization } from '@/hooks/useResumeOptimization';
import { toast } from 'sonner';
import { AuthGuard } from "@/components/AuthGuard"; // Import AuthGuard
import { GlassCard } from "@/components/glass-card"; // Import GlassCard
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

function OptimizePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");

  const { resumeData, updateResumeSection, handleUpdateFieldAndSave, isLoading: isResumeLoading, errorMsg: resumeError } = useResumeBuilder();
  const { analyzeResume, isAnalyzing, analysis, error: optimizationError } = useResumeOptimization();
  const [jobDescription, setJobDescription] = useState('');
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  // Effect to load job description from local storage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedJobDescription = localStorage.getItem('jobDescriptionForOptimization');
      if (savedJobDescription) {
        setJobDescription(savedJobDescription);
      }
    }
  }, []);

  // Effect to save job description to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jobDescriptionForOptimization', jobDescription);
    }
  }, [jobDescription]);

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }
    if (!resumeData || !resumeData._id) {
      toast.error('No resume data available. Please select or create a resume first.');
      return;
    }
    analyzeResume(resumeData, jobDescription);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast.success('Copied to clipboard!');
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const applySuggestion = async (section: string, newText: string) => {
    if (!resumeData) {
      toast.error('Resume data not loaded.');
      return;
    }
    if (!resumeData._id) {
      toast.error('Resume not saved. Please save your resume first.');
      return;
    }

    switch (section) {
      case 'summary':
        // Use the new handleUpdateFieldAndSave to update and persist the summary
        await handleUpdateFieldAndSave('profileInfo', {
          ...resumeData.profileInfo,
          summary: newText
        });
        break;
      // Add other sections as needed
    }
    toast.success('Applied to your resume!');
  };

  if (isResumeLoading) {
    return (
      <AuthGuard>
        <div className="flex flex-1 items-center justify-center min-h-screen">
          <Skeleton className="h-32 w-32 rounded-full animate-pulse" />
        </div>
      </AuthGuard>
    );
  }

  if (resumeError) {
    return (
      <AuthGuard>
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <GlassCard className="relative z-10 p-8 text-center text-red-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Error Loading Resume</h1>
            <p className="mb-4">{resumeError}</p>
            <Button onClick={() => router.push('/dashboard')} variant="gradient-glow" className="mt-6">
              Go to Dashboard
            </Button>
          </GlassCard>
        </div>
      </AuthGuard>
    );
  }

  if (!resumeData || !resumeData._id) {
    return (
      <AuthGuard>
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <GlassCard className="relative z-10 p-8 text-center text-gray-300">
            <h1 className="text-3xl font-bold text-white mb-4">No Resume Selected</h1>
            <p>Please select a resume from your dashboard to optimize.</p>
            <Button onClick={() => router.push('/dashboard')} variant="gradient-glow" className="mt-6">
              Go to Dashboard
            </Button>
          </GlassCard>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="relative flex flex-col flex-1">
        <main className="relative z-10 max-w-7xl mx-auto flex-1 p-6 lg:p-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white glow-text">AI Resume Optimization</h1>
              <p className="text-gray-300">Optimize your resume for specific job opportunities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <GlassCard className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Job Description Analysis
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Paste the job description you're applying for:
                  </label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
                    className="min-h-[200px] text-sm bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !jobDescription.trim()}
                  variant="gradient-glow"
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze & Optimize
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>

            {/* Results Section */}
            <GlassCard className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">Optimization Results</h2>
              
              {(optimizationError || resumeError) && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 text-sm">{optimizationError || resumeError}</p>
                </div>
              )}
              
              {!analysis && !optimizationError && (
                <div className="text-center py-12 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a job description and click "Analyze & Optimize" to get started</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  {/* Overall Match */}
                  <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                    <h3 className="font-semibold text-cyan-300 mb-2">Overall Match Score</h3>
                    <div className="text-3xl font-bold text-cyan-400">{analysis.overallMatch}</div>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Key Findings</h3>
                    <ul className="space-y-2">
                      {analysis.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Summary Improvement */}
                  {analysis.improvements.summary && (
                    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                      <h3 className="font-semibold text-white mb-3">Professional Summary</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Current</label>
                          <div className="bg-white/10 p-3 rounded text-sm text-gray-200">
                            {analysis.improvements.summary.current}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-cyan-400 uppercase tracking-wide">Suggested</label>
                          <div className="bg-cyan-900/20 p-3 rounded text-sm border border-cyan-500/30 text-cyan-200">
                            {analysis.improvements.summary.suggested}
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-white border-white/20 hover:bg-white/10"
                                onClick={() => copyToClipboard(analysis.improvements.summary!.suggested, 'summary')}
                              >
                                {copiedStates.summary ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="gradient-glow"
                                onClick={() => applySuggestion('summary', analysis.improvements.summary!.suggested)}
                              >
                                Apply to Resume
                              </Button>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{analysis.improvements.summary.reasoning}</p>
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {analysis.improvements.skills?.missing.length > 0 && (
                    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                      <h3 className="font-semibold text-white mb-3">Missing Skills</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {analysis.improvements.skills.missing.map((skill, index) => (
                          <span key={index} className="bg-purple-900/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">{analysis.improvements.skills.reasoning}</p>
                    </div>
                  )}

                  {/* ATS Optimization */}
                  {analysis.atsOptimization.tips.length > 0 && (
                    <div className="border border-white/20 rounded-lg p-4 bg-white/5">
                      <h3 className="font-semibold text-white mb-3">ATS Optimization Tips</h3>
                      <ul className="space-y-1">
                        {analysis.atsOptimization.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

export default function OptimizePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OptimizePageContent />
    </Suspense>
  );
}