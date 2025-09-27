import React from "react";
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';

// Default theme for TemplateThree (based on the provided image)
const DEFAULT_THEME_THREE = [
  "#E0F7FA", // Very Light Cyan/Blue (sidebarBg)
  "#212121", // Dark Gray/Black (mainText)
  "#00ACC1", // Vibrant Cyan/Teal (accentColor)
  "#666666", // Medium Gray (secondaryText)
  "#00ACC1", // Vibrant Cyan/Teal (linkText - same as accent)
  "#00ACC1", // Vibrant Cyan/Teal (bulletColor - same as accent)
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
  },
  leftColumn: {
    width: '30%', // 1.5fr equivalent
    backgroundColor: colors[0] || DEFAULT_THEME_THREE[0],
    paddingVertical: 32, // py-8
    paddingHorizontal: 24, // px-6
  },
  rightColumn: {
    width: '70%', // 3.5fr equivalent
    paddingVertical: 32, // py-8
    paddingHorizontal: 24, // px-6
    color: '#212121', // mainContentTextColor
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignSelf: 'center',
    marginBottom: 16, // mb-4
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    objectFit: 'cover',
  },
  profileIconFallback: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#CCCCCC', // Light gray fallback
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40, // text-5xl
    color: colors[2] || DEFAULT_THEME_THREE[2], // accentColor
  },
  fullName: {
    fontSize: 18, // text-xl
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // sidebarFixedTextColor
    textAlign: 'center',
    marginBottom: 4, // mb-1
    textTransform: 'uppercase',
  },
  designation: {
    fontSize: 12, // text-sm
    color: '#212121', // sidebarFixedTextColor
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1, // tracking-wide
  },
  section: {
    marginBottom: 24, // mb-6
  },
  sectionTitle: {
    fontSize: 14, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[2] || DEFAULT_THEME_THREE[2], // accentColor
    marginBottom: 12, // mb-3
    paddingBottom: 4, // pb-1
  },
  contactDivider: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // border-white/30
    paddingVertical: 16, // py-4
    marginBottom: 24, // mb-6
    gap: 8, // space-y-2
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
    fontSize: 10, // text-xs
    color: '#212121', // sidebarFixedTextColor
  },
  contactLink: {
    color: colors[2] || DEFAULT_THEME_THREE[2], // sidebarFixedLinkColor
    textDecoration: 'underline',
    flexShrink: 1,
  },
  educationItem: {
    marginBottom: 8,
  },
  educationInstitution: {
    fontSize: 10, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // sidebarFixedTextColor
  },
  educationDegree: {
    fontSize: 9, // text-xs
    color: '#212121', // sidebarFixedTextColor
  },
  educationDuration: {
    fontSize: 9, // text-xs
    fontStyle: 'italic',
    color: '#666666', // sidebarFixedSecondaryTextColor
  },
  bulletList: {
    marginTop: 4,
    gap: 4,
  },
  bulletListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 10, // text-xs
    color: '#212121', // sidebarFixedTextColor
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors[5] || DEFAULT_THEME_THREE[5], // bulletColor
    marginTop: 4,
    flexShrink: 0,
  },
  summaryText: {
    fontSize: 11, // text-sm
    lineHeight: 1.5,
    color: '#212121', // mainContentTextColor
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 24, // space-y-6
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4, // mb-1
  },
  experienceCompany: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // mainContentTextColor
  },
  experienceRole: {
    fontSize: 10, // text-xs
    fontStyle: 'italic',
    color: '#666666', // mainContentSecondaryTextColor
  },
  experienceDuration: {
    fontSize: 10, // text-xs
    fontStyle: 'italic',
    color: '#666666', // mainContentSecondaryTextColor
  },
  descriptionList: {
    marginTop: 8, // mt-[0.2cm]
    marginLeft: 16, // ml-4
  },
  descriptionListItem: {
    fontSize: 10, // text-xs
    lineHeight: 1.4,
    color: '#4b5563', // text-gray-600
    fontStyle: 'italic', // font-medium italic
    marginBottom: 2,
  },
  projectItem: {
    marginBottom: 20, // mb-5
  },
  projectTitle: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // text-gray-800
  },
  projectDescription: {
    fontSize: 10, // text-xs
    lineHeight: 1.4,
    color: '#4a5568', // text-gray-700
    marginBottom: 5,
  },
  projectLinksContainer: {
    flexDirection: 'column', // flex-col
    gap: 4, // gap-1
    marginTop: 8, // mt-2
  },
  projectLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  projectLinkIconContainer: {
    width: 20, // w-5
    height: 20, // h-5
    borderRadius: 10, // rounded-full
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors[0] || DEFAULT_THEME_THREE[0], // sidebarBg
  },
  projectLinkText: {
    fontSize: 9, // text-xs
    fontFamily: 'Helvetica-Bold', // font-medium
    color: colors[2] || DEFAULT_THEME_THREE[2], // Accent Cyan for icon color
    textDecoration: 'underline',
    flexShrink: 1,
  },
});

interface PdfTemplateThreeProps {
  data: ResumeFormData;
  colorPalette?: string[];
}

