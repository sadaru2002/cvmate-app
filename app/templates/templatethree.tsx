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

// Default theme for TemplateThree
// Order: [sidebarBg, mainText, accentColor, secondaryText, linkText, bulletColor]
const DEFAULT_THEME_THREE = [
  "#E0F7FA", // Very Light Cyan/Blue (sidebarBg)
  "#212121", // Dark Gray/Black (mainText)
  "#00ACC1", // Vibrant Cyan/Teal (accentColor)
  "#666666", // Medium Gray (secondaryText)
  "#00ACC1", // Vibrant Cyan/Teal (linkText)
  "#00ACC1", // Vibrant Cyan/Teal (bulletColor)
];

// Simple Title Component for sections
const Title: React.FC<{ text: string; color: string; borderColor?: string }> = ({ 
  text, 
  color, 
  borderColor 
}) => (
  <h2 
    className="text-xs font-extrabold mb-2 tracking-wider" 
    style={{ 
      color: color,
      borderBottomWidth: borderColor ? '2px' : undefined,
      borderBottomColor: borderColor || 'transparent',
      borderBottomStyle: 'solid'
    }}
  >
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
  const colors = colorPalette && colorPalette.length >= 6 ? colorPalette : DEFAULT_THEME_THREE;

  // Destructure the colors array into named variables for easier use
  const [sidebarBg, , accentColor, , , bulletColor] = colors;

  // Define fixed text colors for consistency and readability
  const sidebarFixedTextColor = "#212121"; // Dark gray
  const sidebarFixedSecondaryTextColor = "#666666"; // Medium gray
  const sidebarFixedLinkColor = "#00ACC1"; // Vibrant Cyan

  const mainContentTextColor = "#212121"; // Dark gray
  const mainContentSecondaryTextColor = "#666666"; // Medium gray
  const mainContentLinkColor = "#00ACC1"; // Vibrant Cyan

  // Extract skills and interests as simple names for bullet lists
  const technicalSkills = resumeData.skills?.map(s => s.name).filter(Boolean) as string[] || [];
  const softSkills = resumeData.interests?.map(i => i.name).filter(Boolean) as string[] || [];
  const certificationsList = resumeData.certifications?.map(c => c.title).filter(Boolean) as string[] || [];

  return (
    <div
      id={id}
      className="bg-white text-gray-900 w-full h-full font-sans text-sm leading-relaxed"
      style={{ boxShadow: "none" }}
    >
      <div className="h-full grid grid-cols-[1.5fr_3.5fr]"> {/* Two-column layout */}
        {/* Left Column (Sidebar) */}
        <div
          className="flex flex-col py-8 px-6"
          style={{ backgroundColor: sidebarBg, height: '100%' }}
        >
          {/* Profile Picture */}
          <div className="w-[90px] h-[90px] rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-white mx-auto mb-3 resume-section">
            {resumeData.profileInfo.profilePictureUrl ? (
              <img
                src={resumeData.profileInfo.profilePictureUrl}
                alt={resumeData.profileInfo.fullName || "Profile"}
                className="w-[82px] h-[82px] rounded-full object-cover"
              />
            ) : (
              <div
                className="w-[82px] h-[82px] flex items-center justify-center text-4xl rounded-full"
                style={{ color: accentColor }}
              >
                <User className="w-10 h-10" />
              </div>
            )}
          </div>

          {/* Name and Designation */}
          <div className="text-center mb-4 resume-section">
            <h1 className="text-base font-bold mb-1 uppercase" style={{ color: sidebarFixedTextColor }}>{resumeData.profileInfo.fullName || "Your Name Here"}</h1>
            <p className="text-xs uppercase tracking-wide" style={{ color: sidebarFixedTextColor }}>{resumeData.profileInfo.designation || "Your Designation"}</p>
          </div>

          {/* Contact Information */}
          {hasContactInfo(resumeData.contactInfo) && (
            <div className="mb-4 pt-0 pb-2 resume-section">
              <Title text="Contact" color={accentColor} />
              <div className="space-y-2">
                {resumeData.contactInfo.email && (
                  <div className="flex items-center gap-4">
                    <Mail className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="text-xs break-all" style={{ color: sidebarFixedTextColor }}>{resumeData.contactInfo.email}</span>
                  </div>
                )}
                {resumeData.contactInfo.phone && (
                  <div className="flex items-center gap-4">
                    <Phone className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="text-xs" style={{ color: sidebarFixedTextColor }}>{resumeData.contactInfo.phone}</span>
                  </div>
                )}
                {resumeData.contactInfo.location && (
                  <div className="flex items-center gap-4">
                    <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="text-xs" style={{ color: sidebarFixedTextColor }}>{resumeData.contactInfo.location}</span>
                  </div>
                )}
                {resumeData.contactInfo.linkedin && (
                  <div className="flex items-center gap-4">
                    <Linkedin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline break-all" style={{ color: sidebarFixedLinkColor }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.linkedin)}
                    </a>
                  </div>
                )}
                {resumeData.contactInfo.github && (
                  <div className="flex items-center gap-4">
                    <Github className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.github} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline break-all" style={{ color: sidebarFixedLinkColor }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.github)}
                    </a>
                  </div>
                )}
                {resumeData.contactInfo.website && (
                  <div className="flex items-center gap-4">
                    <Globe className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline break-all" style={{ color: sidebarFixedLinkColor }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.website)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills (Technical) */}
          {technicalSkills.length > 0 && (
            <div className="mb-4 resume-section">
              <Title text="Skills" color={accentColor} />
              <div className="space-y-2">
                {resumeData.skills?.map((skill, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 items-center">
                    <span className="text-xs" style={{ color: sidebarFixedTextColor }}>{skill.name}</span>
                    <div className="w-full bg-white rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          backgroundColor: accentColor, 
                          width: `${(skill.proficiency || 0) * 20}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {hasArrayData(resumeData.languages) && (
            <div className="mb-4 resume-section">
              <Title text="Languages" color={accentColor} />
              <div className="space-y-2">
                {resumeData.languages?.map((language, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 items-center">
                    <span className="text-xs" style={{ color: sidebarFixedTextColor }}>{language.name}</span>
                    <div className="w-full bg-white rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          backgroundColor: accentColor, 
                          width: `${(language.proficiency || 0) * 20}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {hasArrayData(resumeData.certifications) && (
            <div className="mb-4 resume-section">
              <Title text="Certifications" color={accentColor} />
              <div className="space-y-2">
                {resumeData.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-xs mr-2 mt-1" style={{ color: bulletColor }}>•</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: sidebarFixedTextColor }}>{cert.title}</span>
                        {cert.year && (
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded" 
                            style={{ 
                              backgroundColor: sidebarBg, 
                              color: '#000000',
                              border: `1px solid ${accentColor}`
                            }}
                          >
                            {cert.year}
                          </span>
                        )}
                      </div>
                      {cert.issuer && (
                        <div className="text-xs italic mt-0.5" style={{ color: sidebarFixedSecondaryTextColor }}>
                          {cert.issuer}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests (Soft Skills) */}
          {softSkills.length > 0 && (
            <div className="mb-4 resume-section">
              <Title text="Soft Skills" color={accentColor} />
              <div className="ml-3">
                {softSkills.map((skill, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <span className="text-xs mr-2" style={{ color: bulletColor }}>•</span>
                    <span className="text-xs" style={{ color: sidebarFixedTextColor }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Main Content) */}
        <div
          className="flex flex-col py-8 px-6"
          style={{ color: mainContentTextColor, height: '100%' }}
        >
          {/* Professional Summary */}
          {resumeData.profileInfo.summary && (
            <div className="mb-4 resume-section">
              <Title text="Profile" color={accentColor} />
              <p className="text-sm leading-relaxed" style={{ color: mainContentTextColor }}>{resumeData.profileInfo.summary || "A short introduction about yourself..."}</p>
            </div>
          )}

          {/* Education */}
          {hasArrayData(resumeData.education) && (
            <div className="mb-4 resume-section">
              <Title text="Education" color={accentColor} />
              <div className="space-y-3">
                {resumeData.education.map((edu, index) => (
                  <div key={`education_${index}`}>
                    <p className="text-sm font-bold" style={{ color: mainContentTextColor }}>{edu.institution || "Your Institution"}</p>
                    <p className="text-xs" style={{ color: mainContentTextColor }}>{edu.degree || "Your Degree"}</p>
                    <p className="text-xs italic" style={{ color: mainContentSecondaryTextColor }}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {hasArrayData(resumeData.workExperiences) && (
            <div className="mb-4 resume-section">
              <Title text="Experience" color={accentColor} />
              <div className="space-y-4 mt-2">
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
                      <div className="ml-4 mt-2">
                        {data.description.split('. ').filter(Boolean).map((point, i) => (
                          <div key={i} className="flex items-start mb-1">
                            <span className="text-xs mr-2 mt-1" style={{ color: accentColor }}>•</span>
                            <span className="text-xs" style={{ color: mainContentTextColor }}>{point.trim()}{point.endsWith('.') ? '' : '.'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasArrayData(resumeData.projects) && (
            <div className="mb-4 resume-section">
              <Title text="Projects" color={accentColor} />
              <div className="space-y-3 mt-2">
                {resumeData.projects.map((project, index) => (
                  <ProjectInfo
                    key={`project_${index}`}
                    title={project.title || "Project Title"}
                    description={project.description || "Project Description"}
                    githubLink={project.github}
                    liveDemoUrl={project.LiveDemo}
                    bgColor={sidebarBg}
                    iconColor={accentColor}
                    templateVersion="large"
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