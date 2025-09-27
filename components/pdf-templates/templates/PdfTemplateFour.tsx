import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';
import { getSvgIcon } from '../utils/getSvgIcon'; // Import the SVG icon helper

// Default theme for TemplateFour (Classic Professional - based on image)
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
    width: '30%', // 1.5fr equivalent (approx 30%)
    flexDirection: 'column',
    paddingRight: 32, // pr-8
    gap: 32, // space-y-8
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0', // border-gray-200
  },
  rightColumn: {
    width: '70%', // 3.5fr equivalent (approx 70%)
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
    alignSelf: 'center', // mx-auto
    marginBottom: 16, // mb-4
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileIconFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 48, // text-5xl
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
  },
  sectionTitle: {
    fontSize: 14, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    marginBottom: 12, // mb-3
    paddingBottom: 4, // pb-1
    textTransform: 'uppercase',
    letterSpacing: 0.5, // tracking-wide
    borderBottomWidth: 1,
    borderBottomColor: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
    fontSize: 10, // text-xs
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
    marginBottom: 8, // space-y-2
  },
  linkIcon: {
    width: 12, // w-3
    height: 12, // h-3
    color: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
  },
  linkText: {
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    textDecoration: 'underline',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10, // text-xs
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    marginBottom: 12, // space-y-3
  },
  progressBarContainer: {
    width: 80, // w-20
    height: 6, // h-1.5
    borderRadius: 3, // rounded-full
    backgroundColor: colors[3] || DEFAULT_THEME_FOUR[3], // progressBarBg
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors[4] || DEFAULT_THEME_FOUR[4], // progressBarFill
  },
  bulletList: {
    marginTop: 4,
    marginLeft: 12,
  },
  bulletListItem: {
    fontSize: 10, // text-xs
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    marginBottom: 4,
  },
  mainHeaderName: {
    fontSize: 28, // text-3xl
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    marginBottom: 4, // mb-1
    textTransform: 'uppercase',
    letterSpacing: 0.5, // tracking-wide
  },
  mainHeaderDesignation: {
    fontSize: 14, // text-lg
    fontFamily: 'Helvetica-Oblique', // font-medium
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
    marginBottom: 16, // mb-4
    textTransform: 'uppercase',
    letterSpacing: 1, // tracking-widest
  },
  contactInfoMain: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24, // gap-x-6
    fontSize: 11, // text-sm
    color: colors[5] || DEFAULT_THEME_FOUR[5], // subtleText
  },
  contactInfoMainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
  },
  summaryText: {
    fontSize: 11, // text-sm
    lineHeight: 1.5,
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
    textAlign: 'justify',
  },
  experienceItem: {
    flexDirection: 'row',
    gap: 8, // gap-2
    marginBottom: 24, // space-y-6
  },
  experienceIcon: {
    width: 16, // w-4
    height: 16, // h-4
    color: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
    marginTop: 4, // mt-1
  },
  experienceContent: {
    flexGrow: 1,
  },
  experienceHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  experienceRoleCompany: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  experienceDurationContent: {
    fontSize: 10, // text-xs
    fontFamily: 'Helvetica-Oblique',
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
    gap: 8, // gap-2
    marginBottom: 16, // space-y-4
  },
  educationDegree: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  educationInstitution: {
    fontSize: 10, // text-xs
    color: colors[1] || DEFAULT_THEME_FOUR[1], // mainText
  },
  projectItem: {
    flexDirection: 'row',
    gap: 8, // gap-2
    marginBottom: 16, // space-y-4
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
  projectLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // gap-x-4
    marginTop: 8, // mt-2
  },
  projectLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // gap-1
    fontSize: 10, // text-xs
    color: colors[2] || DEFAULT_THEME_FOUR[2], // accentColor
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
          {/* Left Column (Sidebar) */}
          <View style={styles.leftColumn}>
            {/* Profile Photo */}
            <View style={styles.profileImageContainer}>
              {data.profileInfo.profilePictureUrl ? (
                <PdfImage src={data.profileInfo.profilePictureUrl} style={styles.profileImage} />
              ) : (
                <View style={styles.profileIconFallback}>
                  {getSvgIcon('User', styles.profileIconFallback.color as string, 48)}
                </View>
              )}
            </View>

            {/* Links Section */}
            {(data.contactInfo.linkedin || data.contactInfo.github || data.contactInfo.website) && (
              <View>
                <Text style={styles.sectionTitle}>LINKS</Text>
                <View style={{ gap: 8 }}>
                  {data.contactInfo.linkedin && (
                    <View style={styles.linkItem}>
                      {getSvgIcon('Linkedin', styles.linkIcon.color as string, 12)}
                      <PdfLink src={data.contactInfo.linkedin} style={styles.linkText}>
                        {cleanUrlForDisplay(data.contactInfo.linkedin)}
                      </PdfLink>
                    </View>
                  )}
                  {data.contactInfo.github && (
                    <View style={styles.linkItem}>
                      {getSvgIcon('Github', styles.linkIcon.color as string, 12)}
                      <PdfLink src={data.contactInfo.github} style={styles.linkText}>
                        {cleanUrlForDisplay(data.contactInfo.github)}
                      </PdfLink>
                    </View>
                  )}
                  {data.contactInfo.website && (
                    <View style={styles.linkItem}>
                      {getSvgIcon('Globe', styles.linkIcon.color as string, 12)}
                      <PdfLink src={data.contactInfo.website} style={styles.linkText}>
                        {cleanUrlForDisplay(data.contactInfo.website)}
                      </PdfLink>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Languages Section */}
            {hasArrayData(data.languages) && (
              <View>
                <Text style={styles.sectionTitle}>LANGUAGES</Text>
                <View style={{ gap: 12 }}>
                  {data.languages.map((lang, index) =>
                    lang.name && (
                      <View key={index} style={styles.languageItem}>
                        <Text>{lang.name}</Text>
                        <View style={styles.progressBarContainer}>
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
              <View>
                <Text style={styles.sectionTitle}>SKILLS</Text>
                <View style={{ gap: 12 }}>
                  {data.skills.map((skill, index) =>
                    skill.name && (
                      <View key={index} style={styles.languageItem}>
                        <Text>{skill.name}</Text>
                        <View style={styles.progressBarContainer}>
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
              <View>
                <Text style={styles.sectionTitle}>HOBBIES</Text>
                <View style={styles.bulletList}>
                  {hobbies.map((hobby, index) => (
                    <Text key={index} style={styles.bulletListItem}>• {hobby}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Right Column (Main Content) */}
          <View style={styles.rightColumn}>
            {/* Name, Title, Contact Info (Main Header) */}
            <View>
              <Text style={styles.mainHeaderName}>
                {data.profileInfo.fullName || "Your Name Here"}
              </Text>
              <Text style={styles.mainHeaderDesignation}>
                {data.profileInfo.designation || "Your Designation"}
              </Text>

              {/* Contact Information - Horizontal layout with icons */}
              {hasContactInfo && (
                <View style={styles.contactInfoMain}>
                  {data.contactInfo.location && (
                    <View style={styles.contactInfoMainItem}>
                      {getSvgIcon('MapPin', styles.contactIcon.color as string, 12)}
                      <Text>{data.contactInfo.location}</Text>
                    </View>
                  )}
                  {data.contactInfo.phone && (
                    <View style={styles.contactInfoMainItem}>
                      {getSvgIcon('Phone', styles.contactIcon.color as string, 12)}
                      <Text>{data.contactInfo.phone}</Text>
                    </View>
                  )}
                  {data.contactInfo.email && (
                    <View style={styles.contactInfoMainItem}>
                      {getSvgIcon('Mail', styles.contactIcon.color as string, 12)}
                      <Text>{data.contactInfo.email}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* About Me Section */}
            {data.profileInfo.summary && (
              <View>
                <Text style={styles.sectionTitle}>ABOUT ME</Text>
                <Text style={styles.summaryText}>
                  {data.profileInfo.summary}
                </Text>
              </View>
            )}

            {/* Work Experience */}
            {hasArrayData(data.workExperiences) && (
              <View>
                <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
                <View style={{ gap: 24 }}>
                  {data.workExperiences.map((exp, index) => (
                    <View key={index} style={styles.experienceItem}>
                      {getSvgIcon('Circle', styles.experienceIcon.color as string, 16)}
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
              </View>
            )}

            {/* Education */}
            {hasArrayData(data.education) && (
              <View>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
                <View style={{ gap: 16 }}>
                  {data.education.map((edu, index) => (
                    <View key={index} style={styles.educationItem}>
                      {getSvgIcon('Circle', styles.experienceIcon.color as string, 16)}
                      <View style={styles.experienceContent}>
                        <View style={styles.experienceHeaderContent}>
                          <Text style={styles.educationDegree}>
                            {edu.degree || "Degree"}
                          </Text>
                          <Text style={styles.experienceDurationContent}>
                            {`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}
                          </Text>
                        </View>
                        <Text style={styles.educationInstitution}>
                          {edu.institution || "Institution"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Projects */}
            {hasArrayData(data.projects) && (
              <View>
                <Text style={styles.sectionTitle}>PROJECTS</Text>
                <View style={{ gap: 16 }}>
                  {data.projects.map((project, index) => (
                    <View key={index} style={styles.projectItem}>
                      {getSvgIcon('Circle', styles.experienceIcon.color as string, 16)}
                      <View style={styles.experienceContent}>
                        <Text style={styles.projectTitle}>
                          {project.title || "Project Title"}
                        </Text>
                        <Text style={styles.projectDescription}>
                          {project.description || "Project Description"}
                        </Text>
                        {(project.github || project.LiveDemo) && (
                          <View style={styles.projectLinksContainer}>
                            {project.github && (
                              <View style={styles.projectLinkItem}>
                                {getSvgIcon('Github', styles.projectLinkItem.color as string, 12)}
                                <PdfLink src={project.github} style={styles.linkText}>
                                  {cleanUrlForDisplay(project.github)}
                                </PdfLink>
                              </View>
                            )}
                            {project.LiveDemo && (
                              <View style={styles.projectLinkItem}>
                                {getSvgIcon('ExternalLink', styles.projectLinkItem.color as string, 12)}
                                <PdfLink src={project.LiveDemo} style={styles.linkText}>
                                  {cleanUrlForDisplay(project.LiveDemo)}
                                </PdfLink>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTemplateFour;