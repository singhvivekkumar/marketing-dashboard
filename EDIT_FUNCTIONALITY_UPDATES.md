# Edit Functionality Updates - BudgetaryQuotationForm

## Summary of Changes

Modified the `ViewBudgetaryQuotationData` component to implement a complete edit workflow with confirmation dialog and backend synchronization.

---

## Changes Made

### 1. **Enhanced Edit Dialog Flow**

#### Before:
- Clicking edit icon would open dialog in edit mode immediately
- No confirmation dialog
- No backend API integration

#### After:
- **View Mode**: Clicking edit icon opens dialog in read-only view mode
- **Edit Mode**: User clicks "✏️ Edit Details" button to enter edit mode
- **Save Mode**: Clicking "💾 Save Changes" shows confirmation dialog
- **Confirm & Update**: Confirmation dialog with "✓ Yes, Save Changes" button

---

### 2. **Handler Functions Updated**

#### `handleEditClick(row)`
- Opens dialog in **VIEW MODE** (not edit mode)
- Stores original data in `tempEditingRow` for potential cancellation
- Sets `isEditMode = false`

#### `handleEnterEditMode()`
- Called when user clicks "✏️ Edit Details" button
- Switches from view mode to edit mode
- Dialog header changes from blue to orange

#### `handleEditSave()`
- Called when user clicks "💾 Save Changes" button
- Opens confirmation dialog (`setConfirmSaveOpen(true)`)
- Does NOT directly save to backend

#### `handleConfirmSave()` (UPDATED)
- Executes after user confirms in confirmation dialog
- **API Call**: Sends PUT request to `/updateBudgetaryQuotation` endpoint
  ```javascript
  axios.put(`${ServerIp}/updateBudgetaryQuotation`, {
    id: editingRow.id,
    ...editingRow
  })
  ```
- **Local State Update**: Updates `tableData` state with new values
- **No Page Reload**: Table reflects changes immediately
- **Parent Notification**: Calls `props.onDataUpdate()` if provided
- Shows success/error alert

#### `handleCancelEdit()`
- Cancels edit mode without saving
- Resets `editingRow` to `tempEditingRow` (original data)
- Disables `isEditMode`

---

### 3. **New State Management**

Added local state in `ViewBudgetaryQuotationData`:

```javascript
const [tableData, setTableData] = useState(props.ViewData.data || []);

useEffect(() => {
  if (props.ViewData.data) {
    setTableData(props.ViewData.data);
  }
}, [props.ViewData.data]);
```

**Benefits:**
- Table updates immediately after backend confirmation
- No need for page reload
- Synchronized with parent component via `onDataUpdate` callback

---

### 4. **Props Passed to Component**

Updated in `BudgetaryQuotationForm`:

```javascript
<ViewBudgetaryQuotationData 
  ViewData={orderData} 
  ServerIp={ServerIp}
  onDataUpdate={(updatedData) => setOrderData({ data: updatedData })}
/>
```

**Props:**
- `ViewData`: Original data from props
- `ServerIp`: Server IP for API calls
- `onDataUpdate`: Callback to update parent state

---

### 5. **Dialog Workflow**

```
Click Row
  ↓
VIEW MODE Dialog Opens
  ↓
Click "✏️ Edit Details"
  ↓
EDIT MODE (Orange Header)
  ↓
Modify Fields
  ↓
Click "💾 Save Changes"
  ↓
CONFIRMATION Dialog Shows
  ↓
Click "✓ Yes, Save Changes"
  ↓
API Call to Backend (/updateBudgetaryQuotation)
  ↓
Update Local Table State
  ↓
Close Dialogs
  ↓
Table Reflects Changes (NO RELOAD)
```

---

### 6. **API Integration**

**Endpoint**: `PUT /updateBudgetaryQuotation`

**Request Payload**:
```javascript
{
  id: "row-id",
  bqTitle: "updated value",
  customerName: "updated value",
  customerAddress: "updated value",
  leadOwner: "updated value",
  defenceAndNonDefence: "updated value",
  estimateValueInCrWithoutGST: "updated value",
  submittedValueInCrWithoutGST: "updated value",
  dateOfLetterSubmission: "updated value",
  referenceNo: "updated value",
  JSON_competitors: "updated value",
  presentStatus: "updated value"
}
```

**Expected Response**:
```javascript
{
  success: true,
  message: "Record updated successfully",
  data: { ...updated record }
}
```

---

## Backend Implementation Required

Create or update the `/updateBudgetaryQuotation` endpoint in your backend:

```javascript
// Example Node.js/Express
router.put('/updateBudgetaryQuotation', async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    
    // Update database
    const updated = await BudgetaryQuotation.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    res.json({
      success: true,
      message: "Record updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

---

## User Experience Flow

1. **View Data Tab** → All records displayed in table
2. **Click Any Row** → Dialog opens in VIEW MODE (read-only)
3. **Click Edit Icon** → Dialog switches to EDIT MODE (orange header)
4. **Modify Fields** → Changes made to form fields
5. **Click Save Changes** → Confirmation dialog appears
6. **Confirm Update** → Backend is called, table updates immediately
7. **Success Message** → "✅ Changes saved successfully!"
8. **Close Dialogs** → Return to table view with updated data

---

## Files Modified

- `src/marketingComponents/components/budgetaryQuotation/BudgetaryQuotationForm.js`

## Key Features

✅ Two-step edit process (View → Edit → Save → Confirm)
✅ Confirmation dialog before API call
✅ Immediate table update without page reload
✅ Original data preservation in case of cancel
✅ Error handling with user feedback
✅ Backend API integration
✅ Parent component state synchronization

---

## Testing Checklist

- [ ] Click row to open dialog in VIEW MODE
- [ ] Click "✏️ Edit Details" to enter EDIT MODE
- [ ] Modify field values
- [ ] Click "💾 Save Changes"
- [ ] Confirmation dialog appears
- [ ] Click "✓ Yes, Save Changes"
- [ ] Table updates without reload
- [ ] Changes persist after refresh
- [ ] Cancel buttons work and reset data
- [ ] Success/error messages display correctly

---

**Last Updated**: December 26, 2025
