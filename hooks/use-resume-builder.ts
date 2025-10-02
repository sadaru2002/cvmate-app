"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import api from "@/lib/axios"
import {
  Info,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Award,
  Languages,
  Mail,
} from "lucide-react"

// Define the overall resume form data structure
export interface ResumeFormData {
  _id?: string;
  title: string;
  thumbnailLink?: string;
  template?: string;
  colorPalette?: string[];
  profileInfo: {
    profilePictureUrl?: string;
    fullName?: string;
    designation?: string;
    summary?: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  workExperiences: Array<{
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education: Array<{
    degree?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills: Array<{
    name?: string;
    proficiency?: number;
  }>;
  projects: Array<{
    title?: string;
    description?: string;
    github?: string;
    LiveDemo?: string;
  }>;
  certifications: Array<{
    title?: string;
    issuer?: string;
    year?: string;
  }>;
  languages: Array<{
    name?: string;
    proficiency?: number;
  }>;
  interests: Array<{ name: string }>; // Changed to array of objects
}

export const initialResumeData: ResumeFormData = {
  title: "Untitled Resume",
  thumbnailLink: "",
  template: "TemplateFive", // Default template changed to TemplateFive
  colorPalette: ["#FFFFFF", "#000000", "#333333", "#000000"], // Default color palette for TemplateFive
  profileInfo: {
    profilePictureUrl: "", // Changed to empty string
    fullName: "", // Changed to empty string
    designation: "", // Changed to empty string
    summary: "", // Changed to empty string
  },
  contactInfo: {
    email: "", // Changed to empty string
    phone: "", // Changed to empty string
    location: "", // Changed to empty string
    linkedin: "",
    github: "",
    website: "",
  },
  workExperiences: [], // Changed to empty array
  education: [], // Changed to empty array
  skills: [], // Changed to empty array
  projects: [], // Changed to empty array
  certifications: [], // Changed to empty array
  languages: [], // Changed to empty array
  interests: [], // Changed to empty array of objects
};

export const availableTemplates = [
  { id: "TemplateOne", name: "Modern Minimalist", thumbnail: "/images/template-one-thumbnail.png", colors: ["#EBFDFF", "#A1FAFD", "#ACEAFE", "#008899", "#4A5568", "#4A5568"] }, // 6 elements
  { id: "TemplateTwo", name: "Modern Professional", thumbnail: "/images/template-two-thumbnail.png", colors: ["#f8f9fa", "#e9ecef", "#dee2e6", "#007bff", "#343a40", "#343a40"] }, // 6 elements
  { id: "TemplateThree", name: "Clean Cyan", thumbnail: "/images/template-three-thumbnail.png", 
    colors: ["#E0F7FA", "#212121", "#00ACC1", "#666666", "#00ACC1", "#00ACC1"] // 6 elements
  },
  { id: "TemplateFour", name: "Classic Professional", thumbnail: "/images/template-four-thumbnail.png",
    colors: ["#FFFFFF", "#212121", "#616161", "#E0E0E0", "#424242", "#757575"] // Grayscale with subtle accent
  },
  { id: "TemplateFive", name: "ATS Classic", thumbnail: "/images/template-five-thumbnail.png",
    colors: ["#FFFFFF", "#000000", "#333333", "#000000"] // Black and white for ATS
  },
];

export const availableColorPalettes = [
  { id: "default", name: "Default Blue-Green", colors: ["#EBFDFF", "#A1FAFD", "#ACEAFE", "#008899", "#4A5568", "#4A5568"] }, // 6 elements
  { id: "warm", name: "Warm Sunset", colors: ["#FFF3E0", "#FFCC80", "#FFB74D", "#E65100", "#BF360C", "#BF360C"] }, // 6 elements
  { id: "cool", name: "Cool Ocean", colors: ["#E0F7FA", "#80DEEA", "#4DD0E1", "#00838F", "#006064", "#006064"] }, // 6 elements
  { id: "grayscale", name: "Grayscale", colors: ["#F5F5F5", "#E0E0E0", "#BDBDBD", "#616161", "#212121", "#212121"] }, // 6 elements
  { id: "vibrant", name: "Vibrant Pop", colors: ["#FCE4EC", "#F48FB1", "#EC407A", "#AD1457", "#880E4F", "#880E4F"] }, // 6 elements
  { id: "corporate", name: "Corporate Blue-Gray", colors: ["#F0F4F8", "#D9E2EC", "#BCCCDC", "#4A5568", "#2D3748", "#2D3748"] }, // 6 elements
  { id: "modern-professional", name: "Modern Professional", colors: ["#f8f9fa", "#e9ecef", "#dee2e6", "#007bff", "#343a40", "#343a40"] }, // 6 elements
  { id: "clean-cyan", name: "Clean Cyan", 
    colors: ["#E0F7FA", "#212121", "#00ACC1", "#666666", "#00ACC1", "#00ACC1"] // 6 elements
  },
  { id: "classic-professional", name: "Classic Professional",
    colors: ["#FFFFFF", "#212121", "#616161", "#E0E0E0", "#424242", "#757575"] // Grayscale with subtle accent
  },
  { id: "ats-classic", name: "ATS Classic",
    colors: ["#FFFFFF", "#000000", "#333333", "#000000"] // Black and white for ATS
  },
];

// API Paths
const API_PATHS = {
  RESUME: {
    GET_BY_ID: (id: string) => `/resumes/${id}`,
    CREATE: "/resumes",
    UPDATE: (id: string) => `/resumes/${id}`,
    DELETE: (id: string) => `/resumes/${id}`,
  },
};

// Define the order of sections for the stepper
export const formSections = [
  { id: "profile-info", label: "Personal Information", icon: Info },
  { id: "contact-info", label: "Contact Information", icon: Mail },
  { id: "work-experience", label: "Work Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: Briefcase }, // Moved Projects here
  { id: "skills", label: "Skills", icon: Lightbulb }, // Moved Skills here
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages-interests", label: "Languages & Interests", icon: Languages },
];

export function useResumeBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");

  const [resumeData, setResumeData] = useState<ResumeFormData>(initialResumeData);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false); // This controls UI loading states
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Calculate progress
  const progress = Math.round(((currentPageIndex + 1) / formSections.length) * 100);

  useEffect(() => {
    let ignore = false; // Flag to prevent race conditions in async operations
    const loadResume = async () => {
      if (!resumeId) {
        console.log("useResumeBuilder: No resumeId in URL, setting initialResumeData.");
        if (!ignore) {
          setResumeData(initialResumeData);
        }
        return;
      }

      if (!isLoading && !ignore) {
        setIsLoading(true);
        setErrorMsg("");
        try {
          console.log(`useResumeBuilder: Fetching resume with ID: ${resumeId}`);
          const response = await api.get(API_PATHS.RESUME.GET_BY_ID(resumeId));
          const resumeInfo = response.resume;
          console.log("useResumeBuilder: API response resumeInfo:", resumeInfo);

          if (resumeInfo && !ignore) {
            setResumeData((prevState) => {
              // Determine the template ID
              let resolvedTemplateId = resumeInfo.template;
              if (!availableTemplates.some(t => t.id === resolvedTemplateId)) {
                  resolvedTemplateId = initialResumeData.template; // Fallback to initial default
              }

              // Find the corresponding template object for colors
              const selectedTemplateConfig = availableTemplates.find(t => t.id === resolvedTemplateId);
              // Find the corresponding color palette object
              const selectedColorPaletteConfig = availableColorPalettes.find(p => JSON.stringify(p.colors) === JSON.stringify(resumeInfo.colorPalette));


              // Determine the color palette
              const resolvedColorPalette = resumeInfo.colorPalette || selectedTemplateConfig?.colors || selectedColorPaletteConfig?.colors || initialResumeData.colorPalette;

              // Construct the new state, prioritizing fetched data, then initial structure, then empty defaults
              const newState: ResumeFormData = {
                  _id: resumeInfo._id,
                  title: resumeInfo.title || initialResumeData.title,
                  thumbnailLink: resumeInfo.thumbnailLink || initialResumeData.thumbnailLink,
                  template: resolvedTemplateId,
                  colorPalette: resolvedColorPalette,
                  
                  profileInfo: { ...initialResumeData.profileInfo, ...(resumeInfo.profileInfo || {}) },
                  contactInfo: { ...initialResumeData.contactInfo, ...(resumeInfo.contactInfo || {}) },
                  
                  workExperiences: resumeInfo.workExperiences || [],
                  education: resumeInfo.education || [],
                  skills: resumeInfo.skills || [],
                  projects: resumeInfo.projects || [],
                  certifications: resumeInfo.certifications || [],
                  languages: resumeInfo.languages || [],
                  // Ensure interests are mapped to the new { name: string } format
                  interests: resumeInfo.interests?.map((item: string | { name: string }) => 
                    typeof item === 'string' ? { name: item } : item
                  ) || [],
              };
              console.log("useResumeBuilder: New state after initial load/update:", newState);
              return newState;
            });
            toast.success("Resume loaded successfully!");
          } else if (!ignore) {
            console.log("useResumeBuilder: API response did not contain resumeInfo.");
          }
        } catch (error: any) {
          if (!ignore) {
            console.error("useResumeBuilder: Error fetching resume details:", error);
            setErrorMsg(error.message || "Failed to load resume details.");
            toast.error(error.message || "Failed to load resume details.");
          }
        } finally {
          if (!ignore) {
            setIsLoading(false);
          }
        }
      }
    };

    loadResume();

    return () => {
      ignore = true;
    };
  }, [resumeId, availableTemplates, availableColorPalettes]); // Added availableColorPalettes to dependencies

  // Generic update function for any top-level or nested section
  const updateResumeSection = useCallback(<K extends keyof ResumeFormData>(
    sectionKey: K,
    newData: ResumeFormData[K]
  ) => {
    console.log("🚨 CRITICAL: updateResumeSection called");
    console.log("📝 Section:", sectionKey);
    console.log("📊 New data type:", typeof newData);
    console.log("📊 New data:", newData);
    
    setResumeData(prev => {
      console.log("📋 Current resumeData (inside setResumeData) BEFORE update:", prev);
      const updated = { ...prev, [sectionKey]: newData };
      console.log("📋 Updated resumeData AFTER merge:", updated);
      return updated;
    });
  }, []); // Removed resumeData from dependencies for stability

  // New function to update a specific field and save it to the backend
  const handleUpdateFieldAndSave = useCallback(async <K extends keyof ResumeFormData>(
    sectionKey: K,
    newData: ResumeFormData[K]
  ) => {
    if (!resumeData._id) {
      toast.error("Cannot save: Resume ID is missing.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    try {
      // Update local state first for immediate UI feedback
      setResumeData(prev => ({ ...prev, [sectionKey]: newData }));

      // Prepare payload for partial update
      const payload = { [sectionKey]: newData };
      
      await api.patch(API_PATHS.RESUME.UPDATE(resumeData._id), payload);
      toast.success("Resume updated successfully!");
    } catch (error: any) {
      console.error(`Error updating ${String(sectionKey)}:`, error);
      setErrorMsg(error.message || `Failed to update ${String(sectionKey)}.`);
      toast.error(error.message || `Failed to update ${String(sectionKey)}.`);
      // Optionally revert local state if save fails
      // setResumeData(originalResumeData); 
    } finally {
      setIsLoading(false);
    }
  }, [resumeData._id]);


  // Validation logic for the current page
  const validateCurrentPage = useCallback((): string[] => {
    const errors: string[] = [];
    const currentSectionId = formSections[currentPageIndex].id;

    switch (currentSectionId) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName?.trim()) errors.push("Full Name is required.");
        if (!designation?.trim()) errors.push("Designation is required.");
        if (!summary?.trim()) errors.push("Summary is required.");
        break;

      case "contact-info":
        const { email, phone, linkedin, github, website } = resumeData.contactInfo;
        if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
          errors.push("A valid email is required.");
        }
        if (!phone?.trim() || !/^\d{10}$/.test(phone)) {
          errors.push("A valid 10-digit phone number is required.");
        }
        if (linkedin?.trim() && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(linkedin)) {
          errors.push("Invalid LinkedIn URL.");
        }
        if (github?.trim() && !/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/.test(github)) {
          errors.push("Invalid GitHub URL.");
        }
        if (website?.trim() && !/^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(website)) {
          errors.push("Invalid Website URL.");
        }
        break;

      case "work-experience":
        // Removed the check that makes work experience mandatory
        resumeData.workExperiences.forEach((exp, index) => {
          // Only validate if the entry is not entirely empty
          if (Object.values(exp).some(val => val?.trim())) {
            if (!exp.company?.trim()) errors.push(`Company name is required in experience ${index + 1}.`);
            if (!exp.role?.trim()) errors.push(`Role is required in experience ${index + 1}.`);
            if (!exp.startDate?.trim()) errors.push(`Start date is required in experience ${index + 1}.`);
            // endDate can be empty for current jobs, so no mandatory check here
          }
        });
        break;

      case "education":
        if (resumeData.education.length === 0) {
          errors.push("At least one education entry is required.");
        } else {
          resumeData.education.forEach((edu, index) => {
            if (!edu.degree?.trim()) errors.push(`Degree is required in education ${index + 1}.`);
            if (!edu.institution?.trim()) errors.push(`Institution is required in education ${index + 1}.`);
            if (!edu.startDate?.trim()) errors.push(`Start date is required in education ${index + 1}.`);
            // endDate can be empty for ongoing education, so no mandatory check here
          });
        }
        break;

      case "projects": // Validation for projects
        if (resumeData.projects.length === 0) {
          errors.push("At least one project is required.");
        } else {
          resumeData.projects.forEach((proj, index) => {
            if (!proj.title?.trim()) errors.push(`Project title is required in project ${index + 1}.`);
            if (!proj.description?.trim()) errors.push(`Project description is required in project ${index + 1}.`);
            if (proj.github?.trim() && !/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/.test(proj.github)) {
              errors.push(`Invalid GitHub URL in project ${index + 1}.`);
            }
            if (proj.LiveDemo?.trim() && !/^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(proj.LiveDemo)) {
              errors.push(`Invalid Live Demo URL in project ${index + 1}.`);
            }
          });
        }
        break;

      case "skills": // Validation for skills
        if (resumeData.skills.length === 0) {
          errors.push("At least one skill is required.");
        } else {
          resumeData.skills.forEach((skill, index) => {
            if (!skill.name?.trim()) errors.push(`Skill name is required in skill ${index + 1}.`);
            // Proficiency is not strictly required for ATS template, but if present, validate range
            if (skill.proficiency !== undefined && (skill.proficiency < 1 || skill.proficiency > 5)) {
              errors.push(`Skill proficiency must be between 1 and 5 in skill ${index + 1}.`);
            }
          });
        }
        break;

      case "certifications":
        if (resumeData.certifications.length === 0) {
          errors.push("At least one certification is required.");
        } else {
          resumeData.certifications.forEach((cert, index) => {
            if (!cert.title?.trim()) errors.push(`Certification title is required in certification ${index + 1}.`);
            if (!cert.issuer?.trim()) errors.push(`Issuer is required in certification ${index + 1}.`);
            if (cert.year?.trim() && !/^\d{4}$/.test(cert.year)) {
              errors.push(`Year must be a 4-digit number in certification ${index + 1}.`);
            }
          });
        }
        break;

      case "languages-interests":
        if (resumeData.languages.length === 0) {
          errors.push("At least one language is required.");
        } else {
          resumeData.languages.forEach((lang, index) => {
            if (!lang.name?.trim()) errors.push(`Language name is required in language ${index + 1}.`);
            // Proficiency is not strictly required for ATS template, but if present, validate range
            if (lang.proficiency !== undefined && (lang.proficiency < 1 || lang.proficiency > 5)) {
              errors.push(`Language proficiency must be between 1 and 5 in language ${index + 1}.`);
            }
          });
        }

        if (resumeData.interests.length === 0 || resumeData.interests.some(interest => !interest.name.trim())) {
          errors.push("At least one interest is required.");
        }
        break;

      default:
        break;
    }
    return errors;
  }, [resumeData, currentPageIndex]);

