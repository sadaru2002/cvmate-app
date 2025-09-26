"use client"

import React from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

// Import section components
import EducationInfo from "./resumesection/Educationinfo";
import WorkExperience from "./resumesection/Workexperience";
import ProjectInfo from "./resumesection/projectinfo.tsx";
import CertificationInfo from "./resumesection/CertificationInfo";
import BulletList from "./resumesection/BulletList"; // New bullet list component
import { cleanUrlForDisplay } from "@/lib/utils";

// Define the structure for resume data (simplified for template usage)
interface TemplateResumeData {
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
    proficiency?: number; // 1-5 scale
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
    proficiency?: number; // 1-5 scale
  }>;
  interests: Array<{ name: string }>; // Changed to array of objects
}

interface TemplateProps {
  resumeData: TemplateResumeData;
  colorPalette?: string[]; // Now an array of strings
  id?: string; // Add id prop
}

// Default theme for TemplateThree (based on the provided image)
// Order: [sidebarBg, mainText, accentColor, secondaryText, linkText, bulletColor]
const DEFAULT_THEME_THREE = [
  "#E0F7FA", // Very Light Cyan/Blue
  "#212121", // Dark Gray/Black
  "#00ACC1", // Vibrant Cyan/Teal
  "#666666", // Medium Gray - for subtle elements like dates, italic roles
  "#00ACC1", // Vibrant Cyan/Teal - for links (same as accent)
  "#00ACC1", // Vibrant Cyan/Teal - for bullet points (same as accent)
];

// Simple Title Component for sections
const Title: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <h2 className="text-base font-bold mb-3 pb-1" style={{ color: color }}>
    {text}
  </h2>
);

// Utility function to format year-month
const formatYearMonth = (dateString?: string) => {
  if (!dateString) return "Present";
  // Basic formatting, could be enhanced with date-fns
  return dateString;
};

// Helper to check if an array section has any meaningful data
const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)));

// Helper to check if contact info has any meaningful data
const hasContactInfo = (contactInfo: TemplateResumeData['contactInfo']) => Object.values(contactInfo).some(val => val !== undefined && val !== null && val !== '');

const TemplateThree: React.FC<TemplateProps> = ({ resumeData, colorPalette, id }) => {
  const colors = colorPalette && colorPalette.length === 6 ? colorPalette : DEFAULT_THEME_THREE;

  // Destructure the colors array into named variables for easier use
  const [sidebarBg, , accentColor, , , bulletColor] = colors; // Removed paletteMainText, paletteSecondaryText, paletteLinkText

  // Define fixed text colors for the main content area (right column) for readability
  const mainContentTextColor = "#212121"; // Dark gray
  const mainContentSecondaryTextColor = "#666666"; // Medium gray
  const mainContentLinkColor = "#00ACC1"; // Vibrant Cyan (readable on white)

  // Define fixed text colors for the sidebar (left column) for readability
  const sidebarFixedTextColor = "#212121"; // Dark gray
  const sidebarFixedSecondaryTextColor = "#666666"; // Medium gray
  const sidebarFixedLinkColor = "#00ACC1"; // Vibrant Cyan (readable on light background)

  // Extract skills and interests as simple names for bullet lists
  const technicalSkills = resumeData.skills?.map(s => s.name).filter(Boolean) as string[] || [];
  const softSkills = resumeData.interests?.map(i => i.name).filter(Boolean) as string[] || [];
  const certificationsList = resumeData.certifications?.map(c => c.title).filter(Boolean) as string[] || [];

  return (
    <div
      id={id}
      className="bg-white text-gray-900 w-full h-full font-sans text-sm leading-relaxed"
      style={{
        boxShadow: "none",
        // Removed overflow: "hidden", // Removed to prevent content clipping in PDF
      }}
    >
      <div className="h-full grid grid-cols-[1.5fr_3.5fr]"> {/* Two-column layout */}
        {/* Left Column (Sidebar) */}
        <div
          className="flex flex-col py-8 px-6" // Removed h-full Tailwind class
          style={{ backgroundColor: sidebarBg, height: '100%' }} // Explicit inline height
        >
          {/* Profile Picture */}
          <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-white mx-auto mb-4 resume-section">
            {resumeData.profileInfo.profilePictureUrl ? (
              <img
                src={resumeData.profileInfo.profilePictureUrl}
                alt={resumeData.profileInfo.fullName || "Profile"}
                className="w-[110px] h-[110px] rounded-full object-cover"
              />
            ) : (
              <div
                className="w-[110px] h-[110px] flex items-center justify-center text-5xl rounded-full"
                style={{ color: accentColor }} // Accent Cyan icon
              >
                <User className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Name and Designation */}
          <div className="text-center mb-6 resume-section">
            <h1 className="text-xl font-bold mb-1 uppercase" style={{ color: sidebarFixedTextColor }}>{resumeData.profileInfo.fullName || "Your Name Here"}</h1>
            <p className="text-sm uppercase tracking-wide" style={{ color: sidebarFixedTextColor }}>{resumeData.profileInfo.designation || "Your Designation"}</p>
          </div>

          {/* Contact Information */}
          {hasContactInfo(resumeData.contactInfo) && (
            <div className="mb-6 resume-section">
              <div className="border-t border-b border-white/30 py-4 space-y-2">
                {resumeData.contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="text-xs break-all" style={{ color: sidebarFixedTextColor }}>{resumeData.contactInfo.email}</span>
                  </div>
                )}
                {resumeData.contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="text-xs" style={{ color: sidebarFixedTextColor }}>{resumeData.contactInfo.phone}</span>
                  </div>
                )}
                {resumeData.contactInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline break-all" style={{ color: sidebarFixedLinkColor }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.linkedin)}
                    </a>
                  </div>
                )}
                {resumeData.contactInfo.github && (
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.github} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline break-all" style={{ color: sidebarFixedLinkColor }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.github)}
                    </a>
                  </div>
                )}
                {resumeData.contactInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline break-all" style={{ color: sidebarFixedLinkColor }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.website)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {hasArrayData(resumeData.education) && (
            <div className="mb-6 resume-section">
              <Title text="Education" color={accentColor} />
              <div className="space-y-2">
                {resumeData.education.map((edu, index) => (
                  <div key={`education_${index}`}>
                    <p className="text-sm font-semibold" style={{ color: sidebarFixedTextColor }}>{edu.institution || "Your Institution"}</p>
                    <p className="text-xs" style={{ color: sidebarFixedTextColor }}>{edu.degree || "Your Degree"}</p>
                    <p className="text-xs italic" style={{ color: sidebarFixedSecondaryTextColor }}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills (Technical) */}
          {technicalSkills.length > 0 && (
            <div className="mb-6 resume-section">
              <Title text="Skills" color={accentColor} /> {/* Accent Cyan for Skills Title */}
              <BulletList items={technicalSkills} textColor={sidebarFixedTextColor} bulletColor={bulletColor} fontSize="text-xs" />
            </div>
          )}

          {/* Certifications */}
          {certificationsList.length > 0 && (
            <div className="mb-6 resume-section">
              <Title text="Certifications" color={accentColor} /> {/* Accent Cyan for Certifications Title */}
              <BulletList items={certificationsList} textColor={sidebarFixedTextColor} bulletColor={bulletColor} fontSize="text-xs" />
            </div>
          )}

          {/* Interests (Soft Skills) */}
          {softSkills.length > 0 && (
            <div className="mb-6 resume-section">
              <Title text="Soft Skills" color={accentColor} /> {/* Accent Cyan for Soft Skills Title */}
              <BulletList items={softSkills} textColor={sidebarFixedTextColor} bulletColor={bulletColor} fontSize="text-xs" />
            </div>
          )}
        </div>

        {/* Right Column (Main Content) */}
        <div
          className="flex flex-col py-8 px-6" // Removed h-full Tailwind class
          style={{ color: mainContentTextColor, height: '100%' }} // Explicit inline height
        >
          {/* Professional Summary */}
          {resumeData.profileInfo.summary && (
            <div className="mb-6 resume-section">
              <Title text="Profile" color={accentColor} />
              <p className="text-sm" style={{ color: mainContentTextColor }}>{resumeData.profileInfo.summary || "A short introduction about yourself..."}</p>
            </div>
          )}

          {/* Work Experience */}
          {hasArrayData(resumeData.workExperiences) && (
            <div className="mb-6 resume-section">
              <Title text="Experience" color={accentColor} />
              <div className="space-y-6">
                {resumeData.workExperiences.map((data, index) => (
                  <div key={`work_${index}`}>
                    <div className="flex justify-between items-baseline mb-1">
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: mainContentTextColor }}>{data.company || "Company Name"}</h3>
                        <p className="text-xs italic" style={{ color: mainContentSecondaryTextColor }}>{data.role || "Your Role"}</p>
                      </div>
                      <p className="text-xs italic" style={{ color: mainContentSecondaryTextColor }}>{`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}</p>
                    </div>
                    {data.description && (
                      <ul className="list-disc list-inside text-xs space-y-0.5 ml-4" style={{ color: mainContentTextColor }}>
                        {data.description.split('. ').filter(Boolean).map((point, i) => (
                          <li key={i}>{point.trim()}{point.endsWith('.') ? '' : '.'}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects (Optional, if space allows and desired in this template) */}
          {hasArrayData(resumeData.projects) && (
            <div className="mb-6 resume-section">
              <Title text="Projects" color={accentColor} />
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <ProjectInfo
                    key={`project_${index}`}
                    title={project.title || "Project Title"}
                    description={project.description || "Project Description"}
                    githubLink={project.github}
                    liveDemoUrl={project.LiveDemo}
                    bgColor={sidebarBg} // Using sidebar background for icon background
                    iconColor={accentColor} // Using Accent Cyan for icon color
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateThree;