import { useState, useEffect, useCallback, useRef } from 'react';
import { sessionStorage, historyStorage, preferencesStorage, createAutoSaver } from '../utils/localStorage';

/**
 * Custom hook for session management and auto-save functionality
 * Handles data persistence, session restoration, and user preferences
 */
export const useSessionManager = () => {
  const [preferences, setPreferences] = useState(preferencesStorage.loadPreferences());
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  const [applicationHistory, setApplicationHistory] = useState(historyStorage.getHistory());
  const autoSaveRef = useRef();

  // Initialize auto-saver with debouncing
  useEffect(() => {
    autoSaveRef.current = createAutoSaver((data) => {
      if (preferences.autoSave) {
        sessionStorage.saveSession(data.formData, data.step, {
          showAnalysisDashboard: data.showAnalysisDashboard,
          showOriginal: data.showOriginal
        });
      }
    }, 1000); // 1 second delay
  }, [preferences.autoSave]);

  // Load session on app start
  const loadSession = useCallback(() => {
    if (hasRestoredSession) return null;
    
    const session = sessionStorage.loadSession();
    if (session && sessionStorage.hasValidSession()) {
      setHasRestoredSession(true);
      return {
        formData: session.formData,
        step: session.step || 1,
        showAnalysisDashboard: session.showAnalysisDashboard ?? true,
        showOriginal: session.showOriginal ?? false
      };
    }
    
    setHasRestoredSession(true);
    return null;
  }, [hasRestoredSession]);

  // Auto-save current state
  const autoSave = useCallback((data) => {
    if (autoSaveRef.current && preferences.autoSave) {
      autoSaveRef.current(data);
    }
  }, [preferences.autoSave]);

  // Save completed application to history
  const saveToHistory = useCallback((formData, results) => {
    historyStorage.saveApplication(formData, results);
    setApplicationHistory(historyStorage.getHistory());
  }, []);

  // Load application from history
  const loadFromHistory = useCallback((applicationId) => {
    const application = historyStorage.loadApplication(applicationId);
    if (application) {
      return {
        formData: {
          ...application.formData,
          cvFile: null, // Don't restore file for privacy
          cvText: ''    // Don't restore CV text for privacy
        },
        step: 3 // Start at job details since CV needs to be re-uploaded
      };
    }
    return null;
  }, []);

  // Delete application from history
  const deleteFromHistory = useCallback((applicationId) => {
    historyStorage.deleteApplication(applicationId);
    setApplicationHistory(historyStorage.getHistory());
  }, []);

  // Update user preferences
  const updatePreference = useCallback((key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    preferencesStorage.savePreferences(newPreferences);
  }, [preferences]);

  // Clear current session
  const clearSession = useCallback(() => {
    sessionStorage.clearSession();
  }, []);

  // Clear all application history
  const clearHistory = useCallback(() => {
    historyStorage.clearHistory();
    setApplicationHistory([]);
  }, []);

  // Get quick suggestions for autocomplete
  const getQuickSuggestions = useCallback(() => {
    return {
      companies: historyStorage.getRecentCompanies(),
      roles: historyStorage.getRecentRoles()
    };
  }, []);

  // Check if user has previous work
  const hasPreviousWork = useCallback(() => {
    return applicationHistory.length > 0 || sessionStorage.hasValidSession();
  }, [applicationHistory]);

  return {
    // Session management
    loadSession,
    autoSave,
    clearSession,
    hasRestoredSession,
    
    // Application history
    applicationHistory,
    saveToHistory,
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
    
    // Preferences
    preferences,
    updatePreference,
    
    // Utilities
    getQuickSuggestions,
    hasPreviousWork
  };
};
