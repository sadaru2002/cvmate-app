"use client"

import React from "react";
import Progress from "./Progress";

interface LanguageItem {
    name?: string;
    proficiency?: number; // 1-5 scale
}

interface LanguageInfoProps {
    language: string;
    proficiency: number;
    accentColor?: string;
    bgColor?: string;
}

const LanguageInfo: React.FC<LanguageInfoProps> = ({ language, proficiency, accentColor, bgColor }) => {
    if (!language) return null;
    return (
        <div className="flex items-center justify-between">
            <p 
                className="font-semibold text-gray-800" 
                style={{ 
                    fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
                    color: '#1F2937'
                }}
            >
                {language}
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

interface LanguageSectionProps {
    languages: LanguageItem[];
    accentColor?: string;
    bgColor?: string;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({ languages, accentColor, bgColor }) => {
    if (!languages || languages.length === 0) return null;
    return (
        <div 
            className="grid gap-y-1" 
            style={{ 
                gridTemplateColumns: 'repeat(2, 1fr)', // Two column layout to match PDF
                columnGap: '3.75pt', // Exact match to PDF (5pt in PDF = 3.75pt in web)
                marginBottom: '2.25pt'
            }}
        >
            {languages.map((lang, index) => (
                <LanguageInfo
                    key={`language_${index}`}
                    language={lang.name || ""}
                    proficiency={lang.proficiency || 0}
                    accentColor={accentColor}
                    bgColor={bgColor}
                />
            ))}
        </div>
    );
};

export default LanguageSection;