import React from "react";
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';
import { getSvgIcon } from '../utils/getSvgIcon'; // Import the SVG icon helper

// Default theme for TemplateThree (based on the provided image)
// Order: [sidebarBg, mainText, accentColor, secondaryText, linkText, bulletColor]
const DEFAULT_THEME_THREE = [
  "#E0F7FA", // Very Light Cyan/Blue (sidebarBg)
  "#212121", // Dark Gray/Black (mainText - not directly used as mainContentTextColor is fixed)
  "#00ACC1", // Vibrant Cyan/Teal (accentColor)
  "#666666", // Medium Gray (secondaryText - not directly used as mainContentSecondaryTextColor is fixed)
  "#00ACC1", // Vibrant Cyan/Teal (linkText - not directly used as mainContentLinkColor is fixed)
  "#00ACC1", // Vibrant Cyan/Teal (bulletColor)
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
    width: '30%', // 1.5fr equivalent (approx 30%)
    backgroundColor: colors[0] || DEFAULT_THEME_THREE[0],
    paddingVertical: 32, // py-8
    paddingHorizontal: 24, // px-6
  },
  rightColumn: {
    width: '70%', // 3.5fr equivalent (approx 70%)
    paddingVertical: 32, // py-8
    paddingHorizontal: 24, // px-6
    color: '#212121', // Fixed mainContentTextColor
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16, // mb-4
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
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 32,
    color: colors[2] || DEFAULT_THEME_THREE[2], // Accent Cyan icon
  },
  fullName: {
    fontSize: 18, // text-xl
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // sidebarFixedTextColor
    textAlign: 'center',
    marginBottom: 4, // mb-1
  },
  designation: {
    fontSize: 12, // text-sm
    color: '#212121', // sidebarFixedTextColor
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5, // tracking-wide
  },
  contactSection: {
    marginTop: 24, // my-6
    paddingVertical: 16, // py-4
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // border-white/30
    marginBottom: 24, // mb-6
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // space-y-2
  },
  contactText: {
    fontSize: 10, // text-xs
    color: '#212121', // sidebarFixedTextColor
    flexShrink: 1,
  },
  contactLink: {
    fontSize: 10, // text-xs
    color: colors[2] || DEFAULT_THEME_THREE[2], // sidebarFixedLinkColor (Accent Cyan)
    textDecoration: 'underline',
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: 14, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[2] || DEFAULT_THEME_THREE[2], // Accent Cyan
    marginBottom: 12, // mb-3
    paddingBottom: 4, // pb-1
  },
  educationItem: {
    marginBottom: 8, // space-y-2
  },
  educationInstitution: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // sidebarFixedTextColor
  },
  educationDegree: {
    fontSize: 10, // text-xs
    color: '#212121', // sidebarFixedTextColor
  },
  educationDates: {
    fontSize: 10, // text-xs
    fontFamily: 'Helvetica-Oblique',
    color: '#666666', // sidebarFixedSecondaryTextColor
  },
  bulletList: {
    marginTop: 4,
    marginLeft: 12,
  },
  bulletListItem: {
    fontSize: 10, // text-xs
    color: '#212121', // sidebarFixedTextColor
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 11, // text-sm
    lineHeight: 1.5,
    color: '#212121', // mainContentTextColor
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 24, // mb-6
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
    fontFamily: 'Helvetica-Oblique',
    color: '#666666', // mainContentSecondaryTextColor
  },
  experienceDuration: {
    fontSize: 10, // text-xs
    fontFamily: 'Helvetica-Oblique',
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
    fontFamily: 'Helvetica-Oblique', // font-medium italic
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
    marginTop: 4, // mt-1
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
  projectLinkIcon: {
    width: 12, // w-3
    height: 12, // h-3
    color: colors[2] || DEFAULT_THEME_THREE[2], // accentColor
  },
  projectLinkLabel: {
    width: 64, // w-16
    fontSize: 9, // text-xs
    fontFamily: 'Helvetica-Bold', // font-medium
    color: '#212121', // text-gray-800
    flexShrink: 0,
  },
  projectLinkText: {
    fontSize: 9, // text-xs
    fontFamily: 'Helvetica-Bold', // font-medium
    color: colors[2] || DEFAULT_THEME_THREE[2], // mainContentLinkColor (Accent Cyan)
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

  // Extract skills and interests as simple names for bullet lists
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
                  {getSvgIcon('User', styles.profileIconFallback.color as string, 32)}
                </View>
              )}
            </View>

            {/* Name and Designation */}
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.fullName}>{data.profileInfo.fullName || "Your Name Here"}</Text>
              <Text style={styles.designation}>{data.profileInfo.designation || "Your Designation"}</Text>
            </View>

            {/* Contact Information */}
            {hasContactInfo && (
              <View style={styles.contactSection}>
                <Text style={styles.sectionTitle}>CONTACT</Text>
                {data.contactInfo.email && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Mail', colors[2], 12)}
                    <Text style={styles.contactText}>{data.contactInfo.email}</Text>
                  </View>
                )}
                {data.contactInfo.phone && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Phone', colors[2], 12)}
                    <Text style={styles.contactText}>{data.contactInfo.phone}</Text>
                  </View>
                )}
                {data.contactInfo.linkedin && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Linkedin', colors[2], 12)}
                    <PdfLink src={data.contactInfo.linkedin} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.linkedin)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.github && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Github', colors[2], 12)}
                    <PdfLink src={data.contactInfo.github} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.github)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.website && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Globe', colors[2], 12)}
                    <PdfLink src={data.contactInfo.website} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.website)}
                    </PdfLink>
                  </View>
                )}
              </View>
            )}

            {/* Education */}
            {hasArrayData(data.education) && (
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
                {data.education.map((edu, index) => (
                  <View key={`education_${index}`} style={styles.educationItem}>
                    <Text style={styles.educationInstitution}>{edu.institution || "Your Institution"}</Text>
                    <Text style={styles.educationDegree}>{edu.degree || "Your Degree"}</Text>
                    <Text style={styles.educationDates}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Skills (Technical) */}
            {technicalSkills.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.sectionTitle}>SKILLS</Text>
                <View style={styles.bulletList}>
                  {technicalSkills.map((skill, index) => (
                    <Text key={index} style={styles.bulletListItem}>• {skill}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* Certifications */}
            {certificationsList.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                <View style={styles.bulletList}>
                  {certificationsList.map((cert, index) => (
                    <Text key={index} style={styles.bulletListItem}>• {cert}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* Interests (Soft Skills) */}
            {softSkills.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.sectionTitle}>SOFT SKILLS</Text>
                <View style={styles.bulletList}>
                  {softSkills.map((skill, index) => (
                    <Text key={index} style={styles.bulletListItem}>• {skill}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Right Column (Main Content) */}
          <View style={styles.rightColumn}>
            {/* Professional Summary */}
            {data.profileInfo.summary && (
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.sectionTitle}>PROFILE</Text>
                <Text style={styles.summaryText}>{data.profileInfo.summary || "A short introduction about yourself..."}</Text>
              </View>
            )}

            {/* Work Experience */}
            {hasArrayData(data.workExperiences) && (
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                <View style={{ marginTop: 16 }}>
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
              </View>
            )}

            {/* Projects */}
            {hasArrayData(data.projects) && (
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.sectionTitle}>PROJECTS</Text>
                <View style={{ marginTop: 16 }}>
                  {data.projects.map((project, index) => (
                    <View key={`project_${index}`} style={styles.projectItem}>
                      <Text style={styles.projectTitle}>{project.title || "Project Title"}</Text>
                      <Text style={styles.projectDescription}>{project.description || "Project Description"}</Text>
                      <View style={styles.projectLinksContainer}>
                        {project.github && (
                          <View style={styles.projectLinkItem}>
                            <View style={styles.projectLinkIconContainer}>
                              {getSvgIcon('Github', styles.projectLinkIcon.color as string, 12)}
                            </View>
                            <Text style={styles.projectLinkLabel}>GitHub:</Text>
                            <PdfLink src={project.github} style={styles.projectLinkText}>
                              {cleanUrlForDisplay(project.github)}
                            </PdfLink>
                          </View>
                        )}
                        {project.LiveDemo && (
                          <View style={styles.projectLinkItem}>
                            <View style={styles.projectLinkIconContainer}>
                              {getSvgIcon('ExternalLink', styles.projectLinkIcon.color as string, 12)}
                            </View>
                            <Text style={styles.projectLinkLabel}>Live Demo:</Text>
                            <PdfLink src={project.LiveDemo} style={styles.projectLinkText}>
                              {cleanUrlForDisplay(project.LiveDemo)}
                            </PdfLink>
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

export default PdfTemplateThree;