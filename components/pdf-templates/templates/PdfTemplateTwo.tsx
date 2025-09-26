import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';

const DEFAULT_THEME_TWO = ["#f8f9fa", "#e9ecef", "#dee2e6", "#007bff", "#343a40", "#343a40"];

const createStyles = (colors: string[]) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333333',
  },
  container: {
    flexDirection: 'row',
    minHeight: '100%',
    gap: 32,
  },
  leftColumn: {
    width: '70%', // 2.5fr equivalent
  },
  rightColumn: {
    width: '30%', // 1fr equivalent
  },
  headerSection: {
    marginBottom: 24,
  },
  fullName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors[4] || DEFAULT_THEME_TWO[4],
    marginBottom: 4,
  },
  designation: {
    fontSize: 16,
    color: colors[3] || DEFAULT_THEME_TWO[3],
    marginBottom: 8,
  },
  contactSection: {
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 10,
    color: '#374151',
    width: '48%', // Two columns
    marginBottom: 4,
  },
  contactIcon: {
    width: 8,
    height: 8,
    backgroundColor: colors[3] || DEFAULT_THEME_TWO[3],
    marginRight: 8,
    borderRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors[4] || DEFAULT_THEME_TWO[4],
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors[3] || DEFAULT_THEME_TWO[3],
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#333333',
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  experienceRole: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors[4] || DEFAULT_THEME_TWO[4],
  },
  experienceCompany: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 2,
  },
  experienceDuration: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  descriptionText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#333333',
    marginTop: 4,
  },
  educationItem: {
    marginBottom: 12,
  },
  educationDegree: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors[4] || DEFAULT_THEME_TWO[4],
    marginBottom: 2,
  },
  educationInstitution: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  educationDates: {
    fontSize: 9,
    color: '#666666',
    fontStyle: 'italic',
  },
  projectItem: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors[4] || DEFAULT_THEME_TWO[4],
    marginBottom: 3,
  },
  projectDescription: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#333333',
    marginBottom: 5,
  },
  projectLinks: {
    flexDirection: 'row',
    gap: 10,
  },
  projectLink: {
    fontSize: 9,
    color: colors[3] || DEFAULT_THEME_TWO[3],
    textDecoration: 'underline',
  },
  // Right column styles
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillItem: {
    backgroundColor: colors[1] || DEFAULT_THEME_TWO[1],
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 9,
    color: colors[4] || DEFAULT_THEME_TWO[4],
    marginRight: 6,
    marginBottom: 6,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageName: {
    fontSize: 10,
    color: '#333333',
  },
  proficiencyDots: {
    flexDirection: 'row',
    gap: 3,
  },
  proficiencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors[2] || DEFAULT_THEME_TWO[2],
  },
  proficiencyDotActive: {
    backgroundColor: colors[3] || DEFAULT_THEME_TWO[3],
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  interestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  interestBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors[3] || DEFAULT_THEME_TWO[3],
    marginRight: 6,
  },
  interestText: {
    fontSize: 9,
    color: '#333333',
  },
  certificationItem: {
    marginBottom: 8,
  },
  certificationTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors[4] || DEFAULT_THEME_TWO[4],
  },
  certificationDetails: {
    fontSize: 9,
    color: '#666666',
  },
});

interface PdfTemplateTwoProps {
  data: ResumeFormData;
  colorPalette?: string[];
}

const PdfTemplateTwo: React.FC<PdfTemplateTwoProps> = ({ data, colorPalette }) => {
  const colors = colorPalette && colorPalette.length >= 6 ? colorPalette : DEFAULT_THEME_TWO;
  const styles = createStyles(colors);

  const formatYearMonth = (dateString?: string) => {
    if (!dateString) return "Present";
    return dateString;
  };

  const getProficiencyDots = (level: number = 0) => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <View key={i} style={[
          styles.proficiencyDot, 
          i <= level ? styles.proficiencyDotActive : {}
        ]} />
      );
    }
    return dots;
  };

  const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== ''));
  const hasContactInfo = Object.values(data.contactInfo).some(val => val !== undefined && val !== null && val !== '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.fullName}>
                {data.profileInfo.fullName || "Your Name Here"}
              </Text>
              <Text style={styles.designation}>
                {data.profileInfo.designation || "Your Designation"}
              </Text>
            </View>

            {/* Contact Information */}
            {hasContactInfo && (
              <View style={styles.contactSection}>
                {data.contactInfo.email && (
                  <View style={styles.contactItem}>
                    <View style={styles.contactIcon} />
                    <Text>{data.contactInfo.email}</Text>
                  </View>
                )}
                {data.contactInfo.location && (
                  <View style={styles.contactItem}>
                    <View style={styles.contactIcon} />
                    <Text>{data.contactInfo.location}</Text>
                  </View>
                )}
                {data.contactInfo.phone && (
                  <View style={styles.contactItem}>
                    <View style={styles.contactIcon} />
                    <Text>{data.contactInfo.phone}</Text>
                  </View>
                )}
                {data.contactInfo.linkedin && (
                  <View style={styles.contactItem}>
                    <View style={styles.contactIcon} />
                    <Text>{cleanUrlForDisplay(data.contactInfo.linkedin)}</Text>
                  </View>
                )}
                {data.contactInfo.github && (
                  <View style={styles.contactItem}>
                    <View style={styles.contactIcon} />
                    <Text>{cleanUrlForDisplay(data.contactInfo.github)}</Text>
                  </View>
                )}
                {data.contactInfo.website && (
                  <View style={styles.contactItem}>
                    <View style={styles.contactIcon} />
                    <Text>{cleanUrlForDisplay(data.contactInfo.website)}</Text>
                  </View>
                )}
              </View>
            )}

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
                {data.workExperiences.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <View>
                        <Text style={styles.experienceRole}>
                          {exp.role || "Role Title"}
                        </Text>
                        <Text style={styles.experienceCompany}>
                          {exp.company || "Company Name"}
                        </Text>
                      </View>
                      <Text style={styles.experienceDuration}>
                        {formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}
                      </Text>
                    </View>
                    {exp.description && (
                      <Text style={styles.descriptionText}>
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
                <Text style={styles.sectionTitle}>PROJECTS</Text>
                {data.projects.map((project, index) => (
                  <View key={index} style={styles.projectItem}>
                    <Text style={styles.projectTitle}>
                      {project.title || "Project Title"}
                    </Text>
                    {project.description && (
                      <Text style={styles.projectDescription}>
                        {project.description}
                      </Text>
                    )}
                    <View style={styles.projectLinks}>
                      {project.github && (
                        <Text style={styles.projectLink}>
                          GitHub: {cleanUrlForDisplay(project.github)}
                        </Text>
                      )}
                      {project.LiveDemo && (
                        <Text style={styles.projectLink}>
                          Demo: {cleanUrlForDisplay(project.LiveDemo)}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {hasArrayData(data.education) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <Text style={styles.educationDegree}>
                      {edu.degree || "Degree"}
                    </Text>
                    <Text style={styles.educationInstitution}>
                      {edu.institution || "Institution"}
                    </Text>
                    <Text style={styles.educationDates}>
                      {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Profile Picture */}
            {data.profileInfo.profilePictureUrl && (
              <PdfImage src={data.profileInfo.profilePictureUrl} style={styles.profileImage} />
            )}

            {/* Skills */}
            {hasArrayData(data.skills) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SKILLS</Text>
                <View style={styles.skillContainer}>
                  {data.skills.map((skill, index) => 
                    skill.name && (
                      <Text key={index} style={styles.skillItem}>
                        {skill.name}
                      </Text>
                    )
                  )}
                </View>
              </View>
            )}

            {/* Languages */}
            {hasArrayData(data.languages) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>LANGUAGES</Text>
                {data.languages.map((lang, index) => 
                  lang.name && (
                    <View key={index} style={styles.languageItem}>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <View style={styles.proficiencyDots}>
                        {getProficiencyDots(lang.proficiency)}
                      </View>
                    </View>
                  )
                )}
              </View>
            )}

            {/* Certifications */}
            {hasArrayData(data.certifications) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                {data.certifications.map((cert, index) => (
                  <View key={index} style={styles.certificationItem}>
                    <Text style={styles.certificationTitle}>
                      {cert.title || "Certification Title"}
                    </Text>
                    <Text style={styles.certificationDetails}>
                      {cert.issuer || "Issuer"} ({cert.year || "Year"})
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Interests */}
            {hasArrayData(data.interests) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>INTERESTS</Text>
                <View style={styles.interestContainer}>
                  {data.interests.map((interest, index) => 
                    interest.name && (
                      <View key={index} style={styles.interestItem}>
                        <View style={styles.interestBullet} />
                        <Text style={styles.interestText}>{interest.name}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplateTwo;