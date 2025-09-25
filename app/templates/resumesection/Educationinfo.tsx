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
        <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-800">{degree}</h3> {/* Reduced font size */}
            <p className="text-[11px] font-medium" style={{ color: institutionColor || "inherit" }}>{institution}</p> {/* Apply institutionColor here */}
            <p className="text-[11px] text-gray-500 font-medium italic mt-0.5"> {/* Reduced font size */}
                {duration}
            </p>
        </div>
    );
};

export default EducationInfo;