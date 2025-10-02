import { NextRequest, NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import PdfTemplateRouter from "@/components/pdf-templates/PdfTemplateRouter";
import { ResumeFormData } from '@/hooks/use-resume-builder'; // Import the canonical interface

export const maxDuration = 60;

const createPDFDocument = (data: ResumeFormData) => { // Use canonical interface
  console.log('createPDFDocument: Received data for PDF generation');
  console.log(`Using template: ${data.template} with ${data.colorPalette?.length || 0} colors`);

  if (!data.template) {
    console.warn('No template specified, defaulting to TemplateOne');
  }
  
  if (!data.colorPalette || data.colorPalette.length === 0) {
    console.warn('No color palette provided, using default colors');
  }

  return (
    <PdfTemplateRouter 
      data={data} // Pass data directly
      template={data.template || 'TemplateOne'} 
      colorPalette={data.colorPalette || ['#EBFDFF', '#A1FAFD', '#ACEAFE', '#008899', '#4A5568']} 
    />
  );
};

const generatePDFWithRetry = async (resumeData: ResumeFormData, filename: string, maxAttempts = 3): Promise<Buffer> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`📄 PDF generation attempt ${attempt}/${maxAttempts}`);
      
      // Sanitize and provide fallbacks directly within the ResumeFormData structure
      const sanitizedResumeData: ResumeFormData = {
        _id: resumeData._id,
        title: resumeData.title || 'Untitled Resume',
        thumbnailLink: resumeData.thumbnailLink,
        template: resumeData.template || 'TemplateOne',
        colorPalette: Array.isArray(resumeData.colorPalette) && resumeData.colorPalette.length > 0 
          ? resumeData.colorPalette 
          : ['#EBFDFF', '#A1FAFD', '#ACEAFE', '#008899', '#4A5568'], // Default for TemplateOne
        
        profileInfo: {
          profilePictureUrl: resumeData.profileInfo?.profilePictureUrl || '',
          fullName: resumeData.profileInfo?.fullName || 'John Doe',
          designation: resumeData.profileInfo?.designation || 'Professional',
          summary: resumeData.profileInfo?.summary || 'Experienced professional with demonstrated expertise in various technologies and methodologies.',
        },
        
        contactInfo: {
          email: resumeData.contactInfo?.email || 'contact@example.com',
          phone: resumeData.contactInfo?.phone || '+1 (555) 123-4567',
          location: resumeData.contactInfo?.location || 'City, State, Country',
          linkedin: resumeData.contactInfo?.linkedin || '',
          github: resumeData.contactInfo?.github || '',
          website: resumeData.contactInfo?.website || '',
        },
        
        workExperiences: Array.isArray(resumeData.workExperiences) 
          ? resumeData.workExperiences
              .filter((exp: any) => exp && (exp.role || exp.company)) // Filter out empty entries
              .slice(0, 6) // Limit to 6 experiences
              .map((exp: any) => ({
                company: exp.company || 'Company Name',
                role: exp.role || 'Position',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                description: exp.description || '',
              }))
          : [],
        
        education: Array.isArray(resumeData.education) 
          ? resumeData.education
              .filter((edu: any) => edu && (edu.degree || edu.institution)) // Filter out empty entries
              .slice(0, 4) // Limit to 4 education entries
              .map((edu: any) => ({
                degree: edu.degree || 'Degree',
                institution: edu.institution || 'Institution',
                startDate: edu.startDate || '',
                endDate: edu.endDate || '',
              }))
          : [],
        
        skills: Array.isArray(resumeData.skills) 
          ? resumeData.skills
              .filter((s: any) => s && s.name) // Filter out empty entries
              .slice(0, 12) // Limit to 12 skills
              .map((s: any) => ({
                name: s.name || '',
                proficiency: s.proficiency || 0,
              }))
          : [],
        
        projects: Array.isArray(resumeData.projects) 
          ? resumeData.projects
              .filter((proj: any) => proj && proj.title) // Filter out empty entries
              .slice(0, 5) // Limit to 5 projects
              .map((proj: any) => ({
                title: proj.title || 'Project Name',
                description: proj.description || 'Project description',
                github: proj.github || '',
                LiveDemo: proj.LiveDemo || '',
              }))
          : [],
        
        certifications: Array.isArray(resumeData.certifications) 
          ? resumeData.certifications
              .filter((cert: any) => cert && cert.title) // Filter out empty entries
              .slice(0, 6) // Limit to 6 certifications
              .map((cert: any) => ({
                title: cert.title || 'Certification',
                issuer: cert.issuer || 'Issuing Organization',
                year: cert.year || '',
              }))
          : [],
        
        languages: Array.isArray(resumeData.languages) 
          ? resumeData.languages
              .filter((lang: any) => lang && lang.name) // Filter out empty entries
              .slice(0, 6) // Limit to 6 languages
              .map((lang: any) => ({
                name: lang.name || '',
                proficiency: lang.proficiency || 0,
              }))
          : [],
        
        interests: Array.isArray(resumeData.interests) 
          ? resumeData.interests
              .filter((interest: any) => interest && interest.name) // Filter out empty entries
              .slice(0, 8) // Limit to 8 interests
              .map((interest: any) => ({
                name: interest.name || '',
              }))
          : [],
      };

      console.log(`✨ Processed resume data - Template: ${sanitizedResumeData.template}`);
      console.log(`📊 Data summary: ${sanitizedResumeData.workExperiences.length} experiences, ${sanitizedResumeData.education.length} education entries, ${sanitizedResumeData.skills.length} skills`);

      // Create PDF document
      const pdfDocument = createPDFDocument(sanitizedResumeData); // Pass sanitized data
      console.log('📄 PDF document React element created');
      
      // Generate PDF with enhanced error handling
      let pdfBuffer: Buffer;
      
      try {
        console.log('🔄 Attempting PDF generation with toBlob()...');
        const pdfInstance = pdf(pdfDocument);
        
        // Use Promise.race for timeout handling
        const blob = await Promise.race([
          pdfInstance.toBlob(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('PDF generation timeout after 45 seconds')), 45000)
          )
        ]);
        
        const arrayBuffer = await blob.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
        console.log('✅ PDF generated successfully via toBlob()');
        
      } catch (blobError) {
        console.warn('⚠️ toBlob() failed, attempting toBuffer():', blobError);
        
        const pdfInstance = pdf(pdfDocument);
        const bufferResult = await Promise.race([
          pdfInstance.toBuffer(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('PDF generation timeout after 45 seconds')), 45000)
          )
        ]);
        
        if (Buffer.isBuffer(bufferResult)) {
          pdfBuffer = bufferResult;
        } else if (bufferResult instanceof Uint8Array) {
          pdfBuffer = Buffer.from(bufferResult);
        } else {
          throw new Error(`Unexpected buffer type: ${typeof bufferResult}`);
        }
        console.log('✅ PDF generated successfully via toBuffer()');
      }

      // Enhanced validation
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error('Generated PDF buffer is empty');
      }

      if (pdfBuffer.length < 200) {
        throw new Error(`PDF buffer too small (${pdfBuffer.length} bytes) - likely corrupted`);
      }

      // Validate PDF format
      const pdfHeader = pdfBuffer.subarray(0, 8).toString();
      if (!pdfHeader.startsWith('%PDF-')) {
        throw new Error(`Invalid PDF header: "${pdfHeader}"`);
      }

      console.log(`🎉 PDF successfully generated on attempt ${attempt}`);
      console.log(`📏 Final PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
      
      return pdfBuffer;

    } catch (error: any) {
      lastError = error;
      console.error(`❌ PDF generation attempt ${attempt} failed:`, error.message);
      
      // Detailed error logging for debugging
      if (error.message?.includes('fontkit') || error.message?.includes('font')) {
        console.error('🔤 Font-related error - check font registration and paths');
      } else if (error.message?.includes('timeout')) {
        console.error('⏰ Timeout error - PDF generation taking too long');
      } else if (error.message?.includes('DataView')) {
        console.error('💾 Memory/Buffer error - possible data corruption');
      }
      
      // Don't retry on certain errors
      if (error.message?.includes('timeout') || 
          error.message?.includes('Maximum call stack') ||
          attempt === maxAttempts) {
        break;
      }
      
      // Progressive backoff
      const backoffMs = attempt * 1000;
      console.log(`⏱️ Waiting ${backoffMs}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
  
  throw lastError || new Error('PDF generation failed after all retry attempts');
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log('🚀 PDF generation API called');
  
  try {
    const body = await req.json();
    const { resumeData, filename = "resume" } = body;

    // Enhanced logging
    console.log('📥 Request received:', {
      hasResumeData: !!resumeData,
      dataKeys: Object.keys(resumeData || {}),
      template: resumeData?.template,
      filename: filename,
      timestamp: new Date().toISOString()
    });

    if (!resumeData) {
      console.error('❌ Missing resume data in request');
      return NextResponse.json(
        { 
          success: false, 
          error: "Resume data is required",
          code: "MISSING_DATA"
        },
        { status: 400 }
      );
    }

    // Generate PDF
    console.log('⚙️ Starting PDF generation process...');
    const pdfBuffer = await generatePDFWithRetry(resumeData, filename);
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ PDF generation completed in ${processingTime}ms`);

    // Clean filename
    const sanitizedFilename = filename.replace(/[^a-z0-9\-_]/gi, '_');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${sanitizedFilename}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-store, max-age=0",
        "X-Processing-Time": processingTime.toString()
      },
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error("💥 PDF generation failed:", {
      error: error.message,
      stack: error.stack,
      processingTime: processingTime,
      timestamp: new Date().toISOString()
    });
    
    // Categorize error types
    let errorCategory = 'UNKNOWN_ERROR';
    if (error.message?.includes('timeout')) errorCategory = 'TIMEOUT_ERROR';
    else if (error.message?.includes('font')) errorCategory = 'FONT_ERROR';
    else if (error.message?.includes('DataView')) errorCategory = 'MEMORY_ERROR';
    else if (error.message?.includes('PDF')) errorCategory = 'PDF_FORMAT_ERROR';
    
    return NextResponse.json({
      success: false,
      error: "PDF generation failed",
      details: error.message,
      errorCategory: errorCategory,
      processingTime: processingTime,
      retryable: !error.message?.includes('timeout'),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}