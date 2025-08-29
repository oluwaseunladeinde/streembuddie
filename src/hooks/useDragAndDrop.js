import { useState, useCallback } from 'react';

/**
 * Custom hook for drag-and-drop file upload functionality
 * Provides drag state management and file validation
 */
export const useDragAndDrop = (onFileSelect, acceptedTypes = ['.pdf', '.doc', '.docx']) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [error, setError] = useState('');

  // Validate file type and size
  const validateFile = useCallback((file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!acceptedTypes.includes(fileExtension)) {
      return `Please upload a valid file type: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }
    
    return null;
  }, [acceptedTypes]);

  // Handle drag enter
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => prev + 1);
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
      setError('');
    }
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    setDragCounter(0);
    setError('');
    
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) {
      setError('No files were dropped');
      return;
    }
    
    if (files.length > 1) {
      setError('Please upload only one file at a time');
      return;
    }
    
    const file = files[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  // Handle file input change (for click to upload)
  const handleFileInputChange = useCallback((e) => {
    setError('');
    const file = e.target.files[0];
    
    if (!file) return;
    
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  return {
    isDragOver,
    error,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    },
    handleFileInputChange
  };
};
