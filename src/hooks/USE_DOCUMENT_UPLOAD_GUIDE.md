# useDocumentUpload Custom Hook - Documentation

## Overview
`useDocumentUpload` is a reusable React custom hook that encapsulates all file upload logic for any type of document. It provides a clean, consistent API for handling file selection, validation, uploading, and error management across your application.

## Location
```
src/hooks/useDocumentUpload.js
```

## Installation/Import

```javascript
import useDocumentUpload from '../../hooks/useDocumentUpload';
```

## Basic Usage

### Simple Setup
```javascript
const MyComponent = () => {
  // Initialize with default configuration
  const {
    documentFile,
    uploadedDocument,
    isUploading,
    uploadError,
    handleFileSelect,
    handleUploadDocument,
    handleClearDocument,
  } = useDocumentUpload();

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx"
      />
      <button onClick={handleUploadDocument} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadError && <p style={{color: 'red'}}>{uploadError}</p>}
      {uploadedDocument && <p>Uploaded: {uploadedDocument.filename}</p>}
    </div>
  );
};
```

### Advanced Configuration
```javascript
const {
  documentFile,
  uploadedDocument,
  isUploading,
  uploadError,
  handleFileSelect,
  handleUploadDocument,
  handleClearDocument,
  resetUploadState,
  getFileInfo,
  isValidFile,
} = useDocumentUpload({
  uploadEndpoint: '/api/documents/upload',  // Your backend endpoint
  maxFileSize: 20,                           // MB (default: 10)
  allowedFormats: ['pdf', 'doc', 'docx', 'xlsx', 'ppt'], // File extensions
  useMockMode: false,                        // Use real API (default: false)
  fileNamePrefix: 'REPORT',                  // Prefix for uploaded files
});
```

## Configuration Options

### `uploadEndpoint` (string)
- **Default**: `'/api/upload/document'`
- **Type**: URL string
- **Description**: Backend API endpoint that handles file uploads
- **Example**: `'/api/documents/upload'` or `'/api/files/upload'`

### `maxFileSize` (number)
- **Default**: `10`
- **Type**: Number (in MB)
- **Description**: Maximum allowed file size in megabytes
- **Example**: `maxFileSize: 50` allows files up to 50MB

### `allowedFormats` (array)
- **Default**: `['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'txt', 'jpg', 'jpeg', 'png', 'gif']`
- **Type**: Array of file extensions (without dots)
- **Description**: Allowed file types for upload
- **Example**: `allowedFormats: ['pdf', 'docx', 'xlsx']`

### `useMockMode` (boolean)
- **Default**: `false`
- **Type**: Boolean
- **Description**: If true, uses mock API for testing; if false, calls real backend
- **Example**: `useMockMode: process.env.NODE_ENV === 'development'`

### `fileNamePrefix` (string)
- **Default**: `'DOC'`
- **Type**: String
- **Description**: Prefix for server-generated filenames
- **Example**: `fileNamePrefix: 'BQ_QUOTATION'` → `BQ_QUOTATION_1234567890.pdf`

## Returned State & Methods

### State Variables

#### `documentFile` (File | null)
Currently selected file from input (before upload)
```javascript
if (documentFile) {
  console.log(documentFile.name); // e.g., "proposal.pdf"
  console.log(documentFile.size); // e.g., 2048576
}
```

#### `uploadedDocument` (Object | null)
Successfully uploaded document information
```javascript
if (uploadedDocument) {
  uploadedDocument.filename;      // "BQ_DOC_1234567890.pdf"
  uploadedDocument.originalName;  // "proposal.pdf"
  uploadedDocument.filePath;      // "/uploads/documents/BQ_DOC_1234567890.pdf"
  uploadedDocument.fileSize;      // 2048576
  uploadedDocument.uploadedAt;    // "2025-12-28T10:30:00Z"
  uploadedDocument.mimeType;      // "application/pdf"
}
```

#### `isUploading` (boolean)
True while upload is in progress
```javascript
<Button disabled={isUploading}>
  {isUploading ? 'Uploading...' : 'Upload Document'}
</Button>
```

#### `uploadError` (string | null)
Error message if validation or upload fails
```javascript
{uploadError && (
  <Alert severity="error">{uploadError}</Alert>
)}
```

### Handler Methods

#### `handleFileSelect(event)` 
Called when user selects a file from input
```javascript
<input 
  type="file" 
  onChange={handleFileSelect}
  id="file-input"
/>
```
- Validates file automatically
- Sets `uploadError` if invalid
- Clears file input if validation fails

#### `handleUploadDocument()` 
Uploads the selected file to server
```javascript
const handleSubmit = async () => {
  const result = await handleUploadDocument();
  if (result) {
    console.log('Uploaded:', result.filename);
  }
};
```
- Returns uploaded document object on success
- Returns `null` on failure
- Sets `uploadError` on failure
- Clears `documentFile` on success

