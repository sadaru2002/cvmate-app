import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import PdfResume from '@/components/pdf-templates/PdfResume'; // Import the new PDF component
import { ResumeFormData } from '@/hooks/use-resume-builder'; // Import ResumeFormData type

export async function POST(req: NextRequest) {
  try {
    const resumeData: ResumeFormData = await req.json();

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    // Render the React PDF component to a stream
    const doc = <PdfResume data={resumeData} />;
    const stream = await renderToStream(doc);

    // Convert the stream to a Buffer
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('React PDF generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF using @react-pdf/renderer', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}