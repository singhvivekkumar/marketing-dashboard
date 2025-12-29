# API: Update & Delete Budgetary Quotation

## Overview
Added two new API endpoints to manage budgetary quotations:
- **UPDATE** endpoint to modify existing quotations
- **DELETE** endpoint to remove quotations

---

## 📝 UPDATE Endpoint

### Endpoint Details
```
PUT /getBudgetaryQuoatation/:id
```

### Description
Updates an existing budgetary quotation record with new data.

### Parameters

**URL Parameter:**
```
:id  - The ID of the quotation to update (required)
```

**Request Body (all optional - only send fields you want to update):**
```json
{
  "bqTitle": "string",
  "customerName": "string",
  "customerAddress": "string",
  "leadOwner": "string",
  "defenceAndNonDefence": "string",
  "estimateValueInCrWithoutGST": "decimal",
  "submittedValueInCrWithoutGST": "decimal",
  "dateOfLetterSubmission": "date (ISO format)",
  "referenceNo": "string (must be unique)",
  "JSON_competitors": "object",
  "presentStatus": "string",
  "OperatorId": "string",
  "OperatorName": "string",
  "OperatorRole": "string",
  "OperatorSBU": "string"
}
```

### Examples

#### Update Single Field
```bash
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/1 \
  -H "Content-Type: application/json" \
  -d '{
    "presentStatus": "Won"
  }'
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bqTitle": "Server Equipment",
    "customerName": "Tech Corp",
    "presentStatus": "Won",
    "updatedAt": "2024-01-15T12:30:00.000Z",
    ...other fields
  },
  "message": "Budgetary Quotation updated successfully"
}
```

#### Update Multiple Fields
```bash
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/1 \
  -H "Content-Type: application/json" \
  -d '{
    "presentStatus": "Approved",
    "submittedValueInCrWithoutGST": "48.50",
    "customerAddress": "New Address, City"
  }'
```

#### Update with All Fields
```bash
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/1 \
  -H "Content-Type: application/json" \
  -d '{
    "bqTitle": "Updated Quote",
    "customerName": "Updated Company",
    "customerAddress": "Updated Address",
    "leadOwner": "John Doe",
    "defenceAndNonDefence": "Defence",
    "estimateValueInCrWithoutGST": "55.00",
    "submittedValueInCrWithoutGST": "52.00",
    "dateOfLetterSubmission": "2024-01-20T00:00:00Z",
    "referenceNo": "REF-2024-001",
    "JSON_competitors": {"competitor1": "Company A"},
    "presentStatus": "In Progress",
    "OperatorId": "E001",
    "OperatorName": "Admin",
    "OperatorRole": "Lead Owner",
    "OperatorSBU": "Sales"
  }'
```

### Response Codes

| Code | Scenario |
|------|----------|
| **200** | Update successful |
| **400** | Missing ID or validation error (duplicate reference) |
| **404** | Quotation not found |
| **500** | Server error |

### Error Responses

**No ID provided:**
```json
{
  "success": false,
  "data": null,
  "message": "Quotation ID is required"
}
```

**Quotation not found:**
```json
{
  "success": false,
  "data": null,
  "message": "Quotation with ID 999 not found"
}
```

**Duplicate reference number:**
```json
{
  "success": false,
  "data": null,
  "message": "Reference number already exists",
  "error": "Unique constraint error"
}
```

**Validation error:**
```json
{
  "success": false,
  "data": null,
  "message": "Validation error",
  "error": ["estimateValueInCrWithoutGST must be numeric"]
}
```

---

## 🗑️ DELETE Endpoint

### Endpoint Details
```
DELETE /getBudgetaryQuoatation/:id
```

### Description
Deletes an existing budgetary quotation record permanently.

### Parameters

**URL Parameter:**
```
:id  - The ID of the quotation to delete (required)
```

### Examples

#### Delete a Quotation
```bash
curl -X DELETE http://localhost:5000/getBudgetaryQuoatation/1
```

**Response (Success):**
```json
{
  "success": true,
  "data": null,
  "message": "Budgetary Quotation deleted successfully"
}
```

#### Delete Non-existent Quotation
```bash
curl -X DELETE http://localhost:5000/getBudgetaryQuoatation/999
```

**Response (Error):**
```json
{
  "success": false,
  "data": null,
  "message": "Quotation with ID 999 not found"
}
```

### Response Codes

| Code | Scenario |
|------|----------|
| **200** | Delete successful |
| **400** | Missing ID |
| **404** | Quotation not found |
| **500** | Server error |

### Error Response

**No ID provided:**
```json
{
  "success": false,
  "data": null,
  "message": "Quotation ID is required"
}
```

**Quotation not found:**
```json
{
  "success": false,
  "data": null,
  "message": "Quotation with ID 999 not found"
}
```

