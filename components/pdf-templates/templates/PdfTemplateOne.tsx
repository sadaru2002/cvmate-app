import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';

const DEFAULT_THEME = ["#EBFDFF", "#A1FAFD", "#ACEAFE", "#008899", "#4A5568"];

const createStyles = (colors: string[]) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
  },
  container: {
    flexDirection: 'row',
    minHeight: '100%',
  },
  leftColumn: {
    width: '35%',
    backgroundColor: colors[0] || DEFAULT_THEME[0],
    padding: 20,
    marginRight: 20,
  },
  rightColumn: {
    width: '65%',
    paddingLeft: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    alignSelf: 'center',
  },
  fullName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors[3] || DEFAULT_THEME[3],
    textAlign: 'center',
    marginBottom: 8,
  },
  designation: {
    fontSize: 14,
    color: colors[4] || DEFAULT_THEME[4],
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors[3] || DEFAULT_THEME[3],
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: colors[3] || DEFAULT_THEME[3],
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    fontSize: 10,
  },
  contactText: {
    marginLeft: 8,
    color: colors[4] || DEFAULT_THEME[4],
  },
  section: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#333333',
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  experienceRole: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors[3] || DEFAULT_THEME[3],
  },
  experienceCompany: {
    fontSize: 11,
    color: '#666666',
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
    marginTop: 5,
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillItem: {
    backgroundColor: colors[2] || DEFAULT_THEME[2],
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 9,
    color: colors[3] || DEFAULT_THEME[3],
    marginRight: 5,
    marginBottom: 5,
  },
  educationItem: {
    marginBottom: 12,
  },
  educationDegree: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors[3] || DEFAULT_THEME[3],
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
    color: colors[3] || DEFAULT_THEME[3],
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
    color: colors[3] || DEFAULT_THEME[3],
    textDecoration: 'underline',
  },
  certificationItem: {
    marginBottom: 8,
  },
  certificationTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors[3] || DEFAULT_THEME[3],
  },
  certificationDetails: {
    fontSize: 9,
    color: '#666666',
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
    backgroundColor: colors[2] || DEFAULT_THEME[2],
  },
  proficiencyDotActive: {
    backgroundColor: colors[3] || DEFAULT_THEME[3],
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  interestItem: {
    backgroundColor: colors[1] || DEFAULT_THEME[1],
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 9,
    color: colors[3] || DEFAULT_THEME[3],
    marginRight: 5,
    marginBottom: 5,
  },
});

interface PdfTemplateOneProps {
  data: ResumeFormData;
  colorPalette?: string[];
}

const PdfTemplateOne: React.FC<PdfTemplateOneProps> = ({ data, colorPalette }) => {
  const colors = colorPalette && colorPalette.length >= 5 ? colorPalette : DEFAULT_THEME;
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
            {/* Profile Section */}
            <View style={styles.profileSection}>
              {data.profileInfo.profilePictureUrl && (
                <PdfImage src={data.profileInfo.profilePictureUrl} style={styles.profileImage} />
              )}
              <Text style={styles.fullName}>
                {data.profileInfo.fullName || "YOUR NAME HERE"}
              </Text>
              <Text style={styles.designation}>
                {data.profileInfo.designation || "Your Designation"}
              </Text>
            </View>

            {/* Contact Information */}
            {hasContactInfo && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CONTACT</Text>
                {data.contactInfo.email && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactText}>{data.contactInfo.email}</Text>
                  </View>
                )}
                {data.contactInfo.phone && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactText}>{data.contactInfo.phone}</Text>
                  </View>
                )}
                {data.contactInfo.location && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactText}>{data.contactInfo.location}</Text>
                  </View>
                )}
                {data.contactInfo.linkedin && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactText}>{cleanUrlForDisplay(data.contactInfo.linkedin)}</Text>
                  </View>
                )}
                {data.contactInfo.github && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactText}>{cleanUrlForDisplay(data.contactInfo.github)}</Text>
                  </View>
                )}
                {data.contactInfo.website && (
                  <View style={styles.contactItem}>
                    <Text style={styles.contactText}>{cleanUrlForDisplay(data.contactInfo.website)}</Text>
                  </View>
                )}
              </View>
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

            {/* Interests */}
            {hasArrayData(data.interests) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>INTERESTS</Text>
                <View style={styles.interestContainer}>
                  {data.interests.map((interest, index) => 
                    interest.name && (
                      <Text key={index} style={styles.interestItem}>
                        {interest.name}
                      </Text>
                    )
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
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
                      <View style={{ flexDirection: 'column' }}>
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
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplateOne;