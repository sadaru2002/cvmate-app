"use client"

import React from "react";

interface HorizontalProgressBarProps {
    progress: number; // Expected to be 1-5
    total?: number; // Default to 5
    fillColor?: string;
    bgColor?: string;
}

const HorizontalProgressBar: React.FC<HorizontalProgressBarProps> = ({ progress = 0, total = 5, fillColor, bgColor }) => {
    const percentage = (progress / total) * 100;
    return (
        <div className="w-20 rounded-full h-1.5" style={{ backgroundColor: bgColor || "#E0E0E0" }}> {/* Fixed width, smaller height */}
            <div
                className="h-1.5 rounded-full"
                style={{
                    width: `${percentage}%`,
                    backgroundColor: fillColor || "#424242" // Default dark gray fill
                }}
            ></div>
        </div>
    );
};

export default HorizontalProgressBar;