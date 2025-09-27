import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';

const DEFAULT_THEME_FOUR = [
  "#FFFFFF", // 0: mainBg (not used directly as bg is white)
  "#212121", // 1: mainText (headings, body)
  "#616161", // 2: accentColor (lines, icons, secondary text)
  "#E0E0E0", // 3: progressBarBg (light gray)
  "#424242", // 4: progressBarFill (darker gray)
  "#757575", // 5: subtleText (contact info, dates)
];

const createStyles = (colors: string[]) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
  },
  container: {
    flexDirection: 'row',
    minHeight: '100%',
    gap: 32, // gap-x-8
    padding: 32, // p-8
  },
  leftColumn: {
    width: '28%', // 1.5fr equivalent (approx 28%)
    flexDirection: 'column',
    paddingRight: 32, // pr-8
    gap: 32, // space-y-8
    borderRightWidth: 1,
    borderColor: '#E0E0E0', // border-gray-200
  },
  rightColumn: {
    width: '72%', // 3.5fr equivalent (approx 72%)
    flexDirection: 'column',
    gap: 32, // space-y-8
  },
  profileImageContainer: {
    width: 96, // w-24
    height: 96, // h-24
    borderRadius: 48, // rounded-full
    overflow: 'hidden',
    backgroundColor: '#F5F5F5', // bg-gray-100
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignSelf: 'center',
    marginBottom: 16, // mb-4
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 80, // w-full (adjusted for border)
    height: 80, // h-full (adjusted for border)
    borderRadius: 40,
    objectFit: 'cover',
  },
  profileIconFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#CCCCCC', // Light gray fallback
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40, // text-5xl
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
  },
  section: {
    marginBottom: 0, // Handled by column gap
  },
  sectionTitle: {
    fontSize: 12, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    marginBottom: 12, // mb-3
    paddingBottom: 4, // pb-1
    textTransform: 'uppercase',
    letterSpacing: 0.5, // tracking-wide
    borderBottomWidth: 1,
    borderColor: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
    fontSize: 10, // text-xs
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
    marginBottom: 8, // space-y-2
  },
  linkText: {
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    textDecoration: 'underline',
  },
  progressBarContainer: {
    gap: 12, // space-y-3
  },
  progressBarItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10, // text-xs
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  progressBarBackground: {
    width: 80, // w-20
    height: 6, // h-1.5
    borderRadius: 3, // rounded-full
    backgroundColor: colors[3] || DEFAULT_THEME_FOUR[3], // progressBarBg
  },
  progressBarFill: {
    height: 6, // h-1.5
    borderRadius: 3, // rounded-full
    backgroundColor: colors[4] || DEFAULT_THEME_FOUR[4], // progressBarFill
  },
  bulletList: {
    gap: 4, // space-y-1
  },
  bulletListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8, // gap-2
    fontSize: 10, // text-xs
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
    marginTop: 4,
    flexShrink: 0,
  },
  headerMain: {
    flexGrow: 0,
  },
  headerFullName: {
    fontSize: 28, // text-3xl
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    marginBottom: 4, // mb-1
    textTransform: 'uppercase',
    letterSpacing: 1, // tracking-wide
  },
  headerDesignation: {
    fontSize: 14, // text-lg
    fontFamily: 'Helvetica-Bold', // font-medium
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
    marginBottom: 16, // mb-4
    textTransform: 'uppercase',
    letterSpacing: 2, // tracking-widest
  },
  headerContactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24, // gap-x-6
    fontSize: 11, // text-sm
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
  },
  headerContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
  },
  headerContactIcon: {
    width: 12, // w-3
    height: 12, // h-3
    color: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
  },
  summaryText: {
    fontSize: 11, // text-sm
    lineHeight: 1.5,
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    textAlign: 'justify',
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8, // gap-2
    marginBottom: 24, // space-y-6
  },
  experienceBullet: {
    width: 16, // w-4
    height: 16, // h-4
    borderRadius: 8, // rounded-full
    backgroundColor: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
    marginTop: 4,
    flexShrink: 0,
  },
  experienceContent: {
    flexGrow: 1,
  },
  experienceHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  experienceRoleCompany: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  experienceDurationContent: {
    fontSize: 10, // text-xs
    fontStyle: 'italic',
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
  },
  experienceDescriptionList: {
    marginTop: 8,
    marginLeft: 16,
  },
  experienceDescriptionListItem: {
    fontSize: 10, // text-xs
    lineHeight: 1.4,
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    marginBottom: 2,
  },
  educationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8, // gap-2
    marginBottom: 16, // space-y-4
  },
  educationContent: {
    flexGrow: 1,
  },
  educationDegreeInstitution: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  educationDatesContent: {
    fontSize: 10, // text-xs
    fontStyle: 'italic',
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
  },
  educationInstitutionText: {
    fontSize: 10, // text-xs
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8, // gap-2
    marginBottom: 16, // space-y-4
  },
  projectContent: {
    flexGrow: 1,
  },
  projectTitle: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  projectDescription: {
    fontSize: 10, // text-xs
    lineHeight: 1.4,
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    marginBottom: 8, // mb-2
  },
  projectLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // gap-x-4
    marginTop: 8, // mt-2
  },
  projectLink: {
    fontSize: 10, // text-xs
    color: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
    textDecoration: 'underline',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
  },
});

interface PdfTemplateFourProps {
  data: ResumeFormData;
  colorPalette?: string[];
}

