import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf, Link } from "@react-pdf/renderer";
import React from "react";

export const maxDuration = 60;

// Vercel-optimized version - no custom font loading


// Styles using only system fonts to prevent fontkit errors
const createStyles = (useSystemFonts: boolean) => StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica", // Always use Helvetica for reliability
    fontSize: 11,
    color: "#333333",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #e5e7eb",
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  text: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 5,
    fontFamily: "Helvetica",
  },
  textBold: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
    marginBottom: 10,
    borderBottom: "1pt solid #e5e7eb",
    paddingBottom: 5,
  },
  sectionContent: {
    marginBottom: 15,
  },
  listItem: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 3,
    fontFamily: "Helvetica",
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
    fontFamily: "Helvetica",
  },
});

const createPDFDocument = (data: any, useSystemFonts: boolean) => {
  console.log('createPDFDocument: Received data for PDF:', JSON.stringify(data, null, 2));
  console.log('createPDFDocument: Using system fonts:', useSystemFonts);

  const styles = createStyles(useSystemFonts); // Create styles dynamically

  // Add text sanitization function to handle problematic characters
  const sanitizeText = (text: any) => {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/[^\x20-\x7E\n\r\t]/g, '') // Keep only printable ASCII + whitespace
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const personalInfo = data?.personalInfo || {};
  const professionalSummary = sanitizeText(data?.professionalSummary);
  const workExperience = data?.workExperiences || [];
  const education = data?.education || [];
  // Ensure skills are filtered to only include valid names before mapping
  const skills = data?.skills?.technical?.filter(Boolean) || [];
  const projects = data?.projects || [];
  const certifications = data?.certifications || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{sanitizeText(personalInfo.fullName) || "Your Name"}</Text>
          <Text style={styles.text}>{sanitizeText(personalInfo.designation) || "Professional Title"}</Text>
          <Text style={styles.text}>Email: {sanitizeText(personalInfo.email) || "email@example.com"}</Text>
          <Text style={styles.text}>Phone: {sanitizeText(personalInfo.phone) || "+1 234-567-8900"}</Text>
          {personalInfo.location && <Text style={styles.text}>Location: {sanitizeText(personalInfo.location)}</Text>}
        </View>

        {/* Professional Summary */}
        {professionalSummary && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{professionalSummary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {workExperience.map((job: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>
                  {`${sanitizeText(job.role) || ''}${job.company ? ` at ${sanitizeText(job.company)}` : ''} (${sanitizeText(job.startDate) || ''} - ${sanitizeText(job.endDate) || 'Present'})`}
                </Text>
                {job.description && <Text style={styles.text}>{sanitizeText(job.description)}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.text}>
                  {`${sanitizeText(edu.degree) || ''} - ${sanitizeText(edu.institution) || ''} (${sanitizeText(edu.startDate) || ''} - ${sanitizeText(edu.endDate) || ''})`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.text}>{skills.map((skill: string) => sanitizeText(skill)).filter(Boolean).join(", ")}</Text>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>
                  {sanitizeText(project.title)}
                </Text>
                {project.description && <Text style={styles.text}>{sanitizeText(project.description)}</Text>}
                {project.LiveDemo && <Link src={project.LiveDemo} style={styles.link}>Live Demo</Link>}
                {project.github && <Link src={project.github} style={styles.link}>GitHub</Link>}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.text}>
                  {`${sanitizeText(cert.title) || ''} by ${sanitizeText(cert.issuer) || ''} (${sanitizeText(cert.year) || ''})`}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

// Alternative simple PDF generation for Vercel troubleshooting
const createSimplePDF = async (resumeData: any): Promise<Buffer> => {
  console.log('🔄 Creating simple PDF with minimal components');
  
  const SimpleDocument = () => (
    <Document>
      <Page size="A4" style={{
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 11,
        color: '#333333',
      }}>
        <View style={{ marginBottom: 20, paddingBottom: 15 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#1f2937', marginBottom: 5 }}>
            {resumeData?.profileInfo?.fullName || resumeData?.personalInfo?.fullName || 'Resume'}
          </Text>
          <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 5 }}>
            {resumeData?.profileInfo?.designation || resumeData?.personalInfo?.designation || 'Professional'}
          </Text>
          <Text style={{ fontSize: 11, color: '#4b5563', marginBottom: 3 }}>
            Email: {resumeData?.profileInfo?.email || resumeData?.personalInfo?.email || 'email@example.com'}
          </Text>
          <Text style={{ fontSize: 11, color: '#4b5563' }}>
            Phone: {resumeData?.profileInfo?.phone || resumeData?.personalInfo?.phone || '+1234567890'}
          </Text>
        </View>
        
        {(resumeData?.profileInfo?.summary || resumeData?.professionalSummary) && (
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1f2937', marginBottom: 10 }}>
              Professional Summary
            </Text>
            <Text style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
              {resumeData?.profileInfo?.summary || resumeData?.professionalSummary}
            </Text>
          </View>
        )}
        
        {resumeData?.skills?.length > 0 && (
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1f2937', marginBottom: 10 }}>
              Skills
            </Text>
            <Text style={{ fontSize: 11, color: '#4b5563' }}>
              {resumeData.skills.map((s: any) => s?.name || s).filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );

  try {
    const pdfInstance = pdf(<SimpleDocument />);
    const result = await pdfInstance.toBuffer();
    
    // Handle the result the same way as the main function
    let buffer: Buffer;
    if (Buffer.isBuffer(result)) {
      buffer = result;
    } else if (result instanceof Uint8Array) {
      buffer = Buffer.from(result);
    } else if (result && typeof result === 'object') {
      // Try to extract buffer from object
      const data = (result as any).data || (result as any).buffer || result;
      buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    } else {
      buffer = Buffer.from(result as any);
    }
    
    console.log(`✅ Simple PDF created: ${buffer.length} bytes`);
    return buffer;
    
  } catch (error: any) {
    console.error('❌ Simple PDF creation failed:', error);
    throw error;
  }
};

const generatePDFWithRetry = async (resumeData: any, filename: string, maxAttempts = 2): Promise<Buffer> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`PDF generation attempt ${attempt}/${maxAttempts}`);
      console.log('Resume data keys:', Object.keys(resumeData || {}));
      
      // Always use system fonts for Vercel reliability
      const useSystemFonts = true;
      console.log(`Using system fonts for Vercel compatibility`);

      // Prepare resume data with comprehensive fallbacks
      const fullResumeData = {
        personalInfo: {
          fullName: resumeData?.profileInfo?.fullName || resumeData?.personalInfo?.fullName || 'John Doe',
          designation: resumeData?.profileInfo?.designation || resumeData?.personalInfo?.designation || 'Professional',
          email: resumeData?.profileInfo?.email || resumeData?.personalInfo?.email || 'email@example.com',
          phone: resumeData?.profileInfo?.phone || resumeData?.personalInfo?.phone || '+1 (555) 123-4567',
          location: resumeData?.profileInfo?.location || resumeData?.personalInfo?.location || 'City, State',
        },
        professionalSummary: resumeData?.profileInfo?.summary || resumeData?.professionalSummary || 'Experienced professional with demonstrated expertise.',
        workExperiences: Array.isArray(resumeData?.workExperiences) ? resumeData.workExperiences.slice(0, 5) : [],
        education: Array.isArray(resumeData?.education) ? resumeData.education.slice(0, 3) : [],
        skills: { 
          technical: Array.isArray(resumeData?.skills) 
            ? resumeData.skills.map((s: any) => s?.name || s).filter(Boolean).slice(0, 10)
            : ['JavaScript', 'Python', 'React'] // Default skills
        },
        projects: Array.isArray(resumeData?.projects) ? resumeData.projects.slice(0, 4) : [],
        certifications: Array.isArray(resumeData?.certifications) ? resumeData.certifications.slice(0, 5) : [],
        languages: [],
        interests: [],
      };

      console.log('Processed resume data for PDF generation');

      // Create PDF with error boundary
      let pdfDocument;
      try {
        pdfDocument = createPDFDocument(fullResumeData, useSystemFonts);
        console.log('PDF document created successfully');
      } catch (docError: any) {
        console.error('Error creating PDF document:', docError);
        throw new Error(`PDF document creation failed: ${docError.message}`);
      }
      
      const pdfInstance = pdf(pdfDocument);
      console.log('PDF instance created successfully');
      
      // Reduced timeout for Vercel
      const pdfResult = await Promise.race([
        pdfInstance.toBuffer(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF generation timeout after 25 seconds')), 25000)
        )
      ]);

      console.log('PDF result type:', typeof pdfResult);
      console.log('PDF result constructor:', pdfResult?.constructor?.name);

      // Handle different buffer types that might be returned in Vercel
      let pdfBuffer: Buffer;
      
      if (Buffer.isBuffer(pdfResult)) {
        pdfBuffer = pdfResult;
        console.log('Direct Buffer received');
      } else if (pdfResult instanceof Uint8Array) {
        pdfBuffer = Buffer.from(pdfResult);
        console.log('Uint8Array converted to Buffer');
      } else if (pdfResult && typeof pdfResult === 'object' && 'data' in pdfResult) {
        // Handle case where result has a 'data' property containing the buffer
        const data = (pdfResult as any).data;
        if (Buffer.isBuffer(data)) {
          pdfBuffer = data;
        } else if (data instanceof Uint8Array) {
          pdfBuffer = Buffer.from(data);
        } else if (Array.isArray(data)) {
          pdfBuffer = Buffer.from(data);
        } else {
          throw new Error(`Unsupported data type in PDF result: ${typeof data}`);
        }
        console.log('Extracted buffer from result.data');
      } else if (pdfResult && typeof pdfResult === 'object' && 'buffer' in pdfResult) {
        // Handle case where result has a 'buffer' property
        const buffer = (pdfResult as any).buffer;
        if (Buffer.isBuffer(buffer)) {
          pdfBuffer = buffer;
        } else if (buffer instanceof Uint8Array) {
          pdfBuffer = Buffer.from(buffer);
        } else {
          throw new Error(`Unsupported buffer type: ${typeof buffer}`);
        }
        console.log('Extracted buffer from result.buffer');
      } else if (Array.isArray(pdfResult)) {
        pdfBuffer = Buffer.from(pdfResult);
        console.log('Array converted to Buffer');
      } else {
        console.error('Unexpected PDF result structure:', pdfResult);
        throw new Error(`Invalid buffer type: ${typeof pdfResult}, constructor: ${pdfResult?.constructor?.name}`);
      }

      console.log('PDF buffer generated, validating...');

      // Comprehensive buffer validation
      if (!pdfBuffer) {
        throw new Error('PDF buffer is null or undefined');
      }
      
      if (!Buffer.isBuffer(pdfBuffer)) {
        throw new Error(`Invalid buffer type: ${typeof pdfBuffer}`);
      }
      
      if (pdfBuffer.length === 0) {
        throw new Error('PDF buffer is empty (0 bytes)');
      }

      if (pdfBuffer.length < 100) {
        throw new Error(`PDF buffer too small: ${pdfBuffer.length} bytes`);
      }

      // Check PDF header
      const pdfHeader = pdfBuffer.subarray(0, 8).toString();
      if (!pdfHeader.includes('%PDF')) {
        throw new Error(`Invalid PDF header: ${pdfHeader}`);
      }

      console.log(`✅ PDF generated successfully on attempt ${attempt}, size: ${pdfBuffer.length} bytes`);
      return pdfBuffer;

    } catch (error: any) {
      lastError = error;
      console.warn(`❌ PDF generation attempt ${attempt} failed:`, error.message);
      
      // If it's a font-related error, note it for debugging
      if (error.message?.includes('DataView') || 
          error.message?.includes('fontkit') || 
          error.message?.includes('Offset is outside') ||
          error.message?.includes('Glyph')) {
        console.warn('Font-related error detected - using system fonts only');
      }
      
      // On final attempt, try with progressively simpler approaches
      if (attempt === maxAttempts) {
        try {
          console.log('🔄 Final attempt with minimal configuration');
          const minimalData = createMinimalResumeData(resumeData);
          const minimalDoc = createPDFDocument(minimalData, true);
          const minimalInstance = pdf(minimalDoc);
          const minimalResult = await minimalInstance.toBuffer();
          
          // Handle buffer conversion for minimal fallback too
          let minimalBuffer: Buffer;
          if (Buffer.isBuffer(minimalResult)) {
            minimalBuffer = minimalResult;
          } else if (minimalResult instanceof Uint8Array) {
            minimalBuffer = Buffer.from(minimalResult);
          } else if (minimalResult && typeof minimalResult === 'object' && 'data' in minimalResult) {
            const data = (minimalResult as any).data;
            minimalBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
          } else {
            minimalBuffer = Buffer.from(minimalResult as any);
          }
          
          if (!minimalBuffer || !Buffer.isBuffer(minimalBuffer) || minimalBuffer.length === 0) {
            throw new Error('Even minimal PDF generation failed');
          }
          
          console.log(`✅ Minimal PDF generated: ${minimalBuffer.length} bytes`);
          return minimalBuffer;
        } catch (minimalError) {
          console.error('💥 Minimal PDF generation failed, trying simple PDF:', minimalError);
          
          // Last resort: try the simple PDF approach
          try {
            return await createSimplePDF(resumeData);
          } catch (simpleError) {
            console.error('💥 Simple PDF generation also failed:', simpleError);
            throw lastError;
          }
        }
      }
      
      // Brief wait before retry
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  throw lastError || new Error('PDF generation failed after all attempts');
};

const createMinimalResumeData = (resumeData: any) => {
  // Create a minimal version of resume data to avoid any issues
  // Sanitize all text fields to prevent special characters that might cause font issues
  const sanitizeText = (text: string) => {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const minimal = {
    personalInfo: {
      fullName: sanitizeText(resumeData.profileInfo?.fullName || resumeData.personalInfo?.fullName) || 'John Doe',
      designation: sanitizeText(resumeData.profileInfo?.designation || resumeData.personalInfo?.designation) || 'Professional',
      email: sanitizeText(resumeData.profileInfo?.email || resumeData.personalInfo?.email) || 'john.doe@email.com',
      phone: sanitizeText(resumeData.profileInfo?.phone || resumeData.personalInfo?.phone) || '+1234567890',
      location: sanitizeText(resumeData.profileInfo?.location || resumeData.personalInfo?.location) || 'Location',
    },
    professionalSummary: sanitizeText(resumeData.profileInfo?.summary || resumeData.professionalSummary) || 'Experienced professional with a strong background in various fields.',
    workExperiences: (resumeData.workExperiences || []).slice(0, 2).map((exp: any) => ({
      role: sanitizeText(exp?.role) || 'Role',
      company: sanitizeText(exp?.company) || 'Company',
      startDate: sanitizeText(exp?.startDate) || '2020',
      endDate: sanitizeText(exp?.endDate) || '2023',
      description: sanitizeText(exp?.description) || 'Job description',
    })),
    education: (resumeData.education || []).slice(0, 1).map((edu: any) => ({
      degree: sanitizeText(edu?.degree) || 'Bachelor Degree',
      institution: sanitizeText(edu?.institution) || 'University',
      startDate: sanitizeText(edu?.startDate) || '2016',
      endDate: sanitizeText(edu?.endDate) || '2020',
    })),
    skills: { 
      technical: (resumeData.skills?.map((s: any) => sanitizeText(s?.name || s)).filter(Boolean) || ['JavaScript', 'Python', 'React']).slice(0, 5)
    },
    projects: (resumeData.projects || []).slice(0, 2).map((proj: any) => ({
      title: sanitizeText(proj?.title) || 'Project',
      description: sanitizeText(proj?.description) || 'Project description',
      LiveDemo: proj?.LiveDemo || '',
      github: proj?.github || '',
    })),
    certifications: (resumeData.certifications || []).slice(0, 2).map((cert: any) => ({
      title: sanitizeText(cert?.title) || 'Certification',
      issuer: sanitizeText(cert?.issuer) || 'Issuer',
      year: sanitizeText(cert?.year) || '2023',
    })),
    languages: [],
    interests: [],
  };

  console.log('Created minimal resume data:', JSON.stringify(minimal, null, 2));
  return minimal;
};

export async function POST(req: NextRequest) {
  console.log('API: generate-pdf-react POST request received.');
  try {
    const body = await req.json();
    const { resumeData, filename = "resume" } = body;

    console.log('API: Request body keys:', Object.keys(body || {}));
    console.log('API: Received resumeData keys:', Object.keys(resumeData || {}));
    console.log('API: Filename:', filename);

    if (!resumeData) {
      console.error('API: Resume data is missing from request body');
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }

    // Log the structure of resumeData for debugging
    console.log('API: Resume data structure:');
    console.log('- profileInfo:', resumeData.profileInfo ? Object.keys(resumeData.profileInfo) : 'missing');
    console.log('- personalInfo:', resumeData.personalInfo ? Object.keys(resumeData.personalInfo) : 'missing');
    console.log('- workExperiences:', Array.isArray(resumeData.workExperiences) ? resumeData.workExperiences.length : 'not array');
    console.log('- education:', Array.isArray(resumeData.education) ? resumeData.education.length : 'not array');
    console.log('- skills:', Array.isArray(resumeData.skills) ? resumeData.skills.length : 'not array');

    // Generate PDF with retry logic
    console.log('API: Starting PDF generation...');
    const pdfBuffer = await generatePDFWithRetry(resumeData, filename);
    console.log('API: PDF generation completed successfully');

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("API: React PDF generation error caught in POST handler:", error);
    console.error("API: Error message:", error?.message);
    console.error("API: Error stack:", error?.stack);
    
    // Return more specific error information for debugging
    const errorMessage = error?.message || 'Unknown error';
    const errorType = error?.name || 'UnknownError';
    
    return NextResponse.json({
      success: false,
      error: "Failed to generate PDF",
      details: errorMessage,
      errorType: errorType,
      retryable: true,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}