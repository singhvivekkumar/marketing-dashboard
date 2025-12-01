// components/upload/ExcelUpload.jsx - Excel Upload Component

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { readExcelFile, validateExcelData, generateSampleExcel } from './excelUtils';

const ExcelUpload = ({
  fields = [],
  onUpload,
  formType = 'data',
  title = 'Bulk Upload'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      processFile(droppedFiles[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile) => {
    setError(null);
    setResult(null);

    // Validate file type
    if (!selectedFile.name.match(/\.xlsx?$/)) {
      setError('Please select a valid Excel file (.xls or .xlsx)');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    setProgress(20);

    try {
      // Read Excel file
      const excelData = await readExcelFile(selectedFile);
      setProgress(50);

      // Validate data
      const validation = validateExcelData(excelData, fields);
      setProgress(75);

      if (!validation.isValid) {
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        setLoading(false);
        return;
      }

      // Call upload handler
      if (onUpload) {
        await onUpload(validation.data);
      }

      setProgress(100);
      setResult({
        success: true,
        message: `Successfully processed ${excelData.length} records`,
        count: excelData.length
      });
    } catch (err) {
      setError(`Error processing file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel(fields, formType);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {title}
      </Typography>

      {/* Info Section */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Box>
          <strong>Instructions:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Download the sample template below</li>
            <li>Fill in your data following the exact format</li>
            <li>Upload the completed file here</li>
            <li>Maximum file size: 5MB</li>
          </ul>
        </Box>
      </Alert>

      {/* Sample Download Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownloadSample}
          variant="outlined"
          fullWidth
        >
          Download Sample Template
        </Button>
      </Box>

      {/* Upload Area */}
      {!result || result.success === false ? (
        <Paper
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: dragActive ? '#667eea' : '#cccccc',
            backgroundColor: dragActive ? 'rgba(102, 126, 234, 0.05)' : '#fafafa',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            mb: 3
          }}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-input"
            disabled={loading}
          />
          <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {file ? file.name : 'Drag and drop your Excel file here'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to select a file
            </Typography>
          </label>
        </Paper>
      ) : null}

      {/* Progress Bar */}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
            Processing... {progress}%
          </Typography>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {result && result.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon />
            {result.message}
          </Box>
        </Alert>
      )}

      {/* Template Info Dialog */}
      <Dialog open={showInfo} onClose={() => setShowInfo(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Excel Template Fields</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            The following fields must be included in your Excel file:
          </Typography>
          <List>
            {fields.map((field, idx) => (
              <ListItem key={idx} disableGutters>
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={field.label}
                  secondary={`Type: ${field.type || 'text'}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfo(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExcelUpload;
