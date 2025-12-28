# Commented Code Location Reference

## Quick Navigation Guide

### 📍 BudgetaryQuotationForm.js

File: `src/marketingComponents/components/budgetaryQuotation/BudgetaryQuotationForm.js`

#### 1. OLD STATE VARIABLES - COMMENTED
**Location**: Lines ~97-109
**Reason**: Replaced by useDocumentUpload custom hook

```javascript
/* 
  ===== COMMENTED OUT: OLD DOCUMENT UPLOAD STATE =====
  REASON: Replaced by useDocumentUpload custom hook
  
  This state was previously managed here:
  const [documentFile, setDocumentFile] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  The custom hook consolidates all upload logic into one reusable place.
*/
```

**To Restore**: Uncomment the 3 lines

---

#### 2. OLD HANDLERS - CREATE FORM - COMMENTED
**Location**: Lines ~230-288
**Reason**: Moved to useDocumentUpload custom hook

**Contains**:
- `handleFileSelect(e)` - File input handler
- `handleUploadDocument()` - Async upload function (50+ lines)
- `handleClearDocument()` - Clear documents

```javascript
/* 
  ===== COMMENTED OUT: OLD DOCUMENT UPLOAD HANDLERS FOR CREATE FORM =====
  REASON: Moved to useDocumentUpload custom hook
  
  Benefits of the hook:
  - Reusable across all components
  - Centralized validation
  - Support for both mock and real API
  - Better error handling
  - Consistent behavior everywhere
  
  [Old code follows...]
*/
```

**To Restore**: Uncomment all commented lines + update setState calls to use hook instead

---

### 📍 ViewBudgetaryQuotationData (Table Component)

#### 3. OLD DIALOG HANDLERS - COMMENTED
**Location**: Lines ~1450-1530 (inside ViewBudgetaryQuotationData function)
**Reason**: Were duplicating the upload logic

**Contains**:
- `handleDialogFileSelect(e)` - File selection for dialog
- `handleDialogUploadDocument()` - Dialog upload (50+ lines with mock API)
- `handleDialogClearDocument()` - Clear dialog documents

```javascript
/* 
  ===== COMMENTED OUT: OLD TABLE DIALOG DOCUMENT UPLOAD HANDLERS =====
  REASON: These handlers were duplicating the upload logic already present in the parent component
  
  Now using the custom hook from parent component state:
  - useDocumentUpload().handleFileSelect
  - useDocumentUpload().handleUploadDocument  
  - useDocumentUpload().handleClearDocument
  
  If you need separate document upload states for the table dialog:
  1. Create a separate instance of useDocumentUpload in ViewBudgetaryQuotationData
  2. Or pass the hooks from parent via props
*/
```

**To Restore**: Either uncomment these handlers, or create a separate hook instance:
```javascript
const tableDocUpload = useDocumentUpload({
  uploadEndpoint: '/api/upload/document',
  fileNamePrefix: 'BQ_TABLE_DOC',
});
```

---

#### 4. OLD DIALOG STATES - COMMENTED
**Location**: Lines ~1216-1226 (inside ViewBudgetaryQuotationData function)
**Reason**: Now using useDocumentUpload custom hook

**Commented State**:
- `documentFile` 
- `uploadedDocument`
- `isUploading`

```javascript
/* 
  ===== COMMENTED OUT: OLD TABLE DIALOG DOCUMENT UPLOAD STATES =====
  REASON: Moved to useDocumentUpload custom hook
  
  These states were previously:
  const [documentFile, setDocumentFile] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  TO USE IN TABLE COMPONENT:
  If you need document upload in the edit dialog of the table, create a separate hook instance:
  
  const tableDocUpload = useDocumentUpload({
    uploadEndpoint: '/api/upload/document',
    maxFileSize: 10,
    allowedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'txt'],
    useMockMode: true,
    fileNamePrefix: 'BQ_TABLE_DOC',
  });
  
  Then use: tableDocUpload.handleFileSelect, tableDocUpload.handleUploadDocument, etc.
*/
```

**To Restore**: Uncomment these 3 lines

---

## Summary Table

| Location | Line Range | What's Commented | Reason |
|----------|-----------|-----------------|--------|
| BudgetaryQuotationForm | ~97-109 | State variables | Replaced by hook |
| BudgetaryQuotationForm | ~230-288 | Upload handlers (create form) | Moved to hook |
| ViewBudgetaryQuotationData | ~1216-1226 | Upload states (table) | Moved to hook |
| ViewBudgetaryQuotationData | ~1450-1530 | Upload handlers (table dialog) | Moved to hook |

---

## Code Structure After Comments

### BudgetaryQuotationForm Component Flow

```
┌─────────────────────────────────────────┐
│ Component Start (Line 60)               │
├─────────────────────────────────────────┤
│ ✅ NEW: useDocumentUpload Hook Init     │ (Lines 67-95)
├─────────────────────────────────────────┤
│ 💬 OLD: State Variables (COMMENTED)     │ (Lines 97-109)
├─────────────────────────────────────────┤
│ ✅ const API, user, useEffect           │
├─────────────────────────────────────────┤
│ ✅ useForm hook                         │
├─────────────────────────────────────────┤
│ ✅ const onSubmit, handleReset          │
├─────────────────────────────────────────┤
│ 💬 OLD: Upload Handlers (COMMENTED)     │ (Lines 230-288)
├─────────────────────────────────────────┤
│ ✅ return () => JSX                     │
└─────────────────────────────────────────┘
```

