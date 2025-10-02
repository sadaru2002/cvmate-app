"use client"

import React from "react";

interface CertificationInfoProps {
    title?: string;
    issuer?: string;
    year?: string;
    bgColor?: string;
}

const CertificationInfo: React.FC<CertificationInfoProps> = ({ title, issuer, year, bgColor }) => {
    if (!title && !issuer && !year) return null; // Don't render if all values are empty
    return (
        <div className="">
            <h3 
                className="font-semibold text-gray-800" 
                style={{ 
                    fontSize: '7.5pt', // Exact match to PDF (10pt in PDF = 7.5pt in web)
                    color: '#1F2937'
                }}
            >
                {title}
            </h3>
            <div className="flex items-center" style={{ gap: '1.5pt' }}>
                {year && (
                    <div
                        className="font-bold text-gray-800 inline-block rounded-lg"
                        style={{ 
                            fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                            backgroundColor: bgColor,
                            paddingLeft: '2.25pt', // Exact match to PDF (3pt in PDF = 2.25pt in web)
                            paddingRight: '2.25pt',
                            paddingTop: '0.375pt',
                            paddingBottom: '0.375pt',
                            marginTop: '1.5pt'
                        }}
                    >
                        {year}
                    </div>
                )}
                <p 
                    className="text-gray-700 font-medium" 
                    style={{ 
                        fontSize: '6.75pt', // Exact match to PDF
                        marginTop: '0.75pt'
                    }}
                >
                    {issuer}
                </p>
            </div>
        </div>
    );
}

export default CertificationInfo;