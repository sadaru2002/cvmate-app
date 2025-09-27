import React from 'react';

// Helper to get SVG icon components for React-PDF
// Note: React-PDF's SVG support is limited, so simple paths are preferred.
// For complex icons, consider using a font icon library or converting to simple paths.
export const getSvgIcon = (iconName: string, color: string, size: number = 12) => {
  const iconProps = {
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
  };

  switch (iconName) {
    case 'Mail':
      return (
        <svg {...iconProps}>
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      );
    case 'Phone':
      return (
        <svg {...iconProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      );
    case 'MapPin':
      return (
        <svg {...iconProps}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      );
    case 'Linkedin':
      return (
        <svg {...iconProps}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect width="4" height="12" x="2" y="9"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      );
    case 'Github':
      return (
        <svg {...iconProps}>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.44-1-3.44.09-2.5-1.28-4.24-2.2-4.55 0 0-1.05-.33-3.44 1.35-1-.27-2.07-.36-3.14-.36-1.07 0-2.14.09-3.14.36C7.22 4.04 6.17 4.37 6.17 4.37c-.92.31-2.29 2.04-2.2 4.55-.72 1-1.07 2.22-1 3.44 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
          <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
      );
    case 'Globe':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
      );
    case 'User':
      return (
        <svg {...iconProps}>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      );
    case 'Briefcase':
      return (
        <svg {...iconProps}>
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
          <path d="M16 21V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14"/>
        </svg>
      );
    case 'GraduationCap':
      return (
        <svg {...iconProps}>
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.838a2 2 0 0 0 1.66 0z"/>
          <path d="M22 10v6"/>
          <path d="M6 12.5V16a6 6 0 0 0 6 6v-4"/>
        </svg>
      );
    case 'Lightbulb':
      return (
        <svg {...iconProps}>
          <path d="M15 14c.2-.84.5-1.5.9-2.2c.3-.5.4-.9.5-1.7 0-.2.07-.5.2-.7.2-.5.5-1 .9-1.4C17.8 6.5 18 5.3 18 4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2c0 1.3.2 2.5.5 3.5.4.7.6 1.2.9 1.7.1.2.2.5.2.7.1.8.2 1.3.5 2.2.4.7.7 1.4.9 2.2"/>
          <path d="M9 18h6"/>
          <path d="M10 22h4"/>
          <path d="M12 14v8"/>
        </svg>
      );
    case 'Award':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89L17.18 21l-5.15-3.62L7 21l1.719-8.109"/>
        </svg>
      );
    case 'Languages':
      return (
        <svg {...iconProps}>
          <path d="m5 8 6 6"/>
          <path d="m11 8 6 6"/>
          <path d="m2 11h10"/>
          <path d="m14 11h8"/>
          <path d="M7 21l1.5-4 1.5 4"/>
          <path d="M17 21l1.5-4 1.5 4"/>
        </svg>
      );
    case 'ExternalLink':
      return (
        <svg {...iconProps}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" x2="21" y1="14" y2="3"/>
        </svg>
      );
    case 'Heart':
      return (
        <svg {...iconProps}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      );
    case 'Circle':
      return (
        <svg {...iconProps} fill={color} stroke="none">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
    default:
      return null;
  }
};