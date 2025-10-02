import React from "react";
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';

// Default theme for TemplateFive (ATS Classic)
const DEFAULT_THEME_FIVE = [
  "#FFFFFF", // Background
  "#000000", // Main text, headings
  "#666666", // Subtle text (contact info, dates)
  "#000000", // Accent color (for lines/borders)
];

const createStyles = (colors: string[]) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors[0] || DEFAULT_THEME_FIVE[0],
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    lineHeight: 1.3,
  },
  headerSection: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 20,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 20,
  },
  fullName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  designation: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactInfoColumn: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: colors[2] || DEFAULT_THEME_FIVE[2],
    lineHeight: 1.4,
    textAlign: 'right',
  },
  contactInfoItem: {
    marginBottom: 1,
  },
  section: {
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 3,
    marginTop: 8,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors[1] || DEFAULT_THEME_FIVE[1],
    letterSpacing: 0.5,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    textAlign: 'justify',
    marginTop: 6,
  },
  experienceItem: {
    marginBottom: 10,
    marginTop: 6,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  experienceLeft: {
    flex: 1,
  },
  experienceRole: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
  },
  experienceDuration: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: colors[2] || DEFAULT_THEME_FIVE[2],
    textAlign: 'right',
    minWidth: 90,
  },
  experienceCompany: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: colors[2] || DEFAULT_THEME_FIVE[2],
    marginTop: 1,
  },
  descriptionList: {
    marginTop: 4,
    marginLeft: 12,
  },
  descriptionListItem: {
    fontSize: 9,
    lineHeight: 1.3,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 2,
    flexDirection: 'row',
  },
  bulletText: {
    flex: 1,
    marginLeft: 6,
  },
  projectItem: {
    marginBottom: 12,
    marginTop: 8,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    flex: 1,
    marginBottom: 10,
  },
  projectDescription: {
    fontSize: 9,
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 6,
    marginTop: 2,
    textAlign: 'justify',
    display: 'block',
    width: '100%',
  },
  projectLinksContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 4,
    justifyContent: 'space-between',
  },
  projectLinksColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  projectLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  projectLinkBullet: {
    fontSize: 8,
    marginRight: 4,
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    fontFamily: 'Helvetica-Bold',
  },
  projectLinkLabel: {
    color: colors[2] || DEFAULT_THEME_FIVE[2],
    marginRight: 2,
    fontSize: 8,
    fontFamily: 'Helvetica',
  },
  projectLink: {
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    textDecoration: 'none',
    fontSize: 8,
  },
  twoColumnGrid: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 8,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 28,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gridColumn: {
    flex: 1,
    width: '46%',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  educationItem: {
    marginBottom: 8,
    marginTop: 6,
  },
  educationContent: {
    flexDirection: 'column',
  },
  educationDegree: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 2,
  },
  educationInstitution: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: colors[2] || DEFAULT_THEME_FIVE[2],
    marginTop: 1,
  },
  educationDates: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: colors[2] || DEFAULT_THEME_FIVE[2],
    marginTop: 2,
  },
  certificationList: {
    marginTop: 6,
  },
  certificationListItem: {
    fontSize: 9,
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    marginBottom: 3,
    flexDirection: 'row',
    marginLeft: 8,
  },
  interestSkillContainer: {
    marginTop: 6,
    width: '100%',
  },
  interestSkillGrid: {
    flexDirection: 'column',
    gap: 4,
    width: '100%',
  },
  interestSkillRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
  },
  interestSkillItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginBottom: 4,
    marginLeft: 8,
    minWidth: 0,
    maxWidth: '47%',
  },
  bulletPoint: {
    fontSize: 8,
    marginRight: 4,
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    fontFamily: 'Helvetica-Bold',
  },
  itemText: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FIVE[1],
    flex: 1,
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
    try {
      const date = new Date(dateString);
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${month} ${year}`;
    } catch {
      return dateString;
    }
  };

  const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== ''));
  const hasContactInfo = Object.values(data.contactInfo).some(val => val !== undefined && val !== null && val !== '');

  const contactItems: string[] = [];
  if (data.contactInfo.location) contactItems.push(data.contactInfo.location);
  if (data.contactInfo.email) contactItems.push(data.contactInfo.email);
  if (data.contactInfo.phone) contactItems.push(data.contactInfo.phone);
  if (data.contactInfo.linkedin) contactItems.push(data.contactInfo.linkedin);
  if (data.contactInfo.github) contactItems.push(data.contactInfo.github);
  if (data.contactInfo.website) contactItems.push(data.contactInfo.website);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <Text style={styles.fullName}>
              {data.profileInfo.fullName || "YOUR NAME HERE"}
            </Text>
            <Text style={styles.designation}>
              {data.profileInfo.designation || "Your Designation"}
            </Text>
          </View>

          {hasContactInfo && (
            <View style={styles.headerRight}>
              {contactItems.map((contact, index) => (
                <View key={index} style={styles.contactInfoItem}>
                  <Text style={styles.contactInfoColumn}>
                    {contact}
                  </Text>
                </View>
              ))}
            </View>
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
            {data.workExperiences.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View style={styles.experienceLeft}>
                    <Text style={styles.experienceRole}>{exp.role || "Role"}</Text>
                    <Text style={styles.experienceCompany}>
                      {exp.company || "Company Name"}, {exp.location || "City, State"}
                    </Text>
                  </View>
                  <Text style={styles.experienceDuration}>
                    {formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}
                  </Text>
                </View>
                {exp.description && (
                  <Text style={styles.projectDescription}>
                    {exp.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {hasArrayData(data.projects) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{project.title || "Project Title"}</Text>
                <Text style={styles.projectDescription}>
                  {(project.description || "Project Description").replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}
                </Text>
                {(project.github || project.LiveDemo) && (
                  <View style={styles.projectLinksContainer}>
                    <View style={styles.projectLinksColumn}>
                      {project.github && (
                        <View style={styles.projectLinkItem}>
                          <Text style={styles.projectLinkBullet}>•</Text>
                          <Text style={styles.projectLinkLabel}>GitHub: </Text>
                          <PdfLink src={project.github} style={styles.projectLink}>
                            {cleanUrlForDisplay(project.github)}
                          </PdfLink>
                        </View>
                      )}
                    </View>
                    <View style={styles.projectLinksColumn}>
                      {project.LiveDemo && (
                        <View style={styles.projectLinkItem}>
                          <Text style={styles.projectLinkBullet}>•</Text>
                          <Text style={styles.projectLinkLabel}>Live Demo: </Text>
                          <PdfLink src={project.LiveDemo} style={styles.projectLink}>
                            {cleanUrlForDisplay(project.LiveDemo)}
                          </PdfLink>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 2x2 Grid Section */}
        <View style={styles.twoColumnGrid}>
          {/* First Row: Education and Certifications */}
          <View style={styles.gridRow}>
            <View style={styles.gridColumn}>
              {hasArrayData(data.education) && (
                <View style={[styles.section, { marginTop: 0 }]}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {data.education.map((edu, index) => (
                    <View key={index} style={styles.educationItem}>
                      <View style={styles.educationContent}>
                        <Text style={styles.educationDegree}>
                          {edu.degree || "Degree"}
                        </Text>
                        <Text style={styles.educationInstitution}>
                          {edu.institution || "Institution"}, {edu.location || "City, State"}
                        </Text>
                        <Text style={styles.educationDates}>
                          {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.gridColumn}>
              {hasArrayData(data.certifications) && (
                <View style={[styles.section, { marginTop: 0 }]}>
                  <Text style={styles.sectionTitle}>Certifications</Text>
                  <View style={styles.certificationList}>
                    {data.certifications.map((cert, index) =>
                      cert.title && (
                        <View key={index} style={styles.certificationListItem}>
                          <Text>• </Text>
                          <Text style={styles.bulletText}>
                            {cert.title} {cert.year && `(${cert.year})`}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Second Row: Interests and Skills */}
          <View style={styles.gridRow}>
            <View style={styles.gridColumn}>
              {hasArrayData(data.interests) && (
                <View style={[styles.section, { marginTop: 0 }]}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <View style={styles.interestSkillContainer}>
                    <View style={styles.interestSkillGrid}>
                      {data.interests.reduce((rows: any[], interest, index) => {
                        if (index % 2 === 0) rows.push([]);
                        rows[rows.length - 1].push(interest);
                        return rows;
                      }, []).map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.interestSkillRow}>
                          {row.map((interest: any, index: number) => (
                            interest.name && (
                              <View key={index} style={styles.interestSkillItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.itemText}>{interest.name}</Text>
                              </View>
                            )
                          ))}
                          {row.length === 1 && <View style={styles.interestSkillItem}><Text></Text></View>}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.gridColumn}>
              {hasArrayData(data.skills) && (
                <View style={[styles.section, { marginTop: 0 }]}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                  <View style={styles.interestSkillContainer}>
                    <View style={styles.interestSkillGrid}>
                      {data.skills.reduce((rows: any[], skill, index) => {
                        if (index % 2 === 0) rows.push([]);
                        rows[rows.length - 1].push(skill);
                        return rows;
                      }, []).map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.interestSkillRow}>
                          {row.map((skill: any, index: number) => (
                            skill.name && (
                              <View key={index} style={styles.interestSkillItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.itemText}>{skill.name}</Text>
                              </View>
                            )
                          ))}
                          {row.length === 1 && <View style={styles.interestSkillItem}><Text></Text></View>}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplateFive;