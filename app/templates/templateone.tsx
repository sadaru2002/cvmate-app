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
} from "lucide-react";

// Import section components
import EducationInfo from "./resumesection/Educationinfo";
import WorkExperience from "./resumesection/Workexperience";
import ProjectInfo from "./resumesection/projectinfo.tsx";
import SkillSection from "./resumesection/SkillSection";
import CertificationInfo from "./resumesection/CertificationInfo";
import LanguageSection from "./resumesection/Languagesection";
import { cleanUrlForDisplay } from "@/lib/utils"; // Import the utility function

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

interface TemplateOneProps {
  resumeData: TemplateResumeData;
  colorPalette?: string[];
  id?: string; // Add id prop
}

const DEFAULT_THEME = ["#EBFDFF", "#A1FAFD", "#ACEAFE", "#008899", "#4A5568"];

// Simple Title Component for sections - Updated to match PDF exactly
const Title: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <h2 className="text-[9pt] font-bold mb-[6.75pt] pb-[2.25pt] border-b border-gray-300 text-gray-800" style={{ borderBottomColor: '#D1D5DB' }}>
    {text}
  </h2>
);

// Utility function to format year-month
const formatYearMonth = (dateString?: string) => {
  if (!dateString) return "Present";
  // Basic formatting, could be enhanced with date-fns
  return dateString;
};

