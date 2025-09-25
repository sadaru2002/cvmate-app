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
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3> {/* Reduced font size */}
            <div className="flex items-center gap-2">
                {year && (
                    <div
                        className="text-xs font-bold text-gray-800 px-3 py-0.5 inline-block mt-2 rounded-tg" // Reduced font size
                        style={{ backgroundColor: bgColor }}
                    >
                        {year}
                    </div>
                )}
                <p className="text-[11px] text-gray-700 font-medium mt-1">{issuer}</p> {/* Reduced font size */}
            </div>
        </div>
    );
}

export default CertificationInfo;