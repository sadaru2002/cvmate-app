"use client"

import React from "react";
import {
  MapPin, Phone, Mail, Linkedin, Github, Globe,
} from "lucide-react";
import { ResumeFormData } from "@/hooks/use-resume-builder";
import { cleanUrlForDisplay } from "@/lib/utils";

interface TemplateResumeData {
  profileInfo: {
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
  interests: Array<{ name: string }>;
}

interface TemplateFiveProps {
  resumeData: TemplateResumeData;
  colorPalette?: string[];
  id?: string;
}

const DEFAULT_THEME_FIVE = [
  "#FFFFFF", // Background
  "#000000", // Main text, headings
  "#333333", // Subtle text (contact info, dates)
  "#000000", // Accent color (for lines/borders)
];

// Simple Title Component for sections
const Title: React.FC<{ text: string; color: string; accentColor: string }> = ({ text, color, accentColor }) => (
  <h2 className="text-lg font-extrabold mb-2 pb-1" style={{ color: color, borderBottom: `1px solid ${accentColor}` }}>
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

const TemplateFive: React.FC<TemplateFiveProps> = ({ resumeData, colorPalette, id }) => {
  const colors = colorPalette && colorPalette.length >= 4 ? colorPalette : DEFAULT_THEME_FIVE;
  const [mainBg, mainText, subtleText, accentColor] = colors;

  // Prepare contact info for inline display
  const contactParts: string[] = [];
  if (resumeData.contactInfo.location) contactParts.push(resumeData.contactInfo.location);
  if (resumeData.contactInfo.email) contactParts.push(resumeData.contactInfo.email);
  if (resumeData.contactInfo.phone) contactParts.push(resumeData.contactInfo.phone);
  if (resumeData.contactInfo.linkedin) contactParts.push(cleanUrlForDisplay(resumeData.contactInfo.linkedin));
  if (resumeData.contactInfo.github) contactParts.push(cleanUrlForDisplay(resumeData.contactInfo.github));
  if (resumeData.contactInfo.website) contactParts.push(cleanUrlForDisplay(resumeData.contactInfo.website));

  return (
    <div
      id={id}
      className="bg-white text-gray-900 w-full h-full p-8 font-sans text-sm leading-normal"
      style={{
        boxShadow: "none",
        // Removed overflow: "hidden", // Removed to prevent content clipping in PDF
        backgroundColor: mainBg,
        color: mainText,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header: Two-column layout */}
        <div className="mb-6 flex justify-between items-start">
          <div className="flex-1 pr-5">
            <h1 className="text-2xl font-bold uppercase mb-1 tracking-wide" style={{ color: mainText }}>
              {resumeData.profileInfo.fullName || "YOUR NAME HERE"}
            </h1>
            <h2 className="text-base font-normal uppercase mb-1 tracking-wider" style={{ color: mainText }}>
              {resumeData.profileInfo.designation || "Your Designation"}
            </h2>
          </div>

          {hasContactInfo(resumeData.contactInfo) && (
            <div className="flex-1 pl-5 text-right">
              <div className="text-xs leading-relaxed" style={{ color: subtleText }}>
                {contactParts.map((contact, index) => (
                  <div key={index} className="mb-0.5">
                    {contact}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Professional Summary */}
        {resumeData.profileInfo.summary && (
          <div className="mb-6 resume-section">
            <Title text="Professional Summary" color={mainText} accentColor={accentColor} />
            <p className="text-sm leading-relaxed" style={{ color: mainText }}>
              {resumeData.profileInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {hasArrayData(resumeData.workExperiences) && (
          <div className="mb-6 resume-section">
            <Title text="Work Experience" color={mainText} accentColor={accentColor} />
            <div className="space-y-4">
              {resumeData.workExperiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-base font-bold" style={{ color: mainText }}>{exp.role || "Role"}</h3>
                    <p className="text-sm italic" style={{ color: subtleText }}>{`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}</p>
                  </div>
                  <p className="text-sm mb-1" style={{ color: subtleText }}>{exp.company || "Company Name"}, {exp.location || "City, State"}</p>
                  {exp.description && (
                    <p className="text-sm leading-relaxed text-justify mt-2" style={{ color: mainText }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {hasArrayData(resumeData.projects) && (
          <div className="mb-6 resume-section">
            <Title text="Projects" color={mainText} accentColor={accentColor} />
            <div className="space-y-6">
              {resumeData.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-base font-bold mb-3" style={{ color: mainText }}>{project.title || "Project Title"}</h3>
                  <p className="text-sm leading-relaxed mb-3 text-justify" style={{ color: mainText }}>{project.description || "Project Description"}</p>
                  {(project.github || project.LiveDemo) && (
                    <div className="grid grid-cols-2 gap-5 mt-2">
                      <div>
                        {project.github && (
                          <div className="flex items-center text-xs">
                            <span className="mr-1 font-bold">•</span>
                            <span className="mr-1" style={{ color: subtleText }}>GitHub:</span>
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: mainText }}>
                              {cleanUrlForDisplay(project.github)}
                            </a>
                          </div>
                        )}
                      </div>
                      <div>
                        {project.LiveDemo && (
                          <div className="flex items-center text-xs">
                            <span className="mr-1 font-bold">•</span>
                            <span className="mr-1" style={{ color: subtleText }}>Live Demo:</span>
                            <a href={project.LiveDemo} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: mainText }}>
                              {cleanUrlForDisplay(project.LiveDemo)}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2x2 Grid Section */}
        <div className="space-y-4">
          {/* First Row: Education and Certifications */}
          <div className="grid grid-cols-2 gap-x-8">
            {hasArrayData(resumeData.education) && (
              <div className="resume-section">
                <Title text="Education" color={mainText} accentColor={accentColor} />
                <div className="space-y-3">
                  {resumeData.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="text-base font-bold mb-1" style={{ color: mainText }}>{edu.degree || "Degree"}</h3>
                      <p className="text-sm mb-1" style={{ color: subtleText }}>{edu.institution || "Institution Name"}, {edu.location || "City, State"}</p>
                      <p className="text-sm italic" style={{ color: subtleText }}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasArrayData(resumeData.certifications) && (
              <div className="resume-section">
                <Title text="Certifications" color={mainText} accentColor={accentColor} />
                <ul className="space-y-1 ml-2 mt-3">
                  {resumeData.certifications.map((cert, index) => (
                    cert.title && (
                      <li key={index} className="flex items-start text-sm">
                        <span className="mr-2">•</span>
                        <span style={{ color: mainText }}>{cert.title} {cert.year && `(${cert.year})`}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Second Row: Interests and Skills */}
          <div className="grid grid-cols-2 gap-x-8">
            {hasArrayData(resumeData.interests) && (
              <div className="resume-section">
                <Title text="Interests" color={mainText} accentColor={accentColor} />
                <div className="mt-3">
                  <div className="space-y-1">
                    {resumeData.interests.reduce((rows: any[], interest, index) => {
                      if (index % 2 === 0) rows.push([]);
                      rows[rows.length - 1].push(interest);
                      return rows;
                    }, []).map((row: any[], rowIndex: number) => (
                      <div key={rowIndex} className="grid grid-cols-2 gap-x-4">
                        {row.map((interest: any, index: number) => (
                          interest.name && (
                            <div key={index} className="flex items-start text-xs ml-2 mb-1">
                              <span className="mr-1 font-bold">•</span>
                              <span style={{ color: mainText }}>{interest.name}</span>
                            </div>
                          )
                        ))}
                        {row.length === 1 && <div></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {hasArrayData(resumeData.skills) && (
              <div className="resume-section">
                <Title text="Skills" color={mainText} accentColor={accentColor} />
                <div className="mt-3">
                  <div className="space-y-1">
                    {resumeData.skills.reduce((rows: any[], skill, index) => {
                      if (index % 2 === 0) rows.push([]);
                      rows[rows.length - 1].push(skill);
                      return rows;
                    }, []).map((row: any[], rowIndex: number) => (
                      <div key={rowIndex} className="grid grid-cols-2 gap-x-4">
                        {row.map((skill: any, index: number) => (
                          skill.name && (
                            <div key={index} className="flex items-start text-xs ml-2 mb-1">
                              <span className="mr-1 font-bold">•</span>
                              <span style={{ color: mainText }}>{skill.name}</span>
                            </div>
                          )
                        ))}
                        {row.length === 1 && <div></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFive;