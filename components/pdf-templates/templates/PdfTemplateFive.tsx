import React from "react";
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';

// Default theme for TemplateFive (ATS Classic)
// Order: [mainBg, mainText, subtleText, accentColor]
const DEFAULT_THEME_FIVE = [
  "#FFFFFF", // Background
  "#000000", // Main text, headings
  "#333333", // Subtle text (contact info, dates)
  "#000000", // Accent color (for lines/borders)
];

const createStyles = (colors: string[]) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors[0] || DEFAULT_THEME_FIVE[0],
    padding: 32, // p-8
    fontFamily: 'Helvetica',
    fontSize: 10, // text-sm
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
  },
  headerSection: {
    marginBottom: 24, // mb-6
    textAlign: 'center',
  },
  fullName: {
    fontSize: 32, // text-4xl
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 4, // mb-1
    textTransform: 'uppercase',
  },
  designation: {
    fontSize: 16, // text-lg
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 8, // mb-2
    textTransform: 'uppercase',
  },
  contactInfoInline: {
    fontSize: 10, // text-xs
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
  },
  section: {
    marginBottom: 24, // mb-6
  },
  sectionTitle: {
    fontSize: 16, // text-lg
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 8, // mb-2
    paddingBottom: 4, // pb-1
    borderBottomWidth: 1,
    borderBottomColor: colors[3] || DEFAULT_THEME_FIVE[3], // accentColor
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: 11, // text-sm
    lineHeight: 1.5,
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 16, // space-y-4
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2, // mb-0.5
  },
  experienceRole: {
    fontSize: 12, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
  },
  experienceDuration: {
    fontSize: 11, // text-sm
    fontFamily: 'Helvetica-Oblique',
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
  },
  experienceCompany: {
    fontSize: 11, // text-sm
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
    marginBottom: 4, // mb-1
  },
  descriptionList: {
    marginTop: 8, // ml-4
    marginLeft: 16,
  },
  descriptionListItem: {
    fontSize: 11, // text-sm
    lineHeight: 1.4,
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 2,
  },
  projectItem: {
    marginBottom: 16, // space-y-4
  },
  projectTitle: {
    fontSize: 12, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 2, // mb-0.5
  },
  projectDescription: {
    fontSize: 11, // text-sm
    lineHeight: 1.4,
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 4, // mb-1
  },
  projectLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // gap-x-4
    fontSize: 10, // text-xs
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
    marginTop: 4, // mt-1
  },
  projectLink: {
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    textDecoration: 'underline',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 32, // gap-x-8
  },
  gridColumn: {
    width: '50%',
  },
  educationItem: {
    marginBottom: 16, // space-y-4
  },
  educationDegree: {
    fontSize: 12, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 2, // mb-0.5
  },
  educationInstitution: {
    fontSize: 11, // text-sm
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
  },
  educationDates: {
    fontSize: 11, // text-sm
    fontFamily: 'Helvetica-Oblique',
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
  },
  certificationList: {
    marginTop: 8,
    marginLeft: 16,
  },
  certificationListItem: {
    fontSize: 11, // text-sm
    lineHeight: 1.4,
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 4,
  },
  interestSkillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32, // gap-x-8
    fontSize: 11, // text-sm
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginTop: 8, // ml-4
    marginLeft: 16,
  },
  interestSkillItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4, // gap-1
    width: '45%', // grid-cols-2
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginTop: 4,
    flexShrink: 0,
  },
});

interface PdfTemplateFiveProps {
  data: ResumeFormData;
  colorPalette?: string[];
}

