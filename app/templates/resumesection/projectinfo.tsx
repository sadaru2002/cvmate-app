"use client"

import React from "react";
import { Github, ExternalLink } from "lucide-react"; // Changed from react-icons/lu to lucide-react
import ActionLink from "./ActionLink";

interface ProjectInfoProps {
    title?: string;
    description?: string;
    githubLink?: string;
    liveDemoUrl?: string;
    bgColor?: string;
    iconColor?: string;
    // New sizing props for template compatibility
    templateVersion?: 'small' | 'medium' | 'large' | 'templateOne'; // Added templateOne specific sizing
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
    title,
    description,
    githubLink,
    liveDemoUrl,
    bgColor,
    iconColor,
    templateVersion = 'medium', // Default to medium sizing
}) => {
    if (!title && !description && !githubLink && !liveDemoUrl) return null;
    
    // Define sizing presets for different templates
    const sizingPresets = {
        templateOne: {
            containerSize: '7.5pt', // Exact match to PDF (10pt in PDF = 7.5pt in web)
            iconSize: '7.5pt', // Exact match to PDF (10pt in PDF = 7.5pt in web)
            gap: '3pt', // Exact match to PDF (4pt in PDF = 3pt in web)
            labelWidth: '0pt', // No label in Template One PDF
            fontSize: '6.75pt', // Exact match to PDF (9pt in PDF = 6.75pt in web)
            marginBottom: '7.5pt',
            titleFontSize: '7.5pt',
            descFontSize: '6.75pt',
            showLabel: false, // Template One doesn't show "GitHub:" labels
            linkGap: '1.5pt', // Gap between links (2pt in PDF = 1.5pt in web)
            linkMarginBottom: '3pt' // Margin between links (4pt in PDF = 3pt in web)
        },
        small: {
            containerSize: '3.75pt',
            iconSize: '2.25pt', 
            gap: '1.5pt',
            labelWidth: '12pt',
            fontSize: '6.75pt',
            marginBottom: '7.5pt',
            titleFontSize: '7.5pt',
            descFontSize: '6.75pt',
            showLabel: true,
            linkGap: '0.75pt',
            linkMarginBottom: '1.5pt'
        },
        medium: {
            containerSize: '12pt',
            iconSize: '7.5pt',
            gap: '4.5pt',
            labelWidth: '36pt',
            fontSize: '7.5pt',
            marginBottom: '9pt',
            titleFontSize: '9pt',
            descFontSize: '7.5pt',
            showLabel: true,
            linkGap: '2.25pt',
            linkMarginBottom: '3pt'
        },
        large: {
            containerSize: '15pt', // Template Three size (20pt in PDF = 15pt in web)
            iconSize: '9pt', // Template Three size (12pt in PDF = 9pt in web) 
            gap: '6pt', // Template Three size (8pt in PDF = 6pt in web)
            labelWidth: '48pt', // Template Three size (64pt in PDF = 48pt in web)
            fontSize: '6.75pt', // Template Three size (9pt in PDF = 6.75pt in web)
            marginBottom: '10.5pt',
            titleFontSize: '10.5pt',
            descFontSize: '7.5pt',
            showLabel: true,
            linkGap: '3pt',
            linkMarginBottom: '4.5pt'
        }
    };
    
    const preset = sizingPresets[templateVersion];
    
    return (
        <div style={{ marginBottom: preset.marginBottom }}>
            <h3 
                className="font-semibold text-gray-800" 
                style={{ 
                    fontSize: preset.titleFontSize,
                    color: '#1F2937'
                }}
            >
                {title}
            </h3>
            <p 
                className="text-gray-700 font-medium" 
                style={{ 
                    fontSize: preset.descFontSize,
                    marginTop: '0.75pt',
                    lineHeight: 1.4
                }}
            >
                {description}
            </p>
            <div 
                className="flex flex-col" 
                style={{ 
                    gap: preset.linkGap,
                    marginTop: '6pt'
                }}
            >
                {githubLink && (
                    <ActionLink
                        icon={<Github />}
                        link={githubLink}
                        bgColor={bgColor}
                        iconColor={iconColor}
                        labelText={preset.showLabel ? "GitHub" : undefined}
                        containerSize={preset.containerSize}
                        iconSize={preset.iconSize}
                        gap={preset.gap}
                        labelWidth={preset.labelWidth}
                        fontSize={preset.fontSize}
                    />
                )}
                {liveDemoUrl && (
                    <ActionLink
                        icon={<ExternalLink />}
                        link={liveDemoUrl}
                        bgColor={bgColor}
                        iconColor={iconColor}
                        labelText={preset.showLabel ? "Live Demo" : undefined}
                        containerSize={preset.containerSize}
                        iconSize={preset.iconSize}
                        gap={preset.gap}
                        labelWidth={preset.labelWidth}
                        fontSize={preset.fontSize}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectInfo;