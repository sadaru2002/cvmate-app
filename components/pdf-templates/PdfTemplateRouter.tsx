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

  switch (template) {
    case 'TemplateOne':
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
    case 'TemplateTwo':
      return <PdfTemplateTwo data={data} colorPalette={colorPalette} />;
    case 'TemplateThree':
      // Fallback to PdfTemplateOne for unsupported templates
      console.warn('TemplateThree not implemented for PDF, using PdfTemplateOne');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
    case 'TemplateFour':
      // Fallback to PdfTemplateOne for unsupported templates
      console.warn('TemplateFour not implemented for PDF, using PdfTemplateOne');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
    case 'TemplateFive':
      // Fallback to PdfResume for TemplateFive
      console.warn('TemplateFive not implemented for PDF, using fallback PdfResume');
      return <PdfResume data={data} />;
    default:
      console.warn('Unknown template:', template, 'falling back to PdfTemplateOne');
      return <PdfTemplateOne data={data} colorPalette={colorPalette} />;
  }
};

export default PdfTemplateRouter;