# Testing Guide for Edit Functionality

## Mock Data Overview

A comprehensive mock dataset has been created at:
```
src/mockData/budgetaryQuotationMockData.js
```

### Dataset Contains:
- **10 sample BQ records** with realistic data
- **Multiple defence types**: Defence, Non-Defence, Civil
- **Various statuses**: Budgetary Quotation Submitted, Commercial Bid Submitted, etc.
- **Complete field data** matching your form schema

---

## Quick Start - Using Mock Data

### 1. Import Mock Data

```javascript
import { mockBudgetaryQuotationData } from '../mockData/budgetaryQuotationMockData';

// In your component
const [orderData, setOrderData] = useState(mockBudgetaryQuotationData);
```

### 2. Replace API Call (Temporary Testing)

In `BudgetaryQuotationForm.js`, replace the axios call with mock data:

```javascript
// BEFORE (Original API call)
useEffect(() => {
  axios
    .get(`/config.json`)
    .then(function (response) {
      // ... existing code
    });
}, []);

// AFTER (For testing with mock data)
useEffect(() => {
  // Use mock data for testing
  setOrderData(mockBudgetaryQuotationData);
  
  // Or keep original API call if backend is ready
  // axios.get(...);
}, []);
```

---

## Testing Scenarios

### Test Case 1: View & Edit Non-Defence Record

**Steps:**
1. Go to "View Data" tab
2. Click on record **BQ001** (Enterprise Software Solution)
3. Dialog opens in VIEW MODE (blue header)
4. Click "✏️ Edit Details"
5. Dialog switches to EDIT MODE (orange header)
6. Change `customerName` from "Acme Corporation" to "Acme Corp Ltd"
7. Click "💾 Save Changes"
8. Confirmation dialog appears
9. Click "✓ Yes, Save Changes"
10. Table updates immediately
11. Verify change in the table row

**Expected Result:** ✅ Changes reflected without page reload

---

### Test Case 2: Edit Defence Record

**Steps:**
1. Click on record **BQ002** (Defence System Integration)
2. Enter EDIT MODE
3. Change `presentStatus` to "Won"
4. Change `estimateValueInCrWithoutGST` to "50.5"
5. Save and confirm
6. Check table for updated values

**Expected Result:** ✅ Multiple field updates work correctly

---

### Test Case 3: Cancel Edit

**Steps:**
1. Open any record (e.g., BQ003)
2. Click "✏️ Edit Details"
3. Change some fields
4. Click "Cancel"
5. Verify dialog closes without saving
6. Open the same record again
7. Verify original values are unchanged

**Expected Result:** ✅ Cancel button reverts changes

---

### Test Case 4: Filter & Edit

**Steps:**
1. Go to "View Data" tab
2. Filter by "Defence / Non-Defence" = "Defence"
3. Click edit on **BQ002**
4. Modify and save
5. Remove filter
6. Verify change persists in full list

**Expected Result:** ✅ Filtered data edits work correctly

---

### Test Case 5: Search & Edit

**Steps:**
1. Search for "Railway" (finds BQ009)
2. Edit the record
3. Change `leadOwner` to "New Lead Owner"
4. Save and confirm
5. Clear search
6. Verify change in full table

**Expected Result:** ✅ Searched records can be edited

---

### Test Case 6: Sort & Edit

**Steps:**
1. Sort by "Estimate Value"
2. Edit the first record in sorted order
3. Save changes
4. Change sort direction
5. Verify change persists

**Expected Result:** ✅ Sorted data remains consistent after edit

---

## Mock Data Helper Functions

### Get All Data
```javascript
import { getMockBudgetaryQuotationData } from '../mockData/budgetaryQuotationMockData';

const data = getMockBudgetaryQuotationData();
console.log(data); // { data: [...] }
```

### Get Single Record
```javascript
import { getMockBQById } from '../mockData/budgetaryQuotationMockData';

const record = getMockBQById('BQ001');
console.log(record); // { id: 'BQ001', bqTitle: '...', ... }
```

### Update Mock Record
```javascript
import { updateMockBQ } from '../mockData/budgetaryQuotationMockData';

const updated = updateMockBQ('BQ001', {
  customerName: 'New Customer',
  presentStatus: 'Won'
});
```

### Add New Record
```javascript
import { addMockBQ } from '../mockData/budgetaryQuotationMockData';

const newRecord = addMockBQ({
  bqTitle: 'New BQ',
  customerName: 'New Customer',
  // ... other fields
});
```

### Filter by Status
```javascript
import { filterMockBQByStatus } from '../mockData/budgetaryQuotationMockData';

const submitted = filterMockBQByStatus('Budgetary Quotation Submitted');
const won = filterMockBQByStatus('Won');
```

### Filter by Defence Type
```javascript
import { filterMockBQByDefenceType } from '../mockData/budgetaryQuotationMockData';

const defence = filterMockBQByDefenceType('Defence');
const nonDefence = filterMockBQByDefenceType('Non-Defence');
const civil = filterMockBQByDefenceType('Civil');
```

---

## Test Data Records

### Record 1: BQ001
```json
{
  "id": "BQ001",
  "bqTitle": "Enterprise Software Solution",
  "customerName": "Acme Corporation",
  "customerAddress": "123 Business Park, New York, NY 10001",
  "leadOwner": "Rajesh Kumar",
  "defenceAndNonDefence": "Non-Defence",
  "estimateValueInCrWithoutGST": 15.5,
  "submittedValueInCrWithoutGST": 14.8,
  "dateOfLetterSubmission": "2025-11-20",
  "referenceNo": "REF-2025-001",
  "JSON_competitors": "TCS, Infosys, Wipro",
  "presentStatus": "Budgetary Quotation Submitted",
  "dateCreated": "2025-11-15"
}
```

### Record 2: BQ002
```json
{
  "id": "BQ002",
  "bqTitle": "Defence System Integration",
  "customerName": "Ministry of Defence",
  "customerAddress": "South Block, New Delhi, Delhi 110011",
  "leadOwner": "Amit Singh",
  "defenceAndNonDefence": "Defence",
  "estimateValueInCrWithoutGST": 45.25,
  "submittedValueInCrWithoutGST": 43.5,
  "dateOfLetterSubmission": "2025-10-15",
  "referenceNo": "REF-2025-002",
  "JSON_competitors": "HAL, BEL, DRDO",
  "presentStatus": "Commercial Bid Submitted",
  "dateCreated": "2025-10-10"
}
```

### Record 9: BQ009
```json
{
  "id": "BQ009",
  "bqTitle": "Railway Signaling System",
  "customerName": "Indian Railways",
  "customerAddress": "Rail Bhavan, New Delhi, Delhi 110001",
  "leadOwner": "Ravi Kumar",
  "defenceAndNonDefence": "Defence",
  "estimateValueInCrWithoutGST": 75.5,
  "submittedValueInCrWithoutGST": 72.0,
  "dateOfLetterSubmission": "2025-09-10",
  "referenceNo": "REF-2025-009",
  "JSON_competitors": "Siemens, Alstom",
  "presentStatus": "Budgetary Quotation Submitted",
  "dateCreated": "2025-09-05"
}
```

---

## Browser Console Testing

### Check Console Logs
Open DevTools (F12) → Console tab and watch for:

```javascript
// When dialog opens
"props viewBudgetaryQuotationData" // Should show data array

// When entering edit mode
"Confirmed - Updating row: { ... }" // Shows edited data

// After API call
"Backend Response: { success: true, ... }"
```

### Test Edit via Console
```javascript
// In React DevTools, update state directly
setEditingRow({ id: 'BQ001', customerName: 'Test', ... })
```

---

## Mock API Integration (For Development)

When backend is not ready, you can mock the API response:

```javascript
// In your interceptor or middleware
axios.interceptors.response.use(
  response => response,
  error => {
    // Mock the update API response
    if (error.config.url.includes('/updateBudgetaryQuotation')) {
      return Promise.resolve({
        status: 200,
        data: {
          success: true,
          message: 'Record updated successfully',
          data: error.config.data
        }
      });
    }
    return Promise.reject(error);
  }
);
```

---

## Expected Behavior Checklist

### View Mode
- [ ] Dialog opens in read-only mode
- [ ] Blue header displayed
- [ ] All fields show correct values
- [ ] "✏️ Edit Details" button visible

### Edit Mode
- [ ] Dialog switches to editable state
- [ ] Orange header displayed
- [ ] Fields become input elements
- [ ] "💾 Save Changes" button visible
- [ ] "Cancel" button works

### Save & Confirm
- [ ] "Save Changes" opens confirmation dialog
- [ ] Confirmation shows update warning
- [ ] "✓ Yes, Save Changes" triggers API call
- [ ] Success alert displayed

### Table Update
- [ ] Table row updates without reload
- [ ] Changed values visible in table
- [ ] Filters still work after edit
- [ ] Sort order maintained

---

## Debugging Tips

### If Edit Not Saving:
1. Check browser console for errors
2. Verify `ServerIp` prop is passed correctly
3. Confirm API endpoint exists: `/updateBudgetaryQuotation`
4. Check Network tab for API calls

### If Table Not Updating:
1. Verify `tableData` state is being updated
2. Check `onDataUpdate` callback is working
3. Confirm row ID matches exactly

### If Confirmation Dialog Not Showing:
1. Ensure `handleEditSave()` calls `setConfirmSaveOpen(true)`
2. Check `confirmSaveOpen` state in React DevTools
3. Verify Dialog component is rendered

---

## Files Structure

```
src/
├── mockData/
│   └── budgetaryQuotationMockData.js  ← Mock data file
├── marketingComponents/
│   └── components/
│       └── budgetaryQuotation/
│           └── BudgetaryQuotationForm.js  ← Main component
└── App.js  ← Import and use mock data
```

---

## Next Steps

1. ✅ **Review mock data** - Check if all fields are correct
2. ⬜ **Test locally** - Use mock data in your component
3. ⬜ **Implement backend API** - Create `/updateBudgetaryQuotation` endpoint
4. ⬜ **Replace mock with real API** - Switch to actual backend calls
5. ⬜ **Production testing** - Test with real database

---

**Last Updated**: December 26, 2025
