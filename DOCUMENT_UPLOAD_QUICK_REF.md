# 📄 Document Upload - Quick Reference

## What Was Added?

### 1. Frontend Components

#### Document Upload Card (In Form)
```
Location: Create Data Tab → Bottom of form (before action buttons)
Contains:
  - File input with drag-drop area
  - File selection display
  - Upload success indicator
  - Upload and Clear buttons
  - Loading state handling
```

#### Document Column (In Table)
```
Location: View Data Tab → Last column
Shows:
  - Document filename as clickable link (if exists)
  - "No document" text (if not exists)
  - Opens document in new window on click
```

---

## Code Changes

### State Variables Added
```javascript
const [documentFile, setDocumentFile] = useState(null);
const [uploadedDocument, setUploadedDocument] = useState(null);
const [isUploading, setIsUploading] = useState(false);
```

### Handlers Added
```javascript
handleFileSelect(e)           // File selection
handleUploadDocument()        // Upload to API
handleClearDocument()         // Clear selection
handleDocumentClick()         // Open preview
```

### UI Elements Added
```javascript
Card Component              // Document upload section
File Input                 // Browse functionality
Button Group              // Upload & Clear buttons
Link Component            // Document filename link in table
```

### Columns Added
```javascript
{ id: "document", label: "Document" }  // Added to leadColumns
```

---

## Imports Added

```javascript
// MUI Components
Link

// Icons
CloudUploadOutlinedIcon
CloseRounded
```

---

## How It Works

### Upload Flow
```
1. User selects file
   ↓ (handleFileSelect)
2. Filename/size displayed
   ↓
3. User clicks Upload
   ↓ (handleUploadDocument)
4. Mock API simulates backend
   ↓
5. Returns: filename, path
   ↓
6. Success message shown
   ↓
7. Document stored in state
```

### View/Preview Flow
```
1. View Data tab opened
   ↓
2. Table shows Document column
   ↓
3. User clicks document link
   ↓ (handleDocumentClick)
4. window.open(filePath)
   ↓
5. Document opens in new window
```

---

## Configuration

### Supported File Types
- PDF
- DOC, DOCX
- XLS, XLSX
- PPT
- TXT

### Limits
- Max file size: 10MB
- Max files per upload: 1
- Mock upload delay: 1.5 seconds

### Server-Generated Filename Format
```
BQ_DOC_[timestamp].[extension]
Example: BQ_DOC_1703593200000.pdf
```

---

## API Response Format (Mock)

```javascript
{
  success: true,
  filename: "BQ_DOC_1703593200000.pdf",
  originalName: "proposal.pdf",
  filePath: "/uploads/documents/BQ_DOC_1703593200000.pdf",
  uploadedAt: "2025-12-27T10:00:00.000Z"
}
```

---

## Backend Integration

### Replace Mock API
**File:** BudgetaryQuotationForm.js, Line ~258
```javascript
// Change from:
const mockResponse = await new Promise(...);

// To:
const response = await axios.post(
  `${ServerIp}/api/bq/uploadDocument`,
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
```

### Create Backend Endpoint
**File:** api/routes/budgetaryQuotation.routes.js
```javascript
router.post('/uploadDocument', upload.single('document'), (req, res) => {
  // Handle file upload with multer
  res.json({
    success: true,
    filename: req.file.filename,
    filePath: `/uploads/documents/${req.file.filename}`
  });
});
```

### Install Multer
```bash
npm install multer
```

---

## Testing

### Quick Test Steps
1. **Upload:**
   - Go to Create Data tab
   - Scroll to Document section
   - Select a file
   - Click Upload
   - Verify success message

2. **View:**
   - Go to View Data tab
   - Locate record with document
   - Click document filename
   - Verify new window opens

3. **No Document:**
   - Check rows without documents
   - Verify "No document" text shown

---

## File Structure

```
BudgetaryQuotationForm.js
├── Imports (Line 1-48) - Added: Link, CloudUploadOutlinedIcon, CloseRounded
├── State (Line 68-71) - Added: documentFile, uploadedDocument, isUploading
├── Handlers (Line 227-290) - Added: handleFileSelect, handleUploadDocument, handleClearDocument
├── Handlers (Line 1414-1426) - Added: handleDocumentClick
├── UI Form (Line 876-977) - Added: Document Upload Card
├── Table Columns (Line 1188-1201) - Updated: Added document column
├── Table Render (Line 2118-2145) - Added: Document column rendering
└── Bottom (Line 3625-3668) - Component exports
```

---

## UI Styling

### Colors Used
- Blue (#1e40af, #42a5f5) - Primary actions
- Green (#4caf50, #2e7d32) - Success states
- Gray (#9ca3af) - Inactive states
- Red (#ef5350) - Clear button

### Hover Effects
- File area: Border darkens, background tints
- Document link: Underline appears, color darkens

### Icons
- 📤 Cloud Upload - File input area
- 📄 Document - Filename display
- ✅ Success - Upload confirmation
- ❌ Error - Upload failure

---

## Common Issues & Solutions

### Issue: File not selected
**Solution:** Check if file input is properly wired to handleFileSelect

### Issue: Upload fails silently
**Solution:** Check browser console for error messages

### Issue: Document link doesn't open
**Solution:** Verify filePath is correct in document object

### Issue: File input not showing
**Solution:** Ensure document-input element ID matches in code

---

## Next Steps

1. **Immediate:**
   - Test mock upload functionality
   - Verify table column displays correctly
   - Test document preview

2. **Short-term:**
   - Implement backend endpoint with multer
   - Create /uploads/documents directory
   - Replace mock API call

3. **Medium-term:**
   - Add file validation
   - Implement document deletion
   - Add download functionality

4. **Long-term:**
   - Add PDF preview
   - Implement document versioning
   - Add document search/filtering

---

## References

- [Material-UI Link Component](https://mui.com/api/link/)
- [Multer Documentation](https://expressjs.com/en/resources/middleware/multer.html)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

---

**Created:** December 27, 2025
**Type:** Quick Reference Guide
**Component:** Document Upload Feature
