import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { getSvgIcon } from './utils/getSvgIcon'; // Import the SVG icon helper

interface PdfResumeProps {
  data: ResumeFormData;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #e5e7eb',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  designation: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 15,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  contactText: {
    fontSize: 10,
    marginHorizontal: 5,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottom: '1pt solid #e5e7eb',
    paddingBottom: 5,
  },
  sectionContent: {
    marginBottom: 15,
  },
  text: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#4b5563',
    marginBottom: 5,
  },
  textBold: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#4b5563',
    marginBottom: 5,
  },
});

const PdfResume: React.FC<PdfResumeProps> = ({ data }) => {
  const sanitizeText = (text: any): string => {
    if (text === null || text === undefined) return '';
    return String(text).replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {sanitizeText(data?.profileInfo?.fullName) || 'Your Name'}
          </Text>
          <Text style={styles.designation}>
            {sanitizeText(data?.profileInfo?.designation) || 'Professional Title'}
          </Text>
          <View style={styles.contactInfo}>
            {data?.contactInfo?.email && (
              <Text style={styles.contactText}>
                {sanitizeText(data.contactInfo.email)}
              </Text>
            )}
            {data?.contactInfo?.phone && (
              <Text style={styles.contactText}>
                {sanitizeText(data.contactInfo.phone)}
              </Text>
            )}
            {data?.contactInfo?.location && (
              <Text style={styles.contactText}>
                {sanitizeText(data.contactInfo.location)}
              </Text>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {data?.profileInfo?.summary && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>
              {sanitizeText(data.profileInfo.summary)}
            </Text>
          </View>
        )}

        {/* Work Experience */}
        {data?.workExperiences && data.workExperiences.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.workExperiences.map((job, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>
                  {sanitizeText(job.role)} at {sanitizeText(job.company)}
                </Text>
                <Text style={styles.text}>
                  {sanitizeText(job.startDate)} - {sanitizeText(job.endDate)}
                </Text>
                <Text style={styles.text}>
                  {sanitizeText(job.description)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data?.education && data.education.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>{sanitizeText(edu.degree)}</Text>
                <Text style={styles.text}>{sanitizeText(edu.institution)}</Text>
                <Text style={styles.text}>
                  {sanitizeText(edu.startDate)} - {sanitizeText(edu.endDate)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data?.skills && data.skills.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.text}>
              {data.skills.map(skill => 
                sanitizeText(skill?.name)
              ).filter(Boolean).join(', ')}
            </Text>
          </View>
        )}

        {/* Projects */}
        {data?.projects && data.projects.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>{sanitizeText(project.title)}</Text>
                <Text style={styles.text}>{sanitizeText(project.description)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data?.certifications && data.certifications.length > 0 && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.textBold}>{sanitizeText(cert.title)}</Text>
                <Text style={styles.text}>
                  {sanitizeText(cert.issuer)} ({sanitizeText(cert.year)})
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PdfResume;
