import React from 'react';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import PdfTemplateOne from './templates/PdfTemplateOne';
import PdfTemplateTwo from './templates/PdfTemplateTwo';
import PdfTemplateThree from './templates/PdfTemplateThree'; // Import new template
import PdfTemplateFour from './templates/PdfTemplateFour';   // Import new template
import PdfTemplateFive from './templates/PdfTemplateFive';   // Import new template

interface PdfTemplateRouterProps {
  data: ResumeFormData;
  template: string;
  colorPalette: string[];
}

const PdfTemplateRouter: React.FC<PdfTemplateRouterProps> = ({ data, template, colorPalette }) => {
  console.log('PdfTemplateRouter: Rendering template:', template, 'with colors:', colorPalette);
  
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