### ViewBudgetaryQuotationData Function Flow

```
┌─────────────────────────────────────────┐
│ Function Start (Line 1200)              │
├─────────────────────────────────────────┤
│ ✅ useState for table management        │
├─────────────────────────────────────────┤
│ 💬 OLD: Upload States (COMMENTED)       │ (Lines 1216-1226)
├─────────────────────────────────────────┤
│ ✅ useState for column selection        │
├─────────────────────────────────────────┤
│ ✅ Handler methods                      │
├─────────────────────────────────────────┤
│ 💬 OLD: Dialog Handlers (COMMENTED)     │ (Lines 1450-1530)
├─────────────────────────────────────────┤
│ ✅ Table styles and rendering           │
└─────────────────────────────────────────┘
```

---

## How to Find Commented Sections

### Using VS Code Search

#### Find All Comments
1. Press `Ctrl+F` (or `Cmd+F` on Mac)
2. Search: `===== COMMENTED OUT:`
3. Will show all 4 comment sections
4. Click "Next" to navigate through them

#### Find Specific Section
1. Press `Ctrl+F`
2. Search for line number or specific text:
   - `OLD DOCUMENT UPLOAD STATE` (Line ~97)
   - `OLD DOCUMENT UPLOAD HANDLERS FOR CREATE FORM` (Line ~230)
   - `OLD TABLE DIALOG DOCUMENT UPLOAD STATES` (Line ~1216)
   - `OLD TABLE DIALOG DOCUMENT UPLOAD HANDLERS` (Line ~1450)

#### View Comment Formatting
All comments follow this structure:
```javascript
/* 
  ===== COMMENTED OUT: [WHAT] =====
  REASON: [WHY]
  
  [ADDITIONAL CONTEXT]
  
  =============== OLD CODE START ===============
  [ACTUAL OLD CODE HERE - Commented with // or /* */]
  =============== OLD CODE END ===============
*/
```

---

## Restoration Guide

### If You Want to Restore Old Code

#### Option 1: Use Search & Replace
1. Search: `/* \n  ===== COMMENTED OUT:`
2. Replace with: (nothing, delete the comment wrapper)
3. This removes comment markers only

#### Option 2: Manual Restoration
1. Find the commented section
2. Copy the code inside `OLD CODE START` and `OLD CODE END`
3. Paste in correct location
4. Remove surrounding `//` or `/* */` markers

#### Option 3: Using Git
If using Git version control:
```bash
git log --oneline -n 20                    # See recent commits
git diff HEAD~1 BudgetaryQuotationForm.js # See what changed
git show HEAD:BudgetaryQuotationForm.js   # See previous version
```

---

## Line Numbers Reference

```
BudgetaryQuotationForm.js (4074 lines total)
│
├─ Line 51: useDocumentUpload import added
├─ Line 67-95: NEW: Hook initialization
├─ Line 97-109: COMMENTED: Old state variables
├─ Line 230-288: COMMENTED: Old handlers (create form)
│
└─ ViewBudgetaryQuotationData function (inside same file)
   ├─ Line 1216-1226: COMMENTED: Old states (table)
   └─ Line 1450-1530: COMMENTED: Old handlers (table dialog)
```

---

## Why Code Was Commented (Not Deleted)

1. **Traceability**: See exactly what was replaced
2. **Learning**: Understand the transformation
3. **Safety**: Easy rollback if needed
4. **Reference**: Check old implementation if questions arise
5. **Documentation**: Comments explain the why, not just the what

---

## Cleanup (Optional - Future)

If you decide to completely remove old code:

1. **Phase 1**: Keep comments for reference (Current state) ✅
2. **Phase 2**: Remove old code after production testing
3. **Phase 3**: Keep only hook implementation

---

## Quick Restore Command

### Find & List All Commented Sections
```bash
# Using grep (Linux/Mac)
grep -n "===== COMMENTED OUT:" BudgetaryQuotationForm.js

# Output will show:
# 109:  ===== COMMENTED OUT: OLD DOCUMENT UPLOAD STATE
# 291:  ===== COMMENTED OUT: OLD DOCUMENT UPLOAD HANDLERS
# 1224: ===== COMMENTED OUT: OLD TABLE DIALOG UPLOAD STATES
# 1500: ===== COMMENTED OUT: OLD TABLE DIALOG HANDLERS
```

---

## Summary

- **Total Commented Sections**: 4
- **Total Lines Commented**: ~200 lines
- **Reason**: Code moved to reusable custom hook
- **Impact**: Better reusability, maintainability, testability
- **Restoration**: Easy - all original code preserved in comments

---

**Last Updated**: December 28, 2025
**File Version**: 1.0.0
