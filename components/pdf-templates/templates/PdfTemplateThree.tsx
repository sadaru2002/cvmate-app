import React from "react";
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';
import { getSvgIcon } from '../utils/getSvgIcon';

const DEFAULT_THEME_THREE = [
  "#E0F7FA", // Very Light Cyan/Blue (sidebarBg)
  "#212121", // Dark Gray/Black (mainText)
  "#00ACC1", // Vibrant Cyan/Teal (accentColor)
  "#666666", // Medium Gray (secondaryText)
  "#00ACC1", // Vibrant Cyan/Teal (linkText)
  "#00ACC1", // Vibrant Cyan/Teal (bulletColor)
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
  },
  leftColumn: {
    width: '30%',
    backgroundColor: colors[0] || DEFAULT_THEME_THREE[0],
    paddingVertical: 32, // py-8
    paddingHorizontal: 24, // px-6 = 24px
  },
  rightColumn: {
    width: '70%',
    paddingVertical: 32, // py-8
    paddingHorizontal: 24, // px-6 = 24px
    color: '#212121',
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignSelf: 'center',
    marginBottom: 12, // mb-3
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
    objectFit: 'cover',
  },
  profileIconFallback: {
    width: 82,
    height: 82,
    borderRadius: 41,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40,
    color: colors[2] || DEFAULT_THEME_THREE[2],
  },
  fullName: {
    fontSize: 12, // text-base in PDF = 12pt
    fontFamily: 'Helvetica-Bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 4, // mb-1
  },
  designation: {
    fontSize: 9, // text-xs = 9pt
    fontFamily: 'Helvetica',
    color: '#212121',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactSection: {
    marginBottom: 16, // mb-4
    paddingTop: 0,
    paddingBottom: 8, // pb-2
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // space-y-2
    gap: 16, // gap-4
  },
  contactText: {
    fontSize: 9, // text-xs
    fontFamily: 'Helvetica',
    color: '#212121',
    flexShrink: 1,
  },
  contactLink: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#00ACC1', // Fixed cyan color
    textDecoration: 'none',
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: 12, // Increased from 9 for better visibility
    fontFamily: 'Helvetica',
    fontWeight: 'bold', // Changed from Helvetica-Bold to standard bold
    color: colors[2] || DEFAULT_THEME_THREE[2],
    marginBottom: 8, // mb-2
    letterSpacing: 1,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // space-y-2
    gap: 8, // gap-2
  },
  skillName: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#212121',
    width: '50%', // grid-cols-2
    flexShrink: 0,
  },
  skillProgressContainer: {
    width: '50%', // grid-cols-2
    height: 8, // h-2
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors[2] || DEFAULT_THEME_THREE[2],
  },
  summaryText: {
    fontSize: 10.5, // text-sm
    lineHeight: 1.6, // leading-relaxed
    fontFamily: 'Helvetica',
    color: '#212121',
    textAlign: 'left',
  },
  experienceItem: {
    marginBottom: 16, // space-y-4
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4, // mb-1
  },
  experienceCompany: {
    fontSize: 10.5, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121',
  },
  experienceRole: {
    fontSize: 9, // text-xs
    fontFamily: 'Helvetica-Oblique',
    color: '#666666',
  },
  educationDegree: {
    fontSize: 9, // text-xs
    fontFamily: 'Helvetica',
    color: '#666666',
  },
  experienceDuration: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#666666',
  },
  descriptionList: {
    marginTop: 8, // mt-2
    marginLeft: 16, // ml-4
  },
  projectItem: {
    marginBottom: 12, // space-y-3
  },
  projectTitle: {
    fontSize: 10.5, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121',
  },
  projectDescription: {
    fontSize: 9, // text-xs
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
    color: '#4a5568',
    marginTop: 4,
  },
  projectLinksContainer: {
    flexDirection: 'column',
    gap: 4,
    marginTop: 8,
  },
  projectLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectLinkIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors[0] || DEFAULT_THEME_THREE[0],
  },
  projectLinkIcon: {
    width: 12,
    height: 12,
    color: colors[2] || DEFAULT_THEME_THREE[2],
  },
  projectLinkLabel: {
    width: 64,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#212121',
    flexShrink: 0,
  },
  projectLinkText: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#000000',
    textDecoration: 'none',
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
                  {getSvgIcon('User', styles.profileIconFallback.color as string, 40)}
                </View>
              )}
            </View>

            {/* Name and Designation */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.fullName}>{data.profileInfo.fullName || "Your Name Here"}</Text>
              <Text style={styles.designation}>{data.profileInfo.designation || "Your Designation"}</Text>
            </View>

            {/* Contact Information */}
            {hasContactInfo && (
              <View style={styles.contactSection}>
                <Text style={styles.sectionTitle}>Contact</Text>
                <View style={{ marginTop: 0 }}>
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
                  {data.contactInfo.location && (
                    <View style={styles.contactItem}>
                      {getSvgIcon('MapPin', colors[2], 12)}
                      <Text style={styles.contactText}>{data.contactInfo.location}</Text>
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
              </View>
            )}

            {/* Skills */}
            {technicalSkills.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={{ marginTop: 0 }}>
                  {data.skills.map((skill, index) => (
                    <View key={index} style={styles.skillRow}>
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <View style={styles.skillProgressContainer}>
                        <View 
                          style={[
                            styles.skillProgressBar, 
                            { width: `${(skill.proficiency || 0) * 20}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Languages */}
            {hasArrayData(data.languages) && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={{ marginTop: 0 }}>
                  {data.languages.map((language, index) => (
                    <View key={index} style={styles.skillRow}>
                      <Text style={styles.skillName}>{language.name}</Text>
                      <View style={styles.skillProgressContainer}>
                        <View 
                          style={[
                            styles.skillProgressBar, 
                            { width: `${(language.proficiency || 0) * 20}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Certifications */}
            {hasArrayData(data.certifications) && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                <View style={{ marginTop: 0 }}>
                  {data.certifications.map((cert, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                      <Text style={{ fontSize: 9, fontFamily: 'Helvetica', color: colors[2] || DEFAULT_THEME_THREE[2], marginRight: 8, marginTop: 4 }}>•</Text>
                      <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        {/* Left Column: Certification name and issuer */}
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#212121' }}>{cert.title}</Text>
                          {cert.issuer && (
                            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Oblique', color: '#666666', marginTop: 2 }}>{cert.issuer}</Text>
                          )}
                        </View>
                        {/* Right Column: Year in box */}
                        {cert.year && (
                          <View style={{ 
                            backgroundColor: colors[0] || DEFAULT_THEME_THREE[0], 
                            borderWidth: 1,
                            borderColor: colors[2] || DEFAULT_THEME_THREE[2],
                            borderRadius: 4,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            minWidth: 35,
                            alignItems: 'center'
                          }}>
                            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#000000' }}>{cert.year}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Soft Skills */}
            {softSkills.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Soft Skills</Text>
                <View style={{ marginLeft: 12, marginTop: 0 }}>
                  {softSkills.map((skill, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 9, fontFamily: 'Helvetica', color: colors[2] || DEFAULT_THEME_THREE[2], marginRight: 8 }}>•</Text>
                      <Text style={{ fontSize: 9, fontFamily: 'Helvetica', color: '#212121', flexShrink: 1 }}>{skill}</Text>
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
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <Text style={styles.summaryText}>{data.profileInfo.summary}</Text>
              </View>
            )}

            {/* Education */}
            {hasArrayData(data.education) && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={{ marginTop: 0 }}>
                  {data.education.map((edu, index) => (
                    <View key={`education_${index}`} style={{ marginBottom: 12 }}>
                      <Text style={styles.experienceCompany}>{edu.institution || "Your Institution"}</Text>
                      <Text style={styles.educationDegree}>{edu.degree || "Your Degree"}</Text>
                      <Text style={styles.experienceDuration}>{`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Work Experience */}
            {hasArrayData(data.workExperiences) && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Experience</Text>
                <View style={{ marginTop: 8 }}>
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
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                              <Text style={{ fontSize: 9, fontFamily: 'Helvetica', color: colors[2] || DEFAULT_THEME_THREE[2], marginRight: 8, marginTop: 4 }}>•</Text>
                              <Text style={{ fontSize: 9, fontFamily: 'Helvetica', color: '#212121', flexShrink: 1 }}>{point.trim()}{point.endsWith('.') ? '' : '.'}</Text>
                            </View>
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
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Projects</Text>
                <View style={{ marginTop: 8 }}>
                  {data.projects.map((project, index) => (
                    <View key={`project_${index}`} style={styles.projectItem}>
                      <Text style={styles.projectTitle}>{project.title || "Project Title"}</Text>
                      <Text style={styles.projectDescription}>{project.description || "Project Description"}</Text>
                      {(project.github || project.LiveDemo) && (
                        <View style={styles.projectLinksContainer}>
                          {project.github && (
                            <View style={styles.projectLinkItem}>
                              <View style={styles.projectLinkIconContainer}>
                                {getSvgIcon('Github', colors[2], 12)}
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
                                {getSvgIcon('ExternalLink', colors[2], 12)}
                              </View>
                              <Text style={styles.projectLinkLabel}>Live Demo:</Text>
                              <PdfLink src={project.LiveDemo} style={styles.projectLinkText}>
                                {cleanUrlForDisplay(project.LiveDemo)}
                              </PdfLink>
                            </View>
                          )}
                        </View>
                      )}
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
