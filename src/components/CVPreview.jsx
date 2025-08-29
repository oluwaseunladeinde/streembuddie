import React from 'react';
import { Eye, Download, FileText, FileEdit, Globe, Type } from 'lucide-react';
import { templateUtils, generateTemplateCSS } from '../utils/cvTemplates';

const CVPreview = ({ cvData, template, customColors = {}, customFont = null, selectedFormat }) => {
    if (!cvData || !template) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a template to see preview</p>
            </div>
        );
    }

    const colors = { ...template.defaultColors, ...customColors };
    const font = customFont ? template.fontOptions?.[customFont] : template.defaultFont;
    const css = generateTemplateCSS(template, customColors, customFont);

    // Format icons for different export types
    const formatIcons = {
        pdf: <FileText className="h-4 w-4 text-red-600" />,
        docx: <FileEdit className="h-4 w-4 text-blue-600" />,
        html: <Globe className="h-4 w-4 text-green-600" />,
        txt: <Type className="h-4 w-4 text-gray-600" />
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Preview Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Eye className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
                        <span className="text-sm text-gray-500">• {template.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {formatIcons[selectedFormat]}
                        <span className="capitalize">{selectedFormat} Preview</span>
                    </div>
                </div>
            </div>

            {/* CV Preview Content */}
            <div className="p-6">
                <div
                    className="cv-template max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
                    style={{
                        fontFamily: font?.name || 'system-ui',
                        color: colors.text
                    }}
                >
                    {/* Header Section */}
                    <div
                        className="p-8 text-center"
                        style={{
                            background: template.layout === 'creative'
                                ? `linear-gradient(135deg, ${colors.light} 0%, ${colors.primary}20 100%)`
                                : colors.light
                        }}
                    >
                        <h1
                            className="text-4xl font-bold mb-4"
                            style={{ color: colors.primary }}
                        >
                            {cvData.name || 'Your Name'}
                        </h1>

                        {cvData.contact && (
                            <div
                                className="text-lg"
                                style={{ color: colors.secondary }}
                            >
                                {[cvData.contact.email, cvData.contact.phone, cvData.contact.location]
                                    .filter(Boolean)
                                    .join(' • ')}
                            </div>
                        )}
                    </div>

                    {/* Content Sections */}
                    <div className="p-8 space-y-8">
                        {/* Professional Summary */}
                        {cvData.summary && (
                            <div className="cv-section">
                                <h2
                                    className="text-2xl font-bold mb-4 pb-2 border-b-2"
                                    style={{
                                        color: colors.primary,
                                        borderColor: colors.secondary
                                    }}
                                >
                                    Professional Summary
                                </h2>
                                <p className="text-lg leading-relaxed">{cvData.summary}</p>
                            </div>
                        )}

                        {/* Professional Experience */}
                        {cvData.experience && cvData.experience.length > 0 && (
                            <div className="cv-section">
                                <h2
                                    className="text-2xl font-bold mb-6 pb-2 border-b-2"
                                    style={{
                                        color: colors.primary,
                                        borderColor: colors.secondary
                                    }}
                                >
                                    Professional Experience
                                </h2>

                                <div className="space-y-6">
                                    {cvData.experience.map((job, index) => (
                                        <div key={index} className="job-entry">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3
                                                    className="text-xl font-semibold"
                                                    style={{ color: colors.accent }}
                                                >
                                                    {job.title}
                                                </h3>
                                                {job.period && (
                                                    <span
                                                        className="text-sm font-medium px-3 py-1 rounded-full"
                                                        style={{
                                                            backgroundColor: colors.light,
                                                            color: colors.secondary
                                                        }}
                                                    >
                                                        {job.period}
                                                    </span>
                                                )}
                                            </div>

                                            {job.company && (
                                                <h4
                                                    className="text-lg font-medium mb-3"
                                                    style={{ color: colors.primary }}
                                                >
                                                    {job.company}
                                                </h4>
                                            )}

                                            {job.responsibilities && job.responsibilities.length > 0 && (
                                                <ul className="space-y-2">
                                                    {job.responsibilities.map((resp, respIndex) => (
                                                        <li
                                                            key={respIndex}
                                                            className="flex items-start space-x-3"
                                                            style={{ color: colors.text }}
                                                        >
                                                            <span
                                                                className="mt-2 flex-shrink-0 w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: colors.primary }}
                                                            ></span>
                                                            <span>{resp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {cvData.education && cvData.education.length > 0 && (
                            <div className="cv-section">
                                <h2
                                    className="text-2xl font-bold mb-4 pb-2 border-b-2"
                                    style={{
                                        color: colors.primary,
                                        borderColor: colors.secondary
                                    }}
                                >
                                    Education
                                </h2>

                                <div className="space-y-3">
                                    {cvData.education.map((edu, index) => (
                                        <div key={index} className="education-entry">
                                            <h3
                                                className="text-lg font-semibold"
                                                style={{ color: colors.accent }}
                                            >
                                                {edu.degree}
                                            </h3>
                                            {edu.period && (
                                                <p
                                                    className="text-sm"
                                                    style={{ color: colors.secondary }}
                                                >
                                                    {edu.period}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {cvData.skills && cvData.skills.length > 0 && (
                            <div className="cv-section">
                                <h2
                                    className="text-2xl font-bold mb-4 pb-2 border-b-2"
                                    style={{
                                        color: colors.primary,
                                        borderColor: colors.secondary
                                    }}
                                >
                                    Skills
                                </h2>

                                <div className="flex flex-wrap gap-3">
                                    {cvData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: colors.light,
                                                color: colors.primary,
                                                border: `1px solid ${colors.primary}30`
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Template Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Template:</span>
                            <span className="ml-2 text-gray-600">{template.name}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Layout:</span>
                            <span className="ml-2 text-gray-600 capitalize">
                                {template.layout === 'two-column' ? 'Two-column' : 'Single-column'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">ATS Optimized:</span>
                            <span className={`ml-2 ${template.atsOptimized ? 'text-green-600' : 'text-yellow-600'}`}>
                                {template.atsOptimized ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVPreview;
