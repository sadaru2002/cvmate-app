"use client";

import React, { createContext, useContext } from 'react';
import { useResumeBuilder, ResumeFormData, formSections, availableTemplates } from '@/hooks/use-resume-builder';

// Define the type for the context value, matching the return type of useResumeBuilder
interface ResumeContextType {
  resumeData: ResumeFormData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeFormData>>;
  isLoading: boolean;
  errorMsg: string;
  currentPageIndex: number;
  setCurrentPageIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSaveResume: (exitAfterSave?: boolean) => Promise<void>;
  handleDeleteResume: () => Promise<void>;
  handlePreviewAndDownload: () => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
  handleTemplateSelect: (templateId: string) => void;
  formSections: typeof formSections;
  progress: number;
  validateCurrentPage: () => string[];
  updateResumeSection: <K extends keyof ResumeFormData>(sectionKey: K, newData: ResumeFormData[K]) => void;
  availableTemplates: typeof availableTemplates;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const resumeBuilderValue = useResumeBuilder(); // Call the hook once here

  return (
    <ResumeContext.Provider value={resumeBuilderValue}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};