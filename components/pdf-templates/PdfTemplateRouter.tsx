import React from 'react';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import PdfTemplateOne from './templates/PdfTemplateOne';
import PdfTemplateTwo from './templates/PdfTemplateTwo';
import PdfResume from './PdfResume'; // Fallback to the original template

interface PdfTemplateRouterProps {
  data: ResumeFormData;
  template: string;
  colorPalette: string[];
}

const PdfTemplateRouter: React.FC<PdfTemplateRouterProps> = ({ data, template, colorPalette }) => {
  console.log('PdfTemplateRouter: Rendering template:', template, 'with colors:', colorPalette);
  console.log('PdfTemplateRouter: Available templates: TemplateOne, TemplateTwo');
  
  // Normalize template name to handle case variations
  const normalizedTemplate = template?.trim();
  
  switch (normalizedTemplate) {
    case 'TemplateOne':
      console.log('PdfTemplateRouter: Using PdfTemplateOne');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
    case 'TemplateTwo':
      console.log('PdfTemplateRouter: Using PdfTemplateTwo');
      return <PdfTemplateTwo data={data} colorPalette={colorPalette} />;
    case 'TemplateThree':
      // Fallback to PdfTemplateOne for unsupported templates
      console.warn('TemplateThree not implemented for PDF, using PdfTemplateOne as fallback');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
    case 'TemplateFour':
      // Fallback to PdfTemplateOne for unsupported templates
      console.warn('TemplateFour not implemented for PDF, using PdfTemplateOne as fallback');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
    case 'TemplateFive':
      // Since TemplateFive is the default, but we don't have a PDF version, use PdfTemplateOne
      console.warn('TemplateFive not implemented for PDF, using PdfTemplateOne as fallback');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
    default:
      console.warn('Unknown template:', template, 'falling back to PdfTemplateOne');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
  }
};

export default PdfTemplateRouter;