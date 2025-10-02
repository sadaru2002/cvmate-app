import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink, Svg, Circle } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';
import { getSvgIcon } from '../utils/getSvgIcon';

const DEFAULT_THEME_FOUR = [
  "#FFFFFF", // 0: Background/white
  "#1a1a1a", // 1: Primary text (black)
  "#2563EB", // 2: Theme accent color (blue) - for titles, icons, lines
  "#E5E7EB", // 3: Light gray for progress bar background
  "#2563EB", // 4: Theme color for progress bar fill (same as accent)
  "#4B5563", // 5: Secondary text (gray)
];

const createStyles = (colors: string[]) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: '#111827',
  },
  container: {
    flexDirection: 'row',
    minHeight: '100%',
    gap: 16,
    padding: 16,
  },
  leftColumn: {
    width: '28%',
    flexDirection: 'column',
    paddingRight: 16,
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  rightColumn: {
    width: '72%',
    flexDirection: 'column',
    gap: 10,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    alignSelf: 'center',
    marginBottom: 6,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 32,
  },
  profileIconFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 32,
    fontFamily: 'Helvetica',
    color: colors[5] || DEFAULT_THEME_FOUR[5],
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 12, // Increased from 11 for better visibility
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme accent color for titles
    marginBottom: 6,
    paddingBottom: 3,
    letterSpacing: 0.3,
    borderBottomWidth: 0.5,
    borderBottomColor: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for underlines
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: colors[5] || DEFAULT_THEME_FOUR[5],
    marginBottom: 4,
  },
  linkIcon: {
    width: 8,
    height: 8,
    color: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for icons
  },
  linkText: {
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // Black text for links
    textDecoration: 'none',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // Black text
    marginBottom: 4,
  },
  progressBarContainer: {
    width: 52,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors[3] || DEFAULT_THEME_FOUR[3], // Light gray background
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for progress bar fill
  },
  bulletList: {
    marginTop: 4,
    marginLeft: 0,
  },
  bulletListItem: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // Black text for content
    marginBottom: 3,
  },
  bulletPoint: {
    fontSize: 12,
    color: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for bullet points
    marginRight: 6,
  },
  mainHeaderName: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    color: colors[1] || DEFAULT_THEME_FOUR[1], // Black for main name
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  mainHeaderDesignation: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for designation
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactInfoMain: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: colors[5] || DEFAULT_THEME_FOUR[5],
  },
  contactInfoMainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  contactIconMain: {
    width: 8,
    height: 8,
    color: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for contact icons
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FOUR[1],
    textAlign: 'justify',
  },
  experienceItem: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 15,
  },
  experienceIconContainer: {
    width: 10,
    height: 10,
    marginTop: 3,
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
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    color: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for job titles
  },
  experienceDurationContent: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Oblique',
    fontStyle: 'italic',
    color: colors[5] || DEFAULT_THEME_FOUR[5],
  },
  experienceDescriptionList: {
    marginTop: 4,
    marginLeft: 10,
  },
  experienceDescriptionListItem: {
    fontSize: 8.5,
    lineHeight: 1.3,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FOUR[1],
    marginBottom: 1.5,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 10,
  },
  educationContent: {
    flexDirection: 'column',
    flex: 1,
  },
  educationDuration: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: 80,
  },
  educationDegree: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    color: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for degree titles
  },
  educationInstitution: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FOUR[1],
  },
  educationDates: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Oblique',
    fontStyle: 'italic',
    color: colors[5] || DEFAULT_THEME_FOUR[5],
    textAlign: 'right',
  },
  projectItem: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    color: colors[2] || DEFAULT_THEME_FOUR[2], // Use theme color for project titles
  },
  projectDescription: {
    fontSize: 8.5,
    lineHeight: 1.3,
    fontFamily: 'Helvetica',
    color: colors[1] || DEFAULT_THEME_FOUR[1],
    marginBottom: 4,
  },
  projectLinksContainer: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    gap: 3,
    marginTop: 4,
  },
  projectLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: colors[2] || DEFAULT_THEME_FOUR[2],
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

  // Stroke circle component
  const StrokeCircle = ({ color }: { color: string }) => (
    <Svg width="10" height="10" viewBox="0 0 10 10" style={styles.experienceIconContainer}>
      <Circle
        cx="5"
        cy="5"
        r="4"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
    </Svg>
  );

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
                  {getSvgIcon('User', styles.profileIconFallback.color as string, styles.profileIconFallback.fontSize as number)}
                </View>
              )}
            </View>

            {/* Links Section */}
            {(data.contactInfo.linkedin || data.contactInfo.github || data.contactInfo.website) && (
              <View>
                <Text style={styles.sectionTitle}>Links</Text>
                <View style={{ gap: 4 }}>
                  {data.contactInfo.linkedin && (
                    <View style={styles.linkItem}>
                      {getSvgIcon('Linkedin', styles.linkIcon.color as string, styles.linkIcon.width as number)}
                      <PdfLink src={data.contactInfo.linkedin} style={styles.linkText}>
                        {cleanUrlForDisplay(data.contactInfo.linkedin)}
                      </PdfLink>
                    </View>
                  )}
                  {data.contactInfo.github && (
                    <View style={styles.linkItem}>
                      {getSvgIcon('Github', styles.linkIcon.color as string, styles.linkIcon.width as number)}
                      <PdfLink src={data.contactInfo.github} style={styles.linkText}>
                        {cleanUrlForDisplay(data.contactInfo.github)}
                      </PdfLink>
                    </View>
                  )}
                  {data.contactInfo.website && (
                    <View style={styles.linkItem}>
                      {getSvgIcon('Globe', styles.linkIcon.color as string, styles.linkIcon.width as number)}
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
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={{ gap: 4 }}>
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
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={{ gap: 4 }}>
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
                <Text style={styles.sectionTitle}>Hobbies</Text>
                <View style={{ gap: 4 }}>
                  {hobbies.map((hobby, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 }}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletListItem}>{hobby}</Text>
                    </View>
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
                      {getSvgIcon('MapPin', styles.contactIconMain.color as string, styles.contactIconMain.width as number)}
                      <Text>{data.contactInfo.location}</Text>
                    </View>
                  )}
                  {data.contactInfo.phone && (
                    <View style={styles.contactInfoMainItem}>
                      {getSvgIcon('Phone', styles.contactIconMain.color as string, styles.contactIconMain.width as number)}
                      <Text>{data.contactInfo.phone}</Text>
                    </View>
                  )}
                  {data.contactInfo.email && (
                    <View style={styles.contactInfoMainItem}>
                      {getSvgIcon('Mail', styles.contactIconMain.color as string, styles.contactIconMain.width as number)}
                      <Text>{data.contactInfo.email}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* About Me Section */}
            {data.profileInfo.summary && (
              <View>
                <Text style={styles.sectionTitle}>About Me</Text>
                <Text style={styles.summaryText}>
                  {data.profileInfo.summary}
                </Text>
              </View>
            )}

            {/* Work Experience */}
            {hasArrayData(data.workExperiences) && (
              <View>
                <Text style={styles.sectionTitle}>Work Experience</Text>
                <View style={{ gap: 15 }}>
                  {data.workExperiences.map((exp, index) => (
                    <View key={index} style={styles.experienceItem}>
                      <StrokeCircle color={colors[2] || DEFAULT_THEME_FOUR[2]} />
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
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={{ gap: 10 }}>
                  {data.education.map((edu, index) => (
                    <View key={index} style={styles.educationItem}>
                      <View style={styles.educationContent}>
                        <Text style={styles.educationDegree}>
                          {edu.degree || "Degree"}
                        </Text>
                        <Text style={styles.educationInstitution}>
                          {edu.institution || "Institution"}
                        </Text>
                      </View>
                      <View style={styles.educationDuration}>
                        <Text style={styles.educationDates}>
                          {`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}
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
                <Text style={styles.sectionTitle}>Projects</Text>
                <View style={{ gap: 10 }}>
                  {data.projects.map((project, index) => (
                    <View key={index} style={styles.projectItem}>
                      <StrokeCircle color={colors[2] || DEFAULT_THEME_FOUR[2]} />
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
                                {getSvgIcon('Github', styles.projectLinkItem.color as string, styles.projectLinkItem.fontSize as number)}
                                <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: colors[1] || DEFAULT_THEME_FOUR[1] }}>GitHub: </Text>
                                <PdfLink src={project.github} style={styles.linkText}>
                                  {cleanUrlForDisplay(project.github)}
                                </PdfLink>
                              </View>
                            )}
                            {project.LiveDemo && (
                              <View style={styles.projectLinkItem}>
                                {getSvgIcon('ExternalLink', styles.projectLinkItem.color as string, styles.projectLinkItem.fontSize as number)}
                                <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: colors[1] || DEFAULT_THEME_FOUR[1] }}>Live Demo: </Text>
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
