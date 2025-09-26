import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Link } from "@react-pdf/renderer";
import React from "react";

export const maxDuration = 60;

// Register Inter font from a highly reliable CDN
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://rsms.me/inter/font-files/Inter-Regular.woff", // Using a different, potentially more stable CDN
      fontWeight: "normal",
    },
    {
      src: "https://rsms.me/inter/font-files/Inter-Bold.woff",
      fontWeight: "bold",
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

const createPDFDocument = (data: any) => {
  console.log('createPDFDocument: Received data for PDF:', JSON.stringify(data, null, 2));

  const personalInfo = data?.personalInfo || {};
  const professionalSummary = data?.professionalSummary;
  const workExperience = data?.workExperience || [];
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
          <Text style={styles.text}>{personalInfo.title || "Professional Title"}</Text>
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
                  {`${job.position} at ${job.company} (${job.startDate} - ${job.endDate || "Present"})`}
                </Text>
                {job.description && <Text style={styles.text}>{job.description}</Text>}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <View style={{ marginLeft: 10 }}>
                    {job.responsibilities.map((resp: string, respIndex: number) => (
                      <Text key={respIndex} style={styles.listItem}>• {resp}</Text>
                    ))}
                  </View>
                )}
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
                {edu.gpa && <Text style={styles.text}>GPA: {edu.gpa}</Text>}
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
                <Text style={{ ...styles.text, fontWeight: 'bold' }}>{project.name}</Text>
                {project.description && <Text style={styles.text}>{project.description}</Text>}
                {project.link && <Link src={project.link} style={styles.link}>Live Demo</Link>}
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
                  {`${cert.name} by ${cert.issuer} (${cert.date})`}
                </Text>
                {cert.url && <Link src={cert.url} style={styles.link}>View Certificate</Link>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export async function POST(req: NextRequest) {
  try {
    const { resumeData, filename = "resume" } = await req.json();

    console.log('API: generate-pdf-react received request.');
    console.log('API: Received resumeData keys:', Object.keys(resumeData || {}));
    console.log('API: Filename:', filename);

    if (!resumeData) {
      console.error('API: Resume data is missing.');
      return NextResponse.json(
        { success: false, error: "Resume data is required" },
        { status: 400 }
      );
    }

    // Ensure all necessary data is present for the PDF component
    const fullResumeData = {
      personalInfo: resumeData.profileInfo,
      professionalSummary: resumeData.profileInfo?.summary,
      workExperience: resumeData.workExperiences,
      education: resumeData.education,
      skills: { technical: resumeData.skills?.map((s: any) => s.name) }, // Map skills to simple array
      projects: resumeData.projects,
      certifications: resumeData.certifications,
      languages: resumeData.languages,
      interests: resumeData.interests,
    };

    console.log('API: Calling createPDFDocument with processed data.');
    const pdfDocument = createPDFDocument(fullResumeData);
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
    console.error("API: React PDF generation error:", error);
    console.error("API: Error details:", error?.message);
    console.error("API: Error stack:", error?.stack);
    return NextResponse.json({
      success: false,
      error: "Failed to generate PDF",
      details: error?.message || "Unknown error"
    }, { status: 500 });
  }
}