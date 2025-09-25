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
  <h2 className="text-lg font-bold uppercase mb-2 pb-1" style={{ color: color, borderBottom: `1px solid ${accentColor}` }}>
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
        {/* Header: Name, Designation, Contact Info */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold uppercase mb-1" style={{ color: mainText }}>
            {resumeData.profileInfo.fullName || "YOUR NAME HERE"}
          </h1>
          <h2 className="text-lg font-semibold uppercase mb-2" style={{ color: mainText }}>
            {resumeData.profileInfo.designation || "Your Designation"}
          </h2>
          {hasContactInfo(resumeData.contactInfo) && (
            <p className="text-xs" style={{ color: subtleText }}>
              {contactParts.join(' | ')}
            </p>
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
                    <ul className="list-disc list-inside text-sm space-y-0.5 ml-4" style={{ color: mainText }}>
                      {exp.description.split('. ').filter(Boolean).map((point, i) => (
                        <li key={i}>{point.trim()}{point.endsWith('.') ? '' : '.'}</li>
                      ))}
                    </ul>
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
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-base font-bold mb-0.5" style={{ color: mainText }}>{project.title || "Project Title"}</h3>
                  <p className="text-sm mb-1" style={{ color: mainText }}>{project.description || "Project Description"}</p>
                  {(project.github || project.LiveDemo) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-1" style={{ color: subtleText }}>
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: mainText }}>
                          GitHub: {cleanUrlForDisplay(project.github)}
                        </a>
                      )}
                      {project.LiveDemo && (
                        <a href={project.LiveDemo} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: mainText }}>
                          Live Demo: {cleanUrlForDisplay(project.LiveDemo)}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education and Certifications in a two-column layout */}
        <div className="grid grid-cols-2 gap-x-8 mb-6">
          {hasArrayData(resumeData.education) && (
            <div className="resume-section">
              <Title text="Education" color={mainText} accentColor={accentColor} />
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-base font-bold" style={{ color: mainText }}>{edu.degree || "Degree"}</h3>
                      <p className="text-sm italic" style={{ color: subtleText }}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</p>
                    </div>
                    <p className="text-sm" style={{ color: subtleText }}>{edu.institution || "Institution Name"}, {edu.location || "City, State"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {hasArrayData(resumeData.certifications) && (
            <div className="resume-section">
              <Title text="Certifications" color={mainText} accentColor={accentColor} />
              <ul className="list-disc list-inside text-sm space-y-0.5 ml-4" style={{ color: mainText }}>
                {resumeData.certifications.map((cert, index) => (
                  cert.title && <li key={index}>{cert.title} ({cert.year})</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Interests and Skills in a two-column layout */}
        <div className="grid grid-cols-2 gap-x-8 mb-6">
          {hasArrayData(resumeData.interests) && (
            <div className="resume-section">
              <Title text="Interests" color={mainText} accentColor={accentColor} />
              <div className="grid grid-cols-2 gap-x-8 text-sm space-y-0.5 ml-4" style={{ color: mainText }}>
                {resumeData.interests.map((interest, index) => (
                  interest.name && (
                    <div key={index} className="flex items-start gap-1">
                      <span className="flex-shrink-0">•</span>
                      <span>{interest.name}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {hasArrayData(resumeData.skills) && (
            <div className="resume-section">
              <Title text="Skills" color={mainText} accentColor={accentColor} />
              <ul className="list-disc list-inside text-sm space-y-0.5 ml-4" style={{ color: mainText }}>
                {resumeData.skills.map((skill, index) => (
                  skill.name && <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateFive;