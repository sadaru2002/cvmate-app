import React from "react";
import { Document, Page, Text, View, StyleSheet, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';

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
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: colors[1] || DEFAULT_THEME_FIVE[1],
  },
  header: {
    marginBottom: 24,
    textAlign: 'center',
  },
  fullName: {
    fontSize: 32, // text-4xl
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 4, // mb-1
    textTransform: 'uppercase',
  },
  designation: {
    fontSize: 16, // text-lg
    fontFamily: 'Helvetica-Bold', // font-semibold
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 8, // mb-2
    textTransform: 'uppercase',
  },
  contactInfo: {
    fontSize: 10, // text-xs
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
    textAlign: 'center',
  },
  section: {
    marginBottom: 24, // mb-6
  },
  sectionTitle: {
    fontSize: 14, // text-lg
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 8, // mb-2
    paddingBottom: 4, // pb-1
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderColor: colors[3] || DEFAULT_THEME_FIVE[3], // accentColor
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
    alignItems: 'baseline',
    marginBottom: 4, // mb-0.5
  },
  experienceRole: {
    fontSize: 12, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
  },
  experienceDuration: {
    fontSize: 11, // text-sm
    fontStyle: 'italic',
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
  },
  experienceCompany: {
    fontSize: 11, // text-sm
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
    marginBottom: 4, // mb-1
  },
  descriptionList: {
    marginLeft: 16, // ml-4
    gap: 2, // space-y-0.5
  },
  descriptionListItem: {
    fontSize: 11, // text-sm
    lineHeight: 1.4,
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
  },
  projectItem: {
    marginBottom: 16, // space-y-4
  },
  projectTitle: {
    fontSize: 12, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginBottom: 4, // mb-0.5
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
    marginBottom: 24, // mb-6
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
    marginBottom: 4, // mb-0.5
  },
  educationDuration: {
    fontSize: 11, // text-sm
    fontStyle: 'italic',
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
  },
  educationInstitution: {
    fontSize: 11, // text-sm
    color: colors[2] || DEFAULT_THEME_FIVE[2], // subtleText
  },
  certificationList: {
    marginLeft: 16, // ml-4
    gap: 2, // space-y-0.5
  },
  certificationListItem: {
    fontSize: 11, // text-sm
    lineHeight: 1.4,
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32, // gap-x-8
    fontSize: 11, // text-sm
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
    marginLeft: 16, // ml-4
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4, // gap-1
    width: '45%', // grid-cols-2
  },
  skillList: {
    marginLeft: 16, // ml-4
    gap: 2, // space-y-0.5
  },
  skillListItem: {
    fontSize: 11, // text-sm
    lineHeight: 1.4,
    color: colors[1] || DEFAULT_THEME_FIVE[1], // mainText
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
        <View style={styles.header}>
          <Text style={styles.fullName}>
            {data.profileInfo.fullName || "YOUR NAME HERE"}
          </Text>
          <Text style={styles.designation}>
            {data.profileInfo.designation || "Your Designation"}
          </Text>
          {hasContactInfo && (
            <Text style={styles.contactInfo}>
              {contactParts.join(' | ')}
            </Text>
          )}
        </View>

        {/* Professional Summary */}
        {data.profileInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>
              {data.profileInfo.summary}
            </Text>
          </View>
        )}

        {/* Work Experience */}
        {hasArrayData(data.workExperiences) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View>
              {data.workExperiences.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.experienceRole}>{exp.role || "Role"}</Text>
                    <Text style={styles.experienceDuration}>{`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}</Text>
                  </View>
                  <Text style={styles.experienceCompany}>{exp.company || "Company Name"}</Text>
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
            <Text style={styles.sectionTitle}>Projects</Text>
            <View>
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
        <View style={styles.twoColumnGrid}>
          {hasArrayData(data.education) && (
            <View style={styles.gridColumn}>
              <Text style={styles.sectionTitle}>Education</Text>
              <View>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <Text style={styles.educationDegree}>{edu.degree || "Degree"}</Text>
                    <Text style={styles.educationDuration}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</Text>
                    <Text style={styles.educationInstitution}>{edu.institution || "Institution Name"}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {hasArrayData(data.certifications) && (
            <View style={styles.gridColumn}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              <View style={styles.certificationList}>
                {data.certifications.map((cert, index) => (
                  cert.title && <Text key={index} style={styles.certificationListItem}>• {cert.title} ({cert.year})</Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Interests and Skills in a two-column layout */}
        <View style={styles.twoColumnGrid}>
          {hasArrayData(data.interests) && (
            <View style={styles.gridColumn}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.interestGrid}>
                {data.interests.map((interest, index) => (
                  interest.name && (
                    <View key={index} style={styles.interestItem}>
                      <Text>•</Text>
                      <Text>{interest.name}</Text>
                    </View>
                  )
                ))}
              </View>
            </View>
          )}

          {hasArrayData(data.skills) && (
            <View style={styles.gridColumn}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillList}>
                {data.skills.map((skill, index) => (
                  skill.name && <Text key={index} style={styles.skillListItem}>• {skill.name}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplateFive;