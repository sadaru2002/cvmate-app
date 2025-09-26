import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import PdfResume from '@/components/pdf-templates/PdfResume'; // Import the new PDF component
import { ResumeFormData } from '@/hooks/use-resume-builder'; // Import ResumeFormData type
import React from 'react'; // Import React

export async function POST(req: NextRequest) {
  try {
    console.log('PDF generation started with @react-pdf/renderer');
    
    const resumeData: ResumeFormData = await req.json();

    if (!resumeData) {
      console.error('No resume data provided');
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    console.log('Creating PDF document with resume data...');

    // Render the React PDF component to a stream using React.createElement
    const doc = React.createElement(PdfResume, { data: resumeData });
    
    console.log('Rendering PDF to stream...');
    const stream = await renderToStream(doc as React.ReactElement);

    // Convert the stream to a Buffer
    console.log('Converting stream to buffer...');
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk);
        console.log('Received chunk of size:', chunk.length);
      });
      stream.on('end', () => {
        console.log('Stream ended, total chunks:', chunks.length);
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', (err) => {
        console.error('Stream error:', err);
        reject(err);
      });
    });

    console.log('PDF generated successfully, buffer size:', buffer.length, 'bytes');

    return new NextResponse(buffer as unknown as BodyInit, {
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