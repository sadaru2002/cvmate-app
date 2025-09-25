"use client"

import React from "react";
import { Github, ExternalLink } from "lucide-react"; // Changed from react-icons/lu to lucide-react
import ActionLink from "./ActionLink.tsx";

interface ProjectInfoProps {
    title?: string;
    description?: string;
    githubLink?: string;
    liveDemoUrl?: string;
    bgColor?: string;
    iconColor?: string; // Added iconColor prop
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
    title,
    description,
    githubLink,
    liveDemoUrl,
    bgColor,
    iconColor,
}) => {
    if (!title && !description && !githubLink && !liveDemoUrl) return null; // Don't render if all values are empty
    return (
        <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-800"> {/* Reduced font size */}
                {title}
            </h3>
            <p className="text-xs text-gray-700 font-medium mt-1"> {/* Reduced font size */}
                {description}
            </p>
            <div className="flex flex-col gap-1 mt-2"> {/* Changed to flex-col and gap-1 for vertical stacking */}
                {githubLink && (
                    <ActionLink
                        icon={<Github className="w-4 h-4" />}
                        link={githubLink}
                        bgColor={bgColor}
                        iconColor={iconColor} // Pass iconColor
                        labelText="GitHub" // Added label
                    />
                )}
                {liveDemoUrl && (
                    <ActionLink
                        icon={<ExternalLink className="w-4 h-4" />}
                        link={liveDemoUrl}
                        bgColor={bgColor}
                        iconColor={iconColor} // Pass iconColor
                        labelText="Live Demo" // Added label
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectInfo;