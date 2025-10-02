"use client"

import React from "react";

interface EducationInfoProps {
    degree?: string;
    institution?: string;
    duration?: string;
    institutionColor?: string; // New prop for institution name color
}

const EducationInfo: React.FC<EducationInfoProps> = ({ degree, institution, duration, institutionColor }) => {
    if (!degree && !institution && !duration) return null; // Don't render if all values are empty
    return (
        <div style={{ marginBottom: '7.5pt' }}> {/* Exact match to PDF (10pt in PDF = 7.5pt in web) */}
            <h3 
                className="text-gray-800" 
                style={{ 
                    fontSize: '7.5pt', // Exact match to PDF (10pt in PDF = 7.5pt in web)
                    fontWeight: 'normal',
                    color: '#212121',
                    textAlign: 'left'
                }}
            >
                {degree}
            </h3>
            <p 
                className="font-medium" 
                style={{ 
                    fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                    color: institutionColor || '#4a5568',
                    textAlign: 'left'
                }}
            >
                {institution}
            </p>
            <p 
                className="text-gray-500 font-medium italic" 
                style={{ 
                    fontSize: '6pt', // Exact match to PDF (8pt in PDF = 6pt in web)
                    marginTop: '0.75pt',
                    fontStyle: 'italic'
                }}
            >
                {duration}
            </p>
        </div>
    );
};

export default EducationInfo;