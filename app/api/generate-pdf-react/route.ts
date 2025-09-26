import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Link } from "@react-pdf/renderer";
import React from "react";

export const maxDuration = 60;

// Register Inter font
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: "normal",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Inter",
    fontSize: 11,
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #e5e7eb",
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  text: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 5,
  },
});

const createPDFDocument = (data) => {
  console.log('Creating PDF document with data:', data?.personalInfo?.fullName);
  
  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header section
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.name },
          data?.personalInfo?.fullName || "Your Name"
        ),
        React.createElement(Text, { style: styles.text },
          data?.personalInfo?.title || "Professional Title"
        ),
        React.createElement(Text, { style: styles.text },
          `Email: ${data?.personalInfo?.email || "email@example.com"}`
        ),
        React.createElement(Text, { style: styles.text },
          `Phone: ${data?.personalInfo?.phone || "+1 234-567-8900"}`
        )
      ),
      
      // Professional Summary
      data?.professionalSummary && React.createElement(View, { style: { marginBottom: 15 } },
        React.createElement(Text, { style: { ...styles.name, fontSize: 16 } }, "Professional Summary"),
        React.createElement(Text, { style: styles.text }, data.professionalSummary)
      ),
      
      // Work Experience
      data?.workExperience && data.workExperience.length > 0 && React.createElement(View, { style: { marginBottom: 15 } },
        React.createElement(Text, { style: { ...styles.name, fontSize: 16 } }, "Work Experience"),
        ...data.workExperience.map((job, index) =>
          React.createElement(View, { key: index, style: { marginBottom: 10 } },
            React.createElement(Text, { style: { ...styles.text, fontWeight: 'bold' } },
              `${job.position} at ${job.company} (${job.startDate} - ${job.endDate || "Present"})`
            ),
            job.description && React.createElement(Text, { style: styles.text }, job.description)
          )
        )
      ),
      
      // Education
      data?.education && data.education.length > 0 && React.createElement(View, { style: { marginBottom: 15 } },
        React.createElement(Text, { style: { ...styles.name, fontSize: 16 } }, "Education"),
        ...data.education.map((edu, index) =>
          React.createElement(View, { key: index, style: { marginBottom: 10 } },
            React.createElement(Text, { style: styles.text },
              `${edu.degree} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`
            )
          )
        )
      ),
      
      // Skills
      data?.skills?.technical && data.skills.technical.length > 0 && React.createElement(View, { style: { marginBottom: 15 } },
        React.createElement(Text, { style: { ...styles.name, fontSize: 16 } }, "Technical Skills"),
        React.createElement(Text, { style: styles.text }, data.skills.technical.join(", "))
      )
    )
  );
};

export async function POST(req: NextRequest) {
  try {
    const { resumeData, filename = "resume" } = await req.json();

    if (!resumeData) {
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }

    console.log('Generating PDF with data:', resumeData?.personalInfo?.fullName);

    const pdfDocument = createPDFDocument(resumeData);
    const pdfInstance = pdf(pdfDocument);
    const pdfBlob = await pdfInstance.toBlob();
    
    // Convert Blob to Buffer for Next.js response
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("React PDF error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to generate PDF",
      details: error?.message || "Unknown error"
    }, { status: 500 });
  }
}