#### `handleClearDocument(inputId?)`
Clears selected and uploaded documents
```javascript
<Button onClick={() => handleClearDocument('file-input')}>
  Clear
</Button>
```
- Optional: specify file input ID to clear (default: 'document-input')
- Clears file input element
- Resets `documentFile` state
- Resets `uploadedDocument` state
- Clears `uploadError`

#### `resetUploadState()`
Completely resets all upload state
```javascript
useEffect(() => {
  return () => resetUploadState(); // Cleanup on unmount
}, []);
```
- Clears all state variables
- Called automatically on cleanup

### Utility Methods

#### `isValidFile(file)` 
Validates a file object
```javascript
const validation = isValidFile(selectedFile);
if (!validation.isValid) {
  console.error(validation.error); // "File size exceeds maximum..."
}
```
Returns: `{ isValid: boolean, error: string|null }`

#### `getFileInfo(file)`
Gets detailed information about a file
```javascript
const info = getFileInfo(documentFile);
console.log(info.sizeInKB);      // "2048.5"
console.log(info.sizeInMB);      // "2.05"
console.log(info.extension);     // "pdf"
console.log(info.lastModified);  // "2025-12-28T10:30:00Z"
```
Returns: `{ name, size, sizeInKB, sizeInMB, type, extension, lastModified }`

## Real-World Examples

### Example 1: Basic File Upload Form
```javascript
import useDocumentUpload from '../../hooks/useDocumentUpload';

function UploadForm() {
  const {
    documentFile,
    uploadedDocument,
    isUploading,
    uploadError,
    handleFileSelect,
    handleUploadDocument,
    handleClearDocument,
  } = useDocumentUpload({
    uploadEndpoint: '/api/uploads/document',
    maxFileSize: 10,
    allowedFormats: ['pdf', 'docx', 'xlsx'],
    useMockMode: false,
  });

  return (
    <div>
      <input 
        id="file-input"
        type="file" 
        onChange={handleFileSelect}
      />
      
      {uploadError && <p className="error">{uploadError}</p>}
      
      {documentFile && (
        <p>Selected: {documentFile.name}</p>
      )}
      
      <button 
        onClick={handleUploadDocument} 
        disabled={!documentFile || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      
      {uploadedDocument && (
        <div className="success">
          <p>✓ Uploaded: {uploadedDocument.originalName}</p>
          <p>Path: {uploadedDocument.filePath}</p>
          <button onClick={handleClearDocument}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Multiple Independent Uploads
```javascript
function DocumentManager() {
  // Proposal upload
  const proposalUpload = useDocumentUpload({
    uploadEndpoint: '/api/uploads/proposal',
    fileNamePrefix: 'PROPOSAL',
  });

  // Contract upload
  const contractUpload = useDocumentUpload({
    uploadEndpoint: '/api/uploads/contract',
    fileNamePrefix: 'CONTRACT',
  });

  return (
    <div>
      <section>
        <h3>Upload Proposal</h3>
        <input onChange={proposalUpload.handleFileSelect} type="file" />
        <button onClick={proposalUpload.handleUploadDocument}>
          Upload Proposal
        </button>
        {proposalUpload.uploadedDocument && (
          <p>Proposal uploaded: {proposalUpload.uploadedDocument.filename}</p>
        )}
      </section>

      <section>
        <h3>Upload Contract</h3>
        <input onChange={contractUpload.handleFileSelect} type="file" />
        <button onClick={contractUpload.handleUploadDocument}>
          Upload Contract
        </button>
        {contractUpload.uploadedDocument && (
          <p>Contract uploaded: {contractUpload.uploadedDocument.filename}</p>
        )}
      </section>
    </div>
  );
}
```

### Example 3: With MUI Components
```javascript
import {
  Box, Button, Card, TextField, Alert, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import useDocumentUpload from '../../hooks/useDocumentUpload';

function MuiUploadExample() {
  const {
    documentFile,
    uploadedDocument,
    isUploading,
    uploadError,
    handleFileSelect,
    handleUploadDocument,
    handleClearDocument,
  } = useDocumentUpload();

  return (
    <Card sx={{ p: 3 }}>
      <TextField
        type="file"
        onChange={handleFileSelect}
        inputProps={{ accept: '.pdf,.docx' }}
        fullWidth
      />

      {uploadError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {uploadError}
        </Alert>
      )}

      {documentFile && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
          {documentFile.name}
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          onClick={handleUploadDocument}
          disabled={!documentFile || isUploading}
          variant="contained"
          startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>

        {(documentFile || uploadedDocument) && (
          <Button onClick={handleClearDocument} variant="outlined" color="error">
            Clear
          </Button>
        )}
      </Box>

      {uploadedDocument && (
        <Alert severity="success" sx={{ mt: 2 }}>
          ✓ {uploadedDocument.originalName} uploaded successfully
        </Alert>
      )}
    </Card>
  );
}
```

## Backend Integration

### Expected API Response Format
Your backend should return JSON in this format:

```javascript
{
  "success": true,
  "filename": "BQ_DOC_1234567890.pdf",
  "originalName": "proposal.pdf",
  "filePath": "/uploads/documents/BQ_DOC_1234567890.pdf",
  "fileSize": 2048576,
  "uploadedAt": "2025-12-28T10:30:00Z"
}
```

### Error Response Format
```javascript
{
  "success": false,
  "message": "File size exceeds maximum allowed size"
}
```

### Node.js/Express Example Endpoint
```javascript
app.post('/api/upload/document', (req, res) => {
  try {
    const file = req.files.document;
    const fileNamePrefix = req.body.fileNamePrefix || 'DOC';
    
    // Validate
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    // Generate server filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const serverFilename = `${fileNamePrefix}_${timestamp}.${ext}`;
    const filePath = path.join(__dirname, 'uploads', serverFilename);

    // Save file
    file.mv(filePath, (err) => {
      if (err) throw err;

      res.json({
        success: true,
        filename: serverFilename,
        originalName: file.name,
        filePath: `/uploads/${serverFilename}`,
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

## Development vs Production

### Development (with Mock Mode)
```javascript
const upload = useDocumentUpload({
  useMockMode: true, // Simulates upload, no real backend needed
});
```

### Production (Real API)
```javascript
const upload = useDocumentUpload({
  uploadEndpoint: 'https://api.yourdomain.com/documents/upload',
  useMockMode: false, // Uses real backend
});
```

### Conditional Setup
```javascript
const upload = useDocumentUpload({
  uploadEndpoint: process.env.REACT_APP_UPLOAD_ENDPOINT,
  useMockMode: process.env.NODE_ENV === 'development',
});
```

## Error Handling

The hook validates files automatically and returns specific error messages:

- **No file selected**: "No file selected"
- **File too large**: "File size (25.50MB) exceeds maximum allowed size (10MB)"
- **Invalid format**: "File format (.exe) is not allowed. Supported formats: pdf, doc, docx, xls, xlsx, ppt, txt"
- **Network error**: "Upload failed with status 500" or specific server error message

```javascript
const { uploadError, handleUploadDocument } = useDocumentUpload();

const upload = async () => {
  const result = await handleUploadDocument();
  if (!result && uploadError) {
    console.error('Upload failed:', uploadError);
    showNotification(uploadError, 'error');
  }
};
```

## Current Integration in BudgetaryQuotationForm

The hook is currently integrated in:

1. **BudgetaryQuotationForm Component** (Create Tab)
   - File: `src/marketingComponents/components/budgetaryQuotation/BudgetaryQuotationForm.js`
   - Lines: ~100-120
   - Configuration: Mock mode enabled for testing

2. **Old Code Status**
   - Old handlers are **COMMENTED OUT** (not deleted)
   - Reasons for each comment section clearly explained
   - Can be removed in future cleanup phase

## Troubleshooting

### Issue: Upload succeeds but file not saved on server
- Check backend endpoint is correct
- Verify server is receiving POST requests
- Check server file permissions (uploads folder must be writable)
- Review backend logs

### Issue: "File format not allowed"
- Ensure file extension is in `allowedFormats` array
- Check extension is lowercase without dot
- Example: `['pdf', 'docx']` not `['.PDF', '.DOCX']`

### Issue: Large files fail
- Increase `maxFileSize` in hook config
- Check server payload size limit
- Add server-side size validation

### Issue: CORS errors in production
- Ensure upload endpoint is same-origin or has CORS headers
- Check `uploadEndpoint` matches actual server domain

## Future Enhancements

Possible improvements:
- Drag & drop file support
- Progress tracking (bytes uploaded)
- Retry logic for failed uploads
- Multiple file uploads
- File preview generation
- Integration with cloud storage (AWS S3, Azure Blob)

## Best Practices

1. **Always validate on both sides**: Hook validates on frontend, backend should also validate
2. **Use meaningful file prefixes**: Makes uploaded files easy to identify
3. **Set appropriate size limits**: Too restrictive = poor UX, too permissive = server issues
4. **Handle errors gracefully**: Always show user-friendly error messages
5. **Cleanup on unmount**: Call `resetUploadState()` in useEffect cleanup
6. **Test with mock mode first**: Debug logic before connecting to real server

## Migration Guide (if updating old code)

### Old Code
```javascript
const [documentFile, setDocumentFile] = useState(null);
const [uploadedDocument, setUploadedDocument] = useState(null);
const [isUploading, setIsUploading] = useState(false);

const handleFileSelect = (e) => {
  setDocumentFile(e.target.files[0]);
};

const handleUploadDocument = async () => {
  // ... upload logic ...
};
```

### New Code
```javascript
const {
  documentFile,
  uploadedDocument,
  isUploading,
  handleFileSelect,
  handleUploadDocument,
} = useDocumentUpload();
```

That's it! All logic is encapsulated.

---

**Version**: 1.0.0
**Last Updated**: December 28, 2025
**Author**: Custom Hook Development
