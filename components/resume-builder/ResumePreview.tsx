"use client"

import React, { useRef, useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Lightbulb, Award, Languages, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import TemplateOne from "@/app/templates/templateone" // Import TemplateOne
import TemplateTwo from "@/app/templates/templatetwo" // Import TemplateTwo
import TemplateThree from "@/app/templates/templatethree" // Import TemplateThree
import TemplateFour from "@/app/templates/templatefour" // Import TemplateFour
import TemplateFive from "@/app/templates/templatefive" // Import TemplateFive
import { ResumeFormData } from "@/hooks/use-resume-builder" // Import the comprehensive ResumeFormData type
import { FallbackResumeTemplate } from "@/components/resume-builder/FallbackResumeTemplate" // Import the new FallbackResumeTemplate

interface ResumePreviewProps {
  data: ResumeFormData; // Use the comprehensive ResumeFormData type
  className?: string;
  resumeElementId?: string; // New prop to pass the ID to the template
  downloadMode?: boolean; // New prop to control rendering for download
}

// Define A4 dimensions in pixels (at 96 DPI)
const A4_WIDTH_PX = 794; // Approximately 210mm
const A4_HEIGHT_PX = 1123; // Approximately 297mm

export function ResumePreview({ data, className, resumeElementId, downloadMode = false }: ResumePreviewProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        setContainerWidth(newWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Calculate scale to fit A4 width within the container for PREVIEW MODE
  const scale = containerWidth > 0 ? containerWidth / A4_WIDTH_PX : 1;

  const renderTemplate = () => {
    const templateProps = {
      resumeData: data,
      colorPalette: data.colorPalette,
      id: resumeElementId,
    };

    switch (data.template) {
      case "TemplateOne":
        return (
          <TemplateOne
            {...templateProps}
          />
        );
      case "TemplateTwo":
        return (
          <TemplateTwo
            {...templateProps}
          />
        );
      case "TemplateThree": // New case for TemplateThree
        return (
          <TemplateThree
            {...templateProps}
          />
        );
      case "TemplateFour": // New case for TemplateFour
        return (
          <TemplateFour
            {...templateProps}
          />
        );
      case "TemplateFive": // New case for TemplateFive
        return (
          <TemplateFive
            {...templateProps}
          />
        );
      default:
        // Generic fallback preview using the new component
        return (
          <FallbackResumeTemplate
            data={data}
            resumeElementId={resumeElementId}
          />
        );
    }
  };

  return (
    <div ref={containerRef} className={className}>
      <div
        className="flex-shrink-0 bg-white" // Ensure white background for the scaled content
        style={{
          width: `${A4_WIDTH_PX}px`,
          height: `${A4_HEIGHT_PX}px`,
          transform: downloadMode ? 'none' : `scale(${scale})`, // Apply scale only in preview mode
          transformOrigin: "top left",
          boxShadow: downloadMode ? "none" : "0 0 10px rgba(0,0,0,0.1)", // Remove shadow in downloadMode
          overflow: "hidden",
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}