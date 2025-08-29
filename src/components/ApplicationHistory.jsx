import React from 'react';
import { Clock, Briefcase, User, Trash2, ArrowRight } from 'lucide-react';

/**
 * Application History Component
 * Displays a list of previous applications with options to load or delete
 */
const ApplicationHistory = ({ 
  applications = [], 
  onLoadApplication, 
  onDeleteApplication,
  compact = false
}) => {
  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p className="mb-2">No previous applications found.</p>
        <p className="text-sm">Your application history will appear here.</p>
      </div>
    );
  }

  // Format date to readable format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div 
          key={app.id} 
          className={`border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-all ${compact ? 'text-sm' : ''}`}
        >
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Briefcase className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
              <h3 className="font-medium text-gray-900">{app.formData.role} at {app.formData.company}</h3>
            </div>
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(app.completedAt)}
            </div>
          </div>
          
          {!compact && (
            <div className="px-4 py-3">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <User className="h-4 w-4 mr-2" />
                {app.formData.fullName || 'Anonymous User'}
              </div>
              
              <div className="text-sm text-gray-700 line-clamp-2 mb-3">
                {app.formData.jobDescription.slice(0, 120)}
                {app.formData.jobDescription.length > 120 ? '...' : ''}
              </div>
            </div>
          )}
          
          <div className={`px-4 py-2 flex justify-end space-x-2 border-t border-gray-100 ${compact ? 'bg-gray-50' : ''}`}>
            <button
              onClick={() => onDeleteApplication(app.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
              aria-label="Delete application"
              title="Delete application"
            >
              <Trash2 className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </button>
            
            <button
              onClick={() => onLoadApplication(app.id)}
              className={`flex items-center space-x-1 ${
                compact 
                  ? 'px-2 py-1 text-xs' 
                  : 'px-3 py-1.5 text-sm'
              } bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors`}
            >
              <span>Continue</span>
              <ArrowRight className={`${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationHistory;
