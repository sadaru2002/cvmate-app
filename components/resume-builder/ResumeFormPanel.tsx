"use client"

import React from "react"
import { AlertCircle, ArrowLeft, ArrowRight, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { StepProgress } from "@/components/resume-builder/StepProgress"
import { ProfileInfoForm } from "@/components/resume-builder/ProfileInfoForm"
import { ContactInfoForm } from "@/components/resume-builder/ContactInfoForm"
import { WorkExperienceForm } from "@/components/resume-builder/WorkExperienceForm"
import { EducationForm } from "@/components/resume-builder/EducationForm"
import { SkillsForm } from "@/components/resume-builder/SkillsForm"
import { ProjectsForm } from "@/components/resume-builder/ProjectsForm"
import { CertificationsForm } from "@/components/resume-builder/CertificationsForm"
import { LanguagesInterestsForm } from "@/components/resume-builder/LanguagesInterestsForm"
import { useResumeContext } from "@/contexts/ResumeContext" // Import useResumeContext

export function ResumeFormPanel() {
  const {
    resumeData,
    updateResumeSection,
    isLoading,
    errorMsg,
    currentPageIndex,
    formSections,
    progress,
    handleBackStep,
    handleSaveResume,
    handleNextStep,
  } = useResumeContext(); // Use context instead of direct hook call

  const currentSectionId = formSections[currentPageIndex].id;
  const isLastStep = currentPageIndex === formSections.length - 1;

  const commonNavigationButtons = (
    <div className="flex justify-between mt-8">
      <Button
        onClick={handleBackStep}
        variant="outline"
        className="text-white border-white/20 hover:bg-white/10"
        disabled={isLoading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <div className="flex gap-2">
        <Button
          onClick={() => handleSaveResume(true)}
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
          disabled={isLoading}
        >
          <Save className="w-4 h-4 mr-2" /> Save & Exit
        </Button>
        <Button
          onClick={handleNextStep}
          variant="gradient-glow"
          disabled={isLoading}
        >
          {isLastStep ? "Preview & Download" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderFormStep = () => {
    switch (currentSectionId) {
      case "profile-info":
        return (
          <ProfileInfoForm
            data={resumeData.profileInfo} // Pass data directly
            onUpdate={(data) => updateResumeSection("profileInfo", data)} // Direct update callback
            className="w-full"
            navigationButtons={commonNavigationButtons}
          />
        );
      case "contact-info":
        return (
          <ContactInfoForm
            data={resumeData.contactInfo}
            onUpdate={(data) => updateResumeSection("contactInfo", data)}
            className="w-full"
            navigationButtons={commonNavigationButtons}
          />
        );
      case "work-experience":
        return (
          <WorkExperienceForm
            data={resumeData.workExperiences}
            onUpdate={(data) => updateResumeSection("workExperiences", data)}
            className="w-full"
            navigationButtons={commonNavigationButtons}
          />
        );
      case "education":
        return (
          <EducationForm
            data={resumeData.education}
            onUpdate={(data) => updateResumeSection("education", data)}
            className="w-full"
            navigationButtons={commonNavigationButtons}
          />
        );
      case "skills":
        console.log("🎯 ResumeFormPanel: Rendering SkillsForm");
        console.log("📊 ResumeFormPanel: Skills data being passed to SkillsForm:", resumeData.skills);
        return (
          <SkillsForm
            data={resumeData.skills}
            onUpdate={(skillsArray) => {
              console.log("🔄 ResumeFormPanel: Skills onUpdate called from SkillsForm");
              console.log("📊 ResumeFormPanel: Received skills array from SkillsForm:", skillsArray);
              console.log("📊 ResumeFormPanel: Type:", typeof skillsArray);
              console.log("📊 ResumeFormPanel: Is array?", Array.isArray(skillsArray));
              
              updateResumeSection("skills", skillsArray);
            }}
            className="w-full"
            navigationButtons={commonNavigationButtons}
          />
        );
      case "projects":
        return (
          <ProjectsForm
            data={resumeData.projects}
            onUpdate={(data) => updateResumeSection("projects", data)}
            className="w-full"
            navigationButtons={commonNavigationButtons}
          />
        );
      case "certifications":
        return (
          <CertificationsForm
            data={resumeData.certifications}
            onUpdate={(data) => updateResumeSection("certifications", data)}
            className="w-full"
            navigationButtons={commonNavigationButtons}
          />
        );
      case "languages-interests":
        console.log("🗣️ Rendering LanguagesInterestsForm");
        console.log("📊 Languages data being passed:", resumeData.languages);
        console.log("📊 Interests data being passed:", resumeData.interests);
        console.log("📊 Full resumeData (before passing to form):", resumeData);
        return (
          <LanguagesInterestsForm
            languagesData={resumeData.languages}
            onUpdateLanguages={(data) => updateResumeSection("languages", data)}
            interestsData={resumeData.interests}
            onUpdateInterests={(data) => {
              console.log("🔄 ResumeFormPanel: Interests onUpdate called from LanguagesInterestsForm");
              console.log("📊 ResumeFormPanel: Received interests array from LanguagesInterestsForm:", data);
              console.log("📊 ResumeFormPanel: Type:", typeof data);
              console.log("📊 ResumeFormPanel: Is array?", Array.isArray(data));
              updateResumeSection("interests", data);
            }}
            className="w-full"
            navigationButtons={commonNavigationButtons}
          />
        );
      default:
        return (
          <GlassCard className="p-8 text-center text-gray-300 w-full">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text glow-text">More sections coming soon!</h2>
            <p>This is step {currentSectionId}.</p>
            {commonNavigationButtons}
          </GlassCard>
        );
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-black/20 backdrop-blur-sm rounded-l-lg">
      {errorMsg && (
        <div className="flex items-center gap-2 text-sm font-medium text-red-500 p-4 bg-red-900/20 border-b border-red-500/30">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}
      <div className="p-6">
        <StepProgress progress={progress} />
        {renderFormStep()}
      </div>
    </div>
  );
}