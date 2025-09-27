import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';
import { getSvgIcon } from '../utils/getSvgIcon'; // Import the SVG icon helper

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
    paddingVertical: 24, // py-6
    paddingHorizontal: 16, // px-4
    marginRight: 0, // No margin-right, gap handled by parent flex
  },
  rightColumn: {
    width: '65%',
    paddingVertical: 24, // py-6
    paddingHorizontal: 16, // px-4
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 12, // mt-3
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    objectFit: 'cover',
  },
  profileIconFallback: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#CCCCCC', // Light gray fallback
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 32,
    color: colors[4] || DEFAULT_THEME[4],
  },
  fullName: {
    fontSize: 18, // text-lg
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // text-gray-800
    textAlign: 'center',
    marginBottom: 4,
  },
  designation: {
    fontSize: 10, // text-xs
    color: '#4a5568', // text-gray-700
    textAlign: 'center',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 12, // text-base
    fontFamily: 'Helvetica-Bold',
    color: colors[4] || DEFAULT_THEME[4],
    marginBottom: 12, // mb-3
    paddingBottom: 4, // pb-1
    borderBottomWidth: 1,
    borderBottomColor: colors[4] || DEFAULT_THEME[4],
  },
  contactSection: {
    marginTop: 20, // my-6
    paddingHorizontal: 8, // px-2
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // items-start
    marginBottom: 8, // mb-2
    fontSize: 10, // text-xs
  },
  contactIcon: {
    width: 12, // w-3
    height: 12, // h-3
    marginRight: 8, // gap-2
    color: '#6b7280', // text-gray-600
    marginTop: 2, // mt-0.5
  },
  contactText: {
    color: '#4a5568', // text-gray-700
    lineHeight: 1.2, // leading-tight
    flexShrink: 1,
  },
  contactLink: {
    color: '#3b82f6', // text-blue-600
    textDecoration: 'underline',
    flexShrink: 1,
  },
  section: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 10, // text-xs
    lineHeight: 1.5,
    color: '#4a5568', // text-gray-800
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 20, // mb-5
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4, // mb-1
  },
  experienceRole: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // text-gray-800
  },
  experienceCompany: {
    fontSize: 10, // text-sm
    color: '#4a5568', // text-gray-700
    fontFamily: 'Helvetica-Bold',
  },
  experienceDuration: {
    fontSize: 9, // text-[11px]
    color: colors[4] || DEFAULT_THEME[4],
    fontFamily: 'Helvetica-BoldOblique', // font-bold italic
  },
  descriptionList: {
    marginTop: 8, // mt-[0.2cm]
    marginLeft: 16, // ml-4
  },
  descriptionListItem: {
    fontSize: 9, // text-xs
    lineHeight: 1.4,
    color: '#4b5563', // text-gray-600
    fontFamily: 'Helvetica-Oblique', // font-medium italic
    marginBottom: 2,
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
    marginBottom: 20, // mb-5
  },
  educationDegree: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // text-gray-800
  },
  educationInstitution: {
    fontSize: 10, // text-[11px]
    color: '#4a5568', // text-gray-700
    fontFamily: 'Helvetica-Bold',
  },
  educationDates: {
    fontSize: 9, // text-[11px]
    color: '#666666', // text-gray-500
    fontFamily: 'Helvetica-Oblique', // font-medium italic
    marginTop: 2, // mt-0.5
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
    backgroundColor: colors[2] || DEFAULT_THEME[2],
  },
  projectLinkIcon: {
    width: 12, // w-3
    height: 12, // h-3
    color: colors[4] || DEFAULT_THEME[4],
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
    color: '#3b82f6', // text-blue-600
    textDecoration: 'underline',
    flexShrink: 1,
  },
  certificationItem: {
    marginBottom: 12, // mb-5
  },
  certificationTitle: {
    fontSize: 12, // text-sm
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // text-gray-800
  },
  certificationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // mt-1
  },
  certificationYearBadge: {
    fontSize: 9, // text-xs
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // text-gray-800
    paddingVertical: 2, // py-0.5
    paddingHorizontal: 12, // px-3
    borderRadius: 8, // rounded-lg
    backgroundColor: colors[2] || DEFAULT_THEME[2],
    marginRight: 8, // gap-2
  },
  certificationIssuer: {
    fontSize: 9, // text-[11px]
    color: '#4a5568', // text-gray-700
    fontFamily: 'Helvetica-Bold', // font-medium
    marginTop: 4, // mt-1
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#212121', // text-gray-800
  },
  proficiencyDots: {
    flexDirection: 'row',
    gap: 2, // gap-0.5
  },
  proficiencyDot: {
    width: 6, // w-1.5
    height: 6, // h-1.5
    borderRadius: 3, // rounded-full
    backgroundColor: colors[2] || DEFAULT_THEME[2],
  },
  proficiencyDotActive: {
    backgroundColor: colors[3] || DEFAULT_THEME[3],
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // gap-2
    marginTop: 8, // mt-2
  },
  interestItem: {
    fontSize: 9, // text-[10px]
    fontFamily: 'Helvetica-Bold', // font-medium
    paddingVertical: 4, // py-1
    paddingHorizontal: 12, // px-3
    borderRadius: 8, // rounded-lg
    color: '#212121', // text-gray-800
    backgroundColor: colors[2] || DEFAULT_THEME[2],
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
              <View style={styles.profileImageContainer}>
                {data.profileInfo.profilePictureUrl ? (
                  <PdfImage src={data.profileInfo.profilePictureUrl} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileIconFallback}>
                    {getSvgIcon('User', styles.profileIconFallback.color as string, 32)}
                  </View>
                )}
              </View>
              <Text style={styles.fullName}>
                {data.profileInfo.fullName || "YOUR NAME HERE"}
              </Text>
              <Text style={styles.designation}>
                {data.profileInfo.designation || "Your Designation"}
              </Text>
            </View>

            {/* Contact Information */}
            {hasContactInfo && (
              <View style={styles.contactSection}>
                <Text style={styles.sectionTitle}>CONTACT</Text>
                {data.contactInfo.location && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('MapPin', '#6b7280', 12)}
                    <Text style={styles.contactText}>{data.contactInfo.location}</Text>
                  </View>
                )}
                {data.contactInfo.email && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Mail', '#6b7280', 12)}
                    <Text style={styles.contactText}>{data.contactInfo.email}</Text>
                  </View>
                )}
                {data.contactInfo.phone && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Phone', '#6b7280', 12)}
                    <Text style={styles.contactText}>{data.contactInfo.phone}</Text>
                  </View>
                )}
                {data.contactInfo.linkedin && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Linkedin', '#6b7280', 12)}
                    <PdfLink src={data.contactInfo.linkedin} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.linkedin)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.github && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Github', '#6b7280', 12)}
                    <PdfLink src={data.contactInfo.github} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.github)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.website && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Globe', '#6b7280', 12)}
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
                    <View style={styles.projectLinksContainer}>
                      {project.github && (
                        <View style={styles.projectLinkItem}>
                          <Text style={styles.projectLinkLabel}>GitHub:</Text>
                          <PdfLink src={project.github} style={styles.projectLinkText}>
                            {cleanUrlForDisplay(project.github)}
                          </PdfLink>
                        </View>
                      )}
                      {project.LiveDemo && (
                        <View style={styles.projectLinkItem}>
                          <Text style={styles.projectLinkLabel}>Demo:</Text>
                          <PdfLink src={project.LiveDemo} style={styles.projectLinkText}>
                            {cleanUrlForDisplay(project.LiveDemo)}
                          </PdfLink>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
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

            {/* Certifications */}
            {hasArrayData(data.certifications) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                {data.certifications.map((cert, index) => (
                  <View key={index} style={styles.certificationItem}>
                    <Text style={styles.certificationTitle}>
                      {cert.title || "Certification Title"}
                    </Text>
                    <View style={styles.certificationDetails}>
                      {cert.year && (
                        <Text style={styles.certificationYearBadge}>
                          {cert.year}
                        </Text>
                      )}
                      <Text style={styles.certificationIssuer}>
                        {cert.issuer || "Issuer"}
                      </Text>
                    </View>
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
                      <Text key={index} style={styles.interestItem}>
                        {interest.name}
                      </Text>
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

export default PdfTemplateOne;