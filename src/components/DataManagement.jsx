import React, { useState } from 'react';
import { Settings, Trash2, Download, Shield, AlertTriangle, Check, X, ChevronRight } from 'lucide-react';
import { dataExport } from '../utils/localStorage';

/**
 * Data Management Component
 * Provides privacy controls, data export, and storage management
 */
const DataManagement = ({ sessionManager, onClose }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [storageInfo, setStorageInfo] = useState(dataExport.getStorageInfo());

  // Refresh storage info when actions are performed
  const refreshStorageInfo = () => {
    setStorageInfo(dataExport.getStorageInfo());
  };

  // Handle exporting all data
  const handleExportData = () => {
    dataExport.exportAllData();
  };

  // Handle clearing all data with confirmation
  const handleClearAllData = () => {
    if (showDeleteConfirm) {
      dataExport.clearAllData();
      sessionManager.clearHistory();
      sessionManager.clearSession();
      refreshStorageInfo();
      setShowDeleteConfirm(false);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  // Handle clearing just application history
  const handleClearHistory = () => {
    sessionManager.clearHistory();
    refreshStorageInfo();
  };

  // Toggle auto-save preference
  const toggleAutoSave = () => {
    sessionManager.updatePreference('autoSave', !sessionManager.preferences.autoSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Storage Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Storage Overview
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <div className="text-gray-600">Current Session</div>
                <div className="font-medium text-gray-900">
                  {storageInfo.hasCurrentSession ? 'Active' : 'None'}
                </div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-gray-600">Application History</div>
                <div className="font-medium text-gray-900">
                  {storageInfo.historyCount} applications
                </div>
              </div>
            </div>
            {storageInfo.oldestApplication && (
              <div className="mt-3 text-xs text-blue-700">
                Oldest data: {storageInfo.oldestApplication.toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Privacy Settings</h3>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Auto-save Progress</div>
                <div className="text-sm text-gray-600">Automatically save your work as you type</div>
              </div>
              <button
                onClick={toggleAutoSave}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  sessionManager.preferences.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    sessionManager.preferences.autoSave ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-800">Privacy Notice</div>
                  <div className="text-yellow-700 mt-1">
                    All data is stored locally in your browser. CV files and text are never saved to history for privacy.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Data Actions</h3>
            
            <div className="grid gap-3">
              {/* Export Data */}
              <button
                onClick={handleExportData}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center">
                  <Download className="h-4 w-4 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Export Your Data</div>
                    <div className="text-sm text-gray-600">Download all your data as JSON</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>

              {/* Clear History */}
              {storageInfo.historyCount > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center justify-between p-3 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <Trash2 className="h-4 w-4 text-orange-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Clear Application History</div>
                      <div className="text-sm text-gray-600">Remove {storageInfo.historyCount} saved applications</div>
                    </div>
                  </div>
                </button>
              )}

              {/* Clear All Data */}
              <button
                onClick={handleClearAllData}
                className={`flex items-center justify-between p-3 border rounded-lg transition-colors text-left ${
                  showDeleteConfirm
                    ? 'border-red-400 bg-red-50'
                    : 'border-red-200 hover:bg-red-50'
                }`}
              >
                <div className="flex items-center">
                  <Trash2 className="h-4 w-4 text-red-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {showDeleteConfirm ? 'Click again to confirm' : 'Clear All Data'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {showDeleteConfirm 
                        ? 'This will permanently delete all stored data'
                        : 'Remove all sessions, history, and preferences'
                      }
                    </div>
                  </div>
                </div>
                {showDeleteConfirm && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(false);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">About Your Data</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All data is stored locally in your browser only</li>
              <li>• CV files and extracted text are never saved to history</li>
              <li>• Session data is automatically cleared after 24 hours</li>
              <li>• You can export your data at any time</li>
              <li>• Clearing your browser data will remove all StreemBuddie information</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
