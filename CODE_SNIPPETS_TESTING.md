# Copy-Paste Code Snippets for Testing

## 🎯 Quick Implementation Guide

### Snippet 1: Update BudgetaryQuotationForm.js (useEffect)

**Location:** Line ~65 in BudgetaryQuotationForm.js

**BEFORE:**
```javascript
useEffect(() => {
  axios
    .get(`/config.json`)
    .then(function (response) {
      console.log(
        "we are looking for server IP : ",
        response.data.project[0].ServerIP[0].NodeServerIP
      );
      SetServerIp(response.data.project[0].ServerIP[0].NodeServerIP);
      axios
        .get(response.data.project[0].ServerIP[0].NodeServerIP + API)
        .then((response) => {
          setOrderData(response.data);
        })
        .catch((error) => console.log(error.message));
    })
    .catch(function (error) {
      SetServerIp("172.195.120.135");
    })
    .finally(function () {
      // always executed
    });
}, []);
```

**AFTER (For Testing with Mock Data):**
```javascript
import { mockBudgetaryQuotationData } from '../../mockData/budgetaryQuotationMockData';

useEffect(() => {
  // ===== FOR TESTING - USE MOCK DATA =====
  setOrderData(mockBudgetaryQuotationData);
  SetServerIp("http://localhost:5000"); // For when API is ready

  // ===== FOR PRODUCTION - USE REAL API =====
  /*
  axios
    .get(`/config.json`)
    .then(function (response) {
      console.log(
        "we are looking for server IP : ",
        response.data.project[0].ServerIP[0].NodeServerIP
      );
      SetServerIp(response.data.project[0].ServerIP[0].NodeServerIP);
      axios
        .get(response.data.project[0].ServerIP[0].NodeServerIP + API)
        .then((response) => {
          setOrderData(response.data);
        })
        .catch((error) => console.log(error.message));
    })
    .catch(function (error) {
      SetServerIp("172.195.120.135");
    })
    .finally(function () {
      // always executed
    });
  */
}, []);
```

---

## 🧪 Testing Code Snippets

### Snippet 2: Test Update Functionality in Console

```javascript
// Open Browser Console (F12)
// Copy and paste to test update functionality

// 1. Get current data
console.log('Current Data:', mockBudgetaryQuotationData.data);

// 2. Update a record
const updated = mockBudgetaryQuotationData.data[0];
updated.customerName = 'Test Updated Customer';
updated.presentStatus = 'Won';
updated.estimateValueInCrWithoutGST = 99.99;

// 3. Verify update
console.log('Updated Record:', updated);

// 4. Refresh component state
setTableData([...mockBudgetaryQuotationData.data]);
```

---

### Snippet 3: Test All Records

```javascript
// Print all 10 records in console
mockBudgetaryQuotationData.data.forEach((record, index) => {
  console.log(`${index + 1}. ${record.id} - ${record.bqTitle}`);
  console.log(`   Customer: ${record.customerName}`);
  console.log(`   Value: ₹${record.estimateValueInCrWithoutGST} Cr`);
  console.log(`   Status: ${record.presentStatus}`);
  console.log('---');
});
```

---

### Snippet 4: Test Filter by Defence Type

```javascript
// Filter by Defence
const defenceRecords = mockBudgetaryQuotationData.data.filter(
  r => r.defenceAndNonDefence === 'Defence'
);
console.log('Defence Records:', defenceRecords);

// Filter by Non-Defence
const nonDefenceRecords = mockBudgetaryQuotationData.data.filter(
  r => r.defenceAndNonDefence === 'Non-Defence'
);
console.log('Non-Defence Records:', nonDefenceRecords);
```

---

### Snippet 5: Test Sort by Value

```javascript
// Sort by estimate value (ascending)
const sortedAsc = [...mockBudgetaryQuotationData.data].sort(
  (a, b) => a.estimateValueInCrWithoutGST - b.estimateValueInCrWithoutGST
);
console.log('Sorted (Low to High):', sortedAsc);

// Sort by estimate value (descending)
const sortedDesc = [...mockBudgetaryQuotationData.data].sort(
  (a, b) => b.estimateValueInCrWithoutGST - a.estimateValueInCrWithoutGST
);
console.log('Sorted (High to Low):', sortedDesc);
```

---

### Snippet 6: Test Search Functionality

```javascript
// Search by title
const searchTerm = 'software';
const results = mockBudgetaryQuotationData.data.filter(
  r => r.bqTitle.toLowerCase().includes(searchTerm)
);
console.log(`Search results for "${searchTerm}":`, results);

// Search by customer
const customerSearch = 'defence';
const customerResults = mockBudgetaryQuotationData.data.filter(
  r => r.customerName.toLowerCase().includes(customerSearch)
);
console.log(`Customer search for "${customerSearch}":`, customerResults);
```

---

