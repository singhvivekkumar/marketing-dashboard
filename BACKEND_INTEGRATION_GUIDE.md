# 🔧 Backend Integration Guide - Document Upload

## Overview

This guide shows how to implement the backend API endpoint for document uploads using Express and Multer.

---

## Step 1: Install Dependencies

```bash
npm install multer
```

---

## Step 2: Create Multer Configuration

Create `config/multer.config.js`:

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: BQ_DOC_[timestamp].[extension]
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `BQ_DOC_${timestamp}${ext}`;
    cb(null, filename);
  }
});

// File filter (only allow certain file types)
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'text/plain'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;
```

---

## Step 3: Create Upload Endpoint

Create or update `routes/budgetaryQuotation.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const path = require('path');

// Document Upload Endpoint
router.post('/uploadDocument', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Return file information
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: `/uploads/documents/${req.file.filename}`,
      fileSize: req.file.size,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload document'
    });
  }
});

module.exports = router;
```

---

## Step 4: Update Express Server

In your main `server.js` or `index.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded documents as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const budgetaryQuotationRoutes = require('./routes/budgetaryQuotation.routes');
app.use('/api/bq', budgetaryQuotationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 10MB limit'
      });
    }
  }
  if (err.message === 'Unsupported file type') {
    return res.status(400).json({
      success: false,
      error: 'Unsupported file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, TXT'
    });
  }
  res.status(500).json({
    success: false,
    error: err.message || 'An error occurred'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Step 5: Update Frontend API Call

In `BudgetaryQuotationForm.js`, replace the mock API with real call:

```javascript
const handleUploadDocument = async () => {
  if (!documentFile) {
    alert("Please select a document first");
    return;
  }

  setIsUploading(true);
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("document", documentFile);

    // Real API call
    const response = await axios.post(
      `${ServerIp}/api/bq/uploadDocument`,  // Change to your actual endpoint
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success) {
      setUploadedDocument({
        filename: response.data.filename,
        originalName: response.data.originalName,
        filePath: response.data.filePath,
        uploadedAt: response.data.uploadedAt,
      });
      alert(`✅ Document uploaded successfully!\nFilename: ${response.data.filename}`);
      setDocumentFile(null);
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    const errorMsg = error.response?.data?.error || "Failed to upload document";
    alert(`❌ ${errorMsg}`);
  } finally {
    setIsUploading(false);
  }
};
```

---

## Step 6: Directory Structure

```
project-root/
├── api/
│   ├── config/
│   │   └── multer.config.js (NEW)
│   ├── routes/
│   │   └── budgetaryQuotation.routes.js (UPDATED)
│   ├── server.js (UPDATED)
│   └── package.json
├── uploads/
│   └── documents/ (Created automatically)
│       ├── BQ_DOC_1703593200000.pdf
│       ├── BQ_DOC_1703593201000.docx
│       └── ...
└── src/
    └── marketingComponents/
        └── components/
            └── budgetaryQuotation/
                └── BudgetaryQuotationForm.js (UPDATED)
```

---

## Step 7: Add to Database (Optional)

If you want to store document information in your database:

```javascript
// In your BQ model/schema
const bqSchema = {
  // ... other fields ...
  document: {
    filename: String,        // BQ_DOC_1703593200000.pdf
    originalName: String,    // proposal.pdf
    filePath: String,        // /uploads/documents/BQ_DOC_1703593200000.pdf
    fileSize: Number,        // bytes
    uploadedAt: Date
  }
};
```

---

## Step 8: Handle Document Deletion (Optional)

```javascript
const fs = require('fs').promises;
const path = require('path');

router.delete('/deleteDocument/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads/documents', filename);

    // Delete file from disk
    await fs.unlink(filepath);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete document'
    });
  }
});
```

---

## Step 9: Test the Endpoint

Using Postman or curl:

```bash
# Using curl
curl -X POST http://localhost:5000/api/bq/uploadDocument \
  -F "document=@/path/to/file.pdf"

# Expected Response
{
  "success": true,
  "filename": "BQ_DOC_1703593200000.pdf",
  "originalName": "proposal.pdf",
  "filePath": "/uploads/documents/BQ_DOC_1703593200000.pdf",
  "fileSize": 2048000,
  "uploadedAt": "2025-12-27T10:00:00.000Z"
}
```

---

## Step 10: Environment Variables (Optional)

Create `.env`:

```env
# File Upload Settings
MAX_FILE_SIZE=10485760        # 10MB in bytes
UPLOAD_DIR=/uploads/documents
ALLOWED_MIME_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

---

## Error Handling

### Client-Side (Frontend)

```javascript
try {
  const response = await axios.post(
    `${ServerIp}/api/bq/uploadDocument`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  // Handle success
} catch (error) {
  if (error.response?.status === 400) {
    // File too large or unsupported format
    alert(error.response.data.error);
  } else if (error.response?.status === 500) {
    // Server error
    alert('Server error: ' + error.response.data.error);
  } else {
    // Network error
    alert('Network error: Unable to upload document');
  }
}
```

### Server-Side (Backend)

```javascript
// Multer error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 10MB limit'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Only one file can be uploaded at a time'
      });
    }
  }
  
  if (err.message === 'Unsupported file type') {
    return res.status(400).json({
      success: false,
      error: 'File type not supported'
    });
  }

  res.status(500).json({
    success: false,
    error: 'An error occurred during upload'
  });
});
```

---

## Security Considerations

1. **File Type Validation**
   - Validate MIME types on server
   - Check file extensions
   - Use magic bytes verification

2. **File Size Limits**
   - Set appropriate limits (10MB)
   - Check before processing
   - Prevent DoS attacks

3. **File Storage**
   - Store outside web root
   - Use unique filenames
   - Implement access control

4. **Cleanup**
   - Delete old/orphaned files
   - Implement file expiration
   - Monitor disk space

---

## Production Checklist

- [ ] Implement file type whitelist
- [ ] Add file size validation
- [ ] Create uploads directory structure
- [ ] Set proper file permissions (644)
- [ ] Implement virus scanning (ClamAV)
- [ ] Add file encryption (optional)
- [ ] Implement access logging
- [ ] Set up backup strategy
- [ ] Monitor disk space
- [ ] Add rate limiting
- [ ] Implement file cleanup routine
- [ ] Add CDN for file serving (optional)

---

## Monitoring & Logging

```javascript
router.post('/uploadDocument', upload.single('document'), (req, res) => {
  try {
    // Log upload
    console.log('Document uploaded:', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      timestamp: new Date().toISOString(),
      ip: req.ip
    });

    res.json({
      success: true,
      filename: req.file.filename,
      filePath: `/uploads/documents/${req.file.filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

**Created:** December 27, 2025
**Purpose:** Backend integration for document upload feature
**Framework:** Express + Multer