  // Save or update resume data
  const handleSaveResume = useCallback(async (exitAfterSave: boolean = false) => {
    const errors = validateCurrentPage();
    if (errors.length > 0) {
      setErrorMsg(errors.join(" "));
      toast.error("Please fix the errors before saving.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    try {
      let response;
      console.log("handleSaveResume: Sending resumeData to API:", resumeData); // Log payload
      if (resumeData._id) {
        // Update existing resume
        response = await api.patch(API_PATHS.RESUME.UPDATE(resumeData._id), resumeData);
        toast.success("Resume updated successfully!");
      } else {
        // Create new resume
        response = await api.post(API_PATHS.RESUME.CREATE, resumeData);
        toast.success("Resume created successfully!");
        // If new resume, update URL with its ID and set _id in state
        router.replace(`/resume-builder?id=${response.resume._id}`);
        setResumeData(prevState => ({ ...prevState, _id: response.resume._id }));
      }
      if (exitAfterSave) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error saving resume:", error);
      setErrorMsg(error.message || "Failed to save resume.");
      toast.error(error.message || "Failed to save resume.");
    } finally {
      setIsLoading(false);
    }
  }, [resumeData, router, validateCurrentPage]);

  const handleDeleteResume = useCallback(async () => {
    if (!resumeData._id) {
      toast.info("No resume selected to delete.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    try {
      await api.delete(API_PATHS.RESUME.DELETE(resumeData._id));
      toast.success("Resume deleted successfully!");
      router.push("/dashboard"); // Redirect to dashboard after deletion
    } catch (error: any) {
      console.error("Error deleting resume:", error);
      setErrorMsg(error.message || "Failed to delete resume.");
      toast.error(error.message || "Failed to delete resume.");
    } finally {
      setIsLoading(false);
    }
  }, [resumeData._id, router]);

  const handlePreviewAndDownload = useCallback(() => {
    console.log("handlePreviewAndDownload: Function entered."); // New log
    const errors = validateCurrentPage();
    if (errors.length > 0) {
      setErrorMsg(errors.join(" "));
      toast.error("Please fix the errors before proceeding to preview.");
      console.log("Validation errors preventing preview:", errors);
      return;
    }
    console.log("handlePreviewAndDownload: Attempting router.push to /preview-download"); // New log
    localStorage.setItem("resumeFormData", JSON.stringify(resumeData));
    router.push("/preview-download");
  }, [resumeData, router, validateCurrentPage]);

  const handleNextStep = useCallback(() => {
    const errors = validateCurrentPage();
    if (errors.length > 0) {
      setErrorMsg(errors.join(" "));
      toast.error("Please fix the errors before proceeding.");
      return;
    }
    setErrorMsg("");
    if (currentPageIndex < formSections.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    } else {
      handlePreviewAndDownload();
    }
  }, [currentPageIndex, handlePreviewAndDownload, validateCurrentPage]);

  const handleBackStep = useCallback(() => {
    setErrorMsg("");
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    } else {
      // Check if we came from the preview page
      const cameFromPreview = sessionStorage.getItem('cameFromPreview');
      if (cameFromPreview === 'true' && resumeData._id) {
        sessionStorage.removeItem('cameFromPreview'); // Clear the flag
        router.push("/preview-download");
      } else {
        router.push("/dashboard");
      }
    }
  }, [currentPageIndex, router, resumeData._id]); // Add resumeData._id to dependencies

  const handleTemplateSelect = useCallback((templateId: string) => {
    const selectedTemplate = availableTemplates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setResumeData(prevState => ({
        ...prevState,
        template: templateId,
        colorPalette: selectedTemplate.colors, // Update color palette based on template
      }));
      toast.info(`Template changed to ${selectedTemplate.name}`);
    }
  }, []);

  const handleColorPaletteSelect = useCallback((colors: string[]) => { // Changed to accept string[]
    setResumeData(prevState => ({
      ...prevState,
      colorPalette: colors,
    }));
    // Find the name of the selected palette for the toast message
    const paletteName = availableColorPalettes.find(p => JSON.stringify(p.colors) === JSON.stringify(colors))?.name || "Custom";
    toast.info(`Color palette changed to ${paletteName}`);
  }, []);

  return {
    resumeData,
    setResumeData,
    isLoading,
    errorMsg,
    currentPageIndex,
    setCurrentPageIndex,
    handleSaveResume,
    handleDeleteResume,
    handlePreviewAndDownload,
    handleNextStep,
    handleBackStep,
    handleTemplateSelect,
    handleColorPaletteSelect, // Expose new handler
    handleUpdateFieldAndSave, // Expose new function
    formSections,
    progress,
    validateCurrentPage,
    updateResumeSection,
    availableTemplates,
    availableColorPalettes, // Expose available palettes
  };
}