const PdfTemplateFour: React.FC<PdfTemplateFourProps> = ({ data, colorPalette }) => {
  const colors = colorPalette && colorPalette.length === 6 ? colorPalette : DEFAULT_THEME_FOUR;
  const styles = createStyles(colors);

  const formatYearMonth = (dateString?: string) => {
    if (!dateString) return "Present";
    return dateString;
  };

  const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== ''));
  const hasContactInfo = Object.values(data.contactInfo).some(val => val !== undefined && val !== null && val !== '');

  const hobbies = data.interests?.filter(i => i.name?.trim()).map(i => i.name) || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Left Sidebar */}
          <View style={styles.leftColumn}>
            {/* Profile Photo */}
            <View style={styles.profileImageContainer}>
              {data.profileInfo.profilePictureUrl ? (
                <PdfImage src={data.profileInfo.profilePictureUrl} style={styles.profileImage} />
              ) : (
                <View style={styles.profileIconFallback}>
                  <Text>JD</Text>
                </View>
              )}
            </View>

            {/* Links Section */}
            {(data.contactInfo.linkedin || data.contactInfo.github || data.contactInfo.website) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Links</Text>
                {data.contactInfo.linkedin && (
                  <View style={styles.linkItem}>
                    <PdfLink src={data.contactInfo.linkedin} style={styles.linkText}>
                      {cleanUrlForDisplay(data.contactInfo.linkedin)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.github && (
                  <View style={styles.linkItem}>
                    <PdfLink src={data.contactInfo.github} style={styles.linkText}>
                      {cleanUrlForDisplay(data.contactInfo.github)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.website && (
                  <View style={styles.linkItem}>
                    <PdfLink src={data.contactInfo.website} style={styles.linkText}>
                      {cleanUrlForDisplay(data.contactInfo.website)}
                    </PdfLink>
                  </View>
                )}
              </View>
            )}

            {/* Languages Section */}
            {hasArrayData(data.languages) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.progressBarContainer}>
                  {data.languages.map((lang, index) =>
                    lang.name && (
                      <View key={index} style={styles.progressBarItem}>
                        <Text>{lang.name}</Text>
                        <View style={styles.progressBarBackground}>
                          <View style={[styles.progressBarFill, { width: `${((lang.proficiency || 0) / 5) * 100}%` }]} />
                        </View>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}

            {/* Skills Section */}
            {hasArrayData(data.skills) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.progressBarContainer}>
                  {data.skills.map((skill, index) =>
                    skill.name && (
                      <View key={index} style={styles.progressBarItem}>
                        <Text>{skill.name}</Text>
                        <View style={styles.progressBarBackground}>
                          <View style={[styles.progressBarFill, { width: `${((skill.proficiency || 0) / 5) * 100}%` }]} />
                        </View>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}

            {/* Hobbies/Interests */}
            {hobbies.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hobbies</Text>
                <View style={styles.bulletList}>
                  {hobbies.map((hobby, index) => (
                    <View key={index} style={styles.bulletListItem}>
                      <View style={styles.bullet} />
                      <Text>{hobby}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={styles.rightColumn}>
            {/* Name, Title, Contact Info (Main Header) */}
            <View style={styles.headerMain}>
              <Text style={styles.headerFullName}>
                {data.profileInfo.fullName || "Your Name Here"}
              </Text>
              <Text style={styles.headerDesignation}>
                {data.profileInfo.designation || "Your Designation"}
              </Text>
              
              {/* Contact Information - Horizontal layout */}
              {hasContactInfo && (
                <View style={styles.headerContactInfo}>
                  {data.contactInfo.location && (
                    <View style={styles.headerContactItem}>
                      <Text>{data.contactInfo.location}</Text>
                    </View>
                  )}
                  {data.contactInfo.phone && (
                    <View style={styles.headerContactItem}>
                      <Text>{data.contactInfo.phone}</Text>
                    </View>
                  )}
                  {data.contactInfo.email && (
                    <View style={styles.headerContactItem}>
                      <Text>{data.contactInfo.email}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* About Me Section */}
            {data.profileInfo.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Me</Text>
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
                    <View style={styles.experienceBullet} />
                    <View style={styles.experienceContent}>
                      <View style={styles.experienceHeaderContent}>
                        <Text style={styles.experienceRoleCompany}>
                          {exp.role || "Role"} at {exp.company || "Company"}
                        </Text>
                        <Text style={styles.experienceDurationContent}>
                          {`${formatYearMonth(exp.startDate)} - ${formatYearMonth(exp.endDate)}`}
                        </Text>
                      </View>
                      {exp.description && (
                        <View style={styles.experienceDescriptionList}>
                          {exp.description.split('. ').filter(Boolean).map((point, i) => (
                            <Text key={i} style={styles.experienceDescriptionListItem}>• {point.trim()}{point.endsWith('.') ? '' : '.'}</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {hasArrayData(data.education) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <View style={styles.experienceBullet} />
                    <View style={styles.educationContent}>
                      <View style={styles.experienceHeaderContent}>
                        <Text style={styles.educationDegreeInstitution}>
                          {edu.degree || "Degree"}
                        </Text>
                        <Text style={styles.educationDatesContent}>
                          {`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}
                        </Text>
                      </View>
                      <Text style={styles.educationInstitutionText}>
                        {edu.institution || "Institution"}
                      </Text>
                    </View>
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
                    <View style={styles.experienceBullet} />
                    <View style={styles.projectContent}>
                      <Text style={styles.projectTitle}>
                        {project.title || "Project Title"}
                      </Text>
                      <Text style={styles.projectDescription}>
                        {project.description || "Project Description"}
                      </Text>
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

export default PdfTemplateFour;