import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Link } from "@react-pdf/renderer";
import React from "react";

export const maxDuration = 60;

// Removed custom font registration. Using only built-in fonts for stability.
// The 'fontsReady' flag is no longer needed.

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

const createPDFDocument = (data: any) => { // Removed useSystemFonts parameter
  console.log('createPDFDocument: Received data for PDF:', JSON.stringify(data, null, 2));
  console.log('createPDFDocument: Using built-in Helvetica fonts.');

  const styles = createStyles(); // Create styles dynamically

  const personalInfo = data?.personalInfo || {};
  const professionalSummary = data?.professionalSummary;
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
          <Text style={styles.name}>{String(personalInfo.fullName ?? "Your Name")}</Text>
          <Text style={styles.text}>{String(personalInfo.designation ?? "Professional Title")}</Text>
          <Text style={styles.text}>Email: {String(personalInfo.email ?? "email@example.com")}</Text>
          <Text style={styles.text}>Phone: {String(personalInfo.phone ?? "+1 234-567-8900")}</Text>
          {personalInfo.location && <Text style={styles.text}>Location: {String(personalInfo.location ?? '')}</Text>}
        </View>

        {/* Professional Summary */}
        {professionalSummary && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{String(professionalSummary ?? '')}</Text>
          </View>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {workExperience.map((job: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>
                  {String(`${job.role ?? ''}${job.company ? ` at ${job.company ?? ''}` : ''} (${job.startDate ?? ''} - ${job.endDate ?? 'Present'})`)}
                </Text>
                {job.description && <Text style={styles.text}>{String(job.description ?? '')}</Text>}
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
                  {String(`${edu.degree ?? ''} - ${edu.institution ?? ''} (${edu.startDate ?? ''} - ${edu.endDate ?? ''})`)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.text}>{String(skills.join(", ") ?? '')}</Text>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>{String(project.title ?? '')}</Text>
                {project.description && <Text style={styles.text}>{String(project.description ?? '')}</Text>}
                {project.LiveDemo && <Link src={String(project.LiveDemo ?? '')} style={styles.link}>Live Demo</Link>}
                {project.github && <Link src={String(project.github ?? '')} style={styles.link}>GitHub</Link>}
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
                  {String(`${cert.title ?? ''} by ${cert.issuer ?? ''} (${cert.year ?? ''})`)}
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
      
      // Force useSystemFonts to true as custom fonts are removed
      const useSystemFonts = true; 
      console.log(`Using system fonts: ${useSystemFonts} (custom fonts disabled)`);

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
            ? resumeData.skills.map((s: any) => s?.name).filter(Boolean).slice(0, 10)
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
        pdfDocument = createPDFDocument(fullResumeData); // No useSystemFonts parameter needed
        console.log('PDF document React element created successfully');
      } catch (docError: any) {
        console.error('Error creating PDF document React element:', docError);
        throw new Error(`PDF document React element creation failed: ${docError.message}`);
      }
      
      const pdfInstance = pdf(pdfDocument); // This returns a PDFRenderer instance
      console.log('PDFRenderer instance created successfully');
      
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