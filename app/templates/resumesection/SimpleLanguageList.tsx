"use client"

import React from "react";
import Progress from "./Progress"; // Import the Progress component

interface LanguageItem {
    name?: string;
    proficiency?: number; // 1-5 scale
}

interface SimpleLanguageListProps {
    languages: LanguageItem[];
    textColor?: string;
    accentColor?: string; // New prop for dot accent color
    dotBgColor?: string; // New prop for dot background color
}

const SimpleLanguageList: React.FC<SimpleLanguageListProps> = ({ languages, textColor, accentColor, dotBgColor }) => {
    if (!languages || languages.length === 0) return null;

    return (
        <div className="space-y-1">
            {languages.map((lang, index) => {
                if (!lang.name) return null;
                return (
                    <div key={index} className="flex items-center justify-between"> {/* Added justify-between here */}
                        <p className="text-sm" style={{ color: textColor }}>
                            {lang.name}
                        </p>
                        {lang.proficiency !== undefined && lang.proficiency > 0 && (
                            <Progress
                                progress={lang.proficiency}
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

export default SimpleLanguageList;