### Snippet 7: Test Record by ID

```javascript
// Get specific record
const record = mockBudgetaryQuotationData.data.find(r => r.id === 'BQ001');
console.log('Record BQ001:', record);

// Edit and show
record.customerName = 'New Customer Name';
console.log('After update:', record);
```

---

## 🔄 Real API Test Snippets

### Snippet 8: API Update Call (When Backend Ready)

```javascript
// Test API update call
const testUpdateAPI = async () => {
  try {
    const response = await axios.put(
      'http://localhost:5000/updateBudgetaryQuotation',
      {
        id: 'BQ001',
        customerName: 'Updated Customer',
        presentStatus: 'Won',
        estimateValueInCrWithoutGST: 99.99
      }
    );

    if (response.data.success) {
      console.log('Update successful:', response.data);
      // Update local state
      setTableData(prev => 
        prev.map(row => 
          row.id === 'BQ001' 
            ? { ...row, ...response.data.data }
            : row
        )
      );
    }
  } catch (error) {
    console.error('Update failed:', error);
  }
};

// Run test
testUpdateAPI();
```

---

### Snippet 9: Mock API Interceptor (For Development)

```javascript
// Add to your axios setup or middleware
axios.interceptors.response.use(
  response => response,
  error => {
    // Mock the update API response during development
    if (error.config.url.includes('/updateBudgetaryQuotation')) {
      return Promise.resolve({
        status: 200,
        data: {
          success: true,
          message: 'Record updated successfully (mocked)',
          data: error.config.data
        }
      });
    }
    return Promise.reject(error);
  }
);
```

---

## 📊 Data Manipulation Snippets

### Snippet 10: Add New Record

```javascript
import { addMockBQ } from '../mockData/budgetaryQuotationMockData';

const newRecord = addMockBQ({
  bqTitle: 'New Project Bid',
  customerName: 'New Customer LLC',
  customerAddress: '456 Tech Avenue, Silicon Valley, CA 94025',
  leadOwner: 'John Doe',
  defenceAndNonDefence: 'Non-Defence',
  estimateValueInCrWithoutGST: 25.5,
  submittedValueInCrWithoutGST: 24.0,
  dateOfLetterSubmission: '2025-12-26',
  referenceNo: 'TEST-NEW-001',
  JSON_competitors: 'Competitor A, Competitor B',
  presentStatus: 'Budgetary Quotation Submitted',
  remarks: 'Test record added'
});

console.log('New record added:', newRecord);
setTableData([...mockBudgetaryQuotationData.data]);
```

---

### Snippet 11: Delete Record

```javascript
import { deleteMockBQ } from '../mockData/budgetaryQuotationMockData';

const deleted = deleteMockBQ('BQ001');
if (deleted) {
  console.log('Record deleted successfully');
  setTableData([...mockBudgetaryQuotationData.data]);
} else {
  console.log('Record not found');
}
```

---

### Snippet 12: Get All Records by Status

```javascript
const statuses = [
  'Budgetary Quotation Submitted',
  'Commercial Bid Submitted',
  'EoI was Submitted',
  'Not Participated'
];

statuses.forEach(status => {
  const records = mockBudgetaryQuotationData.data.filter(
    r => r.presentStatus === status
  );
  console.log(`${status}: ${records.length} records`);
});
```

---

## 🎨 UI Testing Snippets

### Snippet 13: Simulate Edit Dialog Open

```javascript
// Simulate opening edit dialog for BQ001
const record = mockBudgetaryQuotationData.data[0];

setEditingRow(record);
setTempEditingRow(record);
setEditDialogOpen(true);
setIsEditMode(false); // Start in view mode

console.log('Dialog opened for:', record.bqTitle);
```

---

### Snippet 14: Simulate Edit and Save

```javascript
// Step 1: Open dialog
const record = mockBudgetaryQuotationData.data[0];
setEditingRow(record);
setEditDialogOpen(true);

// Step 2: Enter edit mode
setIsEditMode(true);

// Step 3: Modify field
setEditingRow(prev => ({
  ...prev,
  customerName: 'New Customer Name'
}));

// Step 4: Save (triggers confirmation)
setConfirmSaveOpen(true);

// Step 5: Confirm update
// (This would call handleConfirmSave)
```

---

### Snippet 15: Test Cancel Functionality

```javascript
// Step 1: Open with original data
const original = mockBudgetaryQuotationData.data[0];
setEditingRow(original);
setTempEditingRow(original);
setEditDialogOpen(true);

// Step 2: Enter edit mode
setIsEditMode(true);

// Step 3: Modify (but will cancel)
setEditingRow(prev => ({
  ...prev,
  customerName: 'This will be cancelled'
}));

// Step 4: Cancel - revert to original
setIsEditMode(false);
setEditingRow(original);
setEditDialogOpen(false);

console.log('Cancelled - reverted to original:', original.customerName);
```

---

## 🧬 State Management Snippets

### Snippet 16: Reset All States

```javascript
// Reset all edit-related states
setEditingRow(null);
setTempEditingRow(null);
setEditDialogOpen(false);
setConfirmSaveOpen(false);
setIsEditMode(false);
setSelectedRow(null);

console.log('All states reset');
```

---

### Snippet 17: Test Search and Edit

```javascript
// Search
const searchTerm = 'Railway';
const searchResults = mockBudgetaryQuotationData.data.filter(
  r => r.bqTitle.toLowerCase().includes(searchTerm.toLowerCase())
);

// Edit first result
if (searchResults.length > 0) {
  const recordToEdit = searchResults[0];
  setEditingRow(recordToEdit);
  setEditDialogOpen(true);
  setIsEditMode(false);
  
  console.log('Editing searched record:', recordToEdit.bqTitle);
}
```

---

## 📝 Debugging Snippets

### Snippet 18: Log Current Component State

```javascript
// Add this to your component to log state
console.log('=== Component State ===');
console.log('tableData:', tableData);
console.log('editingRow:', editingRow);
console.log('isEditMode:', isEditMode);
console.log('editDialogOpen:', editDialogOpen);
console.log('confirmSaveOpen:', confirmSaveOpen);
console.log('selectedRow:', selectedRow);
console.log('======================');
```

---

### Snippet 19: Verify Data Integrity

```javascript
// Check all records have required fields
mockBudgetaryQuotationData.data.forEach((record, index) => {
  const required = [
    'id', 'bqTitle', 'customerName', 'leadOwner',
    'defenceAndNonDefence', 'estimateValueInCrWithoutGST',
    'dateOfLetterSubmission', 'referenceNo', 'presentStatus'
  ];
  
  const missing = required.filter(field => !record[field]);
  
  if (missing.length > 0) {
    console.warn(`Record ${index} (${record.id}) missing:`, missing);
  } else {
    console.log(`Record ${index} (${record.id}): ✓ Complete`);
  }
});
```

---

### Snippet 20: Test Record Values Range

```javascript
// Analyze value distribution
const values = mockBudgetaryQuotationData.data.map(
  r => r.estimateValueInCrWithoutGST
);

console.log('Value Statistics:');
console.log('Min:', Math.min(...values));
console.log('Max:', Math.max(...values));
console.log('Avg:', (values.reduce((a, b) => a + b) / values.length).toFixed(2));
console.log('Median:', values.sort()[Math.floor(values.length / 2)]);
```

---

## 🚀 Integration Test Snippet

### Snippet 21: Complete Edit Workflow Test

```javascript
// Copy this entire workflow to test complete edit functionality

const testCompleteEditWorkflow = async () => {
  console.log('=== Starting Complete Edit Workflow Test ===');

  // 1. Get record
  const record = mockBudgetaryQuotationData.data.find(r => r.id === 'BQ001');
  console.log('1. Original Record:', record);

  // 2. Open dialog
  setEditingRow(record);
  setTempEditingRow(record);
  setEditDialogOpen(true);
  console.log('2. Dialog opened');

  // 3. Enter edit mode
  setIsEditMode(true);
  console.log('3. Entered edit mode');

  // 4. Modify fields
  const updates = {
    customerName: 'Updated Customer',
    presentStatus: 'Won',
    estimateValueInCrWithoutGST: 99.99
  };
  
  setEditingRow(prev => ({ ...prev, ...updates }));
  console.log('4. Fields updated:', updates);

  // 5. Save
  setConfirmSaveOpen(true);
  console.log('5. Confirmation dialog opened');

  // 6. Confirm (simulated)
  const updatedRecord = { ...record, ...updates };
  setTableData(prev =>
    prev.map(r => r.id === record.id ? updatedRecord : r)
  );
  console.log('6. Record saved to table');

  // 7. Clean up
  setEditingRow(null);
  setEditDialogOpen(false);
  setIsEditMode(false);
  setConfirmSaveOpen(false);
  console.log('7. Dialogs closed');

  console.log('=== Workflow Complete ===');
};

// Run it
testCompleteEditWorkflow();
```

---

## 📋 Checklist for Copy-Paste

- [ ] Snippet 1: Updated useEffect with mock data
- [ ] Snippet 2: Test update in console
- [ ] Snippet 3: Print all records
- [ ] Snippet 4: Test filters
- [ ] Snippet 5: Test sort
- [ ] Snippet 6: Test search
- [ ] Snippet 7: Get by ID
- [ ] Snippet 8: API update call
- [ ] Snippet 9: Mock interceptor
- [ ] Snippet 10-15: Data manipulation and UI testing
- [ ] Snippet 16-21: Debugging and integration tests

---

**Ready to copy, paste, and test! 🎉**

Last Updated: December 26, 2025