const PdfTemplateThree: React.FC<PdfTemplateThreeProps> = ({ data, colorPalette }) => {
  const colors = colorPalette && colorPalette.length >= 6 ? colorPalette : DEFAULT_THEME_THREE;
  const styles = createStyles(colors);

  const formatYearMonth = (dateString?: string) => {
    if (!dateString) return "Present";
    return dateString;
  };

  const hasArrayData = (arr?: any[]) => arr && arr.length > 0 && arr.some(item => Object.values(item).some(val => val !== undefined && val !== null && val !== ''));
  const hasContactInfo = Object.values(data.contactInfo).some(val => val !== undefined && val !== null && val !== '');

  const technicalSkills = data.skills?.map(s => s.name).filter(Boolean) as string[] || [];
  const softSkills = data.interests?.map(i => i.name).filter(Boolean) as string[] || [];
  const certificationsList = data.certifications?.map(c => c.title).filter(Boolean) as string[] || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Left Column (Sidebar) */}
          <View style={styles.leftColumn}>
            {/* Profile Picture */}
            <View style={styles.profileImageContainer}>
              {data.profileInfo.profilePictureUrl ? (
                <PdfImage src={data.profileInfo.profilePictureUrl} style={styles.profileImage} />
              ) : (
                <View style={styles.profileIconFallback}>
                  <Text>JD</Text>
                </View>
              )}
            </View>

            {/* Name and Designation */}
            <View style={styles.section}>
              <Text style={styles.fullName}>{data.profileInfo.fullName || "YOUR NAME HERE"}</Text>
              <Text style={styles.designation}>{data.profileInfo.designation || "Your Designation"}</Text>
            </View>

            {/* Contact Information */}
            {hasContactInfo && (
              <View style={styles.contactDivider}>
                {data.contactInfo.email && (
                  <View style={styles.contactItem}>
                    <Text>Email: </Text>
                    <Text>{data.contactInfo.email}</Text>
                  </View>
                )}
                {data.contactInfo.phone && (
                  <View style={styles.contactItem}>
                    <Text>Phone: </Text>
                    <Text>{data.contactInfo.phone}</Text>
                  </View>
                )}
                {data.contactInfo.linkedin && (
                  <View style={styles.contactItem}>
                    <Text>LinkedIn: </Text>
                    <PdfLink src={data.contactInfo.linkedin} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.linkedin)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.github && (
                  <View style={styles.contactItem}>
                    <Text>GitHub: </Text>
                    <PdfLink src={data.contactInfo.github} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.github)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.website && (
                  <View style={styles.contactItem}>
                    <Text>Website: </Text>
                    <PdfLink src={data.contactInfo.website} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.website)}
                    </PdfLink>
                  </View>
                )}
              </View>
            )}

            {/* Education */}
            {hasArrayData(data.education) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, index) => (
                  <View key={`education_${index}`} style={styles.educationItem}>
                    <Text style={styles.educationInstitution}>{edu.institution || "Your Institution"}</Text>
                    <Text style={styles.educationDegree}>{edu.degree || "Your Degree"}</Text>
                    <Text style={styles.educationDuration}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Skills (Technical) */}
            {technicalSkills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.bulletList}>
                  {technicalSkills.map((skill, index) => (
                    <View key={index} style={styles.bulletListItem}>
                      <View style={styles.bullet} />
                      <Text>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Certifications */}
            {certificationsList.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                <View style={styles.bulletList}>
                  {certificationsList.map((cert, index) => (
                    <View key={index} style={styles.bulletListItem}>
                      <View style={styles.bullet} />
                      <Text>{cert}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Interests (Soft Skills) */}
            {softSkills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Soft Skills</Text>
                <View style={styles.bulletList}>
                  {softSkills.map((skill, index) => (
                    <View key={index} style={styles.bulletListItem}>
                      <View style={styles.bullet} />
                      <Text>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Right Column (Main Content) */}
          <View style={styles.rightColumn}>
            {/* Professional Summary */}
            {data.profileInfo.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <Text style={styles.summaryText}>{data.profileInfo.summary || "A short introduction about yourself..."}</Text>
              </View>
            )}

            {/* Work Experience */}
            {hasArrayData(data.workExperiences) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.workExperiences.map((exp, index) => (
                  <View key={`work_${index}`} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <View>
                        <Text style={styles.experienceCompany}>{exp.company || "Company Name"}</Text>
                        <Text style={styles.experienceRole}>{exp.role || "Your Role"}</Text>
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
            )}

            {/* Projects */}
            {hasArrayData(data.projects) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {data.projects.map((project, index) => (
                  <View key={`project_${index}`} style={styles.projectItem}>
                    <Text style={styles.projectTitle}>{project.title || "Project Title"}</Text>
                    <Text style={styles.projectDescription}>{project.description || "Project Description"}</Text>
                    <View style={styles.projectLinksContainer}>
                      {project.github && (
                        <View style={styles.projectLinkItem}>
                          <PdfLink src={project.github} style={styles.projectLinkText}>GitHub: {cleanUrlForDisplay(project.github)}</PdfLink>
                        </View>
                      )}
                      {project.LiveDemo && (
                        <View style={styles.projectLinkItem}>
                          <PdfLink src={project.LiveDemo} style={styles.projectLinkText}>Live Demo: {cleanUrlForDisplay(project.LiveDemo)}</PdfLink>
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

export default PdfTemplateThree;