"use client"

import React from 'react'
import { cleanUrlForDisplay } from '@/lib/utils'; // Import the utility function

interface ActionLinkProps {
    icon: React.ReactNode;
    link?: string;
    bgColor?: string;
    iconColor?: string; // Added iconColor prop
    labelText?: string; // New prop for the label text
}

const ActionLink: React.FC<ActionLinkProps> = ({ icon, link, bgColor, iconColor, labelText }) => {
    if (!link) return null; // Don't render if link is empty
    const displayLink = cleanUrlForDisplay(link); // Clean the URL for display
    return (
        <div className="flex items-center gap-2"> {/* Reduced gap */}
            <div
                className="w-5 h-5 flex items-center justify-center rounded-full" // Reduced size
                style={{ backgroundColor: bgColor, color: iconColor }} // Apply iconColor here
            >
                {React.cloneElement(icon as React.ReactElement, { className: "w-3 h-3" })} {/* Reduced icon size */}
            </div>
            {labelText && <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-800">{labelText}:</span>} {/* Display labelText with fixed width */}
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-gray-800 no-underline cursor-pointer break-all"> {/* Reduced font size */}
                {displayLink} {/* Display the cleaned URL */}
            </a>
        </div>
    )
}

export default ActionLink