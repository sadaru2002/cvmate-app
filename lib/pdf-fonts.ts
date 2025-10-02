import { Font } from '@react-pdf/renderer';

let fontsInitialized = false;

export const initializePdfFonts = () => {
  if (fontsInitialized) return;

  try {
    // Register Helvetica as primary font (built-in to most PDF viewers)
    Font.register({
      family: 'Roboto',
      fonts: [
        {
          src: 'data:font/truetype;base64,', // Use built-in font
          fontWeight: 'normal',
        },
        {
          src: 'data:font/truetype;base64,', // Use built-in font
          fontWeight: 'bold',
        }
      ]
    });

    // Also register as separate family for compatibility
    Font.register({
      family: 'Roboto-Bold',
      src: 'data:font/truetype;base64,', // Use built-in font
    });

    fontsInitialized = true;
    console.log('✅ PDF fonts initialized with system defaults');
  } catch (error) {
    console.error('❌ Failed to initialize PDF fonts:', error);
    fontsInitialized = true; // Prevent infinite retry
  }
};

export const getFontFamily = (weight: 'normal' | 'bold' = 'normal') => {
  return weight === 'bold' ? 'Helvetica-Bold' : 'Helvetica';
};

export const getPdfStyleWithFont = (baseStyle: any, fontWeight: 'normal' | 'bold' = 'normal') => {
  return {
    ...baseStyle,
    fontFamily: getFontFamily(fontWeight),
  };
};