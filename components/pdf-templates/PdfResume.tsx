"use client"

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image as PdfImage } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';

// Register fonts (Geist Sans and Geist Mono are not directly available via @react-pdf/renderer,
// so we'll use standard sans-serif and monospace or provide custom font files if needed.
// For simplicity, we'll use standard fonts for now.)
Font.register({ family: 'Open Sans', src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf' });
Font.register({ family: 'Lato', src: 'https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf' });
Font.register({ family: 'Lato Bold', src: 'https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: '#333333',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  fullName: {
    fontSize: 24,
    fontFamily: 'Lato Bold',
    marginBottom: 5,
    color: '#212121',
  },
  designation: {
    fontSize: 14,
    fontFamily: 'Lato',
    marginBottom: 10,
    color: '#666666',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  contactItem: {
    fontSize: 9,
    marginHorizontal: 5,
    color: '#666666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Lato Bold',
    marginBottom: 8,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    textTransform: 'uppercase',
    color: '#212121',
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#333333',
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  experienceRole: {
    fontSize: 11,
    fontFamily: 'Lato Bold',
    color: '#212121',
  },
  experienceCompany: {
    fontSize: 10,
    fontFamily: 'Lato',
    color: '#666666',
  },
  experienceDuration: {
    fontSize: 9,
    fontFamily: 'Lato',
    fontStyle: 'italic',
    color: '#666666',
  },
  descriptionBullet: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 2,
    color: '#333333',
  },
  skillList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5, // This might not work directly in @react-pdf, use margin for spacing
  },
  skillItem: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    fontSize: 9,
    marginRight: 5, // Fallback for gap
    marginBottom: 5, // Fallback for gap
    color: '#424242',
  },
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 11,
    fontFamily: 'Lato Bold',
    marginBottom: 2,
    color: '#212121',
  },
  projectDescription: {
    fontSize: 10,
    marginBottom: 5,
    color: '#333333',
  },
  projectLink: {
    fontSize: 9,
    color: '#007bff',
    textDecoration: 'underline',
    marginRight: 5,
  },
  certificationItem: {
    marginBottom: 5,
  },
  certificationTitle: {
    fontSize: 10,
    fontFamily: 'Lato Bold',
    color: '#212121',
  },
  certificationDetails: {
    fontSize: 9,
    color: '#666666',
  },
  languageItem: {
    marginBottom: 5,
  },
  languageName: {
    fontSize: 10,
    color: '#333333',
  },
  interestItem: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    fontSize: 9,
    marginRight: 5,
    marginBottom: 5,
    color: '#424242',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

const PdfResume: React.FC<{ data: ResumeFormData }> = ({ data }) => {
  const formatYearMonth = (dateString?: string) => {
    if (!dateString) return "Present";
    return dateString;
  };

  const getProficiencyText = (level?: number) => {
    switch (level) {
      case 1: return "Beginner";
      case 2: return "Novice";
      case 3: return "Intermediate";
      case 4: return "Advanced";
      case 5: return "Expert";
      default: return "";
    }
  };

  const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)));
  const hasContactInfo = Object.values(data.contactInfo).some(val => val !== undefined && val !== null && val !== '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {data.profileInfo.profilePictureUrl && (
            <PdfImage src={data.profileInfo.profilePictureUrl} style={styles.profileImage} />
          )}
          <Text style={styles.fullName}>{data.profileInfo.fullName || "YOUR NAME HERE"}</Text>
          <Text style={styles.designation}>{data.profileInfo.designation || "Your Designation"}</Text>
          {hasContactInfo && (
            <View style={styles.contactInfo}>
              {data.contactInfo.location && <Text style={styles.contactItem}>{data.contactInfo.location}</Text>}
              {data.contactInfo.email && <Text style={styles.contactItem}>{data.contactInfo.email}</Text>}
              {data.contactInfo.phone && <Text style={styles.contactItem}>{data.contactInfo.phone}</Text>}
              {data.contactInfo.linkedin && <Text style={styles.contactItem}>LinkedIn: {cleanUrlForDisplay(data.contactInfo.linkedin)}</Text>}
              {data.contactInfo.github && <Text style={styles.contactItem}>GitHub: {cleanUrlForDisplay(data.contactInfo.github)}</Text>}
              {data.contactInfo.website && <Text style={styles.contactItem}>Website: {cleanUrlForDisplay(data.contactInfo.website)}</Text>}
            </View>
          )}
        </View>

        {data.profileInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{data.profileInfo.summary}</Text>
          </View>
        )}

        {hasArrayData(data.workExperiences) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {data.workExperiences.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experienceRole}>{exp.role || "Role"} at {exp.company || "Company"}</Text>
                  <Text style={styles.experienceDuration}>{`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}</Text>
                </View>
                {exp.description && exp.description.split('. ').filter(Boolean).map((point, i) => (
                  <Text key={i} style={styles.descriptionBullet}>• {point.trim()}{point.endsWith('.') ? '' : '.'}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {hasArrayData(data.education) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experienceRole}>{edu.degree || "Degree"}</Text>
                  <Text style={styles.experienceDuration}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</Text>
                </View>
                <Text style={styles.experienceCompany}>{edu.institution || "Institution"}</Text>
              </View>
            ))}
          </View>
        )}

        {hasArrayData(data.skills) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillList}>
              {data.skills.map((skill, index) => (
                skill.name && <Text key={index} style={styles.skillItem}>{skill.name} ({getProficiencyText(skill.proficiency)})</Text>
              ))}
            </View>
          </View>
        )}

        {hasArrayData(data.projects) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((proj, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{proj.title || "Project Title"}</Text>
                <Text style={styles.projectDescription}>{proj.description || "Project Description"}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {proj.github && <Text style={styles.projectLink}>GitHub: {cleanUrlForDisplay(proj.github)}</Text>}
                  {proj.LiveDemo && <Text style={styles.projectLink}>Live Demo: {cleanUrlForDisplay(proj.LiveDemo)}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {hasArrayData(data.certifications) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationItem}>
                <Text style={styles.certificationTitle}>{cert.title || "Certification Title"}</Text>
                <Text style={styles.certificationDetails}>{cert.issuer || "Issuer"} ({cert.year || "Year"})</Text>
              </View>
            ))}
          </View>
        )}

        {hasArrayData(data.languages) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {data.languages.map((lang, index) => (
                lang.name && <Text key={index} style={styles.skillItem}>{lang.name} ({getProficiencyText(lang.proficiency)})</Text>
              ))}
            </View>
          </View>
        )}

        {hasArrayData(data.interests) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {data.interests.map((interest, index) => (
                interest.name && <Text key={index} style={styles.interestItem}>{interest.name}</Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PdfResume;