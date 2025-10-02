"use client"

import React from "react";

interface WorkExperienceProps {
    company?: string;
    role?: string;
    duration?: string;
    durationColor?: string;
    description?: string;
    companyColor?: string; // New prop for company name color
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ company, role, duration, durationColor, description, companyColor }) => {
    if (!company && !role && !duration && !description) return null; // Don't render if all values are empty

    const descriptionPoints = description ? description.split('. ').filter(Boolean).map(point => point.trim()) : [];

    return (
        <div style={{ marginBottom: '7.5pt' }}> {/* Exact match to PDF (10pt in PDF = 7.5pt in web) */}
            <div className="flex items-start justify-between" style={{ marginBottom: '3pt' }}>
                <div>
                    <h3 
                        className="text-gray-800" 
                        style={{ 
                            fontSize: '7.5pt', // Exact match to PDF (10pt in PDF = 7.5pt in web)
                            fontWeight: 'normal', // Changed from bold to normal to match PDF
                            color: '#212121',
                            textAlign: 'left'
                        }}
                    >
                        {role}
                    </h3>
                    <p 
                        className="text-gray-600" 
                        style={{ 
                            fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                            fontWeight: 'normal',
                            color: '#4a5568',
                            textAlign: 'left'
                        }}
                    >
                        {company}
                    </p>
                </div>
                <p 
                    className="font-normal italic" 
                    style={{ 
                        fontSize: '6pt', // Exact match to PDF (8pt in PDF = 6pt in web)
                        color: durationColor,
                        textAlign: 'right',
                        fontStyle: 'italic'
                    }}
                >
                    {duration}
                </p>
            </div>
            {descriptionPoints.length > 0 && (
                <ul 
                    className="list-disc space-y-0.5" 
                    style={{ 
                        marginTop: '4.5pt', // Exact match to PDF (6pt in PDF = 4.5pt in web)
                        marginLeft: 0,
                        paddingLeft: '9pt' // Exact match to PDF (12pt in PDF = 9pt in web)
                    }}
                >
                    {descriptionPoints.map((point, index) => (
                        <li 
                            key={index} 
                            className="text-gray-600 font-medium italic"
                            style={{ 
                                fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                                lineHeight: 1.4,
                                color: '#4b5563',
                                marginBottom: '1.5pt' // Exact match to PDF (2pt in PDF = 1.5pt in web)
                            }}
                        >
                            {point}{point.endsWith('.') ? '' : '.'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WorkExperience;