import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Link } from "@react-pdf/renderer";
import React from "react";

export const maxDuration = 60;

// Font loading with better error handling - skip custom fonts entirely for now
let fontsReady = false;
let fontLoadingAttempted = false;

const loadFontsWithRetry = async (maxRetries = 1) => {
  if (fontLoadingAttempted) return fontsReady;
  fontLoadingAttempted = true;

  // For now, skip custom font loading entirely to avoid DataView errors
  console.log('Skipping custom font loading to avoid fontkit errors');
  fontsReady = false; // Force system fonts
  return false;
};

// Don't initialize font loading to avoid errors
// loadFontsWithRetry();


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

const generatePDFWithRetry = async (resumeData: any, filename: string, maxAttempts = 3): Promise<Buffer> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`PDF generation attempt ${attempt}/${maxAttempts}`);
      console.log('Resume data keys:', Object.keys(resumeData || {}));
      
      // Always use system fonts for reliability
      const useSystemFonts = true;
      console.log(`Using system fonts for attempt ${attempt}`);

      // Prepare resume data with safe defaults and extensive logging
      const fullResumeData = {
        personalInfo: {
          fullName: resumeData.profileInfo?.fullName || resumeData.personalInfo?.fullName || 'John Doe',
          designation: resumeData.profileInfo?.designation || resumeData.personalInfo?.designation || 'Professional',
          email: resumeData.profileInfo?.email || resumeData.personalInfo?.email || 'email@example.com',
          phone: resumeData.profileInfo?.phone || resumeData.personalInfo?.phone || '+1234567890',
          location: resumeData.profileInfo?.location || resumeData.personalInfo?.location || '',
        },
        professionalSummary: resumeData.profileInfo?.summary || resumeData.professionalSummary || 'Professional summary not provided.',
        workExperiences: Array.isArray(resumeData.workExperiences) ? resumeData.workExperiences : [],
        education: Array.isArray(resumeData.education) ? resumeData.education : [],
        skills: { 
          technical: Array.isArray(resumeData.skills) 
            ? resumeData.skills.map((s: any) => s?.name || s).filter(Boolean) 
            : []
        },
        projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
        certifications: Array.isArray(resumeData.certifications) ? resumeData.certifications : [],
        languages: Array.isArray(resumeData.languages) ? resumeData.languages : [],
        interests: Array.isArray(resumeData.interests) ? resumeData.interests : [],
      };

      console.log('Processed resume data:', JSON.stringify(fullResumeData, null, 2));

      const pdfDocument = createPDFDocument(fullResumeData, useSystemFonts);
      console.log('PDF document created successfully');
      
      const pdfInstance = pdf(pdfDocument);
      console.log('PDF instance created successfully');
      
      // Add timeout to prevent hanging
      const pdfBuffer = await Promise.race([
        pdfInstance.toBuffer(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF generation timeout after 30 seconds')), 30000)
        )
      ]) as Buffer;

      console.log('PDF buffer generated, checking validity...');

      // More detailed buffer validation
      if (!pdfBuffer) {
        throw new Error('PDF buffer is null or undefined');
      }
      
      if (!Buffer.isBuffer(pdfBuffer)) {
        throw new Error(`PDF buffer is not a Buffer instance, got: ${typeof pdfBuffer}`);
      }
      
      if (pdfBuffer.length === 0) {
        throw new Error('PDF buffer is empty (0 bytes)');
      }

      // Check if buffer starts with PDF header
      const pdfHeader = pdfBuffer.subarray(0, 4).toString();
      if (!pdfHeader.startsWith('%PDF')) {
        throw new Error(`Generated buffer does not appear to be a valid PDF (header: ${pdfHeader})`);
      }

      console.log(`PDF generated successfully on attempt ${attempt}, buffer size: ${pdfBuffer.length} bytes`);
      return pdfBuffer;

    } catch (error: any) {
      lastError = error;
      console.warn(`PDF generation attempt ${attempt} failed:`, error.message);
      
      // If it's a font-related error, force system fonts on next attempt
      if (error.message?.includes('DataView') || 
          error.message?.includes('fontkit') || 
          error.message?.includes('Offset is outside') ||
          error.message?.includes('Glyph')) {
        console.warn('Font-related error detected, forcing system fonts for next attempt');
        fontsReady = false;
        fontLoadingAttempted = false; // Allow retry with system fonts
      }
      
      // On final attempt, try with minimal configuration
      if (attempt === maxAttempts) {
        try {
          console.log('Final attempt with minimal configuration and system fonts');
          const fallbackData = createMinimalResumeData(resumeData);
          const fallbackDocument = createPDFDocument(fallbackData, true); // Force system fonts
          const fallbackInstance = pdf(fallbackDocument);
          const fallbackBuffer = await fallbackInstance.toBuffer();
          
          if (!fallbackBuffer || !Buffer.isBuffer(fallbackBuffer) || fallbackBuffer.length === 0) {
            throw new Error('Fallback PDF buffer is invalid or empty');
          }
          
          return fallbackBuffer;
        } catch (fallbackError) {
          console.error('Fallback PDF generation failed:', fallbackError);
          throw lastError; // Throw the original error
        }
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
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