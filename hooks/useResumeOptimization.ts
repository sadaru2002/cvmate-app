import { useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react'; // Ensure AlertCircle is imported if used in the hook directly

interface OptimizationResult {
  overallMatch: string;
  keyFindings: string[];
  improvements: {
    summary?: {
      current: string;
      suggested: string;
      reasoning: string;
    };
    skills?: {
      missing: string[];
      suggested: string[];
      reasoning: string;
    };
    experience?: Array<{
      position: string;
      current: string;
      suggested: string;
      reasoning: string;
    }>;
    keywords?: {
      missing: string[];
      suggestions: string;
    };
  };
  atsOptimization: {
    tips: string[];
    formatting: string[];
  };
}

interface ResumeStats {
  atsScore: string;
  keywordsCount: number;
  keywordsList: string[]; // Added keywordsList
}

export const useResumeOptimization = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New states for resume stats
  const [isGeneratingStats, setIsGeneratingStats] = useState(false);
  const [resumeStats, setResumeStats] = useState<ResumeStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const analyzeResume = async (resumeData: any, jobDescription: string) => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze resume');
      }

      setAnalysis(result.analysis);
      toast.success('Resume analysis completed!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateResumeStats = async (resumeData: any) => {
    setIsGeneratingStats(true);
    setStatsError(null);

    try {
      const response = await fetch('/api/resume-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate resume stats');
      }

      setResumeStats(result.stats);
      toast.success('Resume stats generated!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate stats';
      setStatsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGeneratingStats(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  const clearStats = () => {
    setResumeStats(null);
    setStatsError(null);
  };

  return {
    analyzeResume,
    clearAnalysis,
    isAnalyzing,
    analysis,
    error,
    generateResumeStats, // New function
    clearStats,
    isGeneratingStats, // New loading state
    resumeStats, // New stats data
    statsError, // New error state
  };
};