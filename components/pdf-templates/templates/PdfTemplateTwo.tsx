import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link as PdfLink } from '@react-pdf/renderer';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import { cleanUrlForDisplay } from '@/lib/utils';
import { getSvgIcon } from '../utils/getSvgIcon';

const DEFAULT_THEME_TWO = ["#f8f9fa", "#e9ecef", "#dee2e6", "#007bff", "#343a40"];

const createStyles = (colors: string[]) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica', // Changed to Roboto
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
  },
  
  mainContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  
  leftColumn: {
    width: '65%',
    flexDirection: 'column',
  },
  
  rightColumn: {
    width: '35%',
    flexDirection: 'column',
    paddingLeft: 15,
    borderLeftWidth: 0,
  },

  // Name and Designation
  nameSection: {
    marginBottom: 12,
  },
  fullName: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold', // Changed to Roboto-Bold
    color: '#1a1a1a',
    marginBottom: 4, // Reduced from 18 to 4
    letterSpacing: 0.5,
  },
  designation: {
    fontSize: 13,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: colors[3] || DEFAULT_THEME_TWO[3],
    marginBottom: 4, // Reduced from 8 to 4 to bring it closer to contact info
  },

  // Contact Grid - 2 columns matching the image exactly
  contactSection: {
    marginBottom: 10, // Reduced from 14
  },
  contactGrid: {
    flexDirection: 'column',
    gap: 3, // Reduced from 5
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10, // Reduced from 20
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
    fontFamily: 'Helvetica', // Changed to Roboto
    width: '48%',
    gap: 4, // Reduced from 6
  },
  contactIcon: {
    width: 10,
    height: 10,
    marginRight: 2,
  },
  contactText: {
    fontSize: 9,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: '#374151',
    flex: 1,
  },
  contactLink: {
    fontSize: 9,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: colors[3] || DEFAULT_THEME_TWO[3],
    textDecoration: 'none',
    flex: 1,
  },

  // Section Titles (Left Column)
  section: {
    marginBottom: 10, // Reduced from 14
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'bold', // Changed from Helvetica-Bold to standard bold
    color: '#1a1a1a',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1a1a1a',
  },

  // Summary
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: '#374151',
    textAlign: 'justify',
  },

  // Experience
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  experienceLeft: {
    flex: 1,
  },
  companyName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold', // Changed to Roboto-Bold
    color: colors[3] || DEFAULT_THEME_TWO[3],
    marginBottom: 2,
  },
  roleName: {
    fontSize: 9,
    fontFamily: 'Helvetica', // Changed to Roboto (no specific italic variant registered)
    color: '#374151',
  },
  duration: {
    fontSize: 8,
    fontFamily: 'Helvetica', // Changed to Roboto (no specific italic variant registered)
    color: '#6B7280',
    textAlign: 'right',
    paddingLeft: 10,
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 15,
  },
  bulletItem: {
    fontSize: 9,
    lineHeight: 1.5,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: '#374151',
    marginBottom: 3,
  },

  // Education
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold', // Changed to Roboto-Bold
    color: '#1a1a1a',
    marginBottom: 2,
  },
  institution: {
    fontSize: 9,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: colors[3] || DEFAULT_THEME_TWO[3],
    marginBottom: 2,
  },
  educationDuration: {
    fontSize: 8,
    fontFamily: 'Helvetica', // Changed to Roboto (no specific italic variant registered)
    color: '#6B7280',
  },

  // Projects
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold', // Changed to Roboto-Bold
    color: '#1a1a1a',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: '#374151',
    marginBottom: 4,
  },
  projectLinks: {
    flexDirection: 'column',
    gap: 3,
  },
  projectLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  projectLinkIcon: {
    width: 9,
    height: 9,
    color: colors[3] || DEFAULT_THEME_TWO[3], // Icon color
  },
  projectLinkLabel: { // New style for the label
    fontSize: 9,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: '#374151', // Dark gray text
    marginRight: 2, // Small space after label
  },
  projectLink: {
    fontSize: 8,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: colors[3] || DEFAULT_THEME_TWO[3],
    textDecoration: 'none',
    flex: 1,
  },

  // Right Column Styles
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profilePicture: {
    width: 100,
    height: 100,
    objectFit: 'cover',
  },
  profilePlaceholder: {
    color: colors[3] || DEFAULT_THEME_TWO[3],
    fontSize: 40,
  },

  // Right Column Sections
  sectionRight: {
    marginBottom: 10, // Reduced from 14
  },
  sectionTitleRight: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold', // Changed to Roboto-Bold
    color: '#1a1a1a',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1a1a1a',
  },

  // Skills & Languages Row
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillName: {
    fontSize: 9,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: '#374151',
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Certifications
  certItem: {
    marginBottom: 8,
  },
  certTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold', // Changed to Roboto-Bold
    color: '#1a1a1a',
    marginBottom: 2,
  },
  certDetails: {
    fontSize: 8,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: '#6B7280',
  },

  // Passions/Interests
  passionContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  passionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  passionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors[3] || DEFAULT_THEME_TWO[3],
  },
  passionText: {
    fontSize: 9,
    fontFamily: 'Helvetica', // Changed to Roboto
    color: '#374151',
  },
});

interface PdfTemplateTwoProps {
  data: ResumeFormData;
  colorPalette?: string[];
}

const PdfTemplateTwo: React.FC<PdfTemplateTwoProps> = ({ data, colorPalette }) => {
  const colors = colorPalette && colorPalette.length >= 5 ? colorPalette : DEFAULT_THEME_TWO;
  const styles = createStyles(colors);

  const formatYearMonth = (dateString?: string) => {
    if (!dateString) return "Present";
    return dateString;
  };

  const sanitizeText = (text: any): string => {
    if (text === null || text === undefined) return '';
    return String(text).replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
  };

  const renderDots = (level: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <View 
        key={i} 
        style={[
          styles.dot,
          { 
            backgroundColor: i < level 
              ? (colors[3] || DEFAULT_THEME_TWO[3]) 
              : (colors[2] || DEFAULT_THEME_TWO[2]) 
          }
        ]} 
      />
    ));
  };

  const hasArrayData = (arr?: any[]) => {
    if (!arr || arr.length === 0) return false;
    if (arr.some(item => item && typeof item === 'object' && 'name' in item)) {
      return arr.some(item => item.name && item.name.trim() !== '');
    }
    return arr.some(item => Object.values(item).some(val => 
      val !== undefined && val !== null && val !== '' && 
      (Array.isArray(val) ? val.length > 0 : true)
    ));
  };

  const hasContactInfo = (contactInfo: any) => 
    Object.values(contactInfo).some(val => val !== undefined && val !== null && val !== '');

  return (
    <Document hyphenationCallback={() => []}>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainContainer}>
          {/* LEFT COLUMN */}
          <View style={styles.leftColumn}>
            {/* Name & Designation */}
            <View style={styles.nameSection}>
              <Text style={styles.fullName}>
                {sanitizeText(data.profileInfo.fullName) || "Thilina Sandaruwan"}
              </Text>
              <Text style={styles.designation}>
                {sanitizeText(data.profileInfo.designation) || "Frontend Developer"}
              </Text>
            </View>

            {/* Contact Info - 2 Column Grid */}
            {hasContactInfo(data.contactInfo) && (
              <View style={styles.contactSection}>
                <View style={styles.contactGrid}>
                  {(() => {
                    const items = [];
                    
                    if (data.contactInfo.email) {
                      items.push({
                        icon: getSvgIcon('Mail', colors[3] || DEFAULT_THEME_TWO[3], 10),
                        text: sanitizeText(data.contactInfo.email),
                        type: 'text'
                      });
                    }
                    
                    if (data.contactInfo.location) {
                      items.push({
                        icon: getSvgIcon('MapPin', colors[3] || DEFAULT_THEME_TWO[3], 10),
                        text: sanitizeText(data.contactInfo.location),
                        type: 'text'
                      });
                    }
                    
                    if (data.contactInfo.phone) {
                      items.push({
                        icon: getSvgIcon('Phone', colors[3] || DEFAULT_THEME_TWO[3], 10),
                        text: sanitizeText(data.contactInfo.phone),
                        type: 'text'
                      });
                    }
                    
                    if (data.contactInfo.linkedin) {
                      items.push({
                        icon: getSvgIcon('Linkedin', colors[3] || DEFAULT_THEME_TWO[3], 10),
                        text: cleanUrlForDisplay(sanitizeText(data.contactInfo.linkedin)),
                        url: sanitizeText(data.contactInfo.linkedin),
                        type: 'link'
                      });
                    }
                    
                    if (data.contactInfo.github) {
                      items.push({
                        icon: getSvgIcon('Github', colors[3] || DEFAULT_THEME_TWO[3], 10),
                        text: cleanUrlForDisplay(sanitizeText(data.contactInfo.github)),
                        url: sanitizeText(data.contactInfo.github),
                        type: 'link'
                      });
                    }
                    
                    if (data.contactInfo.website) {
                      items.push({
                        icon: getSvgIcon('Globe', colors[3] || DEFAULT_THEME_TWO[3], 10),
                        text: cleanUrlForDisplay(sanitizeText(data.contactInfo.website)),
                        url: sanitizeText(data.contactInfo.website),
                        type: 'link'
                      });
                    }

                    // Render in 2-column grid
                    const rows = [];
                    for (let i = 0; i < items.length; i += 2) {
                      rows.push(
                        <View key={i} style={styles.contactRow}>
                          <View style={styles.contactItem}>
                            {items[i].icon}
                            {items[i].type === 'link' ? (
                              <PdfLink src={items[i].url} style={styles.contactLink}>
                                {items[i].text}
                              </PdfLink>
                            ) : (
                              <Text style={styles.contactText}>{items[i].text}</Text>
                            )}
                          </View>
                          {items[i + 1] && (
                            <View style={styles.contactItem}>
                              {items[i + 1].icon}
                              {items[i + 1].type === 'link' ? (
                                <PdfLink src={items[i + 1].url} style={styles.contactLink}>
                                  {items[i + 1].text}
                                </PdfLink>
                              ) : (
                                <Text style={styles.contactText}>{items[i + 1].text}</Text>
                              )}
                            </View>
                          )}
                        </View>
                      );
                    }
                    return rows;
                  })()}
                </View>
              </View>
            )}

            {/* Summary */}
            {data.profileInfo.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.summaryText}>{sanitizeText(data.profileInfo.summary)}</Text>
              </View>
            )}

            {/* Experience */}
            {hasArrayData(data.workExperiences) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.workExperiences.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <View style={styles.experienceLeft}>
                        <Text style={styles.companyName}>{sanitizeText(exp.company) || "Company Name"}</Text>
                        <Text style={styles.roleName}>{sanitizeText(exp.role) || "Your Role"}</Text>
                      </View>
                      <Text style={styles.duration}>
                        {formatYearMonth(sanitizeText(exp.startDate))} - {formatYearMonth(sanitizeText(exp.endDate))}
                      </Text>
                    </View>
                    {exp.description && (
                      <View style={styles.bulletList}>
                        {sanitizeText(exp.description).split(/[.!?]\s+/).filter(s => s.trim()).map((point, i) => (
                          <Text key={i} style={styles.bulletItem}>
                            • {point.trim()}{point.endsWith('.') ? '' : '.'}
                          </Text>
                        ))}
                      </View>
                    )}
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
                    <Text style={styles.degree}>{sanitizeText(edu.degree) || "Your Degree"}</Text>
                    <Text style={styles.institution}>{sanitizeText(edu.institution) || "Your Institution"}</Text>
                    <Text style={styles.educationDuration}>
                      {formatYearMonth(sanitizeText(edu.startDate))} - {formatYearMonth(sanitizeText(edu.endDate))}
                    </Text>
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
                    <Text style={styles.projectTitle}>{sanitizeText(project.title) || "Project Title"}</Text>
                    {project.description && (
                      <Text style={styles.projectDescription}>{sanitizeText(project.description)}</Text>
                    )}
                    {(project.github || project.LiveDemo) && (
                      <View style={styles.projectLinks}>
                        {project.github && (
                          <View style={styles.projectLinkItem}>
                            {getSvgIcon('Github', colors[3] || DEFAULT_THEME_TWO[3], 9)}
                            <Text style={styles.projectLinkLabel}>GitHub:</Text>
                            <PdfLink src={sanitizeText(project.github)} style={styles.projectLink}>
                              {cleanUrlForDisplay(sanitizeText(project.github))}
                            </PdfLink>
                          </View>
                        )}
                        {project.LiveDemo && (
                          <View style={styles.projectLinkItem}>
                            {getSvgIcon('ExternalLink', colors[3] || DEFAULT_THEME_TWO[3], 9)}
                            <Text style={styles.projectLinkLabel}>Live Demo:</Text>
                            <PdfLink src={sanitizeText(project.LiveDemo)} style={styles.projectLink}>
                              {cleanUrlForDisplay(sanitizeText(project.LiveDemo))}
                            </PdfLink>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightColumn}>
            {/* Profile Picture */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                {data.profileInfo.profilePictureUrl ? (
                  <PdfImage src={sanitizeText(data.profileInfo.profilePictureUrl)} style={styles.profilePicture} />
                ) : (
                  <Text style={styles.profilePlaceholder}>👤</Text>
                )}
              </View>
            </View>

            {/* Skills */}
            {hasArrayData(data.skills) && (
              <View style={styles.sectionRight}>
                <Text style={styles.sectionTitleRight}>Skills</Text>
                {data.skills.map((skill, index) => (
                  <View key={index} style={styles.skillRow}>
                    <Text style={styles.skillName}>{sanitizeText(skill.name)}</Text>
                    <View style={styles.dotsContainer}>
                      {renderDots(skill.proficiency)}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {hasArrayData(data.languages) && (
              <View style={styles.sectionRight}>
                <Text style={styles.sectionTitleRight}>Languages</Text>
                {data.languages.map((lang, index) => (
                  <View key={index} style={styles.skillRow}>
                    <Text style={styles.skillName}>{sanitizeText(lang.name)}</Text>
                    <View style={styles.dotsContainer}>
                      {renderDots(lang.proficiency)}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {hasArrayData(data.certifications) && (
              <View style={styles.sectionRight}>
                <Text style={styles.sectionTitleRight}>Certifications</Text>
                {data.certifications.map((cert, index) => (
                  <View key={index} style={styles.certItem}>
                    <Text style={styles.certTitle}>{sanitizeText(cert.title) || "Certification Title"}</Text>
                    <Text style={styles.certDetails}>
                      {sanitizeText(cert.year) || "Year"}    {sanitizeText(cert.issuer) || "Issuer"}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Passions */}
            {hasArrayData(data.interests?.filter(i => !i.name?.toLowerCase().includes("volunteer"))) && (
              <View style={styles.sectionRight}>
                <Text style={styles.sectionTitleRight}>Passions</Text>
                <View style={styles.passionContainer}>
                  {data.interests.filter(i => !i.name?.toLowerCase().includes("volunteer")).map((interest, index) => (
                    <View key={index} style={styles.passionItem}>
                      <View style={styles.passionBullet} />
                      <Text style={styles.passionText}>{sanitizeText(interest.name)}</Text>
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

export default PdfTemplateTwo;
