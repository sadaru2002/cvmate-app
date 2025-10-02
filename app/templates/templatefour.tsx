"use client"

import React from 'react';
import {
  MapPin, Phone, Mail, Linkedin, Github, Globe,
  User, Building, GraduationCap, Circle, ExternalLink
} from "lucide-react";
import { ResumeFormData } from "@/hooks/use-resume-builder"; // Use the main data type
import { cleanUrlForDisplay } from "@/lib/utils";
import HorizontalProgressBar from "./resumesection/HorizontalProgressBar"; // New component
import BulletList from "./resumesection/BulletList"; // Reusing existing BulletList

interface TemplateFourProps {
  resumeData: ResumeFormData;
  colorPalette?: string[];
  id?: string;
}

const DEFAULT_THEME_FOUR = [
  "#FFFFFF", // 0: Background/white
  "#1a1a1a", // 1: Primary text (black)
  "#2563EB", // 2: Theme accent color (blue) - for titles, icons, lines
  "#E5E7EB", // 3: Light gray for progress bar background
  "#2563EB", // 4: Theme color for progress bar fill (same as accent)
  "#4B5563", // 5: Secondary text (gray)
];

// Simple Title Component for sections
const Title: React.FC<{ text: string; color: string; accentColor: string }> = ({ text, color, accentColor }) => (
  <h3 className="text-base font-extrabold mb-3 pb-1 tracking-wide" style={{ color: color, borderBottom: `1px solid ${accentColor}` }}>
    {text}
  </h3>
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
const hasContactInfo = (contactInfo: ResumeFormData['contactInfo']) => Object.values(contactInfo).some(val => val !== undefined && val !== null && val !== '');

const TemplateFour: React.FC<TemplateFourProps> = ({ resumeData, colorPalette, id }) => {
  const colors = colorPalette && colorPalette.length === 6 ? colorPalette : DEFAULT_THEME_FOUR;
  const [mainBg, mainText, accentColor, progressBarBg, progressBarFill, subtleText] = colors;

  // Filter out empty interests for hobbies
  const hobbies = resumeData.interests?.filter(i => i.name?.trim()).map(i => i.name) || [];

  return (
    <div
      id={id}
      className="bg-white text-gray-900 w-full h-full font-sans text-sm leading-relaxed"
      style={{
        boxShadow: "none",
        // Removed overflow: "hidden", // Removed to prevent content clipping in PDF
      }}
    >
      <div className="h-full grid grid-cols-[1.5fr_3.5fr] gap-x-8 p-8"> {/* Two-column layout with padding */}
        {/* Left Sidebar - 25% width */}
        <div className="flex flex-col pr-8 space-y-8 border-r border-gray-200"> {/* Added border-r */}
          {/* Profile Photo - Circular, professional */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex-shrink-0 mx-auto mb-4 resume-section">
            {resumeData.profileInfo.profilePictureUrl ? (
              <img
                src={resumeData.profileInfo.profilePictureUrl}
                alt={resumeData.profileInfo.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl" style={{ color: subtleText }}>
                <User className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Links Section */}
          {(resumeData.contactInfo.linkedin || resumeData.contactInfo.github || resumeData.contactInfo.website) && (
            <div className="resume-section">
              <Title text="Links" color={accentColor} accentColor={accentColor} />
              <div className="space-y-2 text-xs" style={{ color: subtleText }}>
                {resumeData.contactInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-3 h-3" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: mainText }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.linkedin)}
                    </a>
                  </div>
                )}
                {resumeData.contactInfo.github && (
                  <div className="flex items-center gap-2">
                    <Github className="w-3 h-3" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: mainText }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.github)}
                    </a>
                  </div>
                )}
                {resumeData.contactInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3" style={{ color: accentColor }} />
                    <a href={resumeData.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: mainText }}>
                      {cleanUrlForDisplay(resumeData.contactInfo.website)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {hasArrayData(resumeData.languages) && (
            <div className="resume-section">
              <Title text="Languages" color={accentColor} accentColor={accentColor} />
              <div className="space-y-3">
                {resumeData.languages.map((lang, index) => (
                  lang.name && (
                    <div key={index} className="flex items-center justify-between text-xs" style={{ color: mainText }}>
                      <span>{lang.name}</span>
                      <HorizontalProgressBar
                        progress={lang.proficiency || 0}
                        fillColor={progressBarFill}
                        bgColor={progressBarBg}
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Skills Section (Moved from right column) */}
          {hasArrayData(resumeData.skills) && (
            <div className="resume-section">
              <Title text="Skills" color={accentColor} accentColor={accentColor} />
              <div className="grid grid-cols-1 gap-y-3"> {/* Changed to grid-cols-1 for vertical stacking */}
                {resumeData.skills.map((skill, index) => (
                  skill.name && (
                    <div key={index} className="flex items-center justify-between text-xs" style={{ color: mainText }}>
                      <span>{skill.name}</span>
                      <HorizontalProgressBar
                        progress={skill.proficiency || 0}
                        fillColor={progressBarFill}
                        bgColor={progressBarBg}
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Hobbies/Interests */}
          {hobbies.length > 0 && (
            <div className="resume-section">
              <Title text="Hobbies" color={accentColor} accentColor={accentColor} />
              <BulletList items={hobbies} textColor={mainText} bulletColor={accentColor} fontSize="text-xs" />
            </div>
          )}
        </div>

        {/* Main Content - 75% width */}
        <div className="flex flex-col space-y-8">
          {/* Name, Title, Contact Info (Main Header) */}
          <div className="flex-grow-0"> {/* Prevent this section from growing */}
            <h1 className="text-3xl font-bold mb-1 uppercase tracking-wide" style={{ color: mainText }}>
              {resumeData.profileInfo.fullName || "Your Name Here"}
            </h1>
            <h2 className="text-lg font-medium mb-4 uppercase tracking-widest" style={{ color: accentColor }}>
              {resumeData.profileInfo.designation || "Your Designation"}
            </h2>
            
            {/* Contact Information - Horizontal layout with icons */}
            {hasContactInfo(resumeData.contactInfo) && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm" style={{ color: subtleText }}>
                {resumeData.contactInfo.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" style={{ color: accentColor }} /> {resumeData.contactInfo.location}
                  </div>
                )}
                {resumeData.contactInfo.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" style={{ color: accentColor }} /> {resumeData.contactInfo.phone}
                  </div>
                )}
                {resumeData.contactInfo.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" style={{ color: accentColor }} /> {resumeData.contactInfo.email}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* About Me Section */}
          {resumeData.profileInfo.summary && (
            <div className="resume-section">
              <Title text="About Me" color={accentColor} accentColor={accentColor} />
              <p className="text-sm leading-relaxed" style={{ color: mainText }}>
                {resumeData.profileInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {hasArrayData(resumeData.workExperiences) && (
            <div className="resume-section">
              <Title text="Work Experience" color={accentColor} accentColor={accentColor} />
              <div className="space-y-6">
                {resumeData.workExperiences.map((exp, index) => (
                  <div key={index} className="flex items-start gap-2"> {/* Adjusted gap */}
                    <Circle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: accentColor }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-sm font-bold" style={{ color: accentColor }}>{exp.role || "Role"} at {exp.company || "Company"}</h4>
                        <p className="text-xs italic" style={{ color: subtleText }}>{`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}</p>
                      </div>
                      {exp.description && (
                        <ul className="list-disc list-inside text-xs space-y-0.5 ml-4" style={{ color: mainText }}>
                          {exp.description.split('. ').filter(Boolean).map((point, i) => (
                            <li key={i}>{point.trim()}{point.endsWith('.') ? '' : '.'}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {hasArrayData(resumeData.education) && (
            <div className="resume-section">
              <Title text="Education" color={accentColor} accentColor={accentColor} />
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-2"> {/* Adjusted gap */}
                    <Circle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: accentColor }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-sm font-bold" style={{ color: accentColor }}>{edu.degree || "Degree"}</h4>
                        <p className="text-xs italic" style={{ color: subtleText }}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</p>
                      </div>
                      <p className="text-xs" style={{ color: mainText }}>{edu.institution || "Institution"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects (Moved here after Education) */}
          {hasArrayData(resumeData.projects) && (
            <div className="resume-section">
              <Title text="Projects" color={accentColor} accentColor={accentColor} />
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="flex items-start gap-2"> {/* Adjusted gap */}
                    <Circle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: accentColor }} />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold" style={{ color: accentColor }}>{project.title || "Project Title"}</h4>
                      <p className="text-xs mb-2" style={{ color: mainText }}>{project.description || "Project Description"}</p> {/* Added mb-2 */}
                      {(project.github || project.LiveDemo) && (
                        <div className="flex flex-col gap-y-1 text-xs mt-2"> {/* Changed to flex-col for vertical layout and reduced gap */}
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1" style={{ color: accentColor }}>
                              <Github className="w-3 h-3" />
                              <span style={{ color: mainText }}>GitHub: </span>
                              {cleanUrlForDisplay(project.github)}
                            </a>
                          )}
                          {project.LiveDemo && (
                            <a href={project.LiveDemo} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1" style={{ color: accentColor }}>
                              <ExternalLink className="w-3 h-3" />
                              <span style={{ color: mainText }}>Live Demo: </span>
                              {cleanUrlForDisplay(project.LiveDemo)}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
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

export default TemplateFour;