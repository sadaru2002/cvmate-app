import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Link } from "@react-pdf/renderer";
import React from "react";

export const maxDuration = 60;

// Font registration with multiple fallbacks
const initializeFonts = async () => {
  const fontConfigs = [
    {
      family: 'Roboto',
      fonts: [
        {
          src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
          fontWeight: 'normal',
        },
        {
          src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2',
          fontWeight: 'bold',
        },
      ],
    },
  ];

  const registrationPromises = fontConfigs.map(async (config) => {
    try {
      Font.register(config);
      return { family: config.family, success: true };
    } catch (error) {
      console.error(`Failed to register ${config.family}:`, error);
      return { family: config.family, success: false };
    }
  });

  const results = await Promise.all(registrationPromises);
  return results.every(result => result.success);
};

// Styles are now created dynamically based on font availability
const createStyles = (useSystemFonts: boolean) => StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: useSystemFonts ? "Helvetica" : "Roboto", // Conditional font family
    fontSize: 11,
    color: "#333333",
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
    borderBottom: "1 solid #e5eeeb",
    paddingBottom: 5,
  },
  sectionContent: {
    marginBottom: 15,
  },
  listItem: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 3,
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
  },
});

const createPDFDocument = (data: any, useSystemFonts: boolean) => {
  console.log('createPDFDocument: Received data for PDF:', JSON.stringify(data, null, 2));
  console.log('createPDFDocument: Using system fonts:', useSystemFonts);

  const styles = createStyles(useSystemFonts); // Create styles dynamically

  const personalInfo = data?.personalInfo || {};
  const professionalSummary = data?.professionalSummary;
  const workExperience = data?.workExperiences || []; // Corrected key
  const education = data?.education || [];
  const skills = data?.skills?.technical || [];
  const projects = data?.projects || [];
  const certifications = data?.certifications || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || "Your Name"}</Text>
          <Text style={styles.text}>{personalInfo.designation || "Professional Title"}</Text>
          <Text style={styles.text}>Email: {personalInfo.email || "email@example.com"}</Text>
          <Text style={styles.text}>Phone: {personalInfo.phone || "+1 234-567-8900"}</Text>
          {personalInfo.location && <Text style={styles.text}>Location: {personalInfo.location}</Text>}
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
                <Text style={{ ...styles.text, fontWeight: 'bold' }}>
                  {`${job.role} at ${job.company} (${job.startDate} - ${job.endDate || "Present"})`}
                </Text>
                {job.description && <Text style={styles.text}>{job.description}</Text>}
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
                  {`${edu.degree} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.text}>{skills.join(", ")}</Text>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project: any, index: number) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={{ ...styles.text, fontWeight: 'bold' }}>{project.title}</Text>
                {project.description && <Text style={styles.text}>{project.description}</Text>}
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
                  {`${cert.title} by ${cert.issuer} (${cert.year})`}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export async function POST(req: NextRequest) {
  console.log('API: generate-pdf-react POST request received.');
  try {
    const { resumeData, filename = "resume" } = await req.json();

    console.log('API: Received resumeData keys:', Object.keys(resumeData || {}));
    console.log('API: Filename:', filename);

    if (!resumeData) {
      console.error('API: Resume data is missing.');
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }

    // Initialize fonts
    const fontsReady = await initializeFonts();
    console.log(`Fonts loaded successfully: ${fontsReady}`);

    // Ensure all necessary data is present for the PDF component
    const fullResumeData = {
      personalInfo: resumeData.profileInfo,
      professionalSummary: resumeData.profileInfo?.summary,
      workExperiences: resumeData.workExperiences,
      education: resumeData.education,
      skills: { technical: resumeData.skills?.map((s: any) => s.name) }, // Map skills to simple array
      projects: resumeData.projects,
      certifications: resumeData.certifications,
      languages: resumeData.languages,
      interests: resumeData.interests,
    };

    console.log('API: Calling createPDFDocument with processed data.');
    const pdfDocument = createPDFDocument(fullResumeData, !fontsReady); // Pass useSystemFonts flag
    console.log('API: PDF Document created. Attempting to buffer...');
    const pdfInstance = pdf(pdfDocument);
    const pdfBuffer = await pdfInstance.toBuffer();
    
    console.log('API: PDF generated successfully, buffer size:', pdfBuffer.length);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("API: React PDF generation error caught in POST handler:", error);
    console.error("API: Error details:", error?.message);
    console.error("API: Error stack:", error?.stack);
    
    // Fallback: try with system fonts only if the initial attempt failed due to font issues
    // This part of the fallback is already handled by the `!fontsReady` flag passed to `createPDFDocument`
    // and the dynamic `createStyles` function. If the error is not font-related,
    // re-attempting with system fonts won't fix it.
    return NextResponse.json({
      success: false,
      error: "Failed to generate PDF",
      details: error?.message || "Unknown error"
    }, { status: 500 });
  }
}