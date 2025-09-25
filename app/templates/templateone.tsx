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
import ProjectInfo from "./resumesection/projectinfo";
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

const TemplateOne: React.FC<TemplateOneProps> = ({ resumeData, colorPalette, id }) => { // Removed scale from props
  const themeColors = colorPalette && colorPalette.length > 0 ? colorPalette : DEFAULT_THEME;

  // Helper to check if an array section has any meaningful data
  const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)));
  
  // Helper to check if contact info has any meaningful data
  const hasContactInfo = Object.values(resumeData.contactInfo).some(val => val !== undefined && val !== null && val !== '');

  return (
    <div
      id={id} // Apply the ID here
      className="bg-white text-gray-900 w-full h-full p-8" // Apply overall A4 margins here (e.g., p-8 for 32px all around)
      style={{
        textAlign: "left",
        // Removed fixed width/height and transform: scale here
        // These are now handled by the parent ResumePreview component
        boxShadow: "none", // Removed shadow to prevent blurry edges
        // Removed overflow: "hidden", // Removed to prevent content clipping in PDF
      }}
    >
      <div className="flex h-full"> {/* This div now takes up the remaining height after p-8 */}
        {/* Left Column (Sidebar) */}
        <div
          className="w-4/12 flex-shrink-0 flex flex-col" // Added flex flex-col
          style={{ backgroundColor: themeColors[0] }}
        >
          {/* Content inside left column, add padding here */}
          <div className="py-6 px-4 flex-1"> {/* Added flex-1 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-[100px] h-[100px] max-w-[110px] max-h-[110px] rounded-full flex items-center justify-center overflow-hidden bg-white" // Changed to white background
              >
                {resumeData.profileInfo.profilePictureUrl ? (
                  <img
                    src={resumeData.profileInfo.profilePictureUrl}
                    alt={resumeData.profileInfo.fullName || "Profile"}
                    className="w-[90px] h-[90px] rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-[90px] h-[90px] flex items-center justify-center text-5xl rounded-full"
                    style={{ color: themeColors[4] }} // Dark grey icon color
                  >
                    <User className="w-8 h-8" /> {/* Reduced icon size */}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold mt-3 text-gray-800">{resumeData.profileInfo.fullName || "Your Name Here"}</h2> {/* Reduced font size */}
              <p className="text-xs text-center text-gray-700">{resumeData.profileInfo.designation || "Your Designation"}</p> {/* Reduced font size */}
            </div>

            {hasContactInfo && (
              <div className="my-6 mx-0 px-2 resume-section"> {/* Added resume-section */}
                <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                  Contact
                </h3>
                
                {resumeData.contactInfo.location && (
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700 leading-tight">
                      {resumeData.contactInfo.location}
                    </span>
                  </div>
                )}
                
                {resumeData.contactInfo.email && (
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-3 h-3 text-gray-600 flex-shrink-0" />
                    <span className="text-xs text-gray-700 break-all">
                      {resumeData.contactInfo.email}
                    </span>
                  </div>
                )}
                
                {resumeData.contactInfo.phone && (
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-3 h-3 text-gray-600 flex-shrink-0" />
                    <span className="text-xs text-gray-700">
                      {resumeData.contactInfo.phone}
                    </span>
                  </div>
                )}
                
                {resumeData.contactInfo.linkedin && (
                  <div className="flex items-center gap-2 mb-2">
                    <Linkedin className="w-3 h-3 text-gray-600 flex-shrink-0" />
                    <a href={resumeData.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 truncate">
                      {cleanUrlForDisplay(resumeData.contactInfo.linkedin)}
                    </a>
                  </div>
                )}
                
                {resumeData.contactInfo.github && (
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-3 h-3 text-gray-600 flex-shrink-0" />
                    <a href={resumeData.contactInfo.github} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 truncate">
                      {cleanUrlForDisplay(resumeData.contactInfo.github)}
                    </a>
                  </div>
                )}
                
                {resumeData.contactInfo.website && (
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-3 h-3 text-gray-600 flex-shrink-0" />
                    <a href={resumeData.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 truncate">
                      {cleanUrlForDisplay(resumeData.contactInfo.website)}
                    </a>
                  </div>
                )}
              </div>
            )}

            {hasArrayData(resumeData.education) && (
              <div className="mt-5 resume-section"> {/* Added resume-section */}
                <Title text="Education" color={themeColors[4]} /> {/* Changed color to themeColors[4] */}
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
              <div className="mt-5 resume-section"> {/* Added resume-section */}
                <Title text="Languages" color={themeColors[4]} /> {/* Changed color to themeColors[4] */}
                <LanguageSection
                  languages={resumeData.languages}
                  accentColor={themeColors[3]}
                  bgColor={themeColors[2]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Main Content) */}
        <div className="w-8/12 flex-shrink-0 flex flex-col"> {/* Added flex flex-col */}
          {/* Content inside right column, add padding here */}
          <div className="py-6 px-4 flex-1"> {/* Added flex-1 */}
            {resumeData.profileInfo.summary && (
              <div className="resume-section"> {/* Added resume-section */}
                <Title text="Professional Summary" color={themeColors[4]} /> {/* Changed color to themeColors[4] */}
                <p className="text-xs font-medium text-gray-800"> {/* Reduced font size */}
                  {resumeData.profileInfo.summary || "A short introduction about yourself..."}
                </p>
              </div>
            )}

            {hasArrayData(resumeData.workExperiences) && (
              <div className="mt-4 resume-section"> {/* Added resume-section */}
                <Title text="Work Experience" color={themeColors[4]} /> {/* Changed color to themeColors[4] */}
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
              <div className="mt-4 resume-section"> {/* Added resume-section */}
                <Title text="Projects" color={themeColors[4]} /> {/* Changed color to themeColors[4] */}
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
                    />
                  );
                })}
              </div>
            )}

            {hasArrayData(resumeData.skills) && (
              <div className="mt-4 resume-section"> {/* Added resume-section */}
                <Title text="Skills" color={themeColors[4]} /> {/* Changed color to themeColors[4] */}
                <SkillSection
                  skills={resumeData.skills}
                  accentColor={themeColors[3]}
                  bgColor={themeColors[2]}
                />
              </div>
            )}

            {hasArrayData(resumeData.certifications) && (
              <div className="mt-4 resume-section"> {/* Added resume-section */}
                <Title text="Certifications" color={themeColors[4]} /> {/* Changed color to themeColors[4] */}
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
              <div className="mt-4 resume-section"> {/* Added resume-section */}
                <Title text="Interests" color={themeColors[4]} /> {/* Changed color to themeColors[4] */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {resumeData.interests.map((interest, index) => {
                    if (!interest.name) return null; // Filter out empty strings
                    return (
                      <div
                        key={`interest_${index}`}
                        className="text-[10px] font-medium py-1 px-3 rounded-lg text-gray-800"
                        style={{ backgroundColor: themeColors[2] }}
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