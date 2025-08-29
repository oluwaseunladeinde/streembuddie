/**
 * Local Storage Utilities for StreemBuddie
 * Handles data persistence, session management, and application history
 */

// Storage keys
const STORAGE_KEYS = {
  CURRENT_SESSION: 'streembuddie-current-session',
  APPLICATION_HISTORY: 'streembuddie-application-history',
  USER_PREFERENCES: 'streembuddie-user-preferences'
};

/**
 * Safe localStorage operations with error handling
 */
const safeStorage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set ${key} in localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      // Only clear StreemBuddie keys, not all localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.warn('Failed to clear StreemBuddie data:', error);
      return false;
    }
  }
};

/**
 * Current session management
 */
export const sessionStorage = {
  // Save current form data
  saveSession: (formData, step = 1, additionalData = {}) => {
    const sessionData = {
      formData,
      step,
      timestamp: Date.now(),
      ...additionalData
    };
    return safeStorage.set(STORAGE_KEYS.CURRENT_SESSION, sessionData);
  },

  // Load current session
  loadSession: () => {
    return safeStorage.get(STORAGE_KEYS.CURRENT_SESSION);
  },

  // Clear current session
  clearSession: () => {
    return safeStorage.remove(STORAGE_KEYS.CURRENT_SESSION);
  },

  // Check if session exists and is recent (within 24 hours)
  hasValidSession: () => {
    const session = safeStorage.get(STORAGE_KEYS.CURRENT_SESSION);
    if (!session) return false;
    
    const dayInMs = 24 * 60 * 60 * 1000;
    return (Date.now() - session.timestamp) < dayInMs;
  }
};

/**
 * Application history management
 */
export const historyStorage = {
  // Save completed application to history
  saveApplication: (formData, results = {}) => {
    const applications = safeStorage.get(STORAGE_KEYS.APPLICATION_HISTORY) || [];
    
    const application = {
      id: Date.now().toString(),
      formData: {
        fullName: formData.fullName,
        company: formData.company,
        role: formData.role,
        jobDescription: formData.jobDescription
        // Note: We don't save cvFile or cvText for privacy
      },
      results,
      completedAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Add to beginning and limit to 10 most recent
    const updatedApplications = [application, ...applications].slice(0, 10);
    
    return safeStorage.set(STORAGE_KEYS.APPLICATION_HISTORY, updatedApplications);
  },

  // Get application history
  getHistory: () => {
    return safeStorage.get(STORAGE_KEYS.APPLICATION_HISTORY) || [];
  },

  // Load specific application by ID
  loadApplication: (id) => {
    const applications = safeStorage.get(STORAGE_KEYS.APPLICATION_HISTORY) || [];
    return applications.find(app => app.id === id);
  },

  // Delete application from history
  deleteApplication: (id) => {
    const applications = safeStorage.get(STORAGE_KEYS.APPLICATION_HISTORY) || [];
    const filtered = applications.filter(app => app.id !== id);
    return safeStorage.set(STORAGE_KEYS.APPLICATION_HISTORY, filtered);
  },

  // Clear all history
  clearHistory: () => {
    return safeStorage.remove(STORAGE_KEYS.APPLICATION_HISTORY);
  },

  // Get recent companies for quick suggestions
  getRecentCompanies: () => {
    const applications = safeStorage.get(STORAGE_KEYS.APPLICATION_HISTORY) || [];
    const companies = [...new Set(applications.map(app => app.formData.company).filter(Boolean))];
    return companies.slice(0, 5);
  },

  // Get recent roles for quick suggestions
  getRecentRoles: () => {
    const applications = safeStorage.get(STORAGE_KEYS.APPLICATION_HISTORY) || [];
    const roles = [...new Set(applications.map(app => app.formData.role).filter(Boolean))];
    return roles.slice(0, 5);
  }
};

/**
 * User preferences management
 */
export const preferencesStorage = {
  // Save user preferences
  savePreferences: (preferences) => {
    const current = safeStorage.get(STORAGE_KEYS.USER_PREFERENCES) || {};
    const updated = { ...current, ...preferences };
    return safeStorage.set(STORAGE_KEYS.USER_PREFERENCES, updated);
  },

  // Load user preferences
  loadPreferences: () => {
    return safeStorage.get(STORAGE_KEYS.USER_PREFERENCES) || {
      showAnalysisDashboard: true,
      autoSave: true,
      showTips: true
    };
  },

  // Update specific preference
  updatePreference: (key, value) => {
    const preferences = safeStorage.get(STORAGE_KEYS.USER_PREFERENCES) || {};
    preferences[key] = value;
    return safeStorage.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }
};

/**
 * Data export and privacy utilities
 */
export const dataExport = {
  // Export all user data as JSON
  exportAllData: () => {
    const data = {
      currentSession: safeStorage.get(STORAGE_KEYS.CURRENT_SESSION),
      applicationHistory: safeStorage.get(STORAGE_KEYS.APPLICATION_HISTORY),
      userPreferences: safeStorage.get(STORAGE_KEYS.USER_PREFERENCES),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streembuddie-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Get storage usage info
  getStorageInfo: () => {
    const session = safeStorage.get(STORAGE_KEYS.CURRENT_SESSION);
    const history = safeStorage.get(STORAGE_KEYS.APPLICATION_HISTORY) || [];
    const preferences = safeStorage.get(STORAGE_KEYS.USER_PREFERENCES);
    
    return {
      hasCurrentSession: Boolean(session),
      historyCount: history.length,
      hasPreferences: Boolean(preferences),
      oldestApplication: history.length > 0 ? new Date(history[history.length - 1].timestamp) : null,
      newestApplication: history.length > 0 ? new Date(history[0].timestamp) : null
    };
  },

  // Clear all data (for privacy)
  clearAllData: () => {
    return safeStorage.clear();
  }
};

/**
 * Auto-save debouncing utility
 */
export const createAutoSaver = (saveFunction, delay = 1000) => {
  let timeoutId;
  
  return (data) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      saveFunction(data);
    }, delay);
  };
};
