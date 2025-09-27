import { NextRequest, NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import PdfTemplateRouter from "@/components/pdf-templates/PdfTemplateRouter";

export const maxDuration = 60;

const createPDFDocument = (data: any) => {
  console.log('createPDFDocument: Received data for PDF:', JSON.stringify(data, null, 2));
  console.log('createPDFDocument: Using template:', data.template, 'with colors:', data.colorPalette);

  // Use the PdfTemplateRouter to render the correct template
  return (
    <PdfTemplateRouter 
      data={data} 
      template={data.template || 'TemplateOne'} 
      colorPalette={data.colorPalette || ['#EBFDFF', '#A1FAFD', '#ACEAFE', '#008899', '#4A5568']} 
    />
  );
};

const generatePDFWithRetry = async (resumeData: any, filename: string, maxAttempts = 2): Promise<Buffer> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`PDF generation attempt ${attempt}/${maxAttempts}`);
      
      // Prepare resume data with comprehensive fallbacks
      const fullResumeData = {
        template: resumeData?.template || 'TemplateOne', // Pass template
        colorPalette: resumeData?.colorPalette || ['#EBFDFF', '#A1FAFD', '#ACEAFE', '#008899', '#4A5568'], // Pass color palette
        profileInfo: {
          profilePictureUrl: resumeData?.profileInfo?.profilePictureUrl || '',
          fullName: resumeData?.profileInfo?.fullName || resumeData?.personalInfo?.fullName || 'John Doe',
          designation: resumeData?.profileInfo?.designation || resumeData?.personalInfo?.designation || 'Professional',
          summary: resumeData?.profileInfo?.summary || resumeData?.professionalSummary || 'Experienced professional with demonstrated expertise.',
        },
        contactInfo: {
          email: resumeData?.contactInfo?.email || resumeData?.profileInfo?.email || resumeData?.personalInfo?.email || 'email@example.com',
          phone: resumeData?.contactInfo?.phone || resumeData?.profileInfo?.phone || resumeData?.personalInfo?.phone || '+1 (555) 123-4567',
          location: resumeData?.contactInfo?.location || resumeData?.profileInfo?.location || resumeData?.personalInfo?.location || 'City, State',
          linkedin: resumeData?.contactInfo?.linkedin || '',
          github: resumeData?.contactInfo?.github || '',
          website: resumeData?.contactInfo?.website || '',
        },
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
      
      // Get PDF buffer using async/await pattern for better error handling
      let pdfBuffer: Buffer;
      try {
        const pdfInstance = pdf(pdfDocument);
        
        // Use toBlob() and then convert to buffer as a more reliable method
        const blob = await Promise.race([
          pdfInstance.toBlob(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('PDF generation timeout after 30 seconds')), 30000)
          )
        ]);
        
        // Convert blob to buffer
        const arrayBuffer = await blob.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
        console.log('PDF buffer generated successfully from toBlob()');
        
      } catch (blobError) {
        console.warn('toBlob() failed, trying toBuffer():', blobError);
        
        // Fallback to toBuffer() method
        const pdfInstance = pdf(pdfDocument);
        const bufferResult = await Promise.race([
          pdfInstance.toBuffer(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('PDF generation timeout after 30 seconds')), 30000)
          )
        ]);
        
        // Handle different return types
        if (Buffer.isBuffer(bufferResult)) {
          pdfBuffer = bufferResult;
        } else if (bufferResult instanceof Uint8Array) {
          pdfBuffer = Buffer.from(bufferResult);
        } else {
          throw new Error(`Invalid buffer type: ${typeof bufferResult}, constructor: ${bufferResult?.constructor?.name}`);
        }
        console.log('PDF buffer generated successfully from toBuffer()');
      }

      // Comprehensive buffer validation
      if (!pdfBuffer) {
        throw new Error('PDF buffer is null or undefined');
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