const PdfTemplateFive: React.FC<PdfTemplateFiveProps> = ({ data, colorPalette }) => {
  const colors = colorPalette && colorPalette.length >= 4 ? colorPalette : DEFAULT_THEME_FIVE;
  const styles = createStyles(colors);

  const formatYearMonth = (dateString?: string) => {
    if (!dateString) return "Present";
    return dateString;
  };

  const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== ''));
  const hasContactInfo = Object.values(data.contactInfo).some(val => val !== undefined && val !== null && val !== '');

  // Prepare contact info for inline display
  const contactParts: string[] = [];
  if (data.contactInfo.location) contactParts.push(data.contactInfo.location);
  if (data.contactInfo.email) contactParts.push(data.contactInfo.email);
  if (data.contactInfo.phone) contactParts.push(data.contactInfo.phone);
  if (data.contactInfo.linkedin) contactParts.push(cleanUrlForDisplay(data.contactInfo.linkedin));
  if (data.contactInfo.github) contactParts.push(cleanUrlForDisplay(data.contactInfo.github));
  if (data.contactInfo.website) contactParts.push(cleanUrlForDisplay(data.contactInfo.website));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: Name, Designation, Contact Info */}
        <View style={styles.headerSection}>
          <Text style={styles.fullName}>
            {data.profileInfo.fullName || "YOUR NAME HERE"}
          </Text>
          <Text style={styles.designation}>
            {data.profileInfo.designation || "Your Designation"}
          </Text>
          {hasContactInfo && (
            <Text style={styles.contactInfoInline}>
              {contactParts.join(' | ')}
            </Text>
          )}
        </View>

        {/* Professional Summary */}
        {data.profileInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>
              {data.profileInfo.summary}
            </Text>
          </View>
        )}

        {/* Work Experience */}
        {hasArrayData(data.workExperiences) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
            <View style={{ gap: 16 }}>
              {data.workExperiences.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <View>
                      <Text style={styles.experienceRole}>{exp.role || "Role"}</Text>
                      <Text style={styles.experienceCompany}>{exp.company || "Company Name"}, {exp.location || "City, State"}</Text>
                    </View>
                    <Text style={styles.experienceDuration}>{`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}</Text>
                  </View>
                  {exp.description && (
                    <View style={styles.descriptionList}>
                      {exp.description.split('. ').filter(Boolean).map((point, i) => (
                        <Text key={i} style={styles.descriptionListItem}>• {point.trim()}{point.endsWith('.') ? '' : '.'}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {hasArrayData(data.projects) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            <View style={{ gap: 16 }}>
              {data.projects.map((project, index) => (
                <View key={index} style={styles.projectItem}>
                  <Text style={styles.projectTitle}>{project.title || "Project Title"}</Text>
                  <Text style={styles.projectDescription}>{project.description || "Project Description"}</Text>
                  {(project.github || project.LiveDemo) && (
                    <View style={styles.projectLinks}>
                      {project.github && (
                        <PdfLink src={project.github} style={styles.projectLink}>
                          GitHub: {cleanUrlForDisplay(project.github)}
                        </PdfLink>
                      )}
                      {project.LiveDemo && (
                        <PdfLink src={project.LiveDemo} style={styles.projectLink}>
                          Live Demo: {cleanUrlForDisplay(project.LiveDemo)}
                        </PdfLink>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education and Certifications in a two-column layout */}
        <View style={[styles.twoColumnGrid, styles.section]}>
          {hasArrayData(data.education) && (
            <View style={styles.gridColumn}>
              <Text style={styles.sectionTitle}>EDUCATION</Text>
              <View style={{ gap: 16 }}>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <Text style={styles.educationDegree}>{edu.degree || "Degree"}</Text>
                    <Text style={styles.educationInstitution}>{edu.institution || "Institution Name"}, {edu.location || "City, State"}</Text>
                    <Text style={styles.educationDates}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {hasArrayData(data.certifications) && (
            <View style={styles.gridColumn}>
              <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
              <View style={styles.certificationList}>
                {data.certifications.map((cert, index) =>
                  cert.title && <Text key={index} style={styles.certificationListItem}>• {cert.title} ({cert.year})</Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Interests and Skills in a two-column layout */}
        <View style={[styles.twoColumnGrid, styles.section]}>
          {hasArrayData(data.interests) && (
            <View style={styles.gridColumn}>
              <Text style={styles.sectionTitle}>INTERESTS</Text>
              <View style={styles.interestSkillGrid}>
                {data.interests.map((interest, index) =>
                  interest.name && (
                    <View key={index} style={styles.interestSkillItem}>
                      <View style={styles.bulletPoint} />
                      <Text>{interest.name}</Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

          {hasArrayData(data.skills) && (
            <View style={styles.gridColumn}>
              <Text style={styles.sectionTitle}>SKILLS</Text>
              <View style={styles.interestSkillGrid}>
                {data.skills.map((skill, index) =>
                  skill.name && <View key={index} style={styles.interestSkillItem}>
                    <View style={styles.bulletPoint} />
                    <Text>{skill.name}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplateFive;