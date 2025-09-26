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

const PDFResume = ({ data }) => (
  React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: styles.page },
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.name },
          data?.personalInfo?.fullName || "Your Name"
        )
      ),
      data?.professionalSummary && React.createElement(View, {},
        React.createElement(Text, { style: styles.text },
          data.professionalSummary
        )
      )
    )
  )
);

export async function POST(req: NextRequest) {
  try {
    const { resumeData, filename = "resume" } = await req.json();

    if (!resumeData) {
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }

    const pdfInstance = pdf(PDFResume({ data: resumeData }));
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
