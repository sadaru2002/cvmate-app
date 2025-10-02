export const validateFont = (fontData) => {
  if (!fontData) return false;
  
  // Check if font data is too large (potential issue with fontkit)
  if (fontData.byteLength > 10485760) { // 10MB
    console.warn('Font file too large, may cause buffer overflow');
    return false;
  }
  
  // Basic validation for font file structure
  try {
    const view = new DataView(fontData);
    const signature = view.getUint32(0);
    
    // Check for common font signatures
    const validSignatures = [
      0x00010000, // TrueType
      0x74727565, // 'true' (TrueType)
      0x4F54544F, // 'OTTO' (OpenType with CFF)
    ];
    
    return validSignatures.includes(signature);
  } catch (error) {
    console.warn('Font validation failed:', error.message);
    return false;
  }
};

export const getSafeFontConfig = () => ({
  // Use only built-in fonts to avoid fontkit issues
  fonts: {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italic: 'Helvetica-Oblique',
      bolditalic: 'Helvetica-BoldOblique'
    }
  }
});
