import { useState } from 'react';

/**
 * Custom Hook: useDocumentUpload
 * 
 * Purpose: Encapsulates all file upload logic for any type of document
 * 
 * Features:
 * - File selection and validation
 * - Real API integration for server uploads
 * - Mock mode for development/testing
 * - Error handling and loading states
 * - Support for multiple file types
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.uploadEndpoint - Server endpoint for upload (e.g., '/api/upload')
 * @param {number} config.maxFileSize - Max file size in MB (default: 10)
 * @param {Array<string>} config.allowedFormats - Allowed file extensions (default: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'txt'])
 * @param {boolean} config.useMockMode - Use mock API for testing (default: false)
 * @param {string} config.fileNamePrefix - Prefix for uploaded file name (default: 'DOC')
 * 
 * @returns {Object} {
 *   // State
 *   documentFile,
 *   uploadedDocument,
 *   isUploading,
 *   uploadError,
 * 
 *   // Handlers
 *   handleFileSelect,
 *   handleUploadDocument,
 *   handleClearDocument,
 *   resetUploadState,
 * 
 *   // Utilities
 *   getFileInfo,
 *   isValidFile,
 * }
 */
const useDocumentUpload = (config = {}) => {
  // ===== DEFAULT CONFIGURATION =====
  const {
    uploadEndpoint = '/api/upload/document',
    maxFileSize = 10, // MB
    allowedFormats = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'txt', 'jpg', 'jpeg', 'png', 'gif'],
    useMockMode = false,
    fileNamePrefix = 'DOC',
  } = config;

  // ===== STATE MANAGEMENT =====
  const [documentFile, setDocumentFile] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // ===== VALIDATION UTILITIES =====
  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @returns {Object} { isValid: boolean, error: string|null }
   */
  const isValidFile = (file) => {
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSize) {
      return {
        isValid: false,
        error: `File size (${fileSizeInMB.toFixed(2)}MB) exceeds maximum allowed size (${maxFileSize}MB)`,
      };
    }

    // Check file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File format (.${fileExtension}) is not allowed. Supported formats: ${allowedFormats.join(', ')}`,
      };
    }

    return { isValid: true, error: null };
  };

  /**
   * Get file information
   * @param {File} file - File to get info from
   * @returns {Object} File metadata
   */
  const getFileInfo = (file) => {
    if (!file) return null;
    return {
      name: file.name,
      size: file.size,
      sizeInKB: (file.size / 1024).toFixed(2),
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
      type: file.type,
      extension: file.name.split('.').pop().toLowerCase(),
      lastModified: new Date(file.lastModified).toISOString(),
    };
  };

  // ===== HANDLERS =====

  /**
   * Handle file selection from input
   * @param {Event} e - Input change event
   */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = isValidFile(file);
      if (validation.isValid) {
        setDocumentFile(file);
        setUploadError(null);
      } else {
        setUploadError(validation.error);
        setDocumentFile(null);
        // Clear file input
        if (e.target) e.target.value = '';
      }
    }
  };

  /**
   * Upload document to server
   * @returns {Promise<Object>} Upload response
   */
  const handleUploadDocument = async () => {
    if (!documentFile) {
      setUploadError('Please select a document first');
      return null;
    }

    const validation = isValidFile(documentFile);
    if (!validation.isValid) {
      setUploadError(validation.error);
      return null;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('document', documentFile);
      formData.append('fileNamePrefix', fileNamePrefix);

      let response;

      if (useMockMode) {
        // ===== MOCK API CALL (for testing/development) =====
        response = await mockUploadApi(documentFile);
      } else {
        // ===== REAL API CALL (production) =====
        response = await realUploadApi(formData);
      }

      if (response && response.success) {
        const uploadData = {
          filename: response.filename,
          originalName: response.originalName,
          filePath: response.filePath,
          fileSize: response.fileSize,
          uploadedAt: response.uploadedAt,
          mimeType: documentFile.type,
        };

        setUploadedDocument(uploadData);
        setDocumentFile(null); // Clear selected file
        return uploadData;
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to upload document. Please try again.';
      setUploadError(errorMessage);
      console.error('Document Upload Error:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Clear uploaded and selected documents
   * @param {string} inputId - Optional ID of file input to clear
   */
  const handleClearDocument = (inputId = 'document-input') => {
    setDocumentFile(null);
    setUploadedDocument(null);
    setUploadError(null);

    // Clear file input element
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  /**
   * Reset entire upload state
   */
  const resetUploadState = () => {
    setDocumentFile(null);
    setUploadedDocument(null);
    setIsUploading(false);
    setUploadError(null);
  };

  // ===== API FUNCTIONS =====

  /**
   * Mock API for testing (simulates server response)
   * @param {File} file - File to upload
   * @returns {Promise<Object>} Mock response
   */
  const mockUploadApi = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const serverFilename = `${fileNamePrefix}_${timestamp}.${fileExtension}`;
        const filePath = `/uploads/documents/${serverFilename}`;

        resolve({
          success: true,
          filename: serverFilename,
          originalName: file.name,
          filePath: filePath,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        });
      }, 1500); // Simulate network delay
    });
  };

  /**
   * Real API call to server
   * @param {FormData} formData - Form data with file
   * @returns {Promise<Object>} Server response
   */
  const realUploadApi = async (formData) => {
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser handles it
        // 'Authorization': 'Bearer ' + token // Add if needed
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  };

  // ===== RETURN PUBLIC API =====
  return {
    // State
    documentFile,
    uploadedDocument,
    isUploading,
    uploadError,

    // Handlers
    handleFileSelect,
    handleUploadDocument,
    handleClearDocument,
    resetUploadState,

    // Utilities
    getFileInfo,
    isValidFile,
  };
};

export default useDocumentUpload;