---

## 📊 Complete CRUD Operations

Now the API supports full CRUD:

| Operation | Method | Endpoint | Purpose |
|-----------|--------|----------|---------|
| **Create** | POST | `/getBudgetaryQuoatation` | Create new quotation |
| **Read** | GET | `/getBudgetaryQuoatation` | Get all quotations |
| **Update** | PUT | `/getBudgetaryQuoatation/:id` | Update quotation ✨ NEW |
| **Delete** | DELETE | `/getBudgetaryQuoatation/:id` | Delete quotation ✨ NEW |
| **Bulk Create** | POST | `/bqbulkUpload` | Create multiple |

---

## 🔄 Usage Flow Example

### 1. Create a Quotation
```bash
curl -X POST http://localhost:5000/getBudgetaryQuoatation \
  -H "Content-Type: application/json" \
  -d '{
    "bqTitle": "Initial Quote",
    "customerName": "Company A",
    "customerAddress": "123 Street",
    "leadOwner": "John",
    "defenceAndNonDefence": "Defence",
    "estimateValueInCrWithoutGST": "100.00",
    "submittedValueInCrWithoutGST": "95.00",
    "dateOfLetterSubmission": "2024-01-10T00:00:00Z",
    "referenceNo": "REF-001",
    "presentStatus": "Pending",
    "OperatorId": "E001",
    "OperatorName": "Admin",
    "OperatorRole": "Lead Owner",
    "OperatorSBU": "Sales"
  }'
```
**Returns:** ID: 1

### 2. Retrieve All Quotations
```bash
curl http://localhost:5000/getBudgetaryQuoatation
```

### 3. Update the Quotation
```bash
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/1 \
  -H "Content-Type: application/json" \
  -d '{
    "presentStatus": "Approved",
    "submittedValueInCrWithoutGST": "92.50"
  }'
```

### 4. Delete the Quotation
```bash
curl -X DELETE http://localhost:5000/getBudgetaryQuoatation/1
```

---

## 💡 Key Features

### Partial Updates
You only need to send the fields you want to update:
```json
{
  "presentStatus": "Won"
}
```

### Automatic Field Preservation
Fields not provided in the request are kept as-is from the database.

### Error Handling
- Validates required fields
- Checks for duplicate reference numbers
- Returns clear error messages
- HTTP status codes follow REST standards

### Timestamp Updates
- `updatedAt` is automatically updated when you modify a record
- No need to manually set timestamps

---

## 🧪 Testing with Postman

### Setup Postman

**1. Create Request:**
- Method: `PUT`
- URL: `http://localhost:5000/getBudgetaryQuoatation/1`
- Headers: `Content-Type: application/json`

**2. Body:**
```json
{
  "presentStatus": "Won",
  "submittedValueInCrWithoutGST": "50.00"
}
```

**3. Send & Check Response**

### Delete Request

**1. Create Request:**
- Method: `DELETE`
- URL: `http://localhost:5000/getBudgetaryQuoatation/1`

**2. Send & Check Response**

---

## 📋 Implementation Details

### Update Function Features
```javascript
export const UpdateBudgetaryQuotation = async (req, res) => {
  // 1. Validates ID is provided
  // 2. Finds the quotation by ID
  // 3. Returns 404 if not found
  // 4. Merges new data with existing data
  // 5. Updates the record
  // 6. Returns updated record with timestamps
  // 7. Handles all error cases
}
```

### Delete Function Features
```javascript
export const DeleteBudgetaryQuotation = async (req, res) => {
  // 1. Validates ID is provided
  // 2. Finds the quotation by ID
  // 3. Returns 404 if not found
  // 4. Permanently deletes the record
  // 5. Returns success message
  // 6. Handles all error cases
}
```

---

## ⚠️ Important Notes

### Before Updating
- Record must exist (will get 404 if not)
- Only provide fields you want to change
- Reference number must be unique (unless not changing it)

### Before Deleting
- Record must exist (will get 404 if not)
- ⚠️ **WARNING:** Deletion is permanent and cannot be undone
- No backup is created - consider archiving instead

### Data Type Constraints
- Numeric fields will be validated
- Dates must be in ISO format (YYYY-MM-DDTHH:mm:ssZ)
- Reference number must be unique across all records

---

## 📚 Related Files

- Controller: `src/controllers/BudgetaryQuotationController.js`
- Router: `src/routes/BudgetaryQuotationRouter.js`
- Model: `src/models/budgetary_quotation_model.js`

---

## ✅ Summary

You now have complete CRUD operations for budgetary quotations:
- ✅ Create new quotations
- ✅ Read all quotations
- ✅ **Update existing quotations** (NEW)
- ✅ **Delete quotations** (NEW)
- ✅ Bulk create quotations

All with proper error handling and validation!
