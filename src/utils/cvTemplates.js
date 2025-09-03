/**
 * CV Template System
 * Defines different CV layouts, styles, and export formats
 */

// Color schemes for templates
export const colorSchemes = {
  professional: {
    primary: '#2563eb',      // Blue
    secondary: '#64748b',    // Slate
    accent: '#0f172a',       // Dark
    text: '#374151',         // Gray-700
    light: '#f1f5f9'        // Slate-100
  },
  modern: {
    primary: '#7c3aed',      // Purple
    secondary: '#6366f1',    // Indigo
    accent: '#1e293b',       // Slate-800
    text: '#475569',         // Slate-600
    light: '#f8fafc'        // Slate-50
  },
  creative: {
    primary: '#059669',      // Emerald
    secondary: '#0d9488',    // Teal
    accent: '#134e4a',       // Teal-900
    text: '#374151',         // Gray-700
    light: '#ecfdf5'        // Emerald-50
  },
  classic: {
    primary: '#1f2937',      // Gray-800
    secondary: '#4b5563',    // Gray-600
    accent: '#111827',       // Gray-900
    text: '#374151',         // Gray-700
    light: '#f9fafb'        // Gray-50
  }
};

// Font options
export const fontOptions = {
  modern: {
    name: 'Inter',
    fallback: 'system-ui, -apple-system, sans-serif',
    headingWeight: '700',
    bodyWeight: '400'
  },
  classic: {
    name: 'Georgia',
    fallback: 'Times New Roman, serif',
    headingWeight: '700',
    bodyWeight: '400'
  },
  clean: {
    name: 'Roboto',
    fallback: 'Arial, sans-serif',
    headingWeight: '600',
    bodyWeight: '400'
  }
};

// Template definitions
export const cvTemplates = {
  modern: {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design perfect for tech and creative roles',
    category: 'Professional',
    atsOptimized: true,
    layout: 'single-column',
    features: ['Two-column layout', 'Skills visualization', 'Modern typography'],
    defaultColors: colorSchemes.modern,
    defaultFont: fontOptions.modern,
    fontOptions: fontOptions,
    sections: {
      header: {
        layout: 'centered',
        includePhoto: false,
        style: 'gradient-background'
      },
      contact: {
        layout: 'horizontal',
        icons: true
      },
      summary: {
        style: 'highlighted',
        maxLines: 4
      },
      experience: {
        layout: 'detailed',
        showCompanyLogo: false,
        bulletStyle: 'arrow'
      },
      skills: {
        style: 'progress-bars',
        categories: true
      },
      education: {
        layout: 'compact',
        showGpa: false
      }
    }
  },

  classic: {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional, conservative layout ideal for corporate environments',
    category: 'Conservative',
    atsOptimized: true,
    layout: 'single-column',
    features: ['Clean typography', 'Traditional layout', 'ATS-friendly'],
    defaultColors: colorSchemes.classic,
    defaultFont: fontOptions.classic,
    fontOptions: fontOptions,
    sections: {
      header: {
        layout: 'left-aligned',
        includePhoto: false,
        style: 'simple'
      },
      contact: {
        layout: 'vertical',
        icons: false
      },
      summary: {
        style: 'paragraph',
        maxLines: 5
      },
      experience: {
        layout: 'traditional',
        showCompanyLogo: false,
        bulletStyle: 'bullet'
      },
      skills: {
        style: 'comma-separated',
        categories: false
      },
      education: {
        layout: 'detailed',
        showGpa: true
      }
    }
  },

  creative: {
    id: 'creative',
    name: 'Creative Impact',
    description: 'Eye-catching design for creative and design professionals',
    category: 'Creative',
    atsOptimized: false,
    layout: 'two-column',
    features: ['Visual elements', 'Color accents', 'Creative layout'],
    defaultColors: colorSchemes.creative,
    defaultFont: fontOptions.clean,
    fontOptions: fontOptions,
    sections: {
      header: {
        layout: 'centered',
        includePhoto: true,
        style: 'creative-banner'
      },
      contact: {
        layout: 'sidebar',
        icons: true
      },
      summary: {
        style: 'callout-box',
        maxLines: 3
      },
      experience: {
        layout: 'timeline',
        showCompanyLogo: true,
        bulletStyle: 'custom'
      },
      skills: {
        style: 'tag-cloud',
        categories: true
      },
      education: {
        layout: 'sidebar',
        showGpa: false
      }
    }
  },

  ats: {
    id: 'ats',
    name: 'ATS Optimized',
    description: 'Maximized for Applicant Tracking System compatibility',
    category: 'ATS',
    atsOptimized: true,
    layout: 'single-column',
    features: ['100% ATS compatible', 'Keyword optimized', 'Simple formatting'],
    defaultColors: colorSchemes.professional,
    defaultFont: fontOptions.clean,
    fontOptions: fontOptions,
    sections: {
      header: {
        layout: 'simple',
        includePhoto: false,
        style: 'text-only'
      },
      contact: {
        layout: 'simple-list',
        icons: false
      },
      summary: {
        style: 'paragraph',
        maxLines: 4
      },
      experience: {
        layout: 'simple',
        showCompanyLogo: false,
        bulletStyle: 'bullet'
      },
      skills: {
        style: 'simple-list',
        categories: true
      },
      education: {
        layout: 'simple',
        showGpa: false
      }
    }
  }
};

