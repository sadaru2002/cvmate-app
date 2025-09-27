import { NextRequest, NextResponse } from "next/server";

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

  const colorPalette = resumeData?.colorPalette || ['#EBFDFF', '#A1FAFD', '#ACEAFE', '#008899', '#4A5568'];
  
  // Get template-specific CSS and HTML based on template
  const getTemplateHTML = (templateName: string, data: any, colors: string[]) => {
    // This is a simplified version - you might need to implement more complex template logic
    const commonStyles = `
      .template-color-1 { background-color: ${colors[0]}; }
      .template-color-2 { background-color: ${colors[1]}; }
      .template-color-3 { background-color: ${colors[2]}; }
      .template-color-4 { background-color: ${colors[3]}; color: ${colors[3]}; }
      .template-color-5 { background-color: ${colors[4]}; color: ${colors[4]}; }
      .border-template-4 { border-color: ${colors[3]}; }
      .text-template-4 { color: ${colors[3]}; }
    `;
    
    switch (templateName) {
      case 'TemplateOne':
        return `
          <div id="resume-template" class="bg-white text-gray-900 w-full h-full p-8">
            <div class="flex h-full">
              <!-- Left Sidebar -->
              <div class="w-4/12 flex-shrink-0 template-color-1 p-6 mr-8">
                <div class="text-center mb-8">
                  ${data?.profileInfo?.profilePictureUrl ? 
                    `<img src="${data.profileInfo.profilePictureUrl}" alt="Profile" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">` : 
                    `<div class="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300"></div>`
                  }
                  <h1 class="text-2xl font-bold text-template-4 mb-2">${data?.profileInfo?.fullName || 'Your Name'}</h1>
                  <p class="text-template-5">${data?.profileInfo?.designation || 'Your Title'}</p>
                </div>
                
                <!-- Contact Info -->
                <div class="mb-8">
                  <h3 class="text-lg font-bold text-template-4 border-b-2 border-template-4 pb-2 mb-4">CONTACT</h3>
                  ${data?.contactInfo?.email ? `<p class="text-sm mb-2 text-template-5">${data.contactInfo.email}</p>` : ''}
                  ${data?.contactInfo?.phone ? `<p class="text-sm mb-2 text-template-5">${data.contactInfo.phone}</p>` : ''}
                  ${data?.contactInfo?.location ? `<p class="text-sm mb-2 text-template-5">${data.contactInfo.location}</p>` : ''}
                  ${data?.contactInfo?.linkedin ? `<p class="text-sm mb-2 text-template-5">${data.contactInfo.linkedin}</p>` : ''}
                  ${data?.contactInfo?.github ? `<p class="text-sm mb-2 text-template-5">${data.contactInfo.github}</p>` : ''}
                </div>
              </div>
              
              <!-- Right Content -->
              <div class="flex-1">
                <!-- Professional Summary -->
                ${data?.profileInfo?.summary ? `
                  <div class="mb-8">
                    <h3 class="text-lg font-bold text-template-4 border-b-2 border-template-4 pb-2 mb-4">PROFESSIONAL SUMMARY</h3>
                    <p class="text-sm text-gray-700 leading-relaxed">${data.profileInfo.summary}</p>
                  </div>
                ` : ''}
                
                <!-- Projects -->
                ${data?.projects?.length ? `
                  <div class="mb-8">
                    <h3 class="text-lg font-bold text-template-4 border-b-2 border-template-4 pb-2 mb-4">PROJECTS</h3>
                    ${data.projects.map((project: any) => `
                      <div class="mb-6">
                        <h4 class="text-base font-bold text-template-4 mb-2">${project.title || ''}</h4>
                        <p class="text-sm text-gray-700 mb-2">${project.description || ''}</p>
                        ${project.github ? `<p class="text-xs text-template-4">GitHub: ${project.github}</p>` : ''}
                        ${project.LiveDemo ? `<p class="text-xs text-template-4">Demo: ${project.LiveDemo}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                
                <!-- Education -->
                ${data?.education?.length ? `
                  <div class="mb-8">
                    <h3 class="text-lg font-bold text-template-4 border-b-2 border-template-4 pb-2 mb-4">EDUCATION</h3>
                    ${data.education.map((edu: any) => `
                      <div class="mb-4">
                        <h4 class="text-base font-semibold text-gray-900">${edu.degree || ''}</h4>
                        <p class="text-sm text-gray-700">${edu.institution || ''}</p>
                        <p class="text-xs text-gray-600">${edu.startDate || ''} - ${edu.endDate || ''}</p>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                
                <!-- Certifications -->
                ${data?.certifications?.length ? `
                  <div class="mb-8">
                    <h3 class="text-lg font-bold text-template-4 border-b-2 border-template-4 pb-2 mb-4">CERTIFICATIONS</h3>
                    ${data.certifications.map((cert: any) => `
                      <div class="mb-3">
                        <h4 class="text-sm font-semibold text-gray-900">${cert.title || ''}</h4>
                        <p class="text-xs text-gray-700">${cert.issuer || ''} (${cert.year || ''})</p>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      default:
        // Fallback template
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
        ${`
          .template-color-1 { background-color: ${colorPalette[0]}; }
          .template-color-2 { background-color: ${colorPalette[1]}; }
          .template-color-3 { background-color: ${colorPalette[2]}; }
          .template-color-4 { color: ${colorPalette[3]}; }
          .template-color-5 { color: ${colorPalette[4]}; }
          .border-template-4 { border-color: ${colorPalette[3]}; }
          .text-template-4 { color: ${colorPalette[3]}; }
        `}
        .a4-container {
          width: 794px;
          height: 1123px;
          margin: 0 auto;
          background: white;
        }
      </style>
    </head>
    <body>
      <div class="a4-container">
        ${getTemplateHTML(template, resumeData, colorPalette)}
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