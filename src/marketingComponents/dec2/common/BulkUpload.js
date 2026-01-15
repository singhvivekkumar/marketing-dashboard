// Bulk Upload Component
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { 
	Typography,  
	Button, 
	Box,
	Alert,
	Card,
	CardContent,
	CircularProgress,
} from '@mui/material';


function BulkUpload({ onBack, onUploadSuccess }) {
  const [file, setFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadResult, setUploadResult] = React.useState(null);
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    if (selectedFile.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
  };

  const processUpload = () => {
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      const recordsCount = Math.floor(Math.random() * 50) + 10;
      setUploadResult({
        success: true,
        recordsCount,
        message: `Successfully processed ${recordsCount} records`
      });
      setUploading(false);
      if (onUploadSuccess) onUploadSuccess(recordsCount);
    }, 2000);
  };

  const downloadTemplate = () => {
    const template = [
      ['Serial Number', 'Tender Name', 'Customer', 'Tender Type', 'Type of Bid', 'Value Without GST', 'Value With GST', 'Reason for Losing', 'Year', 'Partner'],
      ['DL-001', 'Sample Tender', 'Sample Customer', 'RFP', 'Technical', '50000000', '59000000', 'Price not competitive', '2025', 'ABC Corp']
    ];
    
    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tender-template.csv';
    a.click();
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<span className="material-icons">arrow_back</span>}
          onClick={onBack}
        >
          Back to Menu
        </Button>
      </Box>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Bulk Upload Excel File
          </Typography>

          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<span className="material-icons">download</span>}
              onClick={downloadTemplate}
            >
              Download Sample Template
            </Button>
          </Box>

          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'grey.400',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              backgroundColor: dragActive ? 'action.hover' : 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <span className="material-icons" style={{ fontSize: 64, color: '#999', marginBottom: 16 }}>cloud_upload</span>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Drag &amp; Drop Excel File Here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or
            </Typography>
            <Button
              variant="contained"
              component="label"
            >
              Browse Files
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileInput}
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
              Supported formats: .xlsx, .xls (Max 5MB)
            </Typography>
          </Box>

          {file && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Selected File:
              </Typography>
              <Typography variant="body2">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={processUpload}
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : <span className="material-icons">upload</span>}
                >
                  {uploading ? 'Processing...' : 'Upload & Process'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => { setFile(null); setUploadResult(null); }}
                  disabled={uploading}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          )}

          {uploadResult && (
            <Alert severity={uploadResult.success ? 'success' : 'error'} sx={{ mt: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {uploadResult.message}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default BulkUpload;