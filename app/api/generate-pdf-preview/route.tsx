import { NextRequest, NextResponse } from "next/server";
import { pdf } from '@react-pdf/renderer';
import PdfTemplateRouter from '@/components/pdf-templates/PdfTemplateRouter';

export const maxDuration = 60;

const generatePDFFromReactPDF = async (resumeData: any): Promise<Buffer> => {
  try {
    console.log('🚀 Starting React PDF generation...');
    
    // Use the same PdfTemplateRouter as the main PDF generation
    // Extract template and color palette from resumeData
    const template = resumeData?.template || 'TemplateOne';
    const colorPalette = resumeData?.colorPalette || ['#3B82F6', '#1E40AF', '#1D4ED8'];
    
    const pdfDoc = (
      <PdfTemplateRouter 
        data={resumeData}
        template={template}
        colorPalette={colorPalette}
      />
    );
    
    console.log('🖨️ Generating PDF with React PDF...');
    const pdfInstance = pdf(pdfDoc);
    
    // Convert to buffer - handle both old and new API
    let pdfBuffer: Buffer;
    try {
      // Try blob method (more reliable)
      const blob = await pdfInstance.toBlob();
      const arrayBuffer = await blob.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } catch (bufferError) {
      console.log('📝 Using direct buffer method...');
      // Fallback to direct buffer if available
      pdfBuffer = await pdfInstance.toBuffer() as any;
    }
    
    console.log('✅ PDF generated successfully with React PDF');
    return pdfBuffer;
    
  } catch (error) {
    console.error('❌ React PDF generation error:', error);
    throw error;
  }
};

export async function POST(req: NextRequest) {
  console.log('🚀 API: generate-pdf-preview POST request received');
  
  try {
    const body = await req.json();
    const { resumeData, filename = "resume" } = body;

    if (!resumeData) {
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }
    
    // Generate PDF using React PDF (same as main generation but simpler)
    const pdfBuffer = await generatePDFFromReactPDF(resumeData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
    
  } catch (error: any) {
    console.error("❌ PDF generation error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to generate PDF from preview",
      details: error?.message,
    }, { status: 500 });
  }
}