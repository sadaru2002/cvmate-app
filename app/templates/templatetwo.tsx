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

// Simple Title Component for sections - Updated to match PDF exactly
const Title: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <h2 
    className="font-bold border-b border-gray-300" 
    style={{ 
      fontSize: '9pt', // Exact match to PDF (12pt in PDF = 9pt in web)
      marginBottom: '7.5pt',
      paddingBottom: '2.25pt',
      color: color
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
const hasArrayData = (arr?: any[]) => {
  if (!arr || arr.length === 0) return false;

  // Check if any item has a non-empty 'name' property (for skills, languages, interests)
  if (arr.some(item => item && typeof item === 'object' && 'name' in item)) {
    return arr.some(item => item.name && item.name.trim() !== '');
  }

  // Fallback for other arrays (e.g., workExperiences, education, projects, certifications)
  return arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)));
};

// Helper to check if contact info has any meaningful data
const hasContactInfo = (contactInfo: TemplateResumeData['contactInfo']) => Object.values(contactInfo).some(val => val !== undefined && val !== null && val !== '');

const TemplateTwo: React.FC<TemplateProps> = ({ resumeData, colorPalette, id }) => {
  const themeColors = colorPalette && colorPalette.length > 0 ? colorPalette : DEFAULT_THEME_TWO;

  return (
    <div
      id={id}
      className="bg-white text-gray-900 w-full h-full font-sans"
      style={{
        padding: '22.5pt', // Exact match to PDF (30pt in PDF = 22.5pt in web)
        fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
        color: '#111827',
        lineHeight: 1.4,
        boxShadow: "none",
      }}
    >
      <div className="h-full flex" style={{ gap: '15pt' }}> {/* Exact match to PDF (20pt in PDF = 15pt in web) */}
        {/* Left Column - Updated to match PDF exactly */}
        <div className="flex flex-col" style={{ width: '65%' }}> {/* Exact match to PDF */}
          {/* Name and Designation */}
          <div className="resume-section" style={{ marginBottom: '9pt' }}> {/* Exact match to PDF (12pt in PDF = 9pt in web) */}
            <h1 
              className="font-bold" 
              style={{ 
                fontSize: '21pt', // Exact match to PDF (28pt in PDF = 21pt in web)
                color: '#1a1a1a',
                marginBottom: '3pt', // Exact match to PDF (4pt in PDF = 3pt in web)
                letterSpacing: '0.375pt' // Exact match to PDF (0.5pt in PDF = 0.375pt in web)
              }}
            >
              {resumeData.profileInfo.fullName || "Your Name Here"}
            </h1>
            <p 
              style={{ 
                fontSize: '9.75pt', // Exact match to PDF (13pt in PDF = 9.75pt in web)
                color: themeColors[3],
                marginBottom: '3pt' // Exact match to PDF
              }}
            >
              {resumeData.profileInfo.designation || "Your Designation"}
            </p>
          </div>

          {/* Contact Information - Updated to match PDF exactly */}
          {hasContactInfo(resumeData.contactInfo) && (
            <div className="resume-section" style={{ marginBottom: '7.5pt' }}> {/* Exact match to PDF (10pt in PDF = 7.5pt in web) */}
              <div className="flex flex-col" style={{ gap: '2.25pt' }}> {/* Exact match to PDF (3pt in PDF = 2.25pt in web) */}
                <div className="flex" style={{ gap: '7.5pt' }}> {/* Exact match to PDF (10pt in PDF = 7.5pt in web) */}
                  {resumeData.contactInfo.email && (
                    <div className="flex items-center" style={{ width: '48%', gap: '3pt' }}> {/* Exact match to PDF */}
                      <Mail 
                        style={{ 
                          width: '7.5pt', // Exact match to PDF (10pt in PDF = 7.5pt in web)
                          height: '7.5pt',
                          marginRight: '1.5pt', // Exact match to PDF (2pt in PDF = 1.5pt in web)
                          color: themeColors[3]
                        }} 
                      />
                      <span 
                        style={{ 
                          fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                          color: '#374151',
                          flex: 1
                        }}
                      >
                        {resumeData.contactInfo.email}
                      </span>
                    </div>
                  )}
                  {resumeData.contactInfo.location && (
                    <div className="flex items-center" style={{ width: '48%', gap: '3pt' }}>
                      <MapPin 
                        style={{ 
                          width: '7.5pt',
                          height: '7.5pt',
                          marginRight: '1.5pt',
                          color: themeColors[3]
                        }} 
                      />
                      <span 
                        style={{ 
                          fontSize: '6.75pt',
                          color: '#374151',
                          flex: 1
                        }}
                      >
                        {resumeData.contactInfo.location}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex" style={{ gap: '7.5pt' }}>
                  {resumeData.contactInfo.phone && (
                    <div className="flex items-center" style={{ width: '48%', gap: '3pt' }}>
                      <Phone 
                        style={{ 
                          width: '7.5pt',
                          height: '7.5pt',
                          marginRight: '1.5pt',
                          color: themeColors[3]
                        }} 
                      />
                      <span 
                        style={{ 
                          fontSize: '6.75pt',
                          color: '#374151',
                          flex: 1
                        }}
                      >
                        {resumeData.contactInfo.phone}
                      </span>
                    </div>
                  )}
                  {resumeData.contactInfo.linkedin && (
                    <div className="flex items-center" style={{ width: '48%', gap: '3pt' }}>
                      <Linkedin 
                        style={{ 
                          width: '7.5pt',
                          height: '7.5pt',
                          marginRight: '1.5pt',
                          color: themeColors[3]
                        }} 
                      />
                      <a 
                        href={resumeData.contactInfo.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          fontSize: '6.75pt',
                          color: themeColors[3],
                          textDecoration: 'none',
                          flex: 1
                        }}
                      >
                        {cleanUrlForDisplay(resumeData.contactInfo.linkedin)}
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex" style={{ gap: '7.5pt' }}>
                  {resumeData.contactInfo.github && (
                    <div className="flex items-center" style={{ width: '48%', gap: '3pt' }}>
                      <Github 
                        style={{ 
                          width: '7.5pt',
                          height: '7.5pt',
                          marginRight: '1.5pt',
                          color: themeColors[3]
                        }} 
                      />
                      <a 
                        href={resumeData.contactInfo.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          fontSize: '6.75pt',
                          color: themeColors[3],
                          textDecoration: 'none',
                          flex: 1
                        }}
                      >
                        {cleanUrlForDisplay(resumeData.contactInfo.github)}
                      </a>
                    </div>
                  )}
                  {resumeData.contactInfo.website && (
                    <div className="flex items-center" style={{ width: '48%', gap: '3pt' }}>
                      <Globe 
                        style={{ 
                          width: '7.5pt',
                          height: '7.5pt',
                          marginRight: '1.5pt',
                          color: themeColors[3]
                        }} 
                      />
                      <a 
                        href={resumeData.contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          fontSize: '6.75pt',
                          color: themeColors[3],
                          textDecoration: 'none',
                          flex: 1
                        }}
                      >
                        {cleanUrlForDisplay(resumeData.contactInfo.website)}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Professional Summary - Updated to match PDF exactly */}
          {resumeData.profileInfo.summary && (
            <div className="resume-section" style={{ marginBottom: '7.5pt' }}>
              <Title text="Summary" color={themeColors[4]} />
              <p 
                style={{ 
                  fontSize: '6.75pt', // Exact match to PDF
                  color: '#374151',
                  lineHeight: 1.4
                }}
              >
                {resumeData.profileInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience - Updated to match PDF exactly */}
          {hasArrayData(resumeData.workExperiences) && (
            <div className="resume-section" style={{ marginBottom: '7.5pt' }}>
              <Title text="Experience" color={themeColors[4]} />
              <div style={{ gap: '2.25pt' }}>
                {resumeData.workExperiences.map((exp, index) => (
                  <WorkExperience
                    key={`work_${index}`}
                    company={exp.company || "Company Name"}
                    role={exp.role || "Your Role"}
                    duration={`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}
                    durationColor={themeColors[4]}
                    description={exp.description || "What did you do in this role?"}
                    companyColor={themeColors[3]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Education - Updated to match PDF exactly */}
          {hasArrayData(resumeData.education) && (
            <div className="resume-section" style={{ marginBottom: '7.5pt' }}>
              <Title text="Education" color={themeColors[4]} />
              <div style={{ gap: '2.25pt' }}>
                {resumeData.education.map((edu, index) => (
                  <EducationInfo
                    key={`education_${index}`}
                    degree={edu.degree || "Your Degree"}
                    institution={edu.institution || "Your Institution"}
                    duration={`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}
                    institutionColor={themeColors[3]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Projects - Updated to match PDF exactly */}
          {hasArrayData(resumeData.projects) && (
            <div className="resume-section" style={{ marginBottom: '7.5pt' }}>
              <Title text="Projects" color={themeColors[4]} />
              <div style={{ gap: '2.25pt' }}>
                {resumeData.projects.map((project, index) => (
                  <ProjectInfo
                    key={`project_${index}`}
                    title={project.title || "Project Title"}
                    description={project.description || "Project Description"}
                    githubLink={project.github}
                    liveDemoUrl={project.LiveDemo}
                    bgColor={themeColors[0]}
                    iconColor={themeColors[3]}
                    templateVersion="medium"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Updated to match PDF exactly */}
        <div className="flex flex-col items-start" style={{ width: '35%', paddingLeft: '11.25pt' }}> {/* Exact match to PDF (15pt in PDF = 11.25pt in web) */}
          {/* Profile Picture - Updated to match PDF exactly */}
          <div 
            className="rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-gray-300 resume-section"
            style={{
              width: '90pt', // Exact match to PDF (120pt in PDF = 90pt in web)
              height: '90pt',
              marginBottom: '7.5pt' // Exact match to PDF
            }}
          >
            {resumeData.profileInfo.profilePictureUrl ? (
              <img
                src={resumeData.profileInfo.profilePictureUrl}
                alt={resumeData.profileInfo.fullName || "Profile"}
                className="rounded-full object-cover"
                style={{
                  width: '82.5pt', // Exact match to PDF (110pt in PDF = 82.5pt in web)
                  height: '82.5pt'
                }}
              />
            ) : (
              <div
                className="flex items-center justify-center rounded-full"
                style={{ 
                  width: '82.5pt',
                  height: '82.5pt',
                  color: themeColors[3],
                  fontSize: '37.5pt' // Exact match to PDF (50pt in PDF = 37.5pt in web)
                }}
              >
                <User style={{ width: '9pt', height: '9pt' }} />
              </div>
            )}
          </div>

          {/* Skills - Updated to match PDF exactly */}
          {hasArrayData(resumeData.skills) && (
            <div className="w-full resume-section" style={{ marginBottom: '7.5pt' }}>
              <Title text="Skills" color={themeColors[4]} />
              <SkillListWithProgress
                skills={resumeData.skills}
                textColor={themeColors[4]}
                accentColor={themeColors[3]}
                dotBgColor={themeColors[2]}
              />
            </div>
          )}

          {/* Languages - Updated to match PDF exactly */}
          {hasArrayData(resumeData.languages) && (
            <div className="w-full resume-section" style={{ marginBottom: '7.5pt' }}>
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
            <div className="w-full mb-4 resume-section">
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
            <div className="w-full mb-4 resume-section">
              <Title text="Volunteer Work" color={themeColors[4]} />
              <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-700">
                {resumeData.interests.filter(i => i.name.toLowerCase().includes("volunteer")).map((interest, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColors[3] }} />
                    {interest.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passions (using interests for now, excluding volunteer) */}
          {hasArrayData(resumeData.interests.filter(i => !i.name.toLowerCase().includes("volunteer"))) && (
            <div className="w-full mb-4 resume-section">
              <Title text="Passions" color={themeColors[4]} />
              <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-700">
                {resumeData.interests.filter(i => !i.name.toLowerCase().includes("volunteer")).map((interest, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColors[3] }} />
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