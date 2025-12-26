# Quick Setup Guide - Using Mock Data for Testing

## Files Created

```
src/
├── mockData/
│   └── budgetaryQuotationMockData.js     ← 10 sample BQ records
├── examples/
│   └── MockDataExample.js                ← Example component showing usage
TESTING_GUIDE.md                          ← Detailed testing scenarios
EDIT_FUNCTIONALITY_UPDATES.md             ← Implementation details
```

---

## 3-Step Setup

### Step 1: Update BudgetaryQuotationForm.js

**Location:** `src/marketingComponents/components/budgetaryQuotation/BudgetaryQuotationForm.js`

**Find this code (around line 65):**
```javascript
useEffect(() => {
  axios
    .get(`/config.json`)
    .then(function (response) {
      // ... existing code
    });
}, []);
```

**Replace with:**
```javascript
import { mockBudgetaryQuotationData } from '../../mockData/budgetaryQuotationMockData';

useEffect(() => {
  // FOR TESTING - Use mock data
  setOrderData(mockBudgetaryQuotationData);
  
  // UNCOMMENT BELOW FOR PRODUCTION
  /*
  axios
    .get(`/config.json`)
    .then(function (response) {
      // ... existing code
    });
  */
}, []);
```

### Step 2: Save and Test

1. **Save the file** (Ctrl + S)
2. **Go to "View Data" tab** in the application
3. **You should see 10 records** from the mock data

### Step 3: Test Edit Functionality

1. **Click on any row** (e.g., "Enterprise Software Solution")
2. **Dialog opens in VIEW MODE**
3. **Click "✏️ Edit Details"**
4. **Change a field** (e.g., customerName)
5. **Click "💾 Save Changes"**
6. **Click "✓ Yes, Save Changes"** in confirmation dialog
7. **Check table for updated values** ✅

---

## Quick Reference - Mock Data Structure

Each record contains:
```javascript
{
  id: "BQ001",                           // Unique identifier
  bqTitle: "...",                       // Form field: bqTitle
  customerName: "...",                  // Form field: customerName
  customerAddress: "...",               // Form field: customerAddress
  leadOwner: "...",                     // Form field: leadOwner
  defenceAndNonDefence: "...",         // Form field: defenceAndNonDefence
  estimateValueInCrWithoutGST: 15.5,   // Form field: estimateValueInCrWithoutGST
  submittedValueInCrWithoutGST: 14.8,  // Form field: submittedValueInCrWithoutGST
  dateOfLetterSubmission: "2025-11-20", // Form field: dateOfLetterSubmission
  referenceNo: "REF-2025-001",         // Form field: referenceNo
  JSON_competitors: "...",              // Form field: JSON_competitors
  presentStatus: "...",                 // Form field: presentStatus
  dateCreated: "2025-11-15"            // Created date
}
```

---

## Available Records for Testing

| ID | Title | Customer | Type | Status |
|---|---|---|---|---|
| BQ001 | Enterprise Software Solution | Acme Corporation | Non-Defence | Budgetary Quotation Submitted |
| BQ002 | Defence System Integration | Ministry of Defence | Defence | Commercial Bid Submitted |
| BQ003 | Civil Infrastructure Management | National Highways Authority | Civil | Budgetary Quotation Submitted |
| BQ004 | Financial Management Platform | State Bank of India | Non-Defence | EoI was Submitted |
| BQ005 | Cybersecurity Solutions | CERT-IN | Defence | Budgetary Quotation Submitted |
| BQ006 | Healthcare IT System | Apollo Hospitals | Non-Defence | Commercial Bid Submitted |
| BQ007 | Smart City Management System | Smart City Development | Civil | Not Participated |
| BQ008 | Telecommunications Infrastructure | Jio | Non-Defence | Commercial Bid Submitted |
| BQ009 | Railway Signaling System | Indian Railways | Defence | Budgetary Quotation Submitted |
| BQ010 | Education Management System | Delhi Public School | Non-Defence | EoI was Submitted |

---

## Test Scenarios

### Easy Tests (Start Here)
1. ✅ **View Record** - Click row, see dialog
2. ✅ **Edit Single Field** - Change customer name only
3. ✅ **Save & Confirm** - Complete flow

### Medium Tests
4. ✅ **Edit Multiple Fields** - Change 3+ fields
5. ✅ **Edit Defence Record** - Test BQ002
6. ✅ **Filter & Edit** - Filter by type, then edit

### Advanced Tests
7. ✅ **Search & Edit** - Search for record, edit it
8. ✅ **Sort & Edit** - Sort by value, edit first row
9. ✅ **Cancel Edit** - Start edit, then cancel

---

## Browser DevTools Tips

### View Console Logs
```
F12 → Console tab → Look for:
- "props viewBudgetaryQuotationData"
- "Confirmed - Updating row:"
- "Backend Response:"
```

### Test Data with React DevTools
1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Find ViewBudgetaryQuotationData component
4. Inspect state: `tableData`, `editingRow`, `isEditMode`

### Network Tab (When Using Real API)
1. Open DevTools → Network tab
2. Perform edit
3. Look for PUT request to `/updateBudgetaryQuotation`
4. Check request/response payload

---

## Common Issues & Solutions

### Issue: Data not loading
**Solution:**
- Check import path is correct
- Verify `setOrderData` is called
- Check browser console for errors

### Issue: Edit button not working
**Solution:**
- Ensure `handleEditClick` is triggered
- Check `editDialogOpen` state is true
- Verify Dialog component is rendered

### Issue: Table not updating after save
**Solution:**
- Confirm `setTableData` is called in `handleConfirmSave`
- Check `tableData` is used in table rendering
- Verify updated object has same `id`

### Issue: Confirmation dialog not showing
**Solution:**
- Check `confirmSaveOpen` state is true
- Ensure `setConfirmSaveOpen(true)` is in `handleEditSave`
- Verify Dialog component is in JSX

---

## Helper Functions Reference

### Import helper functions:
```javascript
import {
  getMockBudgetaryQuotationData,    // Get all data
  getMockBQById,                     // Get single record
  updateMockBQ,                      // Update mock record
  addMockBQ,                         // Add new record
  deleteMockBQ,                      // Delete record
  filterMockBQByStatus,             // Filter by status
  filterMockBQByDefenceType         // Filter by type
} from './mockData/budgetaryQuotationMockData';
```

### Get record by ID:
```javascript
const record = getMockBQById('BQ001');
console.log(record);
```

### Update record:
```javascript
const updated = updateMockBQ('BQ001', {
  customerName: 'New Name',
  presentStatus: 'Won'
});
```

### Filter Defence records:
```javascript
const defenceRecords = filterMockBQByDefenceType('Defence');
```

---

## When to Switch to Real API

Once your backend is ready:

1. **Implement the endpoint:**
   ```
   PUT /updateBudgetaryQuotation
   ```

2. **Return response format:**
   ```javascript
   {
     success: true,
     message: "Record updated successfully",
     data: { updated record }
   }
   ```

3. **Comment out mock data:**
   ```javascript
   // setOrderData(mockBudgetaryQuotationData);
   ```

4. **Uncomment axios call:**
   ```javascript
   axios.get(`/config.json`)...
   ```

5. **Test with real backend** 🚀

---

## File Locations

```
Project Root/
├── src/
│   ├── mockData/
│   │   └── budgetaryQuotationMockData.js
│   ├── examples/
│   │   └── MockDataExample.js
│   └── marketingComponents/
│       └── components/
│           └── budgetaryQuotation/
│               └── BudgetaryQuotationForm.js
├── TESTING_GUIDE.md
└── EDIT_FUNCTIONALITY_UPDATES.md
```

---

## Next Steps

1. ✅ **Setup mock data** (This guide)
2. ⬜ **Test all scenarios** (See TESTING_GUIDE.md)
3. ⬜ **Implement backend API** (PUT /updateBudgetaryQuotation)
4. ⬜ **Replace mock with real API**
5. ⬜ **Deploy to production**

---

## Support

If you encounter issues:
1. Check browser console (F12)
2. Review TESTING_GUIDE.md for test cases
3. Refer to EDIT_FUNCTIONALITY_UPDATES.md for implementation details
4. Inspect component state with React DevTools

---

**Happy Testing! 🎉**

Last Updated: December 26, 2025
