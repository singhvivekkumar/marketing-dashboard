# 🚀 Quick Reference: Update & Delete API

## New Endpoints Added

### UPDATE (PUT)
```
PUT /getBudgetaryQuoatation/:id
```
Updates a budgetary quotation by ID.

### DELETE (DELETE)
```
DELETE /getBudgetaryQuoatation/:id
```
Deletes a budgetary quotation by ID.

---

## 📋 Quick Examples

### Update a Quotation
```bash
# Update single field
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/1 \
  -H "Content-Type: application/json" \
  -d '{"presentStatus": "Won"}'

# Update multiple fields
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/1 \
  -H "Content-Type: application/json" \
  -d '{
    "presentStatus": "Approved",
    "submittedValueInCrWithoutGST": "48.50"
  }'
```

### Delete a Quotation
```bash
curl -X DELETE http://localhost:5000/getBudgetaryQuoatation/1
```

---

## ✅ Response Format

### Success Response (Update)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bqTitle": "Quote Title",
    "presentStatus": "Won",
    "updatedAt": "2024-01-15T12:30:00.000Z",
    ...
  },
  "message": "Budgetary Quotation updated successfully"
}
```

### Success Response (Delete)
```json
{
  "success": true,
  "data": null,
  "message": "Budgetary Quotation deleted successfully"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": "Additional error details"
}
```

---

## 🔐 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing ID or validation error) |
| 404 | Not found |
| 500 | Server error |

---

## 📝 Update Request Fields

Send any of these fields (all optional):

```
bqTitle
customerName
customerAddress
leadOwner
defenceAndNonDefence
estimateValueInCrWithoutGST
submittedValueInCrWithoutGST
dateOfLetterSubmission
referenceNo
JSON_competitors
presentStatus
OperatorId
OperatorName
OperatorRole
OperatorSBU
```

---

## ⚡ Usage Scenarios

### Scenario 1: Update Status to Won
```bash
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/1 \
  -H "Content-Type: application/json" \
  -d '{"presentStatus": "Won"}'
```

### Scenario 2: Update Customer Address
```bash
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/2 \
  -H "Content-Type: application/json" \
  -d '{"customerAddress": "New Address, New City"}'
```

### Scenario 3: Update Submitted Value
```bash
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/3 \
  -H "Content-Type: application/json" \
  -d '{"submittedValueInCrWithoutGST": "49.99"}'
```

### Scenario 4: Comprehensive Update
```bash
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/4 \
  -H "Content-Type: application/json" \
  -d '{
    "bqTitle": "Final Quote",
    "presentStatus": "Approved",
    "submittedValueInCrWithoutGST": "47.50",
    "OperatorName": "Sales Manager"
  }'
```

### Scenario 5: Archive Instead of Delete
```bash
# Instead of deleting, you can archive by changing status
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/5 \
  -H "Content-Type: application/json" \
  -d '{"presentStatus": "Archived"}'
```

---

## 🎯 Complete CRUD Example

```bash
# 1. CREATE
curl -X POST http://localhost:5000/getBudgetaryQuoatation \
  -H "Content-Type: application/json" \
  -d '{
    "bqTitle": "New Quote",
    "customerName": "ABC Corp",
    "customerAddress": "123 Main St",
    "leadOwner": "John",
    "defenceAndNonDefence": "Defence",
    "estimateValueInCrWithoutGST": "100.00",
    "submittedValueInCrWithoutGST": "95.00",
    "dateOfLetterSubmission": "2024-01-10T00:00:00Z",
    "referenceNo": "REF-NEW-001",
    "presentStatus": "Pending",
    "OperatorId": "E001",
    "OperatorName": "Admin",
    "OperatorRole": "Lead",
    "OperatorSBU": "Sales"
  }'
# Returns: id = 1

# 2. READ
curl http://localhost:5000/getBudgetaryQuoatation

# 3. UPDATE
curl -X PUT http://localhost:5000/getBudgetaryQuoatation/1 \
  -H "Content-Type: application/json" \
  -d '{"presentStatus": "Won"}'

# 4. DELETE
curl -X DELETE http://localhost:5000/getBudgetaryQuoatation/1
```

---

## 💡 Key Points

✅ **Partial Updates** - Only send fields you want to change
✅ **Automatic Timestamps** - `updatedAt` is set automatically
✅ **Error Handling** - Clear error messages
✅ **Validation** - Data type and uniqueness checks
✅ **RESTful** - Follows REST conventions

---

## 🔗 For More Details

See: `UPDATE_DELETE_API.md` for complete documentation with all error cases, validation rules, and advanced examples.

---

**Ready to test?** Use Postman or curl commands above! 🚀
