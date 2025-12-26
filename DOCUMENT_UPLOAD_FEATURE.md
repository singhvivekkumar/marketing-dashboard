# 📎 Document Upload Feature Implementation

## Overview

A complete document/attachment upload feature has been added to the Budgetary Quotation Form. Users can now upload documents, and the system will:
1. Store document information (filename, path)
2. Display uploaded documents in the table
3. Allow users to preview documents by clicking on them

---

## Features Implemented

### 1. **Document Upload Section in Form**
- New "Document/Attachment Upload" card at the bottom of the form
- File browse functionality with drag-and-drop placeholder
- File selection display showing filename and size
- Upload button to submit document to server
- Clear button to remove selected/uploaded documents
- Upload status indication (loading state)

### 2. **Mock API Integration**
- Simulates backend document upload via multer
- Generates server-side unique filename: `BQ_DOC_[timestamp].[extension]`
- Returns file path: `/uploads/documents/[filename]`
- Mock delay of 1.5 seconds to simulate real network

### 3. **Table Integration**
- New "Document" column added to the table
- Shows document filename as clickable link
- Link icon (📄) with filename display
- "No document" text for records without documents
- Hover effects for better UX

### 4. **Document Preview**
- Click on document filename in table
- Opens document in new window/tab
- Uses `window.open(filePath, "_blank")`

---

## Implementation Details

### State Variables Added

```javascript
// Document Upload States
const [documentFile, setDocumentFile] = useState(null);      // Selected file
const [uploadedDocument, setUploadedDocument] = useState(null); // Uploaded info
const [isUploading, setIsUploading] = useState(false);        // Loading state
```

### Handlers Added

#### `handleFileSelect(e)`
```javascript
- Triggered: When user selects a file
- Action: Stores file in documentFile state
- Payload: HTML5 File object
```

#### `handleUploadDocument()`
```javascript
- Triggered: When Upload button is clicked
- Action: Simulates API call to backend
- Mock Response:
  {
    success: true,
    filename: "BQ_DOC_1703593200000.pdf",
    originalName: "proposal.pdf",
    filePath: "/uploads/documents/BQ_DOC_1703593200000.pdf",
    uploadedAt: "2025-12-27T10:00:00.000Z"
  }
- Updates: uploadedDocument state with response data
```

#### `handleClearDocument()`
```javascript
- Triggered: When Clear button is clicked
- Action: Resets document states
- Clears: documentFile, uploadedDocument, and file input value
```

#### `handleDocumentClick(filePath, filename)`
```javascript
- Triggered: When user clicks document link in table
- Action: Opens document in new window
- Method: window.open(filePath, "_blank")
```

---

## UI Components

### Document Upload Card
```
┌─────────────────────────────────────────┐
│  📎 Document/Attachment Upload          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📤 Click or drag file here       │   │
│  │ Formats: PDF, DOC, DOCX, XLS... │   │
│  │ Max: 10MB                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Selected File] (if chosen)            │
│  📄 proposal.pdf (2.5 MB)               │
│                                         │
│  [Uploaded!] (if successful)            │
│  ✅ Document Uploaded                   │
│  BQ_DOC_1703593200000.pdf               │
│                                         │
│  [Upload Document] [Clear]              │
│                                         │
└─────────────────────────────────────────┘
```

### Document Column in Table
```
Document Column:
├─ With document: 📄 BQ_DOC_1703593200000.pdf (clickable link)
├─ Without document: "No document" (grayed text)
└─ Hover effect: Blue underline on filename
```

---

## Form Integration

The document upload is integrated after the "Additional Information" section:

```
Create Data Tab
├── BQ Details Card
├── Classification & Financial Info Card
├── Additional Information Card
├── 📎 Document/Attachment Upload Card (NEW)
└── Form Action Buttons (Submit, Reset)
```

---

## Table Integration

The document column is added to leadColumns:

```javascript
const leadColumns = [
  { id: "bqTitle", label: "BQ Title" },
  { id: "customerName", label: "Customer Name" },
  // ... other columns ...
  { id: "document", label: "Document" },  // NEW
];
```

---

## Data Structure

### Document Object in Row
```javascript
document: {
  filename: "BQ_DOC_1703593200000.pdf",      // Server-generated
  originalName: "proposal.pdf",               // User's original name
  filePath: "/uploads/documents/BQ_DOC_1703593200000.pdf", // Server path
  uploadedAt: "2025-12-27T10:00:00.000Z"     // Upload timestamp
}
```

### Form Submit with Document
```javascript
formData: {
  bqTitle: "...",
  customerName: "...",
  // ... other fields ...
  document: {
    filename: "BQ_DOC_...",
    filePath: "/uploads/documents/..."
  }
}
```

---

## Backend Integration (Future)

### Multer Configuration
```javascript
// In your Node.js backend
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    cb(null, `BQ_DOC_${timestamp}.${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// API Endpoint
router.post('/uploadDocument', upload.single('document'), (req, file, res) => {
  // Return filename and path
  res.json({
    success: true,
    filename: req.file.filename,
    filePath: `/uploads/documents/${req.file.filename}`,
    originalName: req.file.originalname
  });
});
```

### Replace Mock API Call
```javascript
// Change from mock to real API
const response = await axios.post(
  `${ServerIp}/uploadDocument`,
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
```

---

## User Workflow

### Uploading Document

```
1. User fills BQ form fields
   ↓
2. Scroll to "Document Upload" section
   ↓
3. Click file input or drag file
   ↓
4. Select document from computer
   ↓
5. See filename and size displayed
   ↓
6. Click "Upload Document" button
   ↓
7. See loading state "Uploading..."
   ↓
8. Success message with server filename
   ↓
9. Document info stored in state
   ↓
10. Click "Submit" to save entire BQ with document
```

### Viewing Document

```
1. Go to "View Data" tab
   ↓
2. Locate desired record in table
   ↓
3. Find "Document" column
   ↓
4. Click on document filename link
   ↓
5. New window opens with document
   ↓
6. User can view/download document
```

---

## Key Features

✅ **File Selection**
- Browse file dialog
- Display selected filename and size
- Visual feedback with blue dashed border

✅ **Upload Functionality**
- Mock API with realistic delay
- Server-generated unique filenames
- Error handling with user alerts
- Loading state with disabled button

✅ **Document Management**
- Clear/remove document option
- Display uploaded document info
- Success notification with filename

✅ **Table Integration**
- New "Document" column (visible by default)
- Clickable document links
- "No document" text for empty records
- Hover effects for better UX

✅ **Document Preview**
- Click filename to open
- Opens in new window/tab
- Works with any file type

---

## File Organization

```
src/
├── marketingComponents/
│   └── components/
│       └── budgetaryQuotation/
│           └── BudgetaryQuotationForm.js (UPDATED)
│               ├── Document upload handlers
│               ├── Document upload UI
│               ├── Document column rendering
│               └── Document preview handler
└── mockData/
    └── budgetaryQuotationMockData.js (Ready for document field)
```

---

## Imports Added

```javascript
// MUI Components
import { Link } from "@mui/material";

// Icons
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseRounded from "@mui/icons-material/CloseRounded";
```

---

## CSS Styles

### File Upload Area
- Blue dashed border (2px)
- Light blue background
- Hover: Darker blue border, darker background
- Rounded corners (3px)
- Icon: 48px cloud upload icon

### File Display
- Light blue background (#e3f2fd)
- Blue border (#42a5f5)
- Flex layout with filename and size
- 📄 Document icon

### Upload Success
- Light green background (#e8f5e9)
- Green border (#4caf50)
- Green checkmark icon (✅)

### Document Link
- Blue text (#1e40af)
- Hover: Underline + darker blue
- Cursor: pointer
- Weight: 600

---

## Configuration

### File Size Limit
```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

### Supported Formats
- PDF
- DOC, DOCX
- XLS, XLSX
- PPT
- TXT

### Mock Upload Delay
```javascript
setTimeout(() => { /* ... */ }, 1500); // 1.5 seconds
```

---

## Testing Checklist

- [ ] Click file input, select a document
- [ ] Verify filename and size displayed
- [ ] Click "Upload Document" button
- [ ] See "Uploading..." state
- [ ] Get success message with server filename
- [ ] Verify uploaded document info shows
- [ ] Click "Clear" to remove document
- [ ] Verify file input cleared
- [ ] Submit BQ form with document
- [ ] Go to "View Data" tab
- [ ] See "Document" column in table
- [ ] Click on document filename
- [ ] Verify new window opens
- [ ] Test row without document shows "No document"

---

## Status

✅ **Implementation Complete**
✅ **Mock API Functional**
✅ **Table Integration Done**
✅ **UI Components Styled**
✅ **Ready for Backend Integration**

---

## Next Steps

1. Implement backend `/uploadDocument` endpoint with multer
2. Replace mock API call with real endpoint
3. Create `/uploads/documents/` directory on server
4. Test with real file uploads
5. Add file validation
6. Implement document deletion
7. Add document preview functionality for PDFs (pdfjs)
8. Add progress bar for large files

---

**Created:** December 27, 2025
**Component:** BudgetaryQuotationForm
**Feature:** Document Upload & Management
