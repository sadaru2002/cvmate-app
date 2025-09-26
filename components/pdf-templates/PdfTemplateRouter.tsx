import React from 'react';
import { ResumeFormData } from '@/hooks/use-resume-builder';
import PdfTemplateOne from './templates/PdfTemplateOne';
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
      // TODO: Create PdfTemplateTwo
      return <PdfResume data={data} />;
    case 'TemplateThree':
      // TODO: Create PdfTemplateThree
      return <PdfResume data={data} />;
    case 'TemplateFour':
      // TODO: Create PdfTemplateFour
      return <PdfResume data={data} />;
    case 'TemplateFive':
      // TODO: Create PdfTemplateFive
      return <PdfResume data={data} />;
    default:
      console.warn('Unknown template:', template, 'falling back to default');
      return <PdfResume data={data} />;
  }
};

export default PdfTemplateRouter;