/**
 * CV Export Utilities
 * Handles PDF, Word, and HTML export functionality
 * Uses dynamic imports to avoid SSR/build issues
 */

import { generateTemplateCSS } from './cvTemplates';

// Browser check utility
const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Parse CV text into structured data
 */
export const parseCVData = (cvText, formData) => {
  // Coerce cvText to string to prevent crashes on null/undefined
  const text = String(cvText || '');

  const lines = text.split('\n').filter(line => line.trim());
  const sections = {};
  let currentSection = null;
  let currentContent = [];

  // Extract name (first line that's not empty)
  const name = formData.fullName || lines[0]?.trim() || 'Your Name';

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // Check if this is a section header
    if (trimmedLine.match(/^(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|PROFESSIONAL SUMMARY)$/i)) {
      // Save previous section
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n');
      }

      currentSection = trimmedLine.toUpperCase();
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  });

  // Save last section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n');
  }

  return {
    name,
    contact: {
      email: extractEmail(text),
      phone: extractPhone(text),
      location: formData.location || ''
    },
    summary: sections['PROFESSIONAL SUMMARY'] || sections['SUMMARY'] || '',
    experience: parseExperience(sections['EXPERIENCE'] || ''),
    education: parseEducation(sections['EDUCATION'] || ''),
    skills: parseSkills(sections['SKILLS'] || ''),
    rawSections: sections
  };
};

/**
 * Extract email from CV text
 */
const extractEmail = (text) => {
  // Ensure text is a string to prevent crashes
  const safeText = String(text || '');
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const match = safeText.match(emailRegex);
  return match ? match[0] : '';
};

/**
 * Extract phone from CV text
 */
const extractPhone = (text) => {
  // Ensure text is a string to prevent crashes
  const safeText = String(text || '');
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const match = safeText.match(phoneRegex);
  return match ? match[0] : '';
};

/**
 * Parse experience section
 */
const parseExperience = (experienceText) => {
  if (!experienceText) return [];

  const experiences = [];
  const lines = experienceText.split('\n').filter(line => line.trim());
  let currentJob = null;

  lines.forEach(line => {
    const trimmed = line.trim();

    // Check if this looks like a job title line
    if (trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('•')) {
      // Save previous job
      if (currentJob) {
        experiences.push(currentJob);
      }

      // Parse job title and company
      const parts = trimmed.split(' at ');
      currentJob = {
        title: parts[0]?.trim() || trimmed,
        company: parts[1]?.split('(')[0]?.trim() || '',
        period: extractPeriod(trimmed),
        responsibilities: []
      };
    } else if (currentJob && (trimmed.startsWith('-') || trimmed.startsWith('•'))) {
      // This is a responsibility bullet point
      currentJob.responsibilities.push(trimmed.replace(/^[-•]\s*/, ''));
    }
  });

  // Save last job
  if (currentJob) {
    experiences.push(currentJob);
  }

  return experiences;
};

/**
 * Parse education section
 */
const parseEducation = (educationText) => {
  if (!educationText) return [];

  const education = [];
  const lines = educationText.split('\n').filter(line => line.trim());

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('•')) {
      education.push({
        degree: trimmed,
        period: extractPeriod(trimmed),
        description: ''
      });
    }
  });

  return education;
};

/**
 * Parse skills section
 */
const parseSkills = (skillsText) => {
  if (!skillsText) return [];

  return skillsText
    .split(/[,\n]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
};

/**
 * Extract period/dates from text
 */
const extractPeriod = (text) => {
  // Ensure text is a string to prevent crashes
  const safeText = String(text || '');
  const periodRegex = /\(([^)]+)\)/;
  const match = safeText.match(periodRegex);
  return match ? match[1] : '';
};

/**
 * Export CV as PDF
 */
export const exportToPDF = async (cvData, template, customOptions = {}) => {
  try {
    // Check if we're in a browser environment
    if (!isBrowser()) {
      throw new Error('PDF export is only available in browser environment');
    }

    // Dynamic import of jsPDF
    const { default: jsPDF } = await import('jspdf');

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = margin;

    // Apply template colors
    const colors = { ...template.defaultColors, ...customOptions.colors };

    // Helper function to add text with word wrap
    const addText = (text, fontSize, isBold = false, color = colors.text) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(color);

      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += (lines.length * fontSize * 0.4) + 5;

      return yPosition;
    };

    // Add header (name)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary);
    doc.text(cvData.name, margin, yPosition);
    yPosition += 15;

    // Add contact info
    if (cvData.contact.email || cvData.contact.phone) {
      const contactInfo = [
        cvData.contact.email,
        cvData.contact.phone,
        cvData.contact.location
      ].filter(Boolean).join(' | ');

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.secondary);
      doc.text(contactInfo, margin, yPosition);
      yPosition += 15;
    }

    // Add divider
    doc.setDrawColor(colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Add professional summary
    if (cvData.summary) {
      addText('PROFESSIONAL SUMMARY', 14, true, colors.primary);
      addText(cvData.summary, 11, false, colors.text);
      yPosition += 5;
    }

    // Add experience
    if (cvData.experience.length > 0) {
      addText('PROFESSIONAL EXPERIENCE', 14, true, colors.primary);

      cvData.experience.forEach(job => {
        // Job title and company
        addText(`${job.title} - ${job.company}`, 12, true, colors.accent);
        if (job.period) {
          addText(job.period, 10, false, colors.secondary);
        }

        // Responsibilities
        job.responsibilities.forEach(resp => {
          addText(`• ${resp}`, 10, false, colors.text);
        });

        yPosition += 5;

        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }
      });
    }

    // Add education
    if (cvData.education.length > 0) {
      addText('EDUCATION', 14, true, colors.primary);

      cvData.education.forEach(edu => {
        addText(edu.degree, 11, false, colors.text);
      });

      yPosition += 5;
    }

    // Add skills
    if (cvData.skills.length > 0) {
      addText('SKILLS', 14, true, colors.primary);
      addText(cvData.skills.join(', '), 11, false, colors.text);
    }

    // Save the PDF
    const filename = `${cvData.name.replace(/\s+/g, '_')}_CV_${template.name.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('PDF export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export CV as Word Document
 */
export const exportToWord = async (cvData, template, customOptions = {}) => {
  try {
    // Check if we're in a browser environment
    if (!isBrowser()) {
      throw new Error('Word export is only available in browser environment');
    }

    // Dynamic import of docx components
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');

    const colors = { ...template.defaultColors, ...customOptions.colors };

    // Create document sections
    const children = [];

    // Add name (title)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.name,
            bold: true,
            size: 32,
            color: colors.primary.replace('#', '')
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );

    // Add contact info
    if (cvData.contact.email || cvData.contact.phone) {
      const contactInfo = [
        cvData.contact.email,
        cvData.contact.phone,
        cvData.contact.location
      ].filter(Boolean).join(' | ');

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactInfo,
              size: 22,
              color: colors.secondary.replace('#', '')
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        })
      );
    }

    // Add professional summary
    if (cvData.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'PROFESSIONAL SUMMARY',
              bold: true,
              size: 24,
              color: colors.primary.replace('#', '')
            })
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.summary,
              size: 22
            })
          ],
          spacing: { after: 300 }
        })
      );
    }

    // Add experience
    if (cvData.experience.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'PROFESSIONAL EXPERIENCE',
              bold: true,
              size: 24,
              color: colors.primary.replace('#', '')
            })
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      cvData.experience.forEach(job => {
        // Job title and company
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${job.title} - ${job.company}`,
                bold: true,
                size: 22,
                color: colors.accent.replace('#', '')
              })
            ],
            spacing: { before: 150, after: 50 }
          })
        );

        // Period
        if (job.period) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: job.period,
                  size: 20,
                  color: colors.secondary.replace('#', ''),
                  italics: true
                })
              ],
              spacing: { after: 100 }
            })
          );
        }

        // Responsibilities
        job.responsibilities.forEach(resp => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${resp}`,
                  size: 22
                })
              ],
              spacing: { after: 50 }
            })
          );
        });
      });
    }

    // Add education
    if (cvData.education.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'EDUCATION',
              bold: true,
              size: 24,
              color: colors.primary.replace('#', '')
            })
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 }
        })
      );

      cvData.education.forEach(edu => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree,
                size: 22
              })
            ],
            spacing: { after: 100 }
          })
        );
      });
    }

    // Add skills
    if (cvData.skills.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'SKILLS',
              bold: true,
              size: 24,
              color: colors.primary.replace('#', '')
            })
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 }
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.skills.join(', '),
              size: 22
            })
          ]
        })
      );
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children
        }
      ]
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    const filename = `${cvData.name.replace(/\s+/g, '_')}_CV_${template.name.replace(/\s+/g, '_')}.docx`;

    // Dynamic import of file-saver
    const { saveAs } = await import('file-saver');
    saveAs(blob, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Word export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export CV as HTML
 */
export const exportToHTML = async (cvData, template, customOptions = {}) => {
  try {
    const css = generateTemplateCSS(template, customOptions.colors, customOptions.font);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cvData.name} - CV</title>
    <style>
        ${css}
        body {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: white;
        }
        .cv-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--template-secondary);
        }
        .cv-section {
            margin-bottom: 2rem;
        }
        .section-title {
            font-size: 1.2rem;
            font-weight: var(--template-heading-weight);
            color: var(--template-primary);
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .job-title {
            font-weight: 600;
            color: var(--template-accent);
            margin-bottom: 0.5rem;
        }
        .job-period {
            color: var(--template-secondary);
            font-style: italic;
            margin-bottom: 0.5rem;
        }
        .responsibility {
            margin-bottom: 0.3rem;
        }
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .skill-tag {
            background: var(--template-light);
            color: var(--template-primary);
            padding: 0.2rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.9rem;
        }
        @media print {
            body { padding: 1rem; }
        }
    </style>
</head>
<body class="cv-template">
    <div class="cv-header">
        <h1>${cvData.name}</h1>
        <div class="contact-info">
            ${[cvData.contact.email, cvData.contact.phone, cvData.contact.location]
        .filter(Boolean)
        .join(' | ')}
        </div>
    </div>

    ${cvData.summary ? `
    <div class="cv-section">
        <h2 class="section-title">Professional Summary</h2>
        <p>${cvData.summary}</p>
    </div>
    ` : ''}

    ${cvData.experience.length > 0 ? `
    <div class="cv-section">
        <h2 class="section-title">Professional Experience</h2>
        ${cvData.experience.map(job => `
            <div class="job" style="margin-bottom: 1.5rem;">
                <div class="job-title">${job.title} - ${job.company}</div>
                ${job.period ? `<div class="job-period">${job.period}</div>` : ''}
                ${job.responsibilities.map(resp =>
          `<div class="responsibility">• ${resp}</div>`
        ).join('')}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${cvData.education.length > 0 ? `
    <div class="cv-section">
        <h2 class="section-title">Education</h2>
        ${cvData.education.map(edu => `
            <div>${edu.degree}</div>
        `).join('')}
    </div>
    ` : ''}

    ${cvData.skills.length > 0 ? `
    <div class="cv-section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-list">
            ${cvData.skills.map(skill =>
          `<span class="skill-tag">${skill}</span>`
        ).join('')}
        </div>
    </div>
    ` : ''}
</body>
</html>`;

    // Create and download HTML file
    const blob = new Blob([html], { type: 'text/html' });
    const filename = `${cvData.name.replace(/\s+/g, '_')}_CV_${template.name.replace(/\s+/g, '_')}.html`;

    // Dynamic import of file-saver
    const { saveAs } = await import('file-saver');
    saveAs(blob, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('HTML export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Main export function that handles different formats
 */
export const exportCV = async (cvText, formData, template, format, customOptions = {}) => {
  const cvData = parseCVData(cvText, formData);

  switch (format.toLowerCase()) {
    case 'pdf':
      return await exportToPDF(cvData, template, customOptions);
    case 'docx':
    case 'word':
      return await exportToWord(cvData, template, customOptions);
    case 'html':
      return await exportToHTML(cvData, template, customOptions);
    case 'txt': {
      // Simple text download (existing functionality)
      if (!isBrowser()) {
        throw new Error('Text export is only available in browser environment');
      }

      const blob = new Blob([cvText], { type: 'text/plain' });
      const filename = `${cvData.name.replace(/\s+/g, '_')}_CV.txt`;

      // Dynamic import of file-saver
      const { saveAs } = await import('file-saver');
      saveAs(blob, filename);
      return { success: true, filename };
    }
    case 'text': {
      // Simple text download (existing functionality)
      if (!isBrowser()) {
        throw new Error('Text export is only available in browser environment');
      }

      const blob = new Blob([cvText], { type: 'text/plain' });
      const filename = `${cvData.name.replace(/\s+/g, '_')}_CV.txt`;

      // Dynamic import of file-saver
      const { saveAs } = await import('file-saver');
      saveAs(blob, filename);
      return { success: true, filename };
    }
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
