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
        <div className="mb-5">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800" style={{ color: companyColor || "inherit" }}> {/* Apply companyColor here */}
                        {company}
                    </h3>
                    <p className="text-sm text-gray-700 font-medium"> {/* Reduced font size */}
                        {role}
                    </p>
                </div>
                <p className="text-[11px] font-bold italic" style={{ color: durationColor }}> {/* Reduced font size */}
                    {duration}
                </p>
            </div>
            {descriptionPoints.length > 0 && (
                <ul className="list-disc space-y-0.5 mt-[0.2cm] ml-4"> {/* Added list-disc and ml-4 for indentation */}
                    {descriptionPoints.map((point, index) => (
                        <li key={index} className="text-xs text-gray-600 font-medium italic"> {/* Removed flexbox, let default list styling handle it */}
                            {point}{point.endsWith('.') ? '' : '.'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WorkExperience;