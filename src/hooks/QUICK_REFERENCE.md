# useDocumentUpload Quick Reference Card

## Import
```javascript
import useDocumentUpload from '../../hooks/useDocumentUpload';
```

## Basic Setup (30 seconds)
```javascript
const {
  documentFile,
  uploadedDocument,
  isUploading,
  uploadError,
  handleFileSelect,
  handleUploadDocument,
  handleClearDocument,
} = useDocumentUpload();
```

## HTML Template
```html
<!-- File Input -->
<input 
  type="file" 
  id="file-input"
  onChange={handleFileSelect}
  accept=".pdf,.doc,.docx"
/>

<!-- Error Display -->
{uploadError && <p style={{color: 'red'}}>{uploadError}</p>}

<!-- Selected File Info -->
{documentFile && <p>Selected: {documentFile.name}</p>}

<!-- Upload Button -->
<button 
  onClick={handleUploadDocument} 
  disabled={!documentFile || isUploading}
>
  {isUploading ? 'Uploading...' : 'Upload'}
</button>

<!-- Clear Button -->
{(documentFile || uploadedDocument) && (
  <button onClick={handleClearDocument}>Clear</button>
)}

<!-- Success Message -->
{uploadedDocument && (
  <p style={{color: 'green'}}>
    ✓ {uploadedDocument.originalName} uploaded successfully
  </p>
)}
```

## Configuration
```javascript
useDocumentUpload({
  uploadEndpoint: '/api/upload/document',  // Required in production
  maxFileSize: 10,                          // MB (default)
  allowedFormats: ['pdf', 'docx', 'xlsx'],  // Extensions only
  useMockMode: true,                        // true=test, false=production
  fileNamePrefix: 'MY_PREFIX',              // For naming uploaded files
})
```

## State Variables
```javascript
documentFile          // File | null - Currently selected file
uploadedDocument      // Object | null - { filename, originalName, filePath, ... }
isUploading          // boolean - true while uploading
uploadError          // string | null - Error message if any
```

## Methods
```javascript
handleFileSelect(event)        // Input onChange handler
handleUploadDocument()         // async - Returns uploadedDocument or null
handleClearDocument(id?)       // Clears all states and input element
resetUploadState()             // Complete state reset
isValidFile(file)              // Returns { isValid, error }
getFileInfo(file)              // Returns { name, size, sizeInKB, ... }
```

## Return on Upload
```javascript
// Success
{
  filename: 'BQ_DOC_1234567890.pdf',
  originalName: 'proposal.pdf',
  filePath: '/uploads/documents/BQ_DOC_1234567890.pdf',
  fileSize: 2048576,
  uploadedAt: '2025-12-28T10:30:00Z',
  mimeType: 'application/pdf'
}

// Failure - returns null, check uploadError
```

## Common Patterns

### With React Hook Form
```javascript
import { Controller, useForm } from 'react-hook-form';

const { control } = useForm();
const upload = useDocumentUpload();

<Controller
  name="document"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      type="file"
      onChange={(e) => {
        field.onChange(e);
        upload.handleFileSelect(e);
      }}
    />
  )}
/>
```

### With MUI Components
```javascript
import { Box, Button, TextField, Alert } from '@mui/material';

<Box sx={{ p: 3 }}>
  <TextField
    type="file"
    onChange={upload.handleFileSelect}
    fullWidth
  />
  
  {upload.uploadError && (
    <Alert severity="error" sx={{ mt: 2 }}>
      {upload.uploadError}
    </Alert>
  )}
  
  <Button
    onClick={upload.handleUploadDocument}
    disabled={!upload.documentFile || upload.isUploading}
    sx={{ mt: 2 }}
  >
    {upload.isUploading ? 'Uploading...' : 'Upload'}
  </Button>
</Box>
```

### Multiple Independent Uploads
```javascript
const docUpload = useDocumentUpload({ fileNamePrefix: 'DOC' });
const reportUpload = useDocumentUpload({ fileNamePrefix: 'REPORT' });

// Use docUpload for one input, reportUpload for another
```

### Async Upload with Then/Catch
```javascript
const handleSubmit = async () => {
  const result = await upload.handleUploadDocument();
  
  if (result) {
    console.log('Success:', result.filePath);
    // Do something with uploaded file
  } else if (upload.uploadError) {
    console.log('Error:', upload.uploadError);
    // Show error to user
  }
};
```

## Validation Examples
```javascript
// Check if file is valid before upload
const { isValid, error } = upload.isValidFile(file);
if (!isValid) {
  console.error(error);
}

// Get file info
const info = upload.getFileInfo(documentFile);
console.log(info.sizeInMB);  // "2.5"
console.log(info.extension); // "pdf"
```

## Error Messages
```
"No file selected"
"File size (25.50MB) exceeds maximum allowed size (10MB)"
"File format (.exe) is not allowed. Supported formats: pdf, doc, docx, xls, xlsx, ppt, txt"
"Upload failed with status 500"
"Network error: Failed to fetch"
```

## Development vs Production

### Dev (Testing)
```javascript
useDocumentUpload({
  useMockMode: true,  // No backend needed, simulates upload
})
```

### Production (Real)
```javascript
useDocumentUpload({
  uploadEndpoint: 'https://api.yourdomain.com/upload',
  useMockMode: false,
})
```

## Integration in BudgetaryQuotationForm

Currently used in:
1. **Create Form Tab** - Lines ~70-120
2. Configuration: Mock mode enabled

To use elsewhere:
```javascript
// In any component
import useDocumentUpload from '../../hooks/useDocumentUpload';

const MyComponent = () => {
  const upload = useDocumentUpload({
    uploadEndpoint: '/your/endpoint',
  });
  
  // Use upload.documentFile, upload.handleFileSelect, etc.
};
```

## Cleanup in useEffect
```javascript
useEffect(() => {
  return () => {
    upload.resetUploadState();  // Clear on unmount
  };
}, []);
```

## Full Working Example (Copy & Paste)
```javascript
import useDocumentUpload from '../../hooks/useDocumentUpload';

function FileUploadDemo() {
  const upload = useDocumentUpload();

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>File Upload</h2>
      
      <input 
        type="file" 
        onChange={upload.handleFileSelect}
        accept=".pdf,.doc,.docx"
      />
      
      {upload.uploadError && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {upload.uploadError}
        </div>
      )}
      
      {upload.documentFile && (
        <div style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
          Selected: {upload.documentFile.name}
        </div>
      )}
      
      <button 
        onClick={upload.handleUploadDocument}
        disabled={!upload.documentFile || upload.isUploading}
        style={{ marginRight: '10px', padding: '10px 20px' }}
      >
        {upload.isUploading ? 'Uploading...' : 'Upload'}
      </button>
      
      {(upload.documentFile || upload.uploadedDocument) && (
        <button 
          onClick={upload.handleClearDocument}
          style={{ padding: '10px 20px' }}
        >
          Clear
        </button>
      )}
      
      {upload.uploadedDocument && (
        <div style={{ color: 'green', margin: '10px 0' }}>
          ✓ {upload.uploadedDocument.originalName} uploaded!
          <p>Path: {upload.uploadedDocument.filePath}</p>
        </div>
      )}
    </div>
  );
}

export default FileUploadDemo;
```

## Docs Location
- Full API: `src/hooks/USE_DOCUMENT_UPLOAD_GUIDE.md`
- Hook Code: `src/hooks/useDocumentUpload.js`
- Implementation: `src/marketingComponents/components/budgetaryQuotation/BudgetaryQuotationForm.js`

---

**Version**: 1.0.0 | **Last Updated**: Dec 28, 2025
