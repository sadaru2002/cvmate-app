import React from 'react';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import PdfTemplateOne from './templates/PdfTemplateOne';
import PdfTemplateTwo from './templates/PdfTemplateTwo';
import PdfTemplateThree from './templates/PdfTemplateThree';
import PdfTemplateFour from './templates/PdfTemplateFour';
import PdfTemplateFive from './templates/PdfTemplateFive';
import { Font } from '@react-pdf/renderer';

// Font registration with robust error handling
let fontsRegistered = false;

const registerFonts = () => {
  if (fontsRegistered) return;
  
  // For now, skip custom font registration to avoid production issues
  // @react-pdf/renderer will use its built-in fonts
  fontsRegistered = true;
  console.log('✅ Using default PDF fonts for better compatibility.');
  
  /* 
  // Uncomment and test these URLs individually if you want custom fonts:
  try {
    Font.register({
      family: 'Roboto',
      src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
    });
    console.log('✅ Custom fonts registered.');
  } catch (error) {
    console.error('❌ Custom font registration failed:', error);
  }
  */
};

// Initialize font registration immediately
registerFonts();

interface PdfTemplateRouterProps {
  data: ResumeFormData;
  template: string;
  colorPalette: string[];
}

const PdfTemplateRouter: React.FC<PdfTemplateRouterProps> = ({ data, template, colorPalette }) => {
  console.log('PdfTemplateRouter: Rendering template:', template, 'with colors:', colorPalette);
  
  // Ensure fonts are registered before rendering
  registerFonts();
  
  const normalizedTemplate = template?.trim();
  
  switch (normalizedTemplate) {
    case 'TemplateOne':
      console.log('PdfTemplateRouter: Using PdfTemplateOne');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
    case 'TemplateTwo':
      console.log('PdfTemplateRouter: Using PdfTemplateTwo');
      return <PdfTemplateTwo data={data} colorPalette={colorPalette} />;
    case 'TemplateThree':
      console.log('PdfTemplateRouter: Using PdfTemplateThree');
      return <PdfTemplateThree data={data} colorPalette={colorPalette} />;
    case 'TemplateFour':
      console.log('PdfTemplateRouter: Using PdfTemplateFour');
      return <PdfTemplateFour data={data} colorPalette={colorPalette} />;
    case 'TemplateFive':
      console.log('PdfTemplateRouter: Using PdfTemplateFive');
      return <PdfTemplateFive data={data} colorPalette={colorPalette} />;
    default:
      console.warn('Unknown template:', template, 'falling back to PdfTemplateOne');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
  }
};

export default PdfTemplateRouter;