// Export format definitions
export const exportFormats = {
  pdf: {
    id: 'pdf',
    name: 'PDF Document',
    extension: '.pdf',
    mimeType: 'application/pdf',
    description: 'Professional PDF ready for printing and digital sharing',
    features: ['Print-ready', 'Universal compatibility', 'Professional appearance'],
    icon: 'FileText',
    recommended: true
  },
  docx: {
    id: 'docx',
    name: 'Word Document',
    extension: '.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Editable Word document for further customization',
    features: ['Fully editable', 'Track changes', 'Comment support'],
    icon: 'FileEdit',
    recommended: false
  },
  html: {
    id: 'html',
    name: 'Web Portfolio',
    extension: '.html',
    mimeType: 'text/html',
    description: 'Interactive web version perfect for online portfolios',
    features: ['Interactive elements', 'Mobile responsive', 'Easy sharing'],
    icon: 'Globe',
    recommended: false
  },
  txt: {
    id: 'txt',
    name: 'Plain Text',
    extension: '.txt',
    mimeType: 'text/plain',
    description: 'Simple text format for ATS systems and basic applications',
    features: ['Universal compatibility', 'ATS-friendly', 'Copy-paste ready'],
    icon: 'Type',
    recommended: false
  }
};

// Template utility functions
export const templateUtils = {
  // Get template by ID
  getTemplate: (templateId) => {
    return cvTemplates[templateId] || cvTemplates.modern;
  },

  // Get all templates
  getAllTemplates: () => {
    return Object.values(cvTemplates);
  },

  // Get templates by category
  getTemplatesByCategory: (category) => {
    return Object.values(cvTemplates).filter(template =>
      template.category === category
    );
  },

  // Get ATS-optimized templates
  getATSTemplates: () => {
    return Object.values(cvTemplates).filter(template =>
      template.atsOptimized
    );
  },

  // Get export formats
  getExportFormats: () => {
    return Object.values(exportFormats);
  },

  // Get recommended export format
  getRecommendedFormat: () => {
    return exportFormats.pdf;
  },

  // Validate template configuration
  validateTemplate: (template) => {
    const required = ['id', 'name', 'description', 'layout', 'sections'];
    return required.every(field => template[field] !== undefined);
  },

  // Merge custom colors with template
  applyColorScheme: (template, customColors) => {
    return {
      ...template,
      colors: { ...template.defaultColors, ...customColors }
    };
  },

  // Apply font options to template
  applyFont: (template, fontOption) => {
    return {
      ...template,
      font: fontOptions[fontOption] || template.defaultFont
    };
  },

  // Get font options for a template
  getFontOptions: () => {
    return fontOptions;
  }
};

// CSS generation for templates
export const generateTemplateCSS = (template, customColors = {}, customFont = null) => {
  const colors = { ...template.defaultColors, ...customColors };
  const font = customFont ? fontOptions[customFont] : template.defaultFont;

  return `
    :root {
      --template-primary: ${colors.primary};
      --template-secondary: ${colors.secondary};
      --template-accent: ${colors.accent};
      --template-text: ${colors.text};
      --template-light: ${colors.light};
      --template-font: ${font.name}, ${font.fallback};
      --template-heading-weight: ${font.headingWeight};
      --template-body-weight: ${font.bodyWeight};
    }
    
    .cv-template {
      font-family: var(--template-font);
      color: var(--template-text);
      line-height: 1.6;
    }
    
    .cv-template h1, .cv-template h2, .cv-template h3 {
      color: var(--template-primary);
      font-weight: var(--template-heading-weight);
    }
    
    .cv-template .section-divider {
      border-color: var(--template-secondary);
    }
    
    .cv-template .highlight {
      color: var(--template-primary);
    }
    
    .cv-template .accent-bg {
      background-color: var(--template-light);
    }
  `;
};
