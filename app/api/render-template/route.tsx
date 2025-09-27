import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from 'fs';
import { join } from 'path';

// Helper to get SVG icon strings
const getSvgIcon = (iconName: string, color: string, size: number = 16) => {
  const icons: { [key: string]: string } = {
    Mail: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    Phone: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    MapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    Linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    Github: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.44-1-3.44.09-2.5-1.28-4.24-2.2-4.55 0 0-1.05-.33-3.44 1.35-1-.27-2.07-.36-3.14-.36-1.07 0-2.14.09-3.14.36C7.22 4.04 6.17 4.37 6.17 4.37c-.92.31-2.29 2.04-2.2 4.55-.72 1-1.07 2.22-1 3.44 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
    Globe: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    User: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    Briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14"/></svg>`,
    GraduationCap: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.838a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 6 0 0 0 6 6v-4"/></svg>`,
    Lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-.84.5-1.5.9-2.2c.3-.5.4-.9.5-1.7 0-.2.07-.5.2-.7.2-.5.5-1 .9-1.4C17.8 6.5 18 5.3 18 4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2c0 1.3.2 2.5.5 3.5.4.7.6 1.2.9 1.7.1.2.2.5.2.7.1.8.2 1.3.5 2.2.4.7.7 1.4.9 2.2"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 14v8"/></svg>`,
    Award: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17.18 21l-5.15-3.62L7 21l1.719-8.109"/></svg>`,
    Languages: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-languages"><path d="m5 8 6 6"/><path d="m11 8 6 6"/><path d="m2 11h10"/><path d="m14 11h8"/><path d="M7 21l1.5-4 1.5 4"/><path d="M17 21l1.5-4 1.5 4"/></svg>`,
    ExternalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`,
  };
  return icons[iconName] || '';
};

// Utility function to format year-month
const formatYearMonth = (dateString?: string) => {
  if (!dateString) return "Present";
  return dateString;
};

// Helper to check if an array section has any meaningful data
const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)));

// Helper to check if contact info has any meaningful data
const hasContactInfo = (contactInfo: any) => Object.values(contactInfo).some(val => val !== undefined && val !== null && val !== '');

// Utility to clean URL for display
const cleanUrlForDisplay = (url?: string): string => {
  if (!url) return '';
  return url.replace(/^(https?:\/\/)?(www\.)?/, '');
};

const DEFAULT_THEME = ["#EBFDFF", "#A1FAFD", "#ACEAFE", "#008899", "#4A5568"];

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

  const colorPalette = resumeData?.colorPalette || DEFAULT_THEME;
  const themeColors = colorPalette && colorPalette.length > 0 ? colorPalette : DEFAULT_THEME;

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