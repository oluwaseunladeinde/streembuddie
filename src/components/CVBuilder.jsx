import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * CV Builder Component
 * Provides a form-based alternative to CV upload
 */
const CVBuilder = ({ onCVGenerated, initialData = {} }) => {
  // State for form sections
  const [personalInfo, setPersonalInfo] = useState({
    fullName: initialData.fullName || '',
    title: initialData.title || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
  });

  const [experiences, setExperiences] = useState(initialData.experiences || [
    { company: '', position: '', period: '', responsibilities: [''] }
  ]);

  const [education, setEducation] = useState(initialData.education || [
    { institution: '', degree: '', period: '', details: '' }
  ]);

  const [skills, setSkills] = useState(initialData.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    experience: true,
    education: true,
    skills: true
  });

  // Generate CV text whenever form data changes
  useEffect(() => {
    const generateCV = () => {
      // Skip if essential fields are empty
      if (!personalInfo.fullName) return;

      let cvText = `${personalInfo.fullName}\n`;
      if (personalInfo.title) cvText += `${personalInfo.title}\n`;
      
      // Add contact info if available
      const contactInfo = [];
      if (personalInfo.email) contactInfo.push(personalInfo.email);
      if (personalInfo.phone) contactInfo.push(personalInfo.phone);
      if (contactInfo.length > 0) cvText += `${contactInfo.join(' | ')}\n`;
      
      // Add experience section
      if (experiences.length > 0 && experiences[0].company) {
        cvText += '\nEXPERIENCE\n';
        experiences.forEach(exp => {
          if (exp.company && exp.position) {
            cvText += `${exp.position} at ${exp.company}`;
            if (exp.period) cvText += ` (${exp.period})`;
            cvText += '\n';
            
            // Add responsibilities
            exp.responsibilities.forEach(resp => {
              if (resp) cvText += `- ${resp}\n`;
            });
            cvText += '\n';
          }
        });
      }
      
      // Add education section
      if (education.length > 0 && education[0].institution) {
        cvText += 'EDUCATION\n';
        education.forEach(edu => {
          if (edu.degree && edu.institution) {
            cvText += `${edu.degree}\n${edu.institution}`;
            if (edu.period) cvText += ` (${edu.period})`;
            cvText += '\n';
            if (edu.details) cvText += `${edu.details}\n`;
            cvText += '\n';
          }
        });
      }
      
      // Add skills section
      if (skills.length > 0) {
        cvText += 'SKILLS\n';
        cvText += skills.join(', ');
      }
      
      // Pass the generated CV text to the parent component
      onCVGenerated(cvText);
    };
    
    generateCV();
  }, [personalInfo, experiences, education, skills, onCVGenerated]);

  // Handlers for form updates
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    setExperiences(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleResponsibilityChange = (expIndex, respIndex, value) => {
    setExperiences(prev => {
      const updated = [...prev];
      updated[expIndex].responsibilities[respIndex] = value;
      return updated;
    });
  };

  const addResponsibility = (expIndex) => {
    setExperiences(prev => {
      const updated = [...prev];
      updated[expIndex].responsibilities.push('');
      return updated;
    });
  };

  const removeResponsibility = (expIndex, respIndex) => {
    setExperiences(prev => {
      const updated = [...prev];
      updated[expIndex].responsibilities.splice(respIndex, 1);
      return updated;
    });
  };

  const addExperience = () => {
    setExperiences(prev => [
      ...prev,
      { company: '', position: '', period: '', responsibilities: [''] }
    ]);
  };

  const removeExperience = (index) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, field, value) => {
    setEducation(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addEducation = () => {
    setEducation(prev => [
      ...prev,
      { institution: '', degree: '', period: '', details: '' }
    ]);
  };

  const removeEducation = (index) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('personal')}
        >
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          {expandedSections.personal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.personal && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={personalInfo.fullName}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={personalInfo.title}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('experience')}
        >
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          {expandedSections.experience ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.experience && (
          <div className="p-4 space-y-6">
            {experiences.map((exp, expIndex) => (
              <div key={expIndex} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-800">Position {expIndex + 1}</h4>
                  {experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(expIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(expIndex, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="TechCorp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position/Title
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(expIndex, 'position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Software Developer"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => handleExperienceChange(expIndex, 'period', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2020-2024"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsibilities & Achievements
                  </label>
                  {exp.responsibilities.map((resp, respIndex) => (
                    <div key={respIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => handleResponsibilityChange(expIndex, respIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Developed web applications using JavaScript and React"
                      />
                      {exp.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResponsibility(expIndex, respIndex)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addResponsibility(expIndex)}
                    className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" /> Add Responsibility
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addExperience}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} className="mr-1" /> Add Another Position
            </button>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('education')}
        >
          <h3 className="text-lg font-medium text-gray-900">Education</h3>
          {expandedSections.education ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.education && (
          <div className="p-4 space-y-6">
            {education.map((edu, eduIndex) => (
              <div key={eduIndex} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-800">Education {eduIndex + 1}</h4>
                  {education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(eduIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(eduIndex, 'institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="University of Technology"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree/Certification
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(eduIndex, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bachelor of Science in Computer Science"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => handleEducationChange(eduIndex, 'period', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2014-2018"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Details
                  </label>
                  <textarea
                    value={edu.details}
                    onChange={(e) => handleEducationChange(eduIndex, 'details', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Relevant coursework, achievements, GPA, etc."
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} className="mr-1" /> Add Another Education
            </button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
          onClick={() => toggleSection('skills')}
        >
          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
          {expandedSections.skills ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.skills && (
          <div className="p-4 space-y-4">
            <div className="flex items-center">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a skill (e.g., JavaScript, React, Project Management)"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-gray-500 text-sm">No skills added yet. Add some skills to improve your CV score.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preview Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          Your CV is being generated automatically as you fill out the form. You'll be able to review and optimize it in the next steps.
        </p>
      </div>
    </div>
  );
};

export default CVBuilder;