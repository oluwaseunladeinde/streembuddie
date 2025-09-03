import React, { useState, useEffect } from 'react';
import { Download, Eye, Palette, FileText, FileEdit, Globe, Type as TypeIcon, Check, ChevronDown, X } from 'lucide-react';
import { cvTemplates, exportFormats, colorSchemes, fontOptions, templateUtils } from '../utils/cvTemplates';
import { exportCV } from '../utils/cvExport';

const InlineExportPanel = ({ cvText, formData, optimizedCV, coverLetter, showOriginal, onExportComplete, onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [selectedFormat, setSelectedFormat] = useState('pdf');
    const [customColors, setCustomColors] = useState({});
    const [customFont, setCustomFont] = useState(null);
    const [showCustomization, setShowCustomization] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState(null);

    // Get current CV content based on showOriginal state
    const currentCVContent = showOriginal ? formData.cvText : optimizedCV;
    const currentTemplate = templateUtils.getTemplate(selectedTemplate);
    const currentFormat = exportFormats[selectedFormat];

    // Reset custom colors when template changes
    useEffect(() => {
        setCustomColors({});
        setCustomFont(null);
    }, [selectedTemplate]);

    // Handle export
    const handleExport = async () => {
        if (!currentCVContent.trim()) {
            setExportStatus({ type: 'error', message: 'No CV content to export' });
            return;
        }

        setIsExporting(true);
        setExportStatus({ type: 'info', message: 'Preparing export...' });

        try {
            const customOptions = {
                colors: customColors,
                font: customFont
            };

            const result = await exportCV(
                currentCVContent,
                formData,
                currentTemplate,
                selectedFormat,
                customOptions
            );

            if (result.success) {
                setExportStatus({
                    type: 'success',
                    message: `${currentFormat.name} exported successfully as ${result.filename}`
                });
                onExportComplete?.(result);
            } else {
                setExportStatus({
                    type: 'error',
                    message: `Export failed: ${result.error}`
                });
            }
        } catch (error) {
            setExportStatus({
                type: 'error',
                message: `Export error: ${error.message}`
            });
        } finally {
            setIsExporting(false);
        }
    };

    // Export cover letter
    const handleCoverLetterExport = async () => {
        if (!coverLetter.trim()) {
            setExportStatus({ type: 'error', message: 'No cover letter to export' });
            return;
        }

        setIsExporting(true);
        setExportStatus({ type: 'info', message: 'Exporting cover letter...' });

        try {
            const blob = new Blob([coverLetter], { type: 'text/plain' });
            const filename = `${formData.fullName.replace(/\s+/g, '_')}_CoverLetter_${formData.company || 'Company'}.txt`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setExportStatus({
                type: 'success',
                message: `Cover letter exported as ${filename}`
            });
        } catch (error) {
            setExportStatus({
                type: 'error',
                message: `Export error: ${error.message}`
            });
        } finally {
            setIsExporting(false);
        }
    };

    // Helper function to truncate text
    const truncateText = (text, maxLength = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 shadow-lg">
            {/* Header with close button */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Export & Templates</h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="h-4 w-4 text-gray-500" />
                </button>
            </div>

            {/* Template Selection - Single Column */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Choose Template</h4>
                <div className="space-y-2">
                    {Object.values(cvTemplates).map((template) => (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-sm ${selectedTemplate === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {selectedTemplate === template.id && (
                                <div className="absolute top-2 right-2">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                            )}

                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-12 rounded border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{
                                        backgroundColor: template.defaultColors.light,
                                        borderColor: template.defaultColors.primary,
                                        color: template.defaultColors.primary
                                    }}
                                >
                                    {template.layout === 'two-column' ? '2C' : '1C'}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 truncate" title={template.name}>
                                        {template.name}
                                    </h5>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2" title={template.description}>
                                        {truncateText(template.description, 60)}
                                    </p>

                                    <div className="flex items-center space-x-2 mt-2">
                                        {template.atsOptimized && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                                                ATS
                                            </span>
                                        )}
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex-shrink-0">
                                            {template.category.length > 8 ? template.category.substring(0, 8) + '...' : template.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Export Format Selection - Single Column */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Export Format</h4>
                <div className="space-y-2">
                    {Object.values(exportFormats).map((format) => (
                        <div
                            key={format.id}
                            onClick={() => setSelectedFormat(format.id)}
                            className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-sm ${selectedFormat === format.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {selectedFormat === format.id && (
                                <div className="absolute top-2 right-2">
                                    <Check className="h-4 w-4 text-blue-600" />
                                </div>
                            )}

                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
                                    {format.id === 'pdf' && <FileText className="h-4 w-4 text-red-600" />}
                                    {format.id === 'docx' && <FileEdit className="h-4 w-4 text-blue-600" />}
                                    {format.id === 'html' && <Globe className="h-4 w-4 text-green-600" />}
                                    {format.id === 'txt' && <TypeIcon className="h-4 w-4 text-gray-600" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate" title={format.name}>
                                        {format.name}
                                    </div>
                                    {format.recommended && (
                                        <span className="text-xs text-blue-600 font-medium">Recommended</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Compact Customization Options */}
            <div className="space-y-3">
                <button
                    onClick={() => setShowCustomization(!showCustomization)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                    <ChevronDown className={`h-4 w-4 transition-transform ${showCustomization ? 'rotate-180' : ''}`} />
                    <span className="font-medium">Customization</span>
                </button>

                {showCustomization && (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                        {/* Color Scheme */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700 flex items-center space-x-2">
                                <Palette className="h-3 w-3" />
                                <span>Colors</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(colorSchemes).map(([key, scheme]) => (
                                    <div
                                        key={key}
                                        onClick={() => setCustomColors(scheme)}
                                        className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${JSON.stringify(customColors) === JSON.stringify(scheme)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex space-x-1 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scheme.primary }}></div>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scheme.secondary }}></div>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scheme.accent }}></div>
                                        </div>
                                        <div className="text-xs font-medium text-gray-700 capitalize truncate" title={key}>
                                            {key}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Font Options */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700 flex items-center space-x-2">
                                <TypeIcon className="h-3 w-3" />
                                <span>Font</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(fontOptions).map(([key, font]) => (
                                    <div
                                        key={key}
                                        onClick={() => setCustomFont(key)}
                                        className={`cursor-pointer rounded-lg border-2 p-2 text-center transition-all ${customFont === key
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-xs font-medium text-gray-900 capitalize truncate" title={key}>
                                            {key}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Export Actions */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleExport}
                        disabled={isExporting || !currentCVContent.trim()}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {isExporting ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        <span>
                            {isExporting ? 'Exporting...' : `Export as ${currentFormat.name}`}
                        </span>
                    </button>

                    {coverLetter && (
                        <button
                            onClick={handleCoverLetterExport}
                            disabled={isExporting}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            <Download className="h-4 w-4" />
                            <span>Cover Letter</span>
                        </button>
                    )}
                </div>

                {/* Export Status */}
                {exportStatus && (
                    <div className={`p-2 rounded-lg text-xs ${exportStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                        exportStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                            'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                        {exportStatus.message}
                    </div>
                )}
            </div>

            {/* Compact Template Info */}
            <div className="bg-gray-50 rounded-lg p-3 text-xs">
                <div className="space-y-1 text-gray-600">
                    <p><strong>Template:</strong> {currentTemplate.name}</p>
                    <p><strong>Layout:</strong> {currentTemplate.layout === 'two-column' ? 'Two-column' : 'Single-column'}</p>
                    <p><strong>ATS:</strong> {currentTemplate.atsOptimized ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>
    );
};

export default InlineExportPanel;
