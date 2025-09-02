import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Briefcase, User, Download, Sparkles, Eye, EyeOff, ChevronRight, Check, AlertCircle, BarChart3, History, Settings, RefreshCw, FileEdit } from 'lucide-react';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useCVAnalysis } from './hooks/useCVAnalysis';
import { useSessionManager } from './hooks/useSessionManager';
import { ScoreDisplay, QuickStats, SkillCategoryBreakdown, RecommendationCard } from './components/ScoringComponents';
import ApplicationHistory from './components/ApplicationHistory';
import DataManagement from './components/DataManagement';
import ExportPanel from './components/ExportPanel';
import InlineExportPanel from './components/InlineExportPanel';
import CVPreview from './components/CVPreview';
import CVBuilder from './components/CVBuilder';
import Dashboard from './components/Dashboard';

const StreemBuddie = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    cvFile: null,
    cvText: '',
    company: '',
    role: '',
    jobDescription: ''
  });
  const [optimizedCV, setOptimizedCV] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showAnalysisDashboard, setShowAnalysisDashboard] = useState(true);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [cvCreationMode, setCvCreationMode] = useState('upload'); // 'upload' or 'build'

  // Initialize session manager for auto-save and persistence
  const sessionManager = useSessionManager();

  // Restore session on app load
  useEffect(() => {
    const restoredSession = sessionManager.loadSession();
    if (restoredSession) {
      setFormData(restoredSession.formData);
      setStep(restoredSession.step);
      setShowAnalysisDashboard(restoredSession.showAnalysisDashboard);
      setShowOriginal(restoredSession.showOriginal);
      if (restoredSession.cvCreationMode) {
        setCvCreationMode(restoredSession.cvCreationMode);
      }
    }
  }, [sessionManager]);

  // Auto-save current state whenever relevant data changes
  useEffect(() => {
    sessionManager.autoSave({
      formData,
      step,
      showAnalysisDashboard,
      showOriginal,
      cvCreationMode
    });
  }, [formData, step, showAnalysisDashboard, showOriginal, cvCreationMode, sessionManager]);

  // Simulate CV text extraction from a file with a loading state
  const handleCVUpload = useCallback((file) => {
    setFormData(prev => ({ ...prev, cvFile: file, cvText: '' })); // Reset cvText when new file is uploaded
    setIsExtractingText(true);

    // Simulate PDF/Word text extraction with realistic timing
    setTimeout(() => {
      const simulatedCVText = `${formData.fullName || 'John Doe'}
Software Engineer

EXPERIENCE
Software Developer at TechCorp (2020-2024)
- Developed web applications using JavaScript and React
- Collaborated with cross-functional teams to deliver projects
- Implemented responsive designs and user interfaces
- Worked with databases and backend systems
- Participated in code reviews and agile development

Junior Developer at StartupXYZ (2018-2020)
- Built frontend components using modern frameworks
- Assisted in debugging and testing applications
- Learned various programming languages and tools
- Contributed to team meetings and planning sessions

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2014-2018)

SKILLS
JavaScript, React, HTML, CSS, Python, Git, Agile, Problem-solving, Team collaboration`;

      setFormData(prev => ({ ...prev, cvText: simulatedCVText }));
      setIsExtractingText(false);
    }, 1500);
  }, [formData.fullName]);

  // Initialize drag-and-drop functionality
  const { isDragOver, error: uploadError, dragHandlers, handleFileInputChange } = useDragAndDrop(handleCVUpload);

  // Handler for CV builder
  const handleCVBuilderOutput = useCallback((cvText) => {
    setFormData(prev => ({ ...prev, cvText }));
  }, []);

  // Initialize CV analysis for scoring and insights
  const cvAnalysis = useCVAnalysis(formData.cvText, formData.jobDescription);

  // AI-powered CV optimization
  const optimizeCV = (cvText, jobDescription, role, company) => {
    const jobKeywords = extractKeywords(jobDescription);
    const cvLines = cvText.split('\n').filter(line => line.trim());

    let optimizedLines = cvLines.map(line => {
      // Enhance experience descriptions
      if (line.includes('- ') && !line.includes('EXPERIENCE') && !line.includes('EDUCATION')) {
        return enhanceExperienceBullet(line, jobKeywords, role);
      }

      // Update skills section
      if (line.includes('JavaScript') || line.includes('SKILLS')) {
        return enhanceSkillsLine(line, jobKeywords);
      }

      return line;
    });

    // Add role-specific summary
    const summaryIndex = optimizedLines.findIndex(line => line.includes('EXPERIENCE'));
    if (summaryIndex > 0) {
      const summary = generateRoleSummary(role, jobKeywords, company);
      optimizedLines.splice(summaryIndex, 0, '', 'PROFESSIONAL SUMMARY', summary, '');
    }

    return optimizedLines.join('\n');
  };

  // Extract key terms from job description
  const extractKeywords = (jobDesc) => {
    const commonKeywords = [
      'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker',
      'leadership', 'agile', 'scrum', 'team lead', 'senior', 'architecture',
      'microservices', 'API', 'database', 'frontend', 'backend', 'full-stack',
      'responsive', 'testing', 'CI/CD', 'DevOps', 'cloud', 'kubernetes'
    ];

    return commonKeywords.filter(keyword =>
      jobDesc.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Enhance experience bullets with job-relevant terms
  const enhanceExperienceBullet = (bullet, keywords) => {
    const enhancements = {
      'web applications': 'scalable web applications',
      'JavaScript': 'JavaScript/TypeScript',
      'teams': 'cross-functional agile teams',
      'projects': 'high-impact projects',
      'designs': 'responsive, user-centric designs',
      'systems': 'distributed systems and APIs',
      'development': 'full-stack development'
    };

    let enhanced = bullet;
    Object.entries(enhancements).forEach(([original, replacement]) => {
      if (enhanced.toLowerCase().includes(original) && keywords.some(k => replacement.toLowerCase().includes(k.toLowerCase()))) {
        enhanced = enhanced.replace(new RegExp(original, 'gi'), replacement);
      }
    });

    // Add quantifiable metrics where appropriate
    if (enhanced.includes('Developed') && !enhanced.match(/\d+/)) {
      enhanced = enhanced.replace('Developed', 'Developed 15+ enterprise-grade');
    }

    if (enhanced.includes('Collaborated') && !enhanced.match(/\d+/)) {
      enhanced = enhanced.replace('Collaborated with', 'Led collaboration with 8+');
    }

    return enhanced;
  };

  // Enhance skills section with job-relevant skills
  const enhanceSkillsLine = (line, keywords) => {
    if (line.includes('SKILLS')) return line;

    const additionalSkills = keywords.filter(k =>
      !line.toLowerCase().includes(k.toLowerCase())
    ).slice(0, 3);

    if (additionalSkills.length > 0) {
      return line + ', ' + additionalSkills.join(', ');
    }

    return line;
  };

  // Generate role-specific professional summary
  const generateRoleSummary = (role, keywords, company) => {
    const experience = "4+";
    const keySkills = keywords.slice(0, 4).join(', ');

    return `Experienced ${role} with ${experience} years developing scalable applications and leading technical initiatives. Proven expertise in ${keySkills} with a track record of delivering high-impact solutions. Seeking to leverage technical leadership and innovation skills to drive ${company}'s engineering excellence.`;
  };

  // Generate personalized cover letter
  const generateCoverLetter = (name, company, role, jobDescription) => {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const skills = extractKeywords(jobDescription).slice(0, 3).join(', ');

    return `${date}

Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With over 4 years of experience in software development and a proven track record of delivering scalable applications, I am excited about the opportunity to contribute to your innovative team.

In my current role as a Software Developer at TechCorp, I have successfully led the development of 15+ enterprise-grade web applications using ${skills}. My experience includes collaborating with cross-functional agile teams, implementing responsive user-centric designs, and working with distributed systems and APIs. These experiences have prepared me well for the challenges outlined in your job description.

What particularly excites me about ${company} is your commitment to technological innovation and excellence. Your focus on ${jobDescription.includes('scaling') ? 'scaling solutions' : jobDescription.includes('user') ? 'user experience' : 'cutting-edge technology'} aligns perfectly with my passion for creating impactful software solutions that drive business results.

I am confident that my technical expertise, leadership experience, and collaborative approach would make me a valuable addition to your team. I would welcome the opportunity to discuss how my background in full-stack development and agile methodologies can contribute to ${company}'s continued success.

Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
${name}`;
  };

  // Process the optimization
  const handleOptimize = async () => {
    setIsProcessing(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const optimized = optimizeCV(formData.cvText, formData.jobDescription, formData.role, formData.company);
    const coverLetter = generateCoverLetter(
      formData.fullName,
      formData.company,
      formData.role,
      formData.jobDescription,
      formData.cvText
    );

    setOptimizedCV(optimized);
    setCoverLetter(coverLetter);
    setIsProcessing(false);
    setStep(4);
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Upload CV', icon: Upload },
    { number: 3, title: 'Job Details', icon: Briefcase },
    { number: 4, title: 'Results', icon: Sparkles }
  ];

  // Handler for loading application from history
  const handleLoadFromHistory = useCallback((applicationId) => {
    const restoredData = sessionManager.loadFromHistory(applicationId);
    if (restoredData) {
      setFormData(restoredData.formData);
      setStep(restoredData.step);
      setShowHistory(false); // Close history modal
    }
  }, [sessionManager]);

  // Handler for deleting application from history
  const handleDeleteFromHistory = useCallback((applicationId) => {
    sessionManager.deleteFromHistory(applicationId);
  }, [sessionManager]);

  // Save to history when optimization is complete
  useEffect(() => {
    if (step === 4 && optimizedCV && coverLetter) {
      sessionManager.saveToHistory(formData, {
        optimizedCV,
        coverLetter,
        cvScore: cvAnalysis.score
      });
    }
  }, [step, optimizedCV, coverLetter, formData, cvAnalysis.score, sessionManager]);

  // Utility function for downloading documents (legacy)
  const downloadDocument = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle export completion
  const handleExportComplete = (result) => {
    console.log('Export completed:', result);
    // Could add toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StreemBuddie
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setShowExportPanel(!showExportPanel)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export & Templates</span>
              </button>
              <button
                onClick={() => setShowDataManagement(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Data & Privacy</span>
              </button>
              <div className="text-sm text-gray-500">
                AI-Powered CV Optimization
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const isActive = step === stepItem.number;
            const isCompleted = step > stepItem.number;

            return (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                  : isCompleted
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                    {stepItem.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-gray-300 mx-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Export Panel Overlay */}
        {showExportPanel && (
          <div className="mb-8">
            <ExportPanel
              cvText={formData.cvText}
              formData={formData}
              optimizedCV={optimizedCV}
              coverLetter={coverLetter}
              showOriginal={showOriginal}
              onExportComplete={handleExportComplete}
            />
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-600">Let's start with your basic details</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Application History Section */}
              {sessionManager.hasPreviousWork() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-blue-900 flex items-center">
                      <History className="h-4 w-4 mr-2" />
                      Continue Previous Work
                    </h3>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-xs text-blue-700 hover:text-blue-800 flex items-center"
                    >
                      {showHistory ? 'Hide' : 'Show'} History
                      <ChevronRight className={`h-3 w-3 ml-1 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Session Restoration Notice */}
                  {sessionManager.hasRestoredSession && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                      <div className="flex items-center text-green-800 text-sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Welcome back! Your previous session has been restored.
                      </div>
                    </div>
                  )}

                  {showHistory && (
                    <ApplicationHistory
                      applications={sessionManager.applicationHistory}
                      onLoadApplication={handleLoadFromHistory}
                      onDeleteApplication={handleDeleteFromHistory}
                      compact={true}
                    />
                  )}
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!formData.fullName}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: CV Upload or Builder */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your CV</h2>
                <p className="text-gray-600">Upload your existing CV or build a new one from scratch</p>
              </div>

              {/* CV Creation Mode Toggle */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setCvCreationMode('upload')}
                  className={`flex items-center px-6 py-3 font-medium text-sm focus:outline-none ${
                    cvCreationMode === 'upload'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CV
                </button>
                <button
                  onClick={() => setCvCreationMode('build')}
                  className={`flex items-center px-6 py-3 font-medium text-sm focus:outline-none ${
                    cvCreationMode === 'build'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Build CV
                </button>
              </div>

              {/* CV Upload Mode */}
              {cvCreationMode === 'upload' && (
                <div className="space-y-6">
                  {/* Enhanced Drag & Drop Upload Area */}
                  <div
                    {...dragHandlers}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragOver
                      ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
                      : uploadError
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                  >
                    {/* Drag Overlay */}
                    {isDragOver && (
                      <div className="absolute inset-0 bg-blue-100 bg-opacity-80 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-bounce" />
                          <div className="text-xl font-semibold text-blue-900">Drop your CV here!</div>
                        </div>
                      </div>
                    )}

                    {/* Upload Icon and Text */}
                    <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${uploadError ? 'text-red-400' : isDragOver ? 'text-blue-500' : 'text-gray-400'
                      }`} />

                    <div className={`text-lg font-medium mb-2 ${uploadError ? 'text-red-700' : 'text-gray-900'
                      }`}>
                      {uploadError ? 'Upload Error' : 'Drop your CV here or click to browse'}
                    </div>

                    <div className={`text-sm mb-4 ${uploadError ? 'text-red-600' : 'text-gray-500'
                      }`}>
                      {uploadError ? uploadError : 'Supports PDF and Word documents • Max file size: 10MB'}
                    </div>

                    {/* File Input */}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="cv-upload"
                    />

                    <label
                      htmlFor="cv-upload"
                      className={`inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all transform hover:scale-105 ${uploadError
                        ? 'border border-red-300 text-red-700 bg-white hover:bg-red-50'
                        : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                    >
                      Choose File
                    </label>
                  </div>

                  {/* File Processing Status */}
                  {formData.cvFile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-blue-900">
                              {formData.cvFile.name}
                            </div>
                            <div className="text-xs text-blue-600">
                              {(formData.cvFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>

                        {/* Processing Status */}
                        <div className="text-sm">
                          {isExtractingText ? (
                            <div className="flex items-center text-blue-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                              Extracting text...
                            </div>
                          ) : formData.cvText ? (
                            <div className="text-green-600 flex items-center">
                              <Check className="h-4 w-4 mr-1" />
                              Ready to optimize
                            </div>
                          ) : (
                            <div className="text-gray-500">Processing...</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Help Text */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                          <span className="text-blue-600 text-sm font-medium">💡</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Tips for best results:</h3>
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                          <li>• Use a well-formatted CV with clear sections</li>
                          <li>• Include specific skills and technologies you've used</li>
                          <li>• Make sure your contact information is current</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CV Builder Mode */}
              {cvCreationMode === 'build' && (
                <div className="space-y-6">
                  <CVBuilder 
                    onCVGenerated={handleCVBuilderOutput} 
                    initialData={{ fullName: formData.fullName }}
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.cvText || (cvCreationMode === 'upload' && isExtractingText)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Job Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Application Details</h2>
                <p className="text-gray-600">Provide details about the position you're applying for</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Google, Microsoft, Startup Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Paste the complete job description here..."
                />
              </div>

              {/* Real-time Analysis Preview */}
              {formData.cvText && formData.jobDescription && cvAnalysis.analysis && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-blue-900 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Quick Analysis Preview
                    </h4>
                    <div className="text-xs text-blue-700">
                      Updated in real-time
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className={`text-2xl font-bold ${cvAnalysis.score >= 70 ? 'text-green-600' :
                        cvAnalysis.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {cvAnalysis.score}
                      </div>
                      <div className="text-xs text-gray-600">Overall Score</div>
                    </div>

                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {cvAnalysis.analysis.totalSkillMatches}
                      </div>
                      <div className="text-xs text-gray-600">Skill Matches</div>
                    </div>

                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className={`text-2xl font-bold ${cvAnalysis.analysis.totalMissingSkills <= 3 ? 'text-green-600' :
                        cvAnalysis.analysis.totalMissingSkills <= 7 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {cvAnalysis.analysis.totalMissingSkills}
                      </div>
                      <div className="text-xs text-gray-600">Missing Skills</div>
                    </div>

                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {cvAnalysis.analysis.wordCount}
                      </div>
                      <div className="text-xs text-gray-600">Words</div>
                    </div>
                  </div>

                  {cvAnalysis.analysis.totalMissingSkills > 0 && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <strong>💡 Quick tip:</strong> Consider mentioning these skills:
                      <span className="font-medium text-yellow-800">
                        {cvAnalysis.topMissingSkills.slice(0, 3).map(s => s.skill).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleOptimize}
                  disabled={!formData.company || !formData.role || !formData.jobDescription || isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Optimizing...
                    </div>
                  ) : (
                    'Optimize CV & Generate Cover Letter'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Enhanced Results with Analysis Dashboard */}
          {step === 4 && (
            <div className="space-y-8">
              {/* Header with View Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Optimization Complete!</h2>
                  <p className="text-gray-600">Your CV has been tailored for {formData.role} at {formData.company}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAnalysisDashboard(!showAnalysisDashboard)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showAnalysisDashboard
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{showAnalysisDashboard ? 'Hide' : 'Show'} Analysis</span>
                  </button>
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showOriginal ? 'Hide' : 'Show'} Original</span>
                  </button>
                </div>
              </div>

              {/* CV Analysis Dashboard */}
              {showAnalysisDashboard && cvAnalysis.analysis && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                      CV Analysis Dashboard
                    </h3>
                    <ScoreDisplay score={cvAnalysis.score} size="small" />
                  </div>

                  {/* Quick Stats */}
                  <QuickStats analysis={cvAnalysis.analysis} />

                  {/* Recommendations */}
                  {cvAnalysis.analysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">💡 Recommendations</h4>
                      <div className="grid gap-4">
                        {cvAnalysis.analysis.recommendations.map((rec, index) => (
                          <RecommendationCard key={index} recommendation={rec} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Analysis */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Skills Analysis</h4>
                    <SkillCategoryBreakdown
                      matchesByCategory={cvAnalysis.analysis.matchesByCategory}
                      missingByCategory={cvAnalysis.analysis.missingByCategory}
                    />
                  </div>
                </div>
              )}

              {/* CV and Cover Letter Display */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Optimized CV */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {showOriginal ? 'Original CV' : 'Optimized CV'}
                      {cvAnalysis.analysis && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${cvAnalysis.score >= 80 ? 'bg-green-100 text-green-800' :
                          cvAnalysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          Score: {cvAnalysis.score}/100
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowExportPanel(!showExportPanel)}
                        className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Export & Templates</span>
                      </button>
                      <button
                        onClick={() => downloadDocument(
                          showOriginal ? formData.cvText : optimizedCV,
                          `${formData.fullName.replace(' ', '_')}_CV_${formData.company}.txt`
                        )}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Quick Text</span>
                      </button>
                    </div>
                  </div>

                  {/* Export Panel */}
                  {showExportPanel && (
                    <div className="mt-4">
                      <InlineExportPanel
                        cvText={formData.cvText}
                        formData={formData}
                        optimizedCV={optimizedCV}
                        coverLetter={coverLetter}
                        showOriginal={showOriginal}
                        onExportComplete={handleExportComplete}
                        onClose={() => setShowExportPanel(false)}
                      />
                    </div>
                  )}

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {showOriginal ? formData.cvText : optimizedCV}
                    </pre>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Generated Cover Letter</h3>
                    <button
                      onClick={() => downloadDocument(
                        coverLetter,
                        `${formData.fullName.replace(' ', '_')}_CoverLetter_${formData.company}.txt`
                      )}
                      className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {coverLetter}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    // Clear current session and reset state
                    sessionManager.clearSession();
                    setStep(1);
                    setFormData({
                      fullName: '',
                      cvFile: null,
                      cvText: '',
                      company: '',
                      role: '',
                      jobDescription: ''
                    });
                    setOptimizedCV('');
                    setCoverLetter('');
                    setShowOriginal(false);
                    setShowAnalysisDashboard(true);
                    setShowHistory(false);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Start New Application
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                >
                  Optimize for Another Job
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 StreemBuddie. Empowering job seekers with AI-powered optimization.</p>
            <p className="mt-1">Your data stays private - all processing happens in your browser.</p>
          </div>
        </div>
      </footer>

      {/* Data Management Modal */}
      {showDataManagement && (
        <DataManagement
          sessionManager={sessionManager}
          onClose={() => setShowDataManagement(false)}
        />
      )}

      {/* Dashboard Modal */}
      {showDashboard && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Dashboard onClose={() => setShowDashboard(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StreemBuddie;
