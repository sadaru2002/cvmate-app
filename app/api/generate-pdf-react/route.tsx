import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Link } from "@react-pdf/renderer";
import React from "react";

export const maxDuration = 60;

// No custom font registration. Using only built-in fonts for stability.

// Styles using only built-in Helvetica fonts
const createStyles = () => StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica", // Always use Helvetica
    fontSize: 11,
    color: "#333333",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #e5e7eb", // Use 'pt' for points
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold", // Explicitly use Helvetica-Bold
    color: "#1f2937",
    marginBottom: 5,
  },
  text: {
    fontSize: 11,
    fontFamily: "Helvetica", // Explicitly use Helvetica
    color: "#4b5563",
    marginBottom: 5,
  },
  textBold: { // For explicit bold text
    fontSize: 11,
    fontFamily: "Helvetica-Bold", // Explicitly use Helvetica-Bold
    color: "#4b5563",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold", // Explicitly use Helvetica-Bold
    color: "#1f2937",
    marginBottom: 10,
    borderBottom: "1pt solid #e5e7eb", // Use 'pt' for points
    paddingBottom: 5,
  },
  sectionContent: {
    marginBottom: 15,
  },
  listItem: {
    fontSize: 11,
    fontFamily: "Helvetica", // Explicitly use Helvetica
    color: "#4b5563",
    marginBottom: 3,
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
    fontFamily: "Helvetica", // Explicitly use Helvetica
  },
});

const createPDFDocument = (data: any) => {
  console.log('createPDFDocument: Received data for PDF:', JSON.stringify(data, null, 2));
  console.log('createPDFDocument: Using built-in Helvetica fonts.');

  const styles = createStyles(); // Create styles dynamically

  // Add text sanitization to prevent issues with special characters
  const sanitizeText = (text: any): string => {
    if (text === null || text === undefined) return '';
    const str = String(text);
    // Remove or replace problematic characters that might cause PDF issues
    return str
      .replace(/[^\x20-\x7E\n\r\t]/g, '') // Keep only printable ASCII + whitespace
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const personalInfo = data?.personalInfo || {};
  const professionalSummary = sanitizeText(data?.professionalSummary);
  const workExperience = data?.workExperiences || [];
  const education = data?.education || [];
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
            <Text style={styles.text}>{skills.map(skill => sanitizeText(skill)).filter(Boolean).join(", ")}</Text>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>{sanitizeText(project.title)}</Text>
                {project.description && <Text style={styles.text}>{sanitizeText(project.description)}</Text>}
                {project.LiveDemo && <Link src={sanitizeText(project.LiveDemo)} style={styles.link}>Live Demo</Link>}
                {project.github && <Link src={sanitizeText(project.github)} style={styles.link}>GitHub</Link>}
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

const generatePDFWithRetry = async (resumeData: any, filename: string, maxAttempts = 2): Promise<Buffer> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`PDF generation attempt ${attempt}/${maxAttempts}`);
      
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
            ? resumeData.skills.map((s: any) => typeof s === 'string' ? s : s?.name).filter(Boolean).slice(0, 10)
            : ['JavaScript', 'Python', 'React'] // Default skills
        },
        projects: Array.isArray(resumeData?.projects) ? resumeData.projects.slice(0, 4) : [],
        certifications: Array.isArray(resumeData?.certifications) ? resumeData.certifications.slice(0, 5) : [],
        languages: [],
        interests: [],
      };

      console.log('Processed resume data for PDF generation');

      // Create PDF document React element
      const pdfDocument = createPDFDocument(fullResumeData);
      console.log('PDF document React element created successfully');
      
      // Get PDF buffer directly from the pdf() function with timeout
      const pdfBuffer = await Promise.race([
        pdf(pdfDocument).toBuffer(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('PDF generation timeout after 30 seconds')), 30000)
        )
      ]);
      console.log('PDF buffer generated successfully from pdf().toBuffer()');

      // Comprehensive buffer validation
      if (!pdfBuffer) {
        throw new Error('PDF buffer is null or undefined');
      }
      
      if (!Buffer.isBuffer(pdfBuffer)) {
        throw new Error(`Invalid buffer type: ${typeof pdfBuffer}, constructor: ${pdfBuffer?.constructor?.name}`);
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
      
      // If it's still a font or DataView error, log it specifically
      if (error.message?.includes('DataView') || 
          error.message?.includes('fontkit') || 
          error.message?.includes('Offset is outside')) {
        console.error('🔤 Font-related error persists despite using built-in fonts:', error.message);
      }
      
      // Brief wait before retry
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  throw lastError || new Error('PDF generation failed after all attempts');
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