import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Safe styles without custom fonts that might cause issues
const fallbackStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica', // Use built-in fonts only
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'Helvetica',
  },
});

const PDFDocumentFallback = (props) => {
  return (
    <Document>
      <Page size="A4" style={fallbackStyles.page}>
        <View style={fallbackStyles.section}>
          <Text style={fallbackStyles.title}>
            {props.personalInfo?.name || 'Resume'}
          </Text>
          <Text style={fallbackStyles.text}>
            This is a simplified version of your resume due to technical constraints.
          </Text>
          {/* Add basic resume content using safe fonts */}
          {props.personalInfo && (
            <View>
              <Text style={fallbackStyles.text}>
                Email: {props.personalInfo.email}
              </Text>
              <Text style={fallbackStyles.text}>
                Phone: {props.personalInfo.phone}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocumentFallback;
