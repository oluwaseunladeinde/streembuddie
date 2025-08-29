import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, TrendingUp, Target, Users, Award } from 'lucide-react';

/**
 * Animated progress bar with color coding
 */
export const ProgressBar = ({ value, max = 100, label, className = '' }) => {
  const percentage = Math.round((value / max) * 100);
  
  const getColorClasses = (percent) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 60) return 'bg-yellow-500';
    if (percent >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-bold text-gray-900">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getColorClasses(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Score card with icon and description
 */
export const ScoreCard = ({ title, value, description, icon: Icon, type = 'default' }) => {
  const getCardClasses = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconClasses = (type) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`p-4 border rounded-lg transition-all hover:shadow-md ${getCardClasses(type)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className={`h-6 w-6 ${getIconClasses(type)}`} />}
          <div>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        </div>
      </div>
      {description && (
        <div className="mt-2 text-xs opacity-75">{description}</div>
      )}
    </div>
  );
};

/**
 * Skill match visualization component
 */
export const SkillMatch = ({ skill, category, isMatched = true, priority = 0 }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': 'bg-blue-100 text-blue-800 border-blue-200',
      'Backend': 'bg-green-100 text-green-800 border-green-200',
      'Database': 'bg-purple-100 text-purple-800 border-purple-200',
      'Cloud': 'bg-orange-100 text-orange-800 border-orange-200',
      'Tools': 'bg-gray-100 text-gray-800 border-gray-200',
      'Soft Skills': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[category] || colors['Tools'];
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
      isMatched 
        ? `${getCategoryColor(category)} hover:shadow-sm` 
        : 'bg-red-50 text-red-700 border-red-200 opacity-75'
    }`}>
      <span>{skill}</span>
      {priority > 1 && !isMatched && (
        <span className="bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">
          High Priority
        </span>
      )}
      {isMatched && (
        <CheckCircle className="h-3 w-3" />
      )}
    </div>
  );
};

/**
 * Recommendation card component
 */
export const RecommendationCard = ({ recommendation }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'critical': return XCircle;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getClasses = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const Icon = getIcon(recommendation.type);

  return (
    <div className={`p-4 border rounded-lg ${getClasses(recommendation.type)}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getIconColor(recommendation.type)}`} />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{recommendation.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
          <p className="text-xs font-medium text-gray-700 mt-2 bg-white bg-opacity-50 px-2 py-1 rounded">
            💡 {recommendation.action}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Overall score display with animated circle
 */
export const ScoreDisplay = ({ score, size = 'large' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const sizeClasses = size === 'large' 
    ? 'h-32 w-32 text-3xl'
    : 'h-20 w-20 text-xl';

  return (
    <div className="text-center">
      <div className={`mx-auto ${sizeClasses} flex items-center justify-center rounded-full border-4 border-gray-200 bg-white shadow-lg`}>
        <div>
          <div className={`font-bold ${getScoreColor(score)}`}>{score}</div>
          <div className="text-xs text-gray-500 font-medium">/ 100</div>
        </div>
      </div>
      <div className={`mt-2 text-sm font-medium ${getScoreColor(score)}`}>
        {getScoreLabel(score)}
      </div>
    </div>
  );
};

/**
 * Quick stats overview component
 */
export const QuickStats = ({ analysis }) => {
  const stats = [
    {
      label: 'Overall Score',
      value: `${analysis.score}/100`,
      icon: Award,
      type: analysis.score >= 70 ? 'success' : analysis.score >= 50 ? 'warning' : 'error'
    },
    {
      label: 'Skill Matches',
      value: analysis.totalSkillMatches,
      icon: Target,
      type: analysis.totalSkillMatches >= 5 ? 'success' : 'info'
    },
    {
      label: 'Missing Skills',
      value: analysis.totalMissingSkills,
      icon: TrendingUp,
      type: analysis.totalMissingSkills <= 3 ? 'success' : analysis.totalMissingSkills <= 7 ? 'warning' : 'error'
    },
    {
      label: 'Word Count',
      value: analysis.wordCount,
      icon: Users,
      type: (analysis.wordCount >= 400 && analysis.wordCount <= 800) ? 'success' : 'info'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <ScoreCard
          key={index}
          title={stat.label}
          value={stat.value}
          icon={stat.icon}
          type={stat.type}
        />
      ))}
    </div>
  );
};

/**
 * Skills category breakdown component
 */
export const SkillCategoryBreakdown = ({ matchesByCategory, missingByCategory }) => {
  return (
    <div className="space-y-4">
      {Object.keys(matchesByCategory).map(category => {
        const matches = matchesByCategory[category] || [];
        const missing = missingByCategory[category] || [];
        const total = matches.length + missing.length;
        
        if (total === 0) return null;
        
        const matchPercentage = total > 0 ? (matches.length / total) * 100 : 0;
        
        return (
          <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">{category}</h4>
              <span className="text-sm text-gray-500">
                {matches.length} / {total} skills
              </span>
            </div>
            
            <ProgressBar value={matchPercentage} className="mb-3" />
            
            <div className="space-y-2">
              {matches.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-green-700 mb-1">✅ Found in your CV:</div>
                  <div className="flex flex-wrap gap-1">
                    {matches.map(match => (
                      <SkillMatch 
                        key={match.skill} 
                        skill={match.skill} 
                        category={category}
                        isMatched={true}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {missing.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-red-700 mb-1">❌ Missing skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {missing.slice(0, 5).map(miss => (
                      <SkillMatch 
                        key={miss.skill} 
                        skill={miss.skill} 
                        category={category}
                        isMatched={false}
                        priority={miss.priority}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
