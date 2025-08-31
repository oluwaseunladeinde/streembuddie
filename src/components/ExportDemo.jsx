import React, { useState } from 'react';
import { Sparkles, Download, Eye, Palette, Type } from 'lucide-react';
import ExportPanel from './ExportPanel';
import CVPreview from './CVPreview';
import { templateUtils } from '../utils/cvTemplates';

const ExportDemo = () => {
    const [showPreview, setShowPreview] = useState(false);

    // Sample CV data for demo
    const sampleFormData = {
        fullName: 'Sarah Johnson',
        location: 'San Francisco, CA',
        company: 'TechCorp',
        role: 'Senior Software Engineer'
    };

    const sampleCVText = `Sarah Johnson
Senior Software Engineer

EXPERIENCE
Senior Software Engineer at TechCorp (2020-2024)
- Led development of microservices architecture serving 1M+ users
- Mentored 5 junior developers and conducted code reviews
- Implemented CI/CD pipelines reducing deployment time by 60%
- Collaborated with product teams to define technical requirements
- Optimized database queries improving performance by 40%

Software Engineer at StartupXYZ (2018-2020)
- Built scalable web applications using React and Node.js
- Worked in agile environment with 2-week sprint cycles
- Integrated third-party APIs and payment systems
- Participated in hackathons and won 2nd place in 2019

EDUCATION
Bachelor of Science in Computer Science
Stanford University (2014-2018)
GPA: 3.8/4.0

SKILLS
JavaScript, React, Node.js, Python, AWS, Docker, Kubernetes, Git, Agile, Leadership, Problem-solving, Team collaboration`;

    const sampleCoverLetter = `Dear Hiring Manager,

I am excited to apply for the Senior Software Engineer position at TechCorp. With over 6 years of experience in full-stack development and a proven track record of leading technical teams, I am confident I can contribute significantly to your engineering organization.

At my current role, I've successfully led the development of microservices architecture that serves over 1 million users, implemented CI/CD pipelines that reduced deployment time by 60%, and mentored 5 junior developers. My experience with modern technologies like React, Node.js, and cloud platforms aligns perfectly with your tech stack.

I am particularly drawn to TechCorp's mission of building innovative solutions that impact millions of users. I would welcome the opportunity to discuss how my technical expertise and leadership experience can contribute to your team's success.

Thank you for considering my application. I look forward to discussing this opportunity further.

Best regards,
Sarah Johnson`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Multi-Format Export & Templates
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the power of professional CV templates with multiple export formats.
                        Choose from 4 beautiful designs, customize colors and fonts, and export as PDF, Word, HTML, or text.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Palette className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">4 Professional Templates</h3>
                        <p className="text-gray-600">Modern, Classic, Creative, and ATS-optimized designs for every industry</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Download className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Export Formats</h3>
                        <p className="text-gray-600">PDF, Word, HTML, and text formats for any application need</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Type className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Customization Options</h3>
                        <p className="text-gray-600">Personalize colors, fonts, and layouts to match your style</p>
                    </div>
                </div>

                {/* Demo Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Export Panel */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Try the Export System</h2>
                        <ExportPanel
                            cvText={sampleCVText}
                            formData={sampleFormData}
                            optimizedCV={sampleCVText}
                            coverLetter={sampleCoverLetter}
                            showOriginal={false}
                            onExportComplete={(result) => console.log('Export completed:', result)}
                        />
                    </div>

                    {/* Preview Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Live Preview</h2>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                            </button>
                        </div>

                        {showPreview && (
                            <CVPreview
                                cvData={{
                                    name: sampleFormData.fullName,
                                    contact: {
                                        email: 'sarah.johnson@email.com',
                                        phone: '+1 (555) 123-4567',
                                        location: sampleFormData.location
                                    },
                                    summary: 'Experienced software engineer with 6+ years in full-stack development, specializing in scalable web applications and team leadership.',
                                    experience: [
                                        {
                                            title: 'Senior Software Engineer',
                                            company: 'TechCorp',
                                            period: '2020-2024',
                                            responsibilities: [
                                                'Led development of microservices architecture serving 1M+ users',
                                                'Mentored 5 junior developers and conducted code reviews',
                                                'Implemented CI/CD pipelines reducing deployment time by 60%'
                                            ]
                                        }
                                    ],
                                    education: [
                                        {
                                            degree: 'Bachelor of Science in Computer Science',
                                            period: 'Stanford University (2014-2018)'
                                        }
                                    ],
                                    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Leadership']
                                }}
                                template={templateUtils.getTemplate('modern')}
                                customColors={{}}
                                customFont={null}
                                selectedFormat="pdf"
                            />
                        )}

                        {!showPreview && (
                            <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                                <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Template Preview</h3>
                                <p className="text-gray-600">Click "Show Preview" to see how your CV will look with the selected template</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Template Showcase */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Available Templates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.values(templateUtils.getAllTemplates()).map((template) => (
                            <div key={template.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                <div
                                    className="h-32 flex items-center justify-center"
                                    style={{ backgroundColor: template.defaultColors.light }}
                                >
                                    <div
                                        className="w-20 h-24 rounded border-2 flex items-center justify-center text-sm font-bold"
                                        style={{
                                            backgroundColor: 'white',
                                            borderColor: template.defaultColors.primary,
                                            color: template.defaultColors.primary
                                        }}
                                    >
                                        {template.layout === 'two-column' ? '2C' : '1C'}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                                    <div className="flex items-center space-x-2 mb-3">
                                        {template.atsOptimized && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                ATS Optimized
                                            </span>
                                        )}
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {template.category}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        <strong>Layout:</strong> {template.layout === 'two-column' ? 'Two-column' : 'Single-column'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportDemo;
