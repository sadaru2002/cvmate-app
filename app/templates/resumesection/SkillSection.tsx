"use client"

import React from "react";
import Progress from "./Progress";

interface SkillItem {
    name?: string;
    proficiency?: number; // 1-5 scale
}

interface SkillInfoProps {
    skill: string;
    proficiency: number; // 1-5 scale
    accentColor?: string;
    bgColor?: string;
}

const SkillInfo: React.FC<SkillInfoProps> = ({ skill, proficiency, accentColor, bgColor }) => {
    if (!skill) return null;
    return (
        <div className="flex items-center justify-between">
            <p 
                className="font-semibold text-gray-800" 
                style={{ 
                    fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                    color: '#1F2937'
                }}
            >
                {skill}
            </p>
            {proficiency !== undefined && proficiency > 0 && (
                <Progress
                    progress={proficiency} // Proficiency is already 1-5
                    total={5}
                    color={accentColor}
                    bgColor={bgColor}
                />
            )}
        </div>
    );
};

interface SkillsSectionProps {
    skills: SkillItem[];
    accentColor?: string;
    bgColor?: string;
}

const SkillSection: React.FC<SkillsSectionProps> = ({ skills, accentColor, bgColor }) => {
    if (!skills || skills.length === 0) return null;
    return (
        <div 
            className="grid gap-y-1" 
            style={{ 
                gridTemplateColumns: 'repeat(2, 1fr)', // Two column layout to match PDF
                columnGap: '3.75pt', // Exact match to PDF (5pt in PDF = 3.75pt in web)
                marginBottom: '2.25pt'
            }}
        >
            {skills.map((skill, index) => (
                <SkillInfo
                    key={`skill_${index}`}
                    skill={skill.name || ""}
                    proficiency={skill.proficiency || 0}
                    accentColor={accentColor}
                    bgColor={bgColor}
                />
            ))}
        </div>
    );
};

export default SkillSection;