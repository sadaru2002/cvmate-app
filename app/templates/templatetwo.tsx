"use client"

import React from "react"
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
  // Removed Heart icon as it's no longer needed directly
} from "lucide-react"

// Import section components
import EducationInfo from "./resumesection/Educationinfo"
import WorkExperience from "./resumesection/Workexperience"
import ProjectInfo from "./resumesection/projectinfo.tsx"
import CertificationInfo from "./resumesection/CertificationInfo"
import SkillListWithProgress from "./resumesection/SkillListWithProgress"
import SimpleLanguageList from "./resumesection/SimpleLanguageList"
import { cleanUrlForDisplay } from "@/lib/utils"

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
  colorPalette?: string[];
  id?: string; // Add id prop
}

// Default theme for TemplateTwo (Modern Professional - based on image)
const DEFAULT_THEME_TWO = ["#f8f9fa", "#e9ecef", "#dee2e6", "#007bff", "#343a40"]; // Lightest Gray, Lighter Gray, Border Gray, Accent Blue, Dark Text/Header

// Simple Title Component for sections
const Title: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <h2 className="text-base font-bold mb-3 pb-1 border-b" style={{ borderColor: color, color: color }}>
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

const TemplateTwo: React.FC<TemplateProps> = ({ resumeData, colorPalette, id }) => {
  const themeColors = colorPalette && colorPalette.length > 0 ? colorPalette : DEFAULT_THEME_TWO;

  return (
    <div
      id={id}
      className="bg-white text-gray-900 w-full h-full p-8 font-sans text-sm leading-relaxed" // Adjusted base font size and added p-8
      style={{
        boxShadow: "none",
        // Removed overflow: "hidden", // Removed to prevent content clipping in PDF
      }}
    >
      <div className="h-full grid grid-cols-[2.5fr_1fr] gap-x-8"> {/* Two-column layout */}
        {/* Left Column */}
        <div className="flex flex-col">
          {/* Name and Designation */}
          <div className="mb-6 resume-section"> {/* Added resume-section */}
            <h1 className="text-3xl font-bold mb-1" style={{ color: themeColors[4] }}>{resumeData.profileInfo.fullName || "Your Name Here"}</h1>
            <p className="text-lg" style={{ color: themeColors[3] }}>{resumeData.profileInfo.designation || "Your Designation"}</p>
          </div>

          {/* Contact Information */}
          {hasContactInfo(resumeData.contactInfo) && (
            <div className="mb-6 resume-section"> {/* Added resume-section */}
              <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm text-gray-700">
                {resumeData.contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: themeColors[3] }} /> {resumeData.contactInfo.email}
                  </div>
                )}
                {resumeData.contactInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: themeColors[3] }} /> {resumeData.contactInfo.location}
                  </div>
                )}
                {resumeData.contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: themeColors[3] }} /> {resumeData.contactInfo.phone}
                  </div>
                )}
                {resumeData.contactInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" style={{ color: themeColors[3] }} /> <a href={resumeData.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: themeColors[3] }}>{cleanUrlForDisplay(resumeData.contactInfo.linkedin)}</a>
                  </div>
                )}
                {resumeData.contactInfo.github && (
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" style={{ color: themeColors[3] }} /> <a href={resumeData.contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: themeColors[3] }}>{cleanUrlForDisplay(resumeData.contactInfo.github)}</a>
                  </div>
                )}
                {resumeData.contactInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" style={{ color: themeColors[3] }} /> <a href={resumeData.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: themeColors[3] }}>{cleanUrlForDisplay(resumeData.contactInfo.website)}</a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {hasArrayData(resumeData.workExperiences) && (
            <div className="mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Experience" color={themeColors[4]} />
              <div className="space-y-4">
                {resumeData.workExperiences.map((exp, index) => (
                  <WorkExperience
                    key={`work_${index}`}
                    company={exp.company || "Company Name"}
                    role={exp.role || "Your Role"}
                    duration={`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}
                    durationColor={themeColors[4]}
                    description={exp.description || "What did you do in this role?"}
                    companyColor={themeColors[3]} // Accent color for company
                  />
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {hasArrayData(resumeData.education) && (
            <div className="mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Education" color={themeColors[4]} />
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <EducationInfo
                    key={`education_${index}`}
                    degree={edu.degree || "Your Degree"}
                    institution={edu.institution || "Your Institution"}
                    duration={`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}
                    institutionColor={themeColors[3]} // Accent color for institution
                  />
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasArrayData(resumeData.projects) && (
            <div className="mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Projects" color={themeColors[4]} />
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <ProjectInfo
                    key={`project_${index}`}
                    title={project.title || "Project Title"}
                    description={project.description || "Project Description"}
                    githubLink={project.github}
                    liveDemoUrl={project.LiveDemo}
                    bgColor={themeColors[0]}
                    iconColor={themeColors[3]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-start"> {/* Changed items-center to items-start */}
          {/* Profile Picture */}
          <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-gray-300 mb-6 resume-section"> {/* Added resume-section */}
            {resumeData.profileInfo.profilePictureUrl ? (
              <img
                src={resumeData.profileInfo.profilePictureUrl}
                alt={resumeData.profileInfo.fullName || "Profile"}
                className="w-[110px] h-[110px] rounded-full object-cover"
              />
            ) : (
              <div
                className="w-[110px] h-[110px] flex items-center justify-center text-5xl rounded-full"
                style={{ color: themeColors[3] }}
              >
                <User className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Professional Summary */}
          {resumeData.profileInfo.summary && (
            <div className="w-full mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Summary" color={themeColors[4]} />
              <p className="text-sm text-gray-700">{resumeData.profileInfo.summary}</p>
            </div>
          )}

          {/* Skills */}
          {hasArrayData(resumeData.skills) && (
            <div className="w-full mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Skills" color={themeColors[4]} />
              <SkillListWithProgress
                skills={resumeData.skills}
                textColor={themeColors[4]}
                accentColor={themeColors[3]}
                dotBgColor={themeColors[2]}
              />
            </div>
          )}

          {/* Languages */}
          {hasArrayData(resumeData.languages) && (
            <div className="w-full mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Languages" color={themeColors[4]} />
              <SimpleLanguageList
                languages={resumeData.languages}
                textColor={themeColors[4]}
                accentColor={themeColors[3]}
                dotBgColor={themeColors[2]}
              />
            </div>
          )}

          {/* Certifications */}
          {hasArrayData(resumeData.certifications) && (
            <div className="w-full mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Certifications" color={themeColors[4]} />
              <div className="grid grid-cols-1 gap-y-2">
                {resumeData.certifications.map((data, index) => {
                  return (
                    <CertificationInfo
                      key={`cert_${index}`}
                      title={data.title || "Certification Title"}
                      issuer={data.issuer || "Issuer Name"}
                      year={data.year || "Year"}
                      bgColor={themeColors[0]}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Volunteer Work (using interests for now) */}
          {hasArrayData(resumeData.interests.filter(i => i.name.toLowerCase().includes("volunteer"))) && (
            <div className="w-full mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Volunteer Work" color={themeColors[4]} />
              <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-700">
                {resumeData.interests.filter(i => i.name.toLowerCase().includes("volunteer")).map((interest, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColors[3] }} /> {/* Bullet point */}
                    {interest.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passions (using interests for now, excluding volunteer) */}
          {hasArrayData(resumeData.interests.filter(i => !i.name.toLowerCase().includes("volunteer"))) && (
            <div className="w-full mb-6 resume-section"> {/* Added resume-section */}
              <Title text="Passions" color={themeColors[4]} />
              <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-700">
                {resumeData.interests.filter(i => !i.name.toLowerCase().includes("volunteer")).map((interest, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColors[3] }} /> {/* Bullet point */}
                    {interest.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateTwo;