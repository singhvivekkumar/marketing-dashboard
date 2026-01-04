# 📊 API Flow Diagram: Update & Delete

## Complete API Endpoints

```
┌────────────────────────────────────────────────────────────────┐
│         BUDGETARY QUOTATION API ENDPOINTS                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  CREATE    POST   /getBudgetaryQuoatation                     │
│  ├─ Request: Form data                                        │
│  ├─ Returns: New quotation with ID                            │
│  └─ Status: 201 Created                                       │
│                                                                │
│  READ      GET    /getBudgetaryQuoatation                     │
│  ├─ Request: None                                             │
│  ├─ Returns: Array of all quotations                          │
│  └─ Status: 200 OK                                            │
│                                                                │
│  UPDATE    PUT    /getBudgetaryQuoatation/:id       ✨ NEW    │
│  ├─ Request: Partial data                                     │
│  ├─ Returns: Updated quotation                                │
│  └─ Status: 200 OK                                            │
│                                                                │
│  DELETE    DELETE /getBudgetaryQuoatation/:id       ✨ NEW    │
│  ├─ Request: ID only                                          │
│  ├─ Returns: Success message                                  │
│  └─ Status: 200 OK                                            │
│                                                                │
│  BULK      POST   /bqbulkUpload                                │
│  ├─ Request: Array of quotations                              │
│  ├─ Returns: Array of created records                         │
│  └─ Status: 200 OK                                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## UPDATE Flow

```
CLIENT REQUEST
     │
     ├─ Method: PUT
     ├─ URL: /getBudgetaryQuoatation/1
     └─ Body: {"presentStatus": "Won"}
          │
          ▼
    VALIDATION
          │
          ├─ ID provided? ✓
          ├─ Record exists? ✓
          └─ Data valid? ✓
          │
          ▼
    UPDATE DATABASE
          │
          ├─ Merge new data
          ├─ Set updatedAt timestamp
          └─ Save to database
          │
          ▼
    RETURN RESPONSE
          │
          ├─ Status: 200
          ├─ Data: Updated record
          └─ Message: "Updated successfully"
          │
          ▼
    CLIENT RECEIVES
```

---

## DELETE Flow

```
CLIENT REQUEST
     │
     ├─ Method: DELETE
     └─ URL: /getBudgetaryQuoatation/1
          │
          ▼
    VALIDATION
          │
          ├─ ID provided? ✓
          └─ Record exists? ✓
          │
          ▼
    DELETE FROM DATABASE
          │
          └─ Permanently remove record
          │
          ▼
    RETURN RESPONSE
          │
          ├─ Status: 200
          └─ Message: "Deleted successfully"
          │
          ▼
    CLIENT RECEIVES
```

---

## Error Handling

```
REQUEST
  │
  ├─ No ID?
  │  └─ Error 400: "ID is required"
  │
  ├─ ID not found?
  │  └─ Error 404: "Not found"
  │
  ├─ Duplicate reference?
  │  └─ Error 400: "Reference already exists"
  │
  ├─ Invalid data?
  │  └─ Error 400: "Validation error"
  │
  └─ Database error?
     └─ Error 500: "Server error"
```

---

## Request/Response Examples

### UPDATE REQUEST
```
┌─────────────────────────────────────────┐
│ PUT /getBudgetaryQuoatation/1           │
├─────────────────────────────────────────┤
│ Content-Type: application/json          │
│                                         │
│ {                                       │
│   "presentStatus": "Won",               │
│   "submittedValueInCrWithoutGST": "48"  │
│ }                                       │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 200 OK                                  │
├─────────────────────────────────────────┤
│ {                                       │
│   "success": true,                      │
│   "data": {                             │
│     "id": 1,                            │
│     "presentStatus": "Won",             │
│     "updatedAt": "2024-01-15T12:30.."   │
│   },                                    │
│   "message": "Updated successfully"     │
│ }                                       │
└─────────────────────────────────────────┘
```

### DELETE REQUEST
```
┌─────────────────────────────────────────┐
│ DELETE /getBudgetaryQuoatation/1        │
├─────────────────────────────────────────┤
│ (No body needed)                        │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ 200 OK                                  │
├─────────────────────────────────────────┤
│ {                                       │
│   "success": true,                      │
│   "data": null,                         │
│   "message": "Deleted successfully"     │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## Data Flow: Update Operation

```
┌──────────┐
│ Frontend │
│ (React)  │
└────┬─────┘
     │ PUT /getBudgetaryQuoatation/1
     │ {presentStatus: "Won"}
     │
     ▼
┌───────────────┐
│  Express API  │
│  /server.js   │
└────┬──────────┘
     │
     │ Route handler
     │
     ▼
┌─────────────────────────────────────┐
│ BudgetaryQuotationRouter            │
│ (routes/BudgetaryQuotationRouter.js)│
└────┬────────────────────────────────┘
     │
     │ Calls UpdateBudgetaryQuotation
     │
     ▼
┌───────────────────────────────────────────┐
│ UpdateBudgetaryQuotation Controller       │
│ (controllers/BudgetaryQuotationController)│
│                                           │
│ 1. Validate ID                            │
│ 2. Find record                            │
│ 3. Check if exists                        │
│ 4. Merge data                             │
│ 5. Save to DB                             │
└────┬──────────────────────────────────────┘
     │
     │ SQL: UPDATE budgetary_quotations SET ...
     │
     ▼
┌──────────────────┐
│  PostgreSQL DB   │
│                  │
│  [Record Updated]│
│  updatedAt: NOW  │
└────┬─────────────┘
     │
     │ Return updated record
     │
     ▼
┌────────────────────┐
│ Response JSON      │
│ {                  │
│   success: true,   │
│   data: {...},     │
│   message: "..."   │
│ }                  │
└────┬───────────────┘
     │
     │ Response sent back
     │
     ▼
┌──────────────┐
│ Frontend     │
│ Receives OK  │
│ Updates UI   │
└──────────────┘
```

---

## Method Comparison

```
┌────────┬──────────┬──────────────────────┬─────────────┐
│ Method │ Purpose  │ Request Body         │ Returns     │
├────────┼──────────┼──────────────────────┼─────────────┤
│ POST   │ Create   │ New data             │ New record  │
│ GET    │ Read     │ None                 │ All records │
│ PUT    │ Update   │ Fields to change     │ Updated rec │
│ DELETE │ Delete   │ None                 │ Message     │
└────────┴──────────┴──────────────────────┴─────────────┘
```

---

## Validation Steps

```
UPDATE Request Validation
     │
     ├─ Step 1: Check ID exists
     │  └─ IF missing → Error 400
     │
     ├─ Step 2: Find record in DB
     │  └─ IF not found → Error 404
     │
     ├─ Step 3: Validate data types
     │  ├─ Numbers must be numeric
     │  ├─ Dates must be ISO format
     │  └─ Enums must be valid values
     │  └─ IF invalid → Error 400
     │
     ├─ Step 4: Check unique constraints
     │  ├─ referenceNo must be unique
     │  └─ IF duplicate → Error 400
     │
     └─ Step 5: Save to database
        └─ IF success → Return 200 with data
```

---

## State Transitions

```
QUOTATION STATES

┌──────────┐
│ Pending  │ ← Initial state when created
└─────┬────┘
      │ PUT /1 {presentStatus: "In Progress"}
      ▼
┌──────────────┐
│ In Progress  │
└─────┬────────┘
      │ PUT /1 {presentStatus: "Approved"}
      ▼
┌──────────┐
│ Approved │
└─────┬────┘
      │ PUT /1 {presentStatus: "Won"}
      ▼
┌──────────┐
│ Won      │ ← Final successful state
└──────────┘

OR

┌──────────┐
│ Pending  │
└─────┬────┘
      │ PUT /1 {presentStatus: "Rejected"}
      ▼
┌──────────┐
│ Rejected │ ← Final unsuccessful state
└──────────┘

OR

┌──────────┐
│ Pending  │
└─────┬────┘
      │ DELETE /1
      ▼
┌──────────────┐
│ Deleted      │ ← Permanent removal
│ (Not found)  │
└──────────────┘
```

---

## Summary

✅ **UPDATE**: Modify existing quotation fields
✅ **DELETE**: Remove quotation from database
✅ **Validation**: All data checked before operation
✅ **Timestamps**: `updatedAt` set automatically
✅ **Error Handling**: Clear error responses
✅ **RESTful**: Follows REST conventions

---

**Documentation**: See `UPDATE_DELETE_API.md` for detailed reference
**Quick Guide**: See `UPDATE_DELETE_QUICK_REF.md` for quick examples
