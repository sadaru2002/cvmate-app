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
        <div className="inline-flex items-center" style={{ gap: '1.5pt' }}> {/* Exact match to PDF gap */}
            {Array(total).fill(0).map((_, index) => (
                <div
                    key={index}
                    className="rounded-full transition-all"
                    style={{
                        width: '4.5pt', // Exact match to PDF (6pt in PDF = 4.5pt in web)
                        height: '4.5pt', // Exact match to PDF
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