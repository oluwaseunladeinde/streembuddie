import { useState, useEffect, useMemo } from 'react';
import { generateAnalysisReport } from '../utils/cvAnalysis';

/**
 * Custom hook for CV analysis and scoring
 * Manages analysis state and provides real-time scoring updates
 */
export const useCVAnalysis = (cvText, jobDescription) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Memoize the analysis to avoid unnecessary recalculations
  const memoizedAnalysis = useMemo(() => {
    if (!cvText || !jobDescription) return null;
    return generateAnalysisReport(cvText, jobDescription);
  }, [cvText, jobDescription]);

  // Update analysis when CV or job description changes
  useEffect(() => {
    if (!cvText || !jobDescription) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    
    // Add a small delay to simulate processing and smooth the UI
    const timer = setTimeout(() => {
      setAnalysis(memoizedAnalysis);
      setIsAnalyzing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [memoizedAnalysis]);

  // Get score color for UI components
  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  // Get score status text
  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent Match!';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  // Check if analysis shows good optimization potential
  const hasOptimizationPotential = useMemo(() => {
    if (!analysis) return false;
    return analysis.score < 70 || analysis.totalMissingSkills > 3;
  }, [analysis]);

  // Get top missing skills for quick display
  const topMissingSkills = useMemo(() => {
    if (!analysis) return [];
    return analysis.missingSkills.slice(0, 5);
  }, [analysis]);

  // Get skill matches by category for visualization
  const skillsByCategory = useMemo(() => {
    if (!analysis) return {};
    return analysis.matchesByCategory;
  }, [analysis]);

  return {
    analysis,
    isAnalyzing,
    hasOptimizationPotential,
    topMissingSkills,
    skillsByCategory,
    getScoreColor,
    getScoreStatus,
    // Helper methods for UI components
    scoreColor: analysis ? getScoreColor(analysis.score) : 'gray',
    scoreStatus: analysis ? getScoreStatus(analysis.score) : 'No data',
    score: analysis?.score || 0,
    isReady: Boolean(analysis && !isAnalyzing)
  };
};