const TemplateOne: React.FC<TemplateOneProps> = ({ resumeData, colorPalette, id }) => { // Removed scale from props
  const themeColors = colorPalette && colorPalette.length > 0 ? colorPalette : DEFAULT_THEME;

  // Helper to check if an array section has any meaningful data
  const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)));
  
  // Helper to check if contact info has any meaningful data
  const hasContactInfo = Object.values(resumeData.contactInfo).some(val => val !== undefined && val !== null && val !== '');

  return (
    <div
      id={id} // Apply the ID here
      className="bg-white text-gray-900 w-full h-full" // Updated to match PDF padding
      style={{
        padding: '7.5mm', // Exact match to PDF: 10mm padding converted to 7.5mm for web
        textAlign: "left",
        boxShadow: "none", // Removed shadow to prevent blurry edges
      }}
    >
      <div className="flex h-full"> {/* This div now takes up the remaining height after p-8 */}
        {/* Left Column (Sidebar) - Updated to match PDF exactly */}
        <div
          className="flex-shrink-0 flex flex-col"
          style={{ 
            width: '35%', // Exact match to PDF
            backgroundColor: themeColors[0] 
          }}
        >
          {/* Content inside left column - Updated padding to match PDF */}
          <div className="flex-1" style={{ paddingTop: '11.25pt', paddingBottom: '11.25pt', paddingLeft: '9pt', paddingRight: '9pt' }}>
            <div className="flex flex-col items-center">
              <div
                className="rounded-full flex items-center justify-center overflow-hidden bg-white mb-[6pt]"
                style={{
                  width: '60pt', // Exact match to PDF (80pt in PDF = 60pt in web)
                  height: '60pt', // Exact match to PDF
                  backgroundColor: '#FFFFFF'
                }}
              >
                {resumeData.profileInfo.profilePictureUrl ? (
                  <img
                    src={resumeData.profileInfo.profilePictureUrl}
                    alt={resumeData.profileInfo.fullName || "Profile"}
                    className="rounded-full object-cover"
                    style={{
                      width: '60pt', // Exact match to PDF
                      height: '60pt' // Exact match to PDF
                    }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{ 
                      width: '60pt',
                      height: '60pt',
                      color: themeColors[4],
                      fontSize: '24pt' // Exact match to PDF (32pt in PDF = 24pt in web)
                    }}
                  >
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>

              <h2 
                className="font-bold text-center text-gray-800" 
                style={{ 
                  fontSize: '10.125pt', // Exact match to PDF (13.5pt in PDF = 10.125pt in web)
                  marginBottom: '3pt',
                  marginTop: '6.75pt' // Exact match to PDF (9pt in PDF = 6.75pt in web)
                }}
              >
                {resumeData.profileInfo.fullName || "Your Name Here"}
              </h2>
              <p 
                className="text-center text-gray-700" 
                style={{ 
                  fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                  marginBottom: '6pt' // Exact match to PDF (8pt in PDF = 6pt in web)
                }}
              >
                {resumeData.profileInfo.designation || "Your Designation"}
              </p>
            </div>

            {hasContactInfo && (
              <div className="resume-section" style={{ marginTop: '4.5pt' }}>
                <h3 
                  className="font-bold text-gray-800 border-b border-gray-300"
                  style={{ 
                    fontSize: '9pt', // Exact match to PDF
                    marginBottom: '6.75pt',
                    paddingBottom: '2.25pt',
                    borderBottomColor: '#D1D5DB'
                  }}
                >
                  Contact
                </h3>
                
                {resumeData.contactInfo.location && (
                  <div className="flex items-start mb-[4.5pt]" style={{ gap: '4.5pt' }}>
                    <MapPin 
                      className="flex-shrink-0 text-gray-600" 
                      style={{ 
                        width: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                        height: '6.75pt',
                        marginTop: '0.75pt' 
                      }} 
                    />
                    <span 
                      className="text-gray-700"
                      style={{ 
                        fontSize: '6.75pt', // Exact match to PDF
                        lineHeight: 1.3
                      }}
                    >
                      {resumeData.contactInfo.location}
                    </span>
                  </div>
                )}
                
                {resumeData.contactInfo.email && (
                  <div className="flex items-start mb-[4.5pt]" style={{ gap: '4.5pt' }}>
                    <Mail 
                      className="flex-shrink-0 text-gray-600" 
                      style={{ 
                        width: '6.75pt',
                        height: '6.75pt',
                        marginTop: '0.75pt' 
                      }} 
                    />
                    <span 
                      className="text-gray-700"
                      style={{ 
                        fontSize: '6.75pt',
                        lineHeight: 1.3,
                        wordBreak: 'break-all'
                      }}
                    >
                      {resumeData.contactInfo.email}
                    </span>
                  </div>
                )}
                
                {resumeData.contactInfo.phone && (
                  <div className="flex items-start mb-[4.5pt]" style={{ gap: '4.5pt' }}>
                    <Phone 
                      className="flex-shrink-0 text-gray-600" 
                      style={{ 
                        width: '6.75pt',
                        height: '6.75pt',
                        marginTop: '0.75pt' 
                      }} 
                    />
                    <span 
                      className="text-gray-700"
                      style={{ 
                        fontSize: '6.75pt',
                        lineHeight: 1.3
                      }}
                    >
                      {resumeData.contactInfo.phone}
                    </span>
                  </div>
                )}
                
                {resumeData.contactInfo.linkedin && (
                  <div className="flex items-start mb-[4.5pt]" style={{ gap: '4.5pt' }}>
                    <Linkedin 
                      className="flex-shrink-0 text-gray-600" 
                      style={{ 
                        width: '6.75pt',
                        height: '6.75pt',
                        marginTop: '0.75pt' 
                      }} 
                    />
                    <a 
                      href={resumeData.contactInfo.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 underline"
                      style={{ 
                        fontSize: '6.75pt',
                        lineHeight: 1.3,
                        flex: 1
                      }}
                    >
                      {cleanUrlForDisplay(resumeData.contactInfo.linkedin)}
                    </a>
                  </div>
                )}
                
                {resumeData.contactInfo.github && (
                  <div className="flex items-start mb-[4.5pt]" style={{ gap: '4.5pt' }}>
                    <Github 
                      className="flex-shrink-0 text-gray-600" 
                      style={{ 
                        width: '6.75pt',
                        height: '6.75pt',
                        marginTop: '0.75pt' 
                      }} 
                    />
                    <a 
                      href={resumeData.contactInfo.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 underline"
                      style={{ 
                        fontSize: '6.75pt',
                        lineHeight: 1.3,
                        flex: 1
                      }}
                    >
                      {cleanUrlForDisplay(resumeData.contactInfo.github)}
                    </a>
                  </div>
                )}
                
                {resumeData.contactInfo.website && (
                  <div className="flex items-start mb-[4.5pt]" style={{ gap: '4.5pt' }}>
                    <Globe 
                      className="flex-shrink-0 text-gray-600" 
                      style={{ 
                        width: '6.75pt',
                        height: '6.75pt',
                        marginTop: '0.75pt' 
                      }} 
                    />
                    <a 
                      href={resumeData.contactInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 underline"
                      style={{ 
                        fontSize: '6.75pt',
                        lineHeight: 1.3,
                        flex: 1
                      }}
                    >
                      {cleanUrlForDisplay(resumeData.contactInfo.website)}
                    </a>
                  </div>
                )}
              </div>
            )}

            {hasArrayData(resumeData.education) && (
              <div className="resume-section" style={{ marginTop: '3.75pt' }}>
                <Title text="Education" color={themeColors[4]} />
                {resumeData.education.map((data, index) => {
                  return (
                    <EducationInfo
                      key={`education_${index}`}
                      degree={data.degree || "Your Degree"}
                      institution={data.institution || "Your Institution"}
                      duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                    />
                  );
                })}
              </div>
            )}

            {hasArrayData(resumeData.languages) && (
              <div className="resume-section" style={{ marginTop: '3.75pt' }}>
                <Title text="Languages" color={themeColors[4]} />
                <LanguageSection
                  languages={resumeData.languages}
                  accentColor={themeColors[3]}
                  bgColor={themeColors[2]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Main Content) - Updated to match PDF exactly */}
        <div className="flex-shrink-0 flex flex-col" style={{ width: '65%' }}>
          {/* Content inside right column - Updated padding to match PDF */}
          <div className="flex-1" style={{ paddingTop: '11.25pt', paddingBottom: '11.25pt', paddingLeft: '9pt', paddingRight: '9pt' }}>
            {resumeData.profileInfo.summary && (
              <div className="resume-section">
                <Title text="Professional Summary" color={themeColors[4]} />
                <p 
                  className="font-medium text-gray-800"
                  style={{ 
                    fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                    lineHeight: 1.4,
                    textAlign: 'justify'
                  }}
                >
                  {resumeData.profileInfo.summary || "A short introduction about yourself..."}
                </p>
              </div>
            )}

            {hasArrayData(resumeData.workExperiences) && (
              <div className="resume-section" style={{ marginTop: '3pt' }}>
                <Title text="Work Experience" color={themeColors[4]} />
                {resumeData.workExperiences.map((data, index) => {
                  return (
                    <WorkExperience
                      key={`work_${index}`}
                      company={data.company || "Company Name"}
                      role={data.role || "Your Role"}
                      duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                      durationColor={themeColors[4]}
                      description={data.description || "What did you do in this role?"}
                    />
                  );
                })}
              </div>
            )}

            {hasArrayData(resumeData.projects) && (
              <div className="resume-section" style={{ marginTop: '3pt' }}>
                <Title text="Projects" color={themeColors[4]} />
                {resumeData.projects.map((project, index) => {
                  return (
                    <ProjectInfo
                      key={`project_${index}`}
                      title={project.title || "Project Title"}
                      description={project.description || "Project Description"}
                      githubLink={project.github}
                      liveDemoUrl={project.LiveDemo}
                      bgColor={themeColors[2]}
                      iconColor={themeColors[4]}
                      templateVersion="templateOne"
                    />
                  );
                })}
              </div>
            )}

            {hasArrayData(resumeData.skills) && (
              <div className="resume-section" style={{ marginTop: '3pt' }}>
                <Title text="Skills" color={themeColors[4]} />
                <SkillSection
                  skills={resumeData.skills}
                  accentColor={themeColors[3]}
                  bgColor={themeColors[2]}
                />
              </div>
            )}

            {hasArrayData(resumeData.certifications) && (
              <div className="resume-section" style={{ marginTop: '3pt' }}>
                <Title text="Certifications" color={themeColors[4]} />
                <div className="grid grid-cols-2 gap-2">
                  {resumeData.certifications.map((data, index) => {
                    return (
                      <CertificationInfo
                        key={`cert_${index}`}
                        title={data.title || "Certification Title"}
                        issuer={data.issuer || "Issuer Name"}
                        year={data.year || "Year"}
                        bgColor={themeColors[2]}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {hasArrayData(resumeData.interests) && (
              <div className="resume-section" style={{ marginTop: '3pt' }}>
                <Title text="Interests" color={themeColors[4]} />
                <div className="flex flex-wrap gap-2 mt-2">
                  {resumeData.interests.map((interest, index) => {
                    if (!interest.name) return null; // Filter out empty strings
                    return (
                      <div
                        key={`interest_${index}`}
                        className="font-medium py-1 px-3 rounded-lg text-gray-800"
                        style={{ 
                          backgroundColor: themeColors[2],
                          fontSize: '7.5pt' // Exact match to PDF (10px = 7.5pt)
                        }}
                      >
                        {interest.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;