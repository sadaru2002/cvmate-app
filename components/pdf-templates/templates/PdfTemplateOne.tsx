import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink, Font } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';
import { getSvgIcon } from '../utils/getSvgIcon'; // Import the SVG icon helper

// Default theme for TemplateOne
const DEFAULT_THEME = ["#EBFDFF", "#A1FAFD", "#ACEAFE", "#008899", "#4A5568"];

// Text truncation helper for contact information
const truncateText = (text: string, maxLength: number = 25): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

const createStyles = (colors: string[]) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: '10mm', // Reduced from 15mm to 10mm (5mm reduction on each side)
    fontFamily: 'Helvetica',
    fontSize: 10, // Base font size
    color: '#333333',
  },
  container: {
    flexDirection: 'row',
    minHeight: '100%',
  },
  leftColumn: {
    width: '35%', // Exact 35% as specified
    backgroundColor: colors[0] || DEFAULT_THEME[0], // #EBFDFF - sidebar background
    paddingVertical: 15, // Reduced from 18pt for more compact layout
    paddingHorizontal: 12, // Reduced from 15pt for wider content area
    flexDirection: 'column',
  },
  rightColumn: {
    width: '65%', // Exact 65% as specified  
    backgroundColor: '#FFFFFF', // Pure white background
    paddingVertical: 15, // Reduced from 18pt for more compact layout
    paddingHorizontal: 12, // Reduced from 15pt for wider content area
    flexDirection: 'column',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 10, // Reduced from 16 for more compact layout
  },
  profileImageContainer: {
    width: 80, // 80pt for perfect circular image
    height: 80, // 80pt for perfect circular image  
    borderRadius: 40, // 40pt for perfect circle
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 8, // Reduced from 12pt for more compact layout
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80, // Adjusted to match container for perfect circle
    height: 80, // Adjusted to match container for perfect circle
    borderRadius: 40, // rounded-full
    objectFit: 'cover',
  },
  profileIconFallback: {
    width: 80, // Adjusted to match container for perfect circle
    height: 80, // Adjusted to match container for perfect circle
    borderRadius: 40, // rounded-full
    backgroundColor: '#CCCCCC', // Light gray fallback
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 32, // text-5xl (approx 32pt)
    color: colors[4] || DEFAULT_THEME[4], // themeColors[4]
  },
  fullName: {
    fontSize: 13.5, // text-lg = 18px = 13.5pt (exactly matching HTML)
    fontFamily: 'Helvetica',
    fontWeight: 700, // font-bold as in HTML
    color: '#1F2937', // text-gray-800 as in HTML
    textAlign: 'center',
    marginBottom: 4, // Small spacing after name
    marginTop: 9, // mt-3 from HTML
  },
  designation: {
    fontSize: 9, // text-xs = 12px = 9pt (exactly matching HTML)
    fontFamily: 'Helvetica',
    fontWeight: 400, // Regular weight as in HTML
    color: '#374151', // text-gray-700 as in HTML
    textAlign: 'center',
    marginBottom: 8, // Reduced from 12 for more compact spacing
  },
  sectionTitle: {
    fontSize: 12, // Increased from 10.5 for better visibility
    fontFamily: 'Helvetica',
    fontWeight: 'bold', // Enhanced from 600 to bold
    color: '#1F2937', // text-gray-800 as in HTML
    marginBottom: 9, // mb-3 from HTML = 12px = 9pt
    paddingBottom: 3, // pb-1 from HTML = 4px = 3pt
    borderBottomWidth: 1, // border-b from HTML
    borderBottomColor: '#D1D5DB', // border-gray-300 as in HTML
    marginTop: 0,
    textAlign: 'left',
  },
  contactSection: {
    marginTop: 6, // Further reduced from 10 for tighter section spacing
    paddingHorizontal: 0,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to allow proper text wrapping
    marginBottom: 6, // Reduced from 8pt for more compact layout
    gap: 6, // 6pt gap between icon and text
    maxWidth: '100%', // Prevent overflow beyond container
  },
  contactIcon: {
    width: 9, // w-3 h-3 = 12px = 9pt (exactly matching HTML)
    height: 9, // w-3 h-3 = 12px = 9pt (exactly matching HTML)
    marginTop: 1, // Small vertical alignment adjustment
    color: '#4B5563', // text-gray-600 as in HTML
    flexShrink: 0,
  },
  contactText: {
    fontFamily: 'Helvetica',
    fontSize: 9, // text-xs = 12px = 9pt (exactly matching HTML)
    color: '#374151', // text-gray-700 as in HTML
    lineHeight: 1.3,
    flexShrink: 1,
    flexWrap: 'wrap', // Allow text to wrap to next line
    flex: 1, // Take available space for proper wrapping
  },
  contactLink: {
    fontFamily: 'Helvetica',
    fontSize: 9, // text-xs = 12px = 9pt (exactly matching HTML)
    color: '#2563EB', // text-blue-600 as in HTML
    textDecoration: 'underline',
    flexShrink: 1,
    lineHeight: 1.3,
    flexWrap: 'wrap', // Allow text to wrap to next line
    flex: 1, // Take available space for proper wrapping
  },
  section: {
    marginBottom: 6, // Further reduced from 10 for tighter section spacing
    paddingHorizontal: 0,
  },
  summaryText: {
    fontSize: 9, // text-xs = 12px = 9pt (exactly matching HTML)
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
    fontWeight: 500, // font-medium as in HTML
    color: '#1F2937', // text-gray-800 as in HTML
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 10, // Reduced from 16 for more compact layout
    paddingLeft: 0, // Consistent left alignment
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  experienceRole: {
    fontSize: 10, // 14px -> 10.5pt, adjusted to 10pt
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Changed from bold to normal to match preview
    color: '#212121',
    textAlign: 'left', // Consistent text alignment
  },
  experienceCompany: {
    fontSize: 9, // 12px -> 9pt
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Changed from bold to normal to match preview
    color: '#4a5568',
    textAlign: 'left', // Consistent text alignment
  },
  experienceDuration: {
    fontSize: 8, // 10px -> 7.5pt, adjusted to 8pt
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Regular weight
    fontStyle: 'italic',
    color: colors[4] || DEFAULT_THEME[4],
    textAlign: 'right', // Consistent right alignment for dates
  },
  descriptionList: {
    marginTop: 6, // 8px -> 6pt
    marginLeft: 0, // Align with parent content
    paddingLeft: 12, // Use padding for bullet indent
  },
  descriptionListItem: {
    fontSize: 9, // text-xs (12px) adjusted to 9pt
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
    fontStyle: 'italic', // font-medium italic
    color: '#4b5563', // text-gray-600
    marginBottom: 2,
  },
  skillContainer: {
    flexDirection: 'row', // Changed to row for two-column layout
    flexWrap: 'wrap', // Allow wrapping to create columns
    gap: 0,
    alignItems: 'flex-start',
    justifyContent: 'space-between', // Distribute items across columns
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6, // 6pt spacing between skill items
    paddingLeft: 0,
    width: '48%', // Each item takes ~48% width for two-column layout
  },
  skillName: {
    fontSize: 9, // Reduced to match preview visual size
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Regular weight to match preview
    color: '#374151', // Dark gray as specified
    textAlign: 'left',
  },
  skillProficiencyDots: {
    flexDirection: 'row',
    gap: 2, // Reduced from 3pt to 2pt gap between dots
    alignItems: 'center',
  },
  educationItem: {
    marginBottom: 10, // Reduced from 16 for more compact layout
    paddingLeft: 0, // Consistent left alignment
  },
  educationDegree: {
    fontSize: 10, // 14px -> 10.5pt, adjusted to 10pt
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Changed from bold to normal to match preview
    color: '#212121',
    textAlign: 'left', // Consistent text alignment
    marginBottom: 2, // Add spacing between degree and institution
  },
  educationInstitution: {
    fontSize: 9, // 12px -> 9pt
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Changed from bold to normal to match preview
    color: '#4a5568',
    textAlign: 'left', // Consistent text alignment
    marginBottom: 2, // Add spacing between institution and dates
  },
  educationDates: {
    fontSize: 8, // 10px -> 7.5pt, adjusted to 8pt
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Regular weight
    color: '#9CA3AF', // Medium gray as specified
    marginTop: 2, // 2pt margin top as specified
    textAlign: 'left',
  },
  projectItem: {
    marginBottom: 8, // Reduced from 12 for more compact layout
    paddingLeft: 0, // Consistent left alignment
  },
  projectTitle: {
    fontSize: 10, // 14px -> 10.5pt, adjusted to 10pt
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Changed from bold to normal to match preview
    color: '#212121',
    textAlign: 'left', // Consistent text alignment
    marginBottom: 4, // Add spacing after title
  },
  projectDescription: {
    fontSize: 9, // 12px -> 9pt
    lineHeight: 1.3, // Reduced from 1.4 to tighten line spacing
    fontFamily: 'Helvetica',
    color: '#4a5568',
    marginBottom: 4, // Reduced from 6 to 4 for tighter spacing
    textAlign: 'left', // Consistent text alignment
  },
  projectLinksContainer: {
    flexDirection: 'column',
    gap: 2, // Reduced gap for tighter spacing
    marginTop: 4, // Reduced top margin
    paddingLeft: 0,
  },
  projectLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // 4pt gap between icon and text as specified
    marginBottom: 4, // 4pt bottom margin as specified
  },
  projectLinkIconContainer: {
    width: 10, // 10pt icon container
    height: 10, // 10pt icon container
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectLinkIcon: {
    width: 10, // 10pt x 10pt icon as specified
    height: 10, // 10pt x 10pt icon as specified
    color: colors[3] || DEFAULT_THEME[3], // Primary color for icons
  },
  projectLinkLabel: {
    fontSize: 9, // 9pt font size as specified
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Regular weight
    color: '#374151', // Dark gray
    flexShrink: 0,
  },
  projectLinkText: {
    fontSize: 9, // 9pt font size as specified
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Regular weight
    color: colors[3] || DEFAULT_THEME[3], // Primary color for links
    textDecoration: 'underline', // Add underline if preview has it
    flexShrink: 1,
  },
  certificationGrid: { // New style for certifications grid
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // 12pt gap between cards
    marginTop: 10, // Adjusted from 16
  },
  certificationGridItem: { // New style for individual certification card
    width: '48%', // Approx 50% width for two columns, adjusted for gap
    backgroundColor: colors[0] || DEFAULT_THEME[0], // Light background from palette
    padding: 8, // 8pt padding
    borderRadius: 4, // 4pt border radius
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  certificationItem: {
    marginBottom: 0, // No extra margin here, handled by grid gap
    paddingLeft: 0, // Consistent left alignment
  },
  certificationTitle: {
    fontSize: 10, // 14px -> 10.5pt, adjusted to 10pt
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'left', // Consistent text alignment
    marginBottom: 4, // Add spacing after title
  },
  certificationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0, // Remove top margin for consistent spacing
  },
  certificationYearBadge: {
    fontSize: 8, // text-xs (12px) adjusted to 8pt
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#212121', // text-gray-800
    paddingVertical: 2, // py-0.5 (2px)
    paddingHorizontal: 8, // px-3 (12px) adjusted to 8pt
    borderRadius: 6, // rounded-lg (8px) adjusted to 6pt
    backgroundColor: colors[2] || DEFAULT_THEME[2], // themeColors[2]
    marginRight: 6, // gap-2 (8px) adjusted to 6pt
  },
  certificationIssuer: {
    fontSize: 8, // 11px -> 8pt
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#4a5568',
    marginTop: 0, // Remove top margin for consistent alignment
    textAlign: 'left', // Consistent text alignment
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6, // Reduced to match skills section
    paddingLeft: 0,
  },
  languageName: {
    fontSize: 9, // 12px -> 9pt
    fontFamily: 'Helvetica',
    fontWeight: 400, // Changed from bold to normal to match HTML
    color: '#212121',
    textAlign: 'left', // Consistent text alignment
  },
  proficiencyDots: {
    flexDirection: 'row',
    gap: 2, // Reduced from 3pt to 2pt gap between dots
    alignItems: 'center',
  },
  proficiencyDot: {
    width: 5, // Reduced from 8pt to 5pt
    height: 5, // Reduced from 8pt to 5pt
    borderRadius: 2.5, // Perfect circle
    backgroundColor: '#E5E7EB', // Light gray for inactive dots
  },
  proficiencyDotActive: {
    backgroundColor: colors[3] || DEFAULT_THEME[3], // Use primary color from palette
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6, // 6pt gap between tags as specified
    marginTop: 6,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  interestItem: {
    fontSize: 8, // 8pt font size as specified
    fontFamily: 'Helvetica',
    fontWeight: 'normal', // Regular weight
    paddingVertical: 3, // 3pt vertical padding
    paddingHorizontal: 4, // 4pt horizontal padding  
    borderRadius: 3, // 3pt border radius as specified
    color: '#4B5563', // Dark gray text as specified
    backgroundColor: colors[0] || DEFAULT_THEME[0], // Use palette background color
    textAlign: 'center',
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
    if (!dateString) return "PRESENT";
    return dateString.toUpperCase(); // Transform to uppercase as specified
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
                    <Text>JD</Text> {/* Fallback text */}
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
                <Text style={styles.sectionTitle}>Contact</Text>
                {data.contactInfo.location && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('MapPin', styles.contactIcon.color as string, styles.contactIcon.width as number)}
                    <Text style={styles.contactText}>{data.contactInfo.location}</Text>
                  </View>
                )}
                {data.contactInfo.email && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Mail', styles.contactIcon.color as string, styles.contactIcon.width as number)}
                    <Text style={styles.contactText}>{data.contactInfo.email}</Text>
                  </View>
                )}
                {data.contactInfo.phone && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Phone', styles.contactIcon.color as string, styles.contactIcon.width as number)}
                    <Text style={styles.contactText}>{data.contactInfo.phone}</Text>
                  </View>
                )}
                {data.contactInfo.linkedin && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Linkedin', styles.contactIcon.color as string, styles.contactIcon.width as number)}
                    <PdfLink src={data.contactInfo.linkedin} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.linkedin)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.github && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Github', styles.contactIcon.color as string, styles.contactIcon.width as number)}
                    <PdfLink src={data.contactInfo.github} style={styles.contactLink}>
                      {cleanUrlForDisplay(data.contactInfo.github)}
                    </PdfLink>
                  </View>
                )}
                {data.contactInfo.website && (
                  <View style={styles.contactItem}>
                    {getSvgIcon('Globe', styles.contactIcon.color as string, styles.contactIcon.width as number)}
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
                <Text style={styles.sectionTitle}>Languages</Text>
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
                      <View style={{ flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                        <Text style={styles.experienceRole}>
                          {exp.role || "Role Title"}
                        </Text>
                        <Text style={styles.experienceCompany}>
                          {exp.company || "Company Name"}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.experienceDuration}>
                          {formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}
                        </Text>
                      </View>
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
                          <View style={styles.projectLinkIconContainer}>
                            {getSvgIcon('Github', styles.projectLinkIcon.color as string, styles.projectLinkIcon.width as number)}
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
                            {getSvgIcon('ExternalLink', styles.projectLinkIcon.color as string, styles.projectLinkIcon.width as number)}
                          </View>
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
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillContainer}>
                  {data.skills.map((skill, index) => 
                    skill.name && (
                      <View key={index} style={styles.skillItem}>
                        <Text style={styles.skillName}>{skill.name}</Text>
                        <View style={styles.skillProficiencyDots}>
                          {getProficiencyDots(skill.proficiency)}
                        </View>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}

            {/* Certifications */}
            {hasArrayData(data.certifications) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                <View style={styles.certificationGrid}> {/* Apply the new grid style */}
                  {data.certifications.map((cert, index) => (
                    <View key={index} style={styles.certificationGridItem}> {/* Apply grid item style */}
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
              </View>
            )}

            {/* Interests */}
            {hasArrayData(data.interests) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
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
