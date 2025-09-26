"use client"

import React from "react";

interface ProgressProps {
    progress: number; // Expected to be 1-5
    total?: number; // Default to 5
    color?: string;
    bgColor?: string;
}

const Progress: React.FC<ProgressProps> = ({ progress = 0, total = 5, color, bgColor }) => {
    return (
        <div className="inline-flex items-center gap-0.5"> {/* Changed to inline-flex and reduced gap */}
            {Array(total).fill(0).map((_, index) => (
                <div
                    key={index}
                    className="w-1.5 h-1.5 rounded-full transition-all" // Smaller circles
                    style={{
                        backgroundColor: index < progress
                            ? color || "rgba(1,1,1,1)"
                            : bgColor || "rgba(1,1,1,0.1)"
                    }}
                ></div>
            ))}
        </div>
    );
};

export default Progress;