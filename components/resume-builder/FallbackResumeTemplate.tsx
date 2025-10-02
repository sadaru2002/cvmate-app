"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Lightbulb, Award, Languages, Heart } from "lucide-react"
import { ResumeFormData } from "@/hooks/use-resume-builder" // Import the comprehensive ResumeFormData type
import { cleanUrlForDisplay } from "@/lib/utils"

interface FallbackResumeTemplateProps {
  data: ResumeFormData;
  resumeElementId?: string;
}

export function FallbackResumeTemplate({ data, resumeElementId }: FallbackResumeTemplateProps) {
  const getProficiencyText = (level: number) => {
    switch (level) {
      case 1: return "Beginner";
      case 2: return "Novice";
      case 3: return "Intermediate";
      case 4: return "Advanced";
      case 5: return "Expert";
      default: return "";
    }
  };

  return (
    <div id={resumeElementId} className="bg-white text-gray-900 p-8 shadow-lg rounded-lg border border-gray-200 overflow-y-auto w-full h-full font-sans text-base leading-relaxed">
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar className="size-28 mb-4 border-2 border-gray-300">
          <AvatarImage src={data.profileInfo.profilePictureUrl || "/placeholder-user.jpg"} alt="User Avatar" />
          <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl">{data.profileInfo.fullName?.split(' ').map(n => n[0]).join('') || 'JD'}</AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{data.profileInfo.fullName || "Your Name Here"}</h2>
        <p className="text-lg text-gray-700 mb-4">{data.profileInfo.designation || "Your Designation"}</p>
        <p className="text-gray-600 text-sm max-w-prose">{data.profileInfo.summary || "A short introduction about yourself..."}</p>
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        {(data.contactInfo.location || data.contactInfo.email || data.contactInfo.phone || data.contactInfo.linkedin || data.contactInfo.github || data.contactInfo.website) && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              Contact Information
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {data.contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" /> {data.contactInfo.email}
                  </div>
                )}
                {data.contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" /> {data.contactInfo.phone}
                  </div>
                )}
              </div>
              {data.contactInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" /> {data.contactInfo.location}
                </div>
              )}
              {data.contactInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-gray-600" /> <a href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{cleanUrlForDisplay(data.contactInfo.linkedin)}</a>
                </div>
              )}
              {data.contactInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-gray-600" /> <a href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{cleanUrlForDisplay(data.contactInfo.github)}</a>
                </div>
              )}
              {data.contactInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-600" /> <a href={data.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{cleanUrlForDisplay(data.contactInfo.website)}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {data.workExperiences && data.workExperiences.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              <Briefcase className="inline-block w-5 h-5 mr-2 text-gray-600" /> Work Experience
            </h3>
            <div className="space-y-4">
              {data.workExperiences.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-400 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900">{exp.role}</h4>
                  <p className="text-gray-700 text-sm">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                  <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-0.5">
                    {exp.description?.split('. ').filter(Boolean).map((item, i) => (
                      <li key={i}>{item.trim()}{item.endsWith('.') ? '' : '.'}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              <GraduationCap className="inline-block w-5 h-5 mr-2 text-gray-600" /> Education
            </h3>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-gray-400 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-700 text-sm">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              <Lightbulb className="inline-block w-5 h-5 mr-2 text-gray-600" /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {skill.name} ({getProficiencyText(skill.proficiency || 0)})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              <Briefcase className="inline-block w-5 h-5 mr-2 text-gray-600" /> Projects
            </h3>
            <div className="space-y-4">
              {data.projects.map((proj, index) => (
                <div key={index} className="border-l-2 border-gray-400 pl-4">
                  <h4 className="text-lg font-semibold text-gray-900">{proj.title}</h4>
                  <p className="text-gray-700 text-sm">{proj.description}</p>
                  {(proj.github || proj.LiveDemo) && (
                    <p className="text-gray-700 text-sm">
                      {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 mr-2">{cleanUrlForDisplay(proj.github)}</a>}
                      {proj.LiveDemo && <a href={proj.LiveDemo} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{cleanUrlForDisplay(proj.LiveDemo)}</a>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              <Award className="inline-block w-5 h-5 mr-2 text-gray-600" /> Certifications
            </h3>
            <div className="space-y-2">
              {data.certifications.map((cert, index) => (
                <p key={index} className="text-gray-700 text-sm">
                  <span className="font-medium">{cert.title}</span> from {cert.issuer} ({cert.year})
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              <Languages className="inline-block w-5 h-5 mr-2 text-gray-600" /> Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((lang, index) => (
                <span key={index} className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {lang.name} ({getProficiencyText(lang.proficiency || 0)})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {data.interests && data.interests.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              <Heart className="inline-block w-5 h-5 mr-2 text-gray-600" /> Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest, index) => (
                <span key={index} className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}