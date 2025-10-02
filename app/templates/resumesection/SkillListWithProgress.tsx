"use client"

import React from "react";
import Progress from "./Progress"; // Import the Progress component

interface SkillItem {
    name?: string;
    proficiency?: number; // 1-5 scale
}

interface SkillListWithProgressProps {
    skills: SkillItem[];
    textColor?: string;
    accentColor?: string; // New prop for dot accent color
    dotBgColor?: string; // New prop for dot background color
}

const SkillListWithProgress: React.FC<SkillListWithProgressProps> = ({ skills, textColor, accentColor, dotBgColor }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <div style={{ gap: '0.75pt' }}> {/* Exact match to PDF gap (1pt in PDF = 0.75pt in web) */}
            {skills.map((skill, index) => {
                if (!skill.name) return null;
                return (
                    <div key={index} className="flex items-center justify-between">
                        <p 
                            className="flex-1 truncate" 
                            style={{ 
                                fontSize: '7.5pt', // Exact match to PDF (10pt in PDF = 7.5pt in web)
                                color: textColor 
                            }}
                        >
                            {skill.name}
                        </p>
                        {skill.proficiency !== undefined && skill.proficiency > 0 && (
                            <Progress
                                progress={skill.proficiency}
                                total={5}
                                color={accentColor}
                                bgColor={dotBgColor}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SkillListWithProgress;