import React from 'react';
import { Svg, Path, Rect, Circle } from '@react-pdf/renderer'; // Import React-PDF SVG components

// Helper to get SVG icon components for React-PDF
export const getSvgIcon = (iconName: string, color: string, size: number = 12) => {
  const iconProps = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
  };

  switch (iconName) {
    case 'Mail':
      return (
        <Svg {...iconProps}>
          <Rect x="2" y="4" width="20" height="16" rx="2" fill="none"/>
          <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" fill="none"/>
        </Svg>
      );
    case 'Phone':
      return (
        <Svg {...iconProps}>
          <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none"/>
        </Svg>
      );
    case 'MapPin':
      return (
        <Svg {...iconProps}>
          <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="none"/>
          <Circle cx="12" cy="10" r="3" fill="none"/>
        </Svg>
      );
    case 'Linkedin':
      return (
        <Svg {...iconProps}>
          <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="none"/>
          <Rect x="2" y="9" width="4" height="12" fill="none"/>
          <Circle cx="4" cy="4" r="2" fill="none"/>
        </Svg>
      );
    case 'Github':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" fill="none"/>
          <Path d="M9 18c-4.51 2-5-2-7-2" fill="none"/>
        </Svg>
      );
    case 'Globe':
      return (
        <Svg {...iconProps}>
          <Circle cx="12" cy="12" r="10" fill="none"/>
          <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" fill="none"/>
          <Path d="M2 12h20" fill="none"/>
        </Svg>
      );
    case 'User':
      return (
        <Svg {...iconProps}>
          <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" fill="none"/>
          <Circle cx="12" cy="7" r="4" fill="none"/>
        </Svg>
      );
    case 'Briefcase':
      return (
        <Svg {...iconProps}>
          <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" fill="none"/>
          <Path d="M16 21V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14" fill="none"/>
        </Svg>
      );
    case 'GraduationCap':
      return (
        <Svg {...iconProps}>
          <Path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.838a2 2 0 0 0 1.66 0z" fill="none"/>
          <Path d="M22 10v6" fill="none"/>
          <Path d="M6 12.5V16a6 6 0 0 0 6 6v-4" fill="none"/>
        </Svg>
      );
    case 'Lightbulb':
      return (
        <Svg {...iconProps}>
          <Path d="M15 14c.2-.84.5-1.5.9-2.2c.3-.5.4-.9.5-1.7 0-.2.07-.5.2-.7.2-.5.5-1 .9-1.4C17.8 6.5 18 5.3 18 4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2c0 1.3.2 2.5.5 3.5.4.7.6 1.2.9 1.7.1.2.2.5.2.7.1.8.2 1.3.5 2.2.4.7.7 1.4.9 2.2" fill="none"/>
          <Path d="M9 18h6" fill="none"/>
          <Path d="M10 22h4" fill="none"/>
          <Path d="M12 14v8" fill="none"/>
        </Svg>
      );
    case 'Award':
      return (
        <Svg {...iconProps}>
          <Circle cx="12" cy="8" r="6" fill="none"/>
          <Path d="M15.477 12.89L17.18 21l-5.15-3.62L7 21l1.719-8.109" fill="none"/>
        </Svg>
      );
    case 'Languages':
      return (
        <Svg {...iconProps}>
          <Path d="m5 8 6 6" fill="none"/>
          <Path d="m11 8 6 6" fill="none"/>
          <Path d="m2 11h10" fill="none"/>
          <Path d="m14 11h8" fill="none"/>
          <Path d="M7 21l1.5-4 1.5 4" fill="none"/>
          <Path d="M17 21l1.5-4 1.5 4" fill="none"/>
        </Svg>
      );
    case 'ExternalLink':
      return (
        <Svg {...iconProps}>
          <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" fill="none"/>
          <Path d="M15 3 21 3 21 9" fill="none"/>
          <Path d="M10 14 21 3" fill="none"/>
        </Svg>
      );
    case 'Heart':
      return (
        <Svg {...iconProps}>
          <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="none"/>
        </Svg>
      );
    case 'Circle':
      return (
        <Svg {...iconProps} fill={color} stroke="none">
          <Circle cx="12" cy="12" r="10"/>
        </Svg>
      );
    default:
      return null;
  }
};
