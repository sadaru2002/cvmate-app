import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from 'fs';
import { join } from 'path';

// Helper to get SVG icon strings
const getSvgIcon = (iconName: string, color: string, size: number = 16) => {
  const iconProps = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  const filledIconProps = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none"`;

  switch (iconName) {
    case 'Mail':
      return `<svg ${iconProps}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
    case 'Phone':
      return `<svg ${iconProps}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
    case 'MapPin':
      return `<svg ${iconProps}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    case 'Linkedin':
      return `<svg ${iconProps}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`;
    case 'Github':
      return `<svg ${iconProps}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.44-1-3.44.09-2.5-1.28-4.24-2.2-4.55 0 0-1.05-.33-3.44 1.35-1-.27-2.07-.36-3.14-.36-1.07 0-2.14.09-3.14.36C7.22 4.04 6.17 4.37 6.17 4.37c-.92.31-2.29 2.04-2.2 4.55-.72 1-1.07 2.22-1 3.44 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`;
    case 'Globe':
      return `<svg ${iconProps}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
    case 'User':
      return `<svg ${iconProps}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    case 'Briefcase':
      return `<svg ${iconProps}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14"/></svg>`;
    case 'GraduationCap':
      return `<svg ${iconProps}><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.838a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 6 0 0 0 6 6v-4"/></svg>`;
    case 'Lightbulb':
      return `<svg ${iconProps}><path d="M15 14c.2-.84.5-1.5.9-2.2c.3-.5.4-.9.5-1.7 0-.2.07-.5.2-.7.2-.5.5-1 .9-1.4C17.8 6.5 18 5.3 18 4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2c0 1.3.2 2.5.5 3.5.4.7.6 1.2.9 1.7.1.2.2.5.2.7.1.8.2 1.3.5 2.2.4.7.7 1.4.9 2.2"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 14v8"/></svg>`;
    case 'Award':
      return `<svg ${iconProps}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17.18 21l-5.15-3.62L7 21l1.719-8.109"/></svg>`;
    case 'Languages':
      return `<svg ${iconProps}><path d="m5 8 6 6"/><path d="m11 8 6 6"/><path d="m2 11h10"/><path d="m14 11h8"/><path d="M7 21l1.5-4 1.5 4"/><path d="M17 21l1.5-4 1.5 4"/></svg>`;
    case 'ExternalLink':
      return `<svg ${iconProps}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`;
    case 'Circle':
      return `<svg ${filledIconProps}><circle cx="12" cy="12" r="10"/></svg>`;
    case 'Heart':
      return `<svg ${iconProps}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
    default:
      return '';
  }
};

// Utility function to format year-month
const formatYearMonth = (dateString?: string): string => {
  if (!dateString) return "Present";
  return dateString;
};

// Helper to check if an array section has any meaningful data
const hasArrayData = (arr?: any[]): boolean => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)));

// Helper to check if contact info has any meaningful data
const hasContactInfo = (contactInfo: any): boolean => Object.values(contactInfo).some(val => val !== undefined && val !== null && val !== '');

// Utility to clean URL for display
const cleanUrlForDisplay = (url?: string): string => {
  if (!url) return '';
  return url.replace(/^(https?:\/\/)?(www\.)?/, '');
};

// Default theme for TemplateOne
const DEFAULT_THEME_ONE = ["#EBFDFF", "#A1FAFD", "#ACEAFE", "#008899", "#4A5568"];
// Default theme for TemplateTwo
const DEFAULT_THEME_TWO = ["#f8f9fa", "#e9ecef", "#dee2e6", "#007bff", "#343a40"];
// Default theme for TemplateThree
const DEFAULT_THEME_THREE = ["#E0F7FA", "#212121", "#00ACC1", "#666666", "#00ACC1", "#00ACC1"];
// Default theme for TemplateFour
const DEFAULT_THEME_FOUR = ["#FFFFFF", "#212121", "#616161", "#E0E0E0", "#424242", "#757575"];
// Default theme for TemplateFive
const DEFAULT_THEME_FIVE = ["#FFFFFF", "#000000", "#333333", "#000000"];


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get('template') || 'TemplateOne';
  const dataParam = searchParams.get('data');
  
  let resumeData;
  try {
    resumeData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : {};
  } catch (error) {
    console.error('Error parsing resume data:', error);
    resumeData = {};
  }

  const colorPalette = resumeData?.colorPalette;
  let themeColors: string[] = [];

  switch (template) {
    case 'TemplateOne':
      themeColors = colorPalette && colorPalette.length >= 5 ? colorPalette : DEFAULT_THEME_ONE;
      break;
    case 'TemplateTwo':
      themeColors = colorPalette && colorPalette.length >= 5 ? colorPalette : DEFAULT_THEME_TWO;
      break;
    case 'TemplateThree':
      themeColors = colorPalette && colorPalette.length >= 6 ? colorPalette : DEFAULT_THEME_THREE;
      break;
    case 'TemplateFour':
      themeColors = colorPalette && colorPalette.length === 6 ? colorPalette : DEFAULT_THEME_FOUR;
      break;
    case 'TemplateFive':
      themeColors = colorPalette && colorPalette.length >= 4 ? colorPalette : DEFAULT_THEME_FIVE;
      break;
    default:
      themeColors = DEFAULT_THEME_ONE;
  }

  let globalsCssContent = '';
  try {
    // Adjust path for Vercel deployment
    const cssPath = process.env.NODE_ENV === 'production' 
      ? join(process.cwd(), '.next', 'static', 'css', 'app_globals.css') // Vercel build output
      : join(process.cwd(), 'app', 'globals.css'); // Local development
    
    globalsCssContent = readFileSync(cssPath, 'utf8');
  } catch (error) {
    console.warn('Could not read globals.css, proceeding without it:', error);
  }

  const getTemplateHTML = (templateName: string, data: any, colors: string[]) => {
    // Ensure data has default empty arrays for sections if not present
    data.profileInfo = data.profileInfo || {};
    data.contactInfo = data.contactInfo || {};
    data.workExperiences = data.workExperiences || [];
    data.education = data.education || [];
    data.skills = data.skills || [];
    data.projects = data.projects || [];
    data.certifications = data.certifications || [];
    data.languages = data.languages || [];
    data.interests = data.interests || [];

    switch (templateName) {
      case 'TemplateOne':
        return `
          <div id="resume-template" class="bg-white text-gray-900 w-full h-full p-8" style="text-align: left;">
            <div class="flex h-full">
              <!-- Left Column (Sidebar) -->
              <div class="w-4/12 flex-shrink-0 flex flex-col" style="background-color: ${colors[0]};">
                <div class="py-6 px-4 flex-1">
                  <div class="flex flex-col items-center gap-2">
                    <div class="w-[100px] h-[100px] max-w-[110px] max-h-[110px] rounded-full flex items-center justify-center overflow-hidden bg-white">
                      ${data.profileInfo.profilePictureUrl ? 
                        `<img src="${data.profileInfo.profilePictureUrl}" alt="Profile" class="w-[90px] h-[90px] rounded-full object-cover">` : 
                        `<div class="w-[90px] h-[90px] flex items-center justify-center text-5xl rounded-full" style="color: ${colors[4]}">${getSvgIcon('User', colors[4], 32)}</div>`
                      }
                    </div>
                    <h2 class="text-lg font-bold mt-3 text-gray-800">${data.profileInfo.fullName || "Your Name Here"}</h2>
                    <p class="text-xs text-center text-gray-700">${data.profileInfo.designation || "Your Designation"}</p>
                  </div>

                  ${hasContactInfo(data.contactInfo) ? `
                    <div class="my-6 mx-0 px-2">
                      <h3 class="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">Contact</h3>
                      ${data.contactInfo.location ? `
                        <div class="flex items-start gap-2 mb-2">
                          ${getSvgIcon('MapPin', '#6b7280', 12)}
                          <span class="text-xs text-gray-700 leading-tight">${data.contactInfo.location}</span>
                        </div>
                      ` : ''}
                      ${data.contactInfo.email ? `
                        <div class="flex items-center gap-2 mb-2">
                          ${getSvgIcon('Mail', '#6b7280', 12)}
                          <span class="text-xs text-gray-700 break-all">${data.contactInfo.email}</span>
                        </div>
                      ` : ''}
                      ${data.contactInfo.phone ? `
                        <div class="flex items-center gap-2 mb-2">
                          ${getSvgIcon('Phone', '#6b7280', 12)}
                          <span class="text-xs text-gray-700">${data.contactInfo.phone}</span>
                        </div>
                      ` : ''}
                      ${data.contactInfo.linkedin ? `
                        <div class="flex items-center gap-2 mb-2">
                          ${getSvgIcon('Linkedin', '#6b7280', 12)}
                          <a href="${data.contactInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 truncate">${cleanUrlForDisplay(data.contactInfo.linkedin)}</a>
                        </div>
                      ` : ''}
                      ${data.contactInfo.github ? `
                        <div class="flex items-center gap-2 mb-2">
                          ${getSvgIcon('Github', '#6b7280', 12)}
                          <a href="${data.contactInfo.github}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 truncate">${cleanUrlForDisplay(data.contactInfo.github)}</a>
                        </div>
                      ` : ''}
                      ${data.contactInfo.website ? `
                        <div class="flex items-center gap-2 mb-2">
                          ${getSvgIcon('Globe', '#6b7280', 12)}
                          <a href="${data.contactInfo.website}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 truncate">${cleanUrlForDisplay(data.contactInfo.website)}</a>
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}

                  ${hasArrayData(data.education) ? `
                    <div class="mt-5">
                      <h3 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[4]}; color: ${colors[4]}">Education</h3>
                      ${data.education.map((edu: any) => `
                        <div class="mb-5">
                          <h3 class="text-sm font-semibold text-gray-800">${edu.degree || "Your Degree"}</h3>
                          <p class="text-[11px] font-medium">${edu.institution || "Your Institution"}</p>
                          <p class="text-[11px] text-gray-500 font-medium italic mt-0.5">${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}</p>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}

                  ${hasArrayData(data.languages) ? `
                    <div class="mt-5">
                      <h3 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[4]}; color: ${colors[4]}">Languages</h3>
                      <div class="grid grid-cols-2 gap-x-5 gap-y-1 mb-3">
                        ${data.languages.map((lang: any) => `
                          ${lang.name ? `
                            <div class="flex items-center justify-between">
                              <p class="text-[11px] font-semibold text-gray-800">${lang.name}</p>
                              <div class="inline-flex items-center gap-0.5">
                                ${Array(5).fill(0).map((_, i) => `
                                  <div class="w-1.5 h-1.5 rounded-full transition-all" style="background-color: ${i < (lang.proficiency || 0) ? (colors[3] || 'rgba(1,1,1,1)') : (colors[2] || 'rgba(1,1,1,0.1)')}"></div>
                                `).join('')}
                              </div>
                            </div>
                          ` : ''}
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Right Column (Main Content) -->
              <div class="w-8/12 flex-shrink-0 flex flex-col">
                <div class="py-6 px-4 flex-1">
                  ${data.profileInfo.summary ? `
                    <div>
                      <h3 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[4]}; color: ${colors[4]}">Professional Summary</h3>
                      <p class="text-xs font-medium text-gray-800">${data.profileInfo.summary || "A short introduction about yourself..."}</p>
                    </div>
                  ` : ''}

                  ${hasArrayData(data.workExperiences) ? `
                    <div class="mt-4">
                      <h3 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[4]}; color: ${colors[4]}">Work Experience</h3>
                      ${data.workExperiences.map((exp: any) => `
                        <div class="mb-5">
                          <div class="flex items-start justify-between">
                            <div>
                              <h3 class="text-sm font-semibold text-gray-800">${exp.company || "Company Name"}</h3>
                              <p class="text-sm text-gray-700 font-medium">${exp.role || "Your Role"}</p>
                            </div>
                            <p class="text-[11px] font-bold italic" style="color: ${colors[4]}">${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}</p>
                          </div>
                          ${exp.description ? `
                            <ul class="list-disc space-y-0.5 mt-[0.2cm] ml-4">
                              ${exp.description.split('. ').filter(Boolean).map((point: string) => `
                                <li class="text-xs text-gray-600 font-medium italic">${point.trim()}${point.endsWith('.') ? '' : '.'}</li>
                              `).join('')}
                            </ul>
                          ` : ''}
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}

                  ${hasArrayData(data.projects) ? `
                    <div class="mt-4">
                      <h3 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[4]}; color: ${colors[4]}">Projects</h3>
                      ${data.projects.map((project: any) => `
                        <div class="mb-5">
                          <h3 class="text-sm font-semibold text-gray-800">${project.title || "Project Title"}</h3>
                          <p class="text-xs text-gray-700 font-medium mt-1">${project.description || "Project Description"}</p>
                          <div class="flex flex-col gap-1 mt-2">
                            ${project.github ? `
                              <div class="flex items-center gap-2">
                                <div class="w-5 h-5 flex items-center justify-center rounded-full" style="background-color: ${colors[2]}; color: ${colors[4]}">
                                  ${getSvgIcon('Github', colors[4], 12)}
                                </div>
                                <span class="w-16 flex-shrink-0 text-xs font-medium text-gray-800">GitHub:</span>
                                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="text-xs font-medium text-blue-600 no-underline cursor-pointer break-all">${cleanUrlForDisplay(project.github)}</a>
                              </div>
                            ` : ''}
                            ${project.LiveDemo ? `
                              <div class="flex items-center gap-2">
                                <div class="w-5 h-5 flex items-center justify-center rounded-full" style="background-color: ${colors[2]}; color: ${colors[4]}">
                                  ${getSvgIcon('ExternalLink', colors[4], 12)}
                                </div>
                                <span class="w-16 flex-shrink-0 text-xs font-medium text-gray-800">Live Demo:</span>
                                <a href="${project.LiveDemo}" target="_blank" rel="noopener noreferrer" class="text-xs font-medium text-blue-600 no-underline cursor-pointer break-all">${cleanUrlForDisplay(project.LiveDemo)}</a>
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}

                  ${hasArrayData(data.skills) ? `
                    <div class="mt-4">
                      <h3 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[4]}; color: ${colors[4]}">Skills</h3>
                      <div class="grid grid-cols-2 gap-x-5 gap-y-1 mb-3">
                        ${data.skills.map((skill: any) => `
                          ${skill.name ? `
                            <div class="flex items-center justify-between">
                              <p class="text-[11px] font-semibold text-gray-800">${skill.name}</p>
                              <div class="inline-flex items-center gap-0.5">
                                ${Array(5).fill(0).map((_, i) => `
                                  <div class="w-1.5 h-1.5 rounded-full transition-all" style="background-color: ${i < (skill.proficiency || 0) ? (colors[3] || 'rgba(1,1,1,1)') : (colors[2] || 'rgba(1,1,1,0.1)')}"></div>
                                `).join('')}
                              </div>
                            </div>
                          ` : ''}
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}

                  ${hasArrayData(data.certifications) ? `
                    <div class="mt-4">
                      <h3 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[4]}; color: ${colors[4]}">Certifications</h3>
                      <div class="grid grid-cols-2 gap-2">
                        ${data.certifications.map((cert: any) => `
                          <div class="">
                            <h3 class="text-sm font-semibold text-gray-800">${cert.title || "Certification Title"}</h3>
                            <div class="flex items-center gap-2">
                              ${cert.year ? `
                                <div class="text-xs font-bold text-gray-800 px-3 py-0.5 inline-block mt-2 rounded-tg" style="background-color: ${colors[2]}">
                                  ${cert.year}
                                </div>
                              ` : ''}
                              <p class="text-[11px] text-gray-700 font-medium mt-1">${cert.issuer || "Issuer Name"}</p>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}

                  ${hasArrayData(data.interests) ? `
                    <div class="mt-4">
                      <h3 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[4]}; color: ${colors[4]}">Interests</h3>
                      <div class="flex flex-wrap gap-2 mt-2">
                        ${data.interests.map((interest: any) => `
                          ${interest.name ? `
                            <div class="text-[10px] font-medium py-1 px-3 rounded-lg text-gray-800" style="background-color: ${colors[2]}">
                              ${interest.name}
                            </div>
                          ` : ''}
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
      case 'TemplateTwo':
        return `
          <div id="resume-template" class="bg-white text-gray-900 w-full h-full p-8 font-sans text-sm leading-relaxed">
            <div class="h-full grid grid-cols-[2.5fr_1fr] gap-x-8">
              <!-- Left Column -->
              <div class="flex flex-col">
                <div class="mb-6">
                  <h1 class="text-3xl font-bold mb-1" style="color: ${colors[4]}">${data.profileInfo.fullName || "Your Name Here"}</h1>
                  <p class="text-lg" style="color: ${colors[3]}">${data.profileInfo.designation || "Your Designation"}</p>
                </div>

                ${hasContactInfo(data.contactInfo) ? `
                  <div class="mb-6">
                    <div class="grid grid-cols-2 gap-y-1 gap-x-4 text-sm text-gray-700">
                      ${data.contactInfo.email ? `
                        <div class="flex items-center gap-2">
                          <div class="w-4 h-4 rounded-full" style="background-color: ${colors[3]}"></div>
                          <span>${data.contactInfo.email}</span>
                        </div>
                      ` : ''}
                      ${data.contactInfo.location ? `
                        <div class="flex items-center gap-2">
                          <div class="w-4 h-4 rounded-full" style="background-color: ${colors[3]}"></div>
                          <span>${data.contactInfo.location}</span>
                        </div>
                      ` : ''}
                      ${data.contactInfo.phone ? `
                        <div class="flex items-center gap-2">
                          <div class="w-4 h-4 rounded-full" style="background-color: ${colors[3]}"></div>
                          <span>${data.contactInfo.phone}</span>
                        </div>
                      ` : ''}
                      ${data.contactInfo.linkedin ? `
                        <div class="flex items-center gap-2">
                          <div class="w-4 h-4 rounded-full" style="background-color: ${colors[3]}"></div>
                          <a href="${data.contactInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: ${colors[3]}">${cleanUrlForDisplay(data.contactInfo.linkedin)}</a>
                        </div>
                      ` : ''}
                      ${data.contactInfo.github ? `
                        <div class="flex items-center gap-2">
                          <div class="w-4 h-4 rounded-full" style="background-color: ${colors[3]}"></div>
                          <a href="${data.contactInfo.github}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: ${colors[3]}">${cleanUrlForDisplay(data.contactInfo.github)}</a>
                        </div>
                      ` : ''}
                      ${data.contactInfo.website ? `
                        <div class="flex items-center gap-2">
                          <div class="w-4 h-4 rounded-full" style="background-color: ${colors[3]}"></div>
                          <a href="${data.contactInfo.website}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: ${colors[3]}">${cleanUrlForDisplay(data.contactInfo.website)}</a>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                ` : ''}

                ${data.profileInfo.summary ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Professional Summary</h2>
                    <p class="text-sm text-gray-700">${data.profileInfo.summary}</p>
                  </div>
                ` : ''}

                ${hasArrayData(data.workExperiences) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Experience</h2>
                    <div class="space-y-4">
                      ${data.workExperiences.map((exp: any) => `
                        <div class="mb-5">
                          <div class="flex items-start justify-between">
                            <div>
                              <h3 class="text-sm font-semibold" style="color: ${colors[3]}">${exp.company || "Company Name"}</h3>
                              <p class="text-sm text-gray-700 font-medium">${exp.role || "Your Role"}</p>
                            </div>
                            <p class="text-[11px] font-bold italic" style="color: ${colors[4]}">${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}</p>
                          </div>
                          ${exp.description ? `
                            <ul class="list-disc space-y-0.5 mt-[0.2cm] ml-4">
                              ${exp.description.split('. ').filter(Boolean).map((point: string) => `
                                <li class="text-xs text-gray-600 font-medium italic">${point.trim()}${point.endsWith('.') ? '' : '.'}</li>
                              `).join('')}
                            </ul>
                          ` : ''}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.education) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Education</h2>
                    <div class="space-y-4">
                      ${data.education.map((edu: any) => `
                        <div class="mb-5">
                          <h3 class="text-sm font-semibold" style="color: ${colors[4]}">${edu.degree || "Your Degree"}</h3>
                          <p class="text-[11px] font-medium" style="color: ${colors[3]}">${edu.institution || "Your Institution"}</p>
                          <p class="text-[11px] text-gray-500 font-medium italic mt-0.5">${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}</p>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.projects) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Projects</h2>
                    <div class="space-y-4">
                      ${data.projects.map((project: any) => `
                        <div class="mb-5">
                          <h3 class="text-sm font-semibold text-gray-800">${project.title || "Project Title"}</h3>
                          <p class="text-xs text-gray-700 font-medium mt-1">${project.description || "Project Description"}</p>
                          <div class="flex flex-col gap-1 mt-2">
                            ${project.github ? `
                              <div class="flex items-center gap-2">
                                <div class="w-5 h-5 flex items-center justify-center rounded-full" style="background-color: ${colors[0]}; color: ${colors[3]}">
                                  ${getSvgIcon('Github', colors[3], 12)}
                                </div>
                                <span class="w-16 flex-shrink-0 text-xs font-medium text-gray-800">GitHub:</span>
                                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="text-xs font-medium text-blue-600 no-underline cursor-pointer break-all">${cleanUrlForDisplay(project.github)}</a>
                              </div>
                            ` : ''}
                            ${project.LiveDemo ? `
                              <div class="flex items-center gap-2">
                                <div class="w-5 h-5 flex items-center justify-center rounded-full" style="background-color: ${colors[0]}; color: ${colors[3]}">
                                  ${getSvgIcon('ExternalLink', colors[3], 12)}
                                </div>
                                <span class="w-16 flex-shrink-0 text-xs font-medium text-gray-800">Live Demo:</span>
                                <a href="${project.LiveDemo}" target="_blank" rel="noopener noreferrer" class="text-xs font-medium text-blue-600 no-underline cursor-pointer break-all">${cleanUrlForDisplay(project.LiveDemo)}</a>
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- Right Column -->
              <div class="flex flex-col items-start">
                ${data.profileInfo.profilePictureUrl ? `
                  <div class="w-[120px] h-[120px] rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-gray-300 mb-6">
                    <img src="${data.profileInfo.profilePictureUrl}" alt="Profile" class="w-[110px] h-[110px] rounded-full object-cover">
                  </div>
                ` : `
                  <div class="w-[120px] h-[120px] rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-gray-300 mb-6">
                    <div class="w-[110px] h-[110px] flex items-center justify-center text-5xl rounded-full" style="color: ${colors[3]}">
                      ${getSvgIcon('User', colors[3], 48)}
                    </div>
                  </div>
                `}

                ${data.profileInfo.summary ? `
                  <div class="w-full mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Summary</h2>
                    <p class="text-sm text-gray-700">${data.profileInfo.summary}</p>
                  </div>
                ` : ''}

                ${hasArrayData(data.skills) ? `
                  <div class="w-full mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Skills</h2>
                    <div class="space-y-1">
                      ${data.skills.map((skill: any) => `
                        ${skill.name ? `
                          <div class="flex items-center justify-between">
                            <p class="text-sm" style="color: ${colors[4]}">${skill.name}</p>
                            <div class="inline-flex items-center gap-0.5">
                              ${Array(5).fill(0).map((_, i) => `
                                <div class="w-1.5 h-1.5 rounded-full transition-all" style="background-color: ${i < (skill.proficiency || 0) ? (colors[3] || 'rgba(1,1,1,1)') : (colors[2] || 'rgba(1,1,1,0.1)')}"></div>
                              `).join('')}
                            </div>
                          </div>
                        ` : ''}
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.languages) ? `
                  <div class="w-full mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Languages</h2>
                    <div class="space-y-1">
                      ${data.languages.map((lang: any) => `
                        ${lang.name ? `
                          <div class="flex items-center justify-between">
                            <p class="text-sm" style="color: ${colors[4]}">${lang.name}</p>
                            <div class="inline-flex items-center gap-0.5">
                              ${Array(5).fill(0).map((_, i) => `
                                <div class="w-1.5 h-1.5 rounded-full transition-all" style="background-color: ${i < (lang.proficiency || 0) ? (colors[3] || 'rgba(1,1,1,1)') : (colors[2] || 'rgba(1,1,1,0.1)')}"></div>
                              `).join('')}
                            </div>
                          </div>
                        ` : ''}
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.certifications) ? `
                  <div class="w-full mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Certifications</h2>
                    <div class="grid grid-cols-1 gap-y-2">
                      ${data.certifications.map((cert: any) => `
                        <div class="mb-0">
                          <h3 class="text-sm font-semibold text-gray-800">${cert.title || "Certification Title"}</h3>
                          <p class="text-[11px] text-gray-700 font-medium mt-1">${cert.issuer || "Issuer Name"} (${cert.year || "Year"})</p>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.interests) ? `
                  <div class="w-full mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1 border-b" style="border-color: ${colors[3]}; color: ${colors[4]}">Interests</h2>
                    <div class="grid grid-cols-1 gap-y-2 text-sm text-gray-700">
                      ${data.interests.map((interest: any) => `
                        ${interest.name ? `
                          <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" style="background-color: ${colors[3]}"></div>
                            <span>${interest.name}</span>
                          </div>
                        ` : ''}
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      case 'TemplateThree':
        return `
          <div id="resume-template" class="bg-white text-gray-900 w-full h-full font-sans text-sm leading-relaxed">
            <div class="h-full flex">
              <!-- Left Column (Sidebar) -->
              <div class="w-3/10 flex flex-col py-8 px-6" style="background-color: ${colors[0]};">
                <div class="w-[120px] h-[120px] rounded-full flex items-center justify-center overflow-hidden bg-white border-2 border-white mx-auto mb-4">
                  ${data.profileInfo.profilePictureUrl ? `
                    <img src="${data.profileInfo.profilePictureUrl}" alt="Profile" class="w-[110px] h-[110px] rounded-full object-cover">
                  ` : `
                    <div class="w-[110px] h-[110px] flex items-center justify-center text-5xl rounded-full" style="color: ${colors[2]}">
                      ${getSvgIcon('User', colors[2], 32)}
                    </div>
                  `}
                </div>

                <div class="text-center mb-6">
                  <h1 class="text-xl font-bold mb-1 uppercase" style="color: #212121">${data.profileInfo.fullName || "Your Name Here"}</h1>
                  <p class="text-sm uppercase tracking-wide" style="color: #212121">${data.profileInfo.designation || "Your Designation"}</p>
                </div>

                ${hasContactInfo(data.contactInfo) ? `
                  <div class="mb-6">
                    <div class="border-t border-b border-white/30 py-4 space-y-2">
                      ${data.contactInfo.email ? `
                        <div class="flex items-center gap-2">
                          ${getSvgIcon('Mail', colors[2], 12)}
                          <span class="text-xs break-all" style="color: #212121">${data.contactInfo.email}</span>
                        </div>
                      ` : ''}
                      ${data.contactInfo.phone ? `
                        <div class="flex items-center gap-2">
                          ${getSvgIcon('Phone', colors[2], 12)}
                          <span class="text-xs" style="color: #212121">${data.contactInfo.phone}</span>
                        </div>
                      ` : ''}
                      ${data.contactInfo.linkedin ? `
                        <div class="flex items-center gap-2">
                          ${getSvgIcon('Linkedin', colors[2], 12)}
                          <a href="${data.contactInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="text-xs hover:underline break-all" style="color: ${colors[2]}">${cleanUrlForDisplay(data.contactInfo.linkedin)}</a>
                        </div>
                      ` : ''}
                      ${data.contactInfo.github ? `
                        <div class="flex items-center gap-2">
                          ${getSvgIcon('Github', colors[2], 12)}
                          <a href="${data.contactInfo.github}" target="_blank" rel="noopener noreferrer" class="text-xs hover:underline break-all" style="color: ${colors[2]}">${cleanUrlForDisplay(data.contactInfo.github)}</a>
                        </div>
                      ` : ''}
                      ${data.contactInfo.website ? `
                        <div class="flex items-center gap-2">
                          ${getSvgIcon('Globe', colors[2], 12)}
                          <a href="${data.contactInfo.website}" target="_blank" rel="noopener noreferrer" class="text-xs hover:underline break-all" style="color: ${colors[2]}">${cleanUrlForDisplay(data.contactInfo.website)}</a>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.education) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1" style="color: ${colors[2]}">Education</h2>
                    <div class="space-y-2">
                      ${data.education.map((edu: any) => `
                        <div>
                          <p class="text-sm font-semibold" style="color: #212121">${edu.institution || "Your Institution"}</p>
                          <p class="text-xs" style="color: #212121">${edu.degree || "Your Degree"}</p>
                          <p class="text-xs italic" style="color: #666666">${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}</p>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.skills) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1" style="color: ${colors[2]}">Skills</h2>
                    <ul class="list-none space-y-1">
                      ${data.skills.map((skill: any) => `
                        ${skill.name ? `
                          <li class="flex items-start gap-2 text-xs" style="color: #212121">
                            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style="background-color: ${colors[5]}"></span>
                            ${skill.name}
                          </li>
                        ` : ''}
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}

                ${hasArrayData(data.certifications) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1" style="color: ${colors[2]}">Certifications</h2>
                    <ul class="list-none space-y-1">
                      ${data.certifications.map((cert: any) => `
                        ${cert.title ? `
                          <li class="flex items-start gap-2 text-xs" style="color: #212121">
                            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style="background-color: ${colors[5]}"></span>
                            ${cert.title}
                          </li>
                        ` : ''}
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}

                ${hasArrayData(data.interests) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1" style="color: ${colors[2]}">Soft Skills</h2>
                    <ul class="list-none space-y-1">
                      ${data.interests.map((interest: any) => `
                        ${interest.name ? `
                          <li class="flex items-start gap-2 text-xs" style="color: #212121">
                            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style="background-color: ${colors[5]}"></span>
                            ${interest.name}
                          </li>
                        ` : ''}
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>

              <!-- Right Column (Main Content) -->
              <div class="w-7/10 flex flex-col py-8 px-6" style="color: #212121;">
                ${data.profileInfo.summary ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1" style="color: ${colors[2]}">Profile</h2>
                    <p class="text-sm" style="color: #212121">${data.profileInfo.summary || "A short introduction about yourself..."}</p>
                  </div>
                ` : ''}

                ${hasArrayData(data.workExperiences) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1" style="color: ${colors[2]}">Experience</h2>
                    <div class="space-y-6">
                      ${data.workExperiences.map((exp: any) => `
                        <div class="mb-5">
                          <div class="flex justify-between items-baseline mb-1">
                            <div>
                              <h3 class="text-sm font-bold" style="color: #212121">${exp.company || "Company Name"}</h3>
                              <p class="text-xs italic" style="color: #666666">${exp.role || "Your Role"}</p>
                            </div>
                            <p class="text-xs italic" style="color: #666666">${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}</p>
                          </div>
                          ${exp.description ? `
                            <ul class="list-disc space-y-0.5 mt-[0.2cm] ml-4">
                              ${exp.description.split('. ').filter(Boolean).map((point: string) => `
                                <li class="text-xs text-gray-600 font-medium italic">${point.trim()}${point.endsWith('.') ? '' : '.'}</li>
                              `).join('')}
                            </ul>
                          ` : ''}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.projects) ? `
                  <div class="mb-6">
                    <h2 class="text-base font-bold mb-3 pb-1" style="color: ${colors[2]}">Projects</h2>
                    <div class="space-y-4">
                      ${data.projects.map((project: any) => `
                        <div class="mb-5">
                          <h3 class="text-sm font-semibold text-gray-800">${project.title || "Project Title"}</h3>
                          <p class="text-xs text-gray-700 font-medium mt-1">${project.description || "Project Description"}</p>
                          <div class="flex flex-col gap-1 mt-2">
                            ${project.github ? `
                              <div class="flex items-center gap-2">
                                <div class="w-5 h-5 flex items-center justify-center rounded-full" style="background-color: ${colors[0]}; color: ${colors[2]}">
                                  ${getSvgIcon('Github', colors[2], 12)}
                                </div>
                                <span class="w-16 flex-shrink-0 text-xs font-medium text-gray-800">GitHub:</span>
                                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="text-xs font-medium text-blue-600 no-underline cursor-pointer break-all">${cleanUrlForDisplay(project.github)}</a>
                              </div>
                            ` : ''}
                            ${project.LiveDemo ? `
                              <div class="flex items-center gap-2">
                                <div class="w-5 h-5 flex items-center justify-center rounded-full" style="background-color: ${colors[0]}; color: ${colors[2]}">
                                  ${getSvgIcon('ExternalLink', colors[2], 12)}
                                </div>
                                <span class="w-16 flex-shrink-0 text-xs font-medium text-gray-800">Live Demo:</span>
                                <a href="${project.LiveDemo}" target="_blank" rel="noopener noreferrer" class="text-xs font-medium text-blue-600 no-underline cursor-pointer break-all">${cleanUrlForDisplay(project.LiveDemo)}</a>
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      case 'TemplateFour':
        return `
          <div id="resume-template" class="bg-white text-gray-900 w-full h-full font-sans text-sm leading-relaxed">
            <div class="h-full flex gap-x-8 p-8">
              <!-- Left Column (Sidebar) -->
              <div class="w-3/10 flex flex-col pr-8 space-y-8 border-r border-gray-200">
                <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex-shrink-0 mx-auto mb-4">
                  ${data.profileInfo.profilePictureUrl ? `
                    <img src="${data.profileInfo.profilePictureUrl}" alt="Profile" class="w-full h-full object-cover">
                  ` : `
                    <div class="w-full h-full flex items-center justify-center text-5xl" style="color: ${colors[5]}">
                      ${getSvgIcon('User', colors[5], 48)}
                    </div>
                  `}
                </div>

                ${(data.contactInfo.linkedin || data.contactInfo.github || data.contactInfo.website) ? `
                  <div>
                    <h3 class="text-base font-bold mb-3 pb-1 uppercase tracking-wide" style="color: ${colors[1]}; border-color: ${colors[2]}">Links</h3>
                    <div class="space-y-2 text-xs" style="color: ${colors[5]}">
                      ${data.contactInfo.linkedin ? `
                        <div class="flex items-center gap-2">
                          ${getSvgIcon('Linkedin', colors[2], 12)}
                          <a href="${data.contactInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: ${colors[1]}">${cleanUrlForDisplay(data.contactInfo.linkedin)}</a>
                        </div>
                      ` : ''}
                      ${data.contactInfo.github ? `
                        <div class="flex items-center gap-2">
                          ${getSvgIcon('Github', colors[2], 12)}
                          <a href="${data.contactInfo.github}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: ${colors[1]}">${cleanUrlForDisplay(data.contactInfo.github)}</a>
                        </div>
                      ` : ''}
                      ${data.contactInfo.website ? `
                        <div class="flex items-center gap-2">
                          ${getSvgIcon('Globe', colors[2], 12)}
                          <a href="${data.contactInfo.website}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: ${colors[1]}">${cleanUrlForDisplay(data.contactInfo.website)}</a>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.languages) ? `
                  <div>
                    <h3 class="text-base font-bold mb-3 pb-1 uppercase tracking-wide" style="color: ${colors[1]}; border-color: ${colors[2]}">Languages</h3>
                    <div class="space-y-3">
                      ${data.languages.map((lang: any) => `
                        ${lang.name ? `
                          <div class="flex items-center justify-between text-xs" style="color: ${colors[1]}">
                            <span>${lang.name}</span>
                            <div class="w-20 rounded-full h-1.5" style="background-color: ${colors[3]}">
                              <div class="h-1.5 rounded-full" style="width: ${((lang.proficiency || 0) / 5) * 100}%; background-color: ${colors[4]}"></div>
                            </div>
                          </div>
                        ` : ''}
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.skills) ? `
                  <div>
                    <h3 class="text-base font-bold mb-3 pb-1 uppercase tracking-wide" style="color: ${colors[1]}; border-color: ${colors[2]}">Skills</h3>
                    <div class="grid grid-cols-1 gap-y-3">
                      ${data.skills.map((skill: any) => `
                        ${skill.name ? `
                          <div class="flex items-center justify-between text-xs" style="color: ${colors[1]}">
                            <span>${skill.name}</span>
                            <div class="w-20 rounded-full h-1.5" style="background-color: ${colors[3]}">
                              <div class="h-1.5 rounded-full" style="width: ${((skill.proficiency || 0) / 5) * 100}%; background-color: ${colors[4]}"></div>
                            </div>
                          </div>
                        ` : ''}
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.interests) ? `
                  <div>
                    <h3 class="text-base font-bold mb-3 pb-1 uppercase tracking-wide" style="color: ${colors[1]}; border-color: ${colors[2]}">Hobbies</h3>
                    <ul class="list-none space-y-1">
                      ${data.interests.map((interest: any) => `
                        ${interest.name ? `
                          <li class="flex items-start gap-2 text-xs" style="color: ${colors[1]}">
                            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style="background-color: ${colors[2]}"></span>
                            ${interest.name}
                          </li>
                        ` : ''}
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>

              <!-- Right Column (Main Content) -->
              <div class="w-7/10 flex flex-col space-y-8">
                <div>
                  <h1 class="text-3xl font-bold mb-1 uppercase tracking-wide" style="color: ${colors[1]}">${data.profileInfo.fullName || "Your Name Here"}</h1>
                  <h2 class="text-lg font-medium mb-4 uppercase tracking-widest" style="color: ${colors[5]}">${data.profileInfo.designation || "Your Designation"}</h2>
                  
                  ${hasContactInfo(data.contactInfo) ? `
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm" style="color: ${colors[5]}">
                      ${data.contactInfo.location ? `
                        <div class="flex items-center gap-1">
                          ${getSvgIcon('MapPin', colors[2], 12)} ${data.contactInfo.location}
                        </div>
                      ` : ''}
                      ${data.contactInfo.phone ? `
                        <div class="flex items-center gap-1">
                          ${getSvgIcon('Phone', colors[2], 12)} ${data.contactInfo.phone}
                        </div>
                      ` : ''}
                      ${data.contactInfo.email ? `
                        <div class="flex items-center gap-1">
                          ${getSvgIcon('Mail', colors[2], 12)} ${data.contactInfo.email}
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}
                </div>

                ${data.profileInfo.summary ? `
                  <div>
                    <h3 class="text-base font-bold mb-3 pb-1 uppercase tracking-wide" style="color: ${colors[1]}; border-color: ${colors[2]}">About Me</h3>
                    <p class="text-sm leading-relaxed" style="color: ${colors[1]}">${data.profileInfo.summary}</p>
                  </div>
                ` : ''}

                ${hasArrayData(data.workExperiences) ? `
                  <div>
                    <h3 class="text-base font-bold mb-3 pb-1 uppercase tracking-wide" style="color: ${colors[1]}; border-color: ${colors[2]}">Work Experience</h3>
                    <div class="space-y-6">
                      ${data.workExperiences.map((exp: any) => `
                        <div class="flex items-start gap-2">
                          ${getSvgIcon('Circle', colors[2], 16)}
                          <div class="flex-1">
                            <div class="flex justify-between items-baseline">
                              <h4 class="text-sm font-bold" style="color: ${colors[1]}">${exp.role || "Role"} at ${exp.company || "Company"}</h4>
                              <p class="text-xs italic" style="color: ${colors[5]}">${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}</p>
                            </div>
                            ${exp.description ? `
                              <ul class="list-disc space-y-0.5 mt-2 ml-4" style="color: ${colors[1]}">
                                ${exp.description.split('. ').filter(Boolean).map((point: string) => `
                                  <li class="text-xs">${point.trim()}${point.endsWith('.') ? '' : '.'}</li>
                                `).join('')}
                              </ul>
                            ` : ''}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.education) ? `
                  <div>
                    <h3 class="text-base font-bold mb-3 pb-1 uppercase tracking-wide" style="color: ${colors[1]}; border-color: ${colors[2]}">Education</h3>
                    <div class="space-y-4">
                      ${data.education.map((edu: any) => `
                        <div class="flex items-start gap-2">
                          ${getSvgIcon('Circle', colors[2], 16)}
                          <div class="flex-1">
                            <div class="flex justify-between items-baseline">
                              <h4 class="text-sm font-bold" style="color: ${colors[1]}">${edu.degree || "Degree"}</h4>
                              <p class="text-xs italic" style="color: ${colors[5]}">${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}</p>
                            </div>
                            <p class="text-xs" style="color: ${colors[1]}">${edu.institution || "Institution"}</p>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.projects) ? `
                  <div>
                    <h3 class="text-base font-bold mb-3 pb-1 uppercase tracking-wide" style="color: ${colors[1]}; border-color: ${colors[2]}">Projects</h3>
                    <div class="space-y-4">
                      ${data.projects.map((project: any) => `
                        <div class="flex items-start gap-2">
                          ${getSvgIcon('Circle', colors[2], 16)}
                          <div class="flex-1">
                            <h4 class="text-sm font-bold" style="color: ${colors[1]}">${project.title || "Project Title"}</h4>
                            <p class="text-xs mb-2" style="color: ${colors[1]}">${project.description || "Project Description"}</p>
                            ${(project.github || project.LiveDemo) ? `
                              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-2">
                                ${project.github ? `
                                  <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1" style="color: ${colors[2]}">
                                    ${getSvgIcon('Github', colors[2], 12)} ${cleanUrlForDisplay(project.github)}
                                  </a>
                                ` : ''}
                                ${project.LiveDemo ? `
                                  <a href="${project.LiveDemo}" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1" style="color: ${colors[2]}">
                                    ${getSvgIcon('ExternalLink', colors[2], 12)} ${cleanUrlForDisplay(project.LiveDemo)}
                                  </a>
                                ` : ''}
                              </div>
                            ` : ''}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      case 'TemplateFive':
        const contactParts: string[] = [];
        if (data.contactInfo.location) contactParts.push(data.contactInfo.location);
        if (data.contactInfo.email) contactParts.push(data.contactInfo.email);
        if (data.contactInfo.phone) contactParts.push(data.contactInfo.phone);
        if (data.contactInfo.linkedin) contactParts.push(cleanUrlForDisplay(data.contactInfo.linkedin));
        if (data.contactInfo.github) contactParts.push(cleanUrlForDisplay(data.contactInfo.github));
        if (data.contactInfo.website) contactParts.push(cleanUrlForDisplay(data.contactInfo.website));

        return `
          <div id="resume-template" class="bg-white text-gray-900 w-full h-full p-8 font-sans text-sm leading-normal" style="background-color: ${colors[0]}; color: ${colors[1]};">
            <div class="flex flex-col h-full">
              <!-- Header: Name, Designation, Contact Info -->
              <div class="mb-6 text-center">
                <h1 class="text-4xl font-extrabold uppercase mb-1" style="color: ${colors[1]}">
                  ${data.profileInfo.fullName || "YOUR NAME HERE"}
                </h1>
                <h2 class="text-lg font-semibold uppercase mb-2" style="color: ${colors[1]}">
                  ${data.profileInfo.designation || "Your Designation"}
                </h2>
                ${hasContactInfo(data.contactInfo) ? `
                  <p class="text-xs" style="color: ${colors[2]}">
                    ${contactParts.join(' | ')}
                  </p>
                ` : ''}
              </div>

              <!-- Professional Summary -->
              ${data.profileInfo.summary ? `
                <div class="mb-6">
                  <h2 class="text-lg font-bold uppercase mb-2 pb-1" style="color: ${colors[1]}; border-bottom: 1px solid ${colors[3]}">
                    Professional Summary
                  </h2>
                  <p class="text-sm leading-relaxed" style="color: ${colors[1]}">
                    ${data.profileInfo.summary}
                  </p>
                </div>
              ` : ''}

              <!-- Work Experience -->
              ${hasArrayData(data.workExperiences) ? `
                <div class="mb-6">
                  <h2 class="text-lg font-bold uppercase mb-2 pb-1" style="color: ${colors[1]}; border-bottom: 1px solid ${colors[3]}">
                    Work Experience
                  </h2>
                  <div class="space-y-4">
                    ${data.workExperiences.map((exp: any) => `
                      <div>
                        <div class="flex justify-between items-baseline mb-0.5">
                          <h3 class="text-base font-bold" style="color: ${colors[1]}">${exp.role || "Role"}</h3>
                          <p class="text-sm italic" style="color: ${colors[2]}">${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}</p>
                        </div>
                        <p class="text-sm mb-1" style="color: ${colors[2]}">${exp.company || "Company Name"}, ${exp.location || "City, State"}</p>
                        ${exp.description ? `
                          <ul class="list-disc list-inside text-sm space-y-0.5 ml-4" style="color: ${colors[1]}">
                            ${exp.description.split('. ').filter(Boolean).map((point: string, i: number) => `
                              <li key=${i}>${point.trim()}${point.endsWith('.') ? '' : '.'}</li>
                            `).join('')}
                          </ul>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Projects -->
              ${hasArrayData(data.projects) ? `
                <div class="mb-6">
                  <h2 class="text-lg font-bold uppercase mb-2 pb-1" style="color: ${colors[1]}; border-bottom: 1px solid ${colors[3]}">
                    Projects
                  </h2>
                  <div class="space-y-4">
                    ${data.projects.map((project: any) => `
                      <div>
                        <h3 class="text-base font-bold mb-0.5" style="color: ${colors[1]}">${project.title || "Project Title"}</h3>
                        <p class="text-sm mb-1" style="color: ${colors[1]}">${project.description || "Project Description"}</p>
                        ${(project.github || project.LiveDemo) ? `
                          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-1" style="color: ${colors[2]}">
                            ${project.github ? `
                              <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: ${colors[1]}">
                                GitHub: ${cleanUrlForDisplay(project.github)}
                              </a>
                            ` : ''}
                            ${project.LiveDemo ? `
                              <a href="${project.LiveDemo}" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: ${colors[1]}">
                                Live Demo: ${cleanUrlForDisplay(project.LiveDemo)}
                              </a>
                            ` : ''}
                          </div>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Education and Certifications in a two-column layout -->
              <div class="grid grid-cols-2 gap-x-8 mb-6">
                ${hasArrayData(data.education) ? `
                  <div>
                    <h2 class="text-lg font-bold uppercase mb-2 pb-1" style="color: ${colors[1]}; border-bottom: 1px solid ${colors[3]}">
                      Education
                    </h2>
                    <div class="space-y-4">
                      ${data.education.map((edu: any) => `
                        <div>
                          <div class="flex justify-between items-baseline mb-0.5">
                            <h3 class="text-base font-bold" style="color: ${colors[1]}">${edu.degree || "Degree"}</h3>
                            <p class="text-sm italic" style="color: ${colors[2]}">${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}</p>
                          </div>
                          <p class="text-sm" style="color: ${colors[2]}">${edu.institution || "Institution Name"}, ${edu.location || "City, State"}</p>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.certifications) ? `
                  <div>
                    <h2 class="text-lg font-bold uppercase mb-2 pb-1" style="color: ${colors[1]}; border-bottom: 1px solid ${colors[3]}">
                      Certifications
                    </h2>
                    <ul class="list-disc list-inside text-sm space-y-0.5 ml-4" style="color: ${colors[1]}">
                      ${data.certifications.map((cert: any, index: number) => `
                        ${cert.title ? `<li key=${index}>${cert.title} (${cert.year})</li>` : ''}
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>

              <!-- Interests and Skills in a two-column layout -->
              <div class="grid grid-cols-2 gap-x-8 mb-6">
                ${hasArrayData(data.interests) ? `
                  <div>
                    <h2 class="text-lg font-bold uppercase mb-2 pb-1" style="color: ${colors[1]}; border-bottom: 1px solid ${colors[3]}">
                      Interests
                    </h2>
                    <div class="grid grid-cols-2 gap-x-8 text-sm space-y-0.5 ml-4" style="color: ${colors[1]}">
                      ${data.interests.map((interest: any, index: number) => `
                        ${interest.name ? `
                          <div key=${index} class="flex items-start gap-1">
                            <span class="flex-shrink-0">•</span>
                            <span>${interest.name}</span>
                          </div>
                        ` : ''}
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hasArrayData(data.skills) ? `
                  <div>
                    <h2 class="text-lg font-bold uppercase mb-2 pb-1" style="color: ${colors[1]}; border-bottom: 1px solid ${colors[3]}">
                      Skills
                    </h2>
                    <ul class="list-disc list-inside text-sm space-y-0.5 ml-4" style="color: ${colors[1]}">
                      ${data.skills.map((skill: any, index: number) => `
                        ${skill.name ? `<li key=${index}>${skill.name}</li>` : ''}
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      default:
        return `
          <div id="resume-template" class="bg-white text-gray-900 w-full h-full p-8">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold mb-2">${data?.profileInfo?.fullName || 'Your Name'}</h1>
              <p class="text-xl text-gray-600">${data?.profileInfo?.designation || 'Your Title'}</p>
            </div>
            <div class="space-y-6">
              ${data?.profileInfo?.summary ? `
                <div>
                  <h3 class="text-lg font-bold mb-2">Professional Summary</h3>
                  <p class="text-gray-700">${data.profileInfo.summary}</p>
                </div>
              ` : ''}
            </div>
          </div>
        `;
    }
  };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume Template Render</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .a4-container {
          width: 794px;
          height: 1123px;
          margin: 0 auto;
          background: white;
        }
        /* Embed globals.css content */
        ${globalsCssContent}
        /* Ensure Tailwind's base styles are applied */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      </style>
    </head>
    <body>
      <div class="a4-container">
        ${getTemplateHTML(template, resumeData, themeColors)}
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}