# Scalable and Robust History Tracking System

## Overview
This is an enterprise-grade history tracking system designed for scalability and robustness. It automatically logs all add, update, and delete operations across your application.

## Key Improvements Made

### 1. **Centralized History Service** (`src/services/historyService.js`)
   - Single source of truth for all history logging
   - Reusable across all controllers
   - Includes utility functions for querying history

### 2. **Enhanced History Model** (`src/models/history_model.js`)
   - Generic model supporting all entities (BudgetaryQuotation, DomesticLeads, etc.)
   - Stores `model_name` to identify which entity was modified
   - Stores `record_id` to link history back to original record
   - Tracks both `previous_data` and `new_data` for updates
   - `changes` field shows exactly which fields changed (old vs new)
   - Indexed for efficient querying:
     - By model_name + record_id (find history of specific record)
     - By operator_id + timestamp (audit trail per user)
     - By status + timestamp (find all deletions, updates, etc.)

### 3. **Error Handling**
   - History logging failures don't block main operations
   - Errors are logged but operations continue
   - Graceful degradation

### 4. **Bulk Operations Support**
   - `logBulkHistory()` function for bulk inserts/updates
   - Efficiently logs multiple records at once

### 5. **Query Functions** for accessing history:
   - `getRecordHistory()` - Complete audit trail of a specific record
   - `getOperatorHistory()` - All changes made by an operator
   - `getHistoryByStatus()` - All additions, updates, or deletions

### 6. **New API Endpoint**
   - `GET /budgetary-quotation/:id/history` - View complete change history

## File Structure

```
src/
├── models/
│   ├── history_model.js          (NEW - Generic history model)
│   └── index.js                  (UPDATED - Registers history model)
├── services/
│   └── historyService.js         (NEW - History utilities)
├── middleware/
│   └── historyMiddleware.js      (NEW - Optional middleware approach)
└── controllers/
    └── BudgetaryQuotationController.js (UPDATED - Uses new service)
```

## Usage Examples

### In Controllers

```javascript
import { logHistory, logBulkHistory } from "../services/historyService.js";

// Log a single create
await logHistory(
  OperationHistory,
  "BudgetaryQuotation",  // model name
  data.id,               // record id
  "added",               // status
  operatorId,
  operatorName,
  null,                  // no previous data
  data.toJSON()          // new data
);

// Log bulk creates
await logBulkHistory(
  OperationHistory,
  "BudgetaryQuotation",
  insertedRecords,
  operatorId,
  operatorName
);

// Log update with change tracking
await logHistory(
  OperationHistory,
  "BudgetaryQuotation",
  id,
  "updated",
  operatorId,
  operatorName,
  previousData,    // automatically calculates changes
  updatedData
);

// Log delete
await logHistory(
  OperationHistory,
  "BudgetaryQuotation",
  id,
  "deleted",
  operatorId,
  operatorName,
  recordData,      // deleted record
  null
);
```

### Query History

```javascript
// Get history for specific record
const history = await OperationHistory.findAll({
  where: {
    model_name: "BudgetaryQuotation",
    record_id: 123
  },
  order: [["timestamp", "DESC"]]
});

// Get all changes by operator
const operatorHistory = await OperationHistory.findAll({
  where: { operator_id: "12345" },
  order: [["timestamp", "DESC"]],
  limit: 100
});

// Get all deletions in last 24 hours
const recentDeletions = await OperationHistory.findAll({
  where: {
    status: "deleted",
    timestamp: { [Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  },
  order: [["timestamp", "DESC"]]
});
```

## Extending to Other Controllers

For each new controller, follow this pattern:

```javascript
import { logHistory, logBulkHistory } from "../services/historyService.js";

const OperationHistory = db.OperationHistory;
const MODEL_NAME = "EntityName"; // e.g., "DomesticLeads", "ExportLeads"

// In create method
await logHistory(
  OperationHistory,
  MODEL_NAME,
  createdRecord.id,
  "added",
  operatorId,
  operatorName,
  null,
  createdRecord.toJSON()
);

// In update method
await logHistory(
  OperationHistory,
  MODEL_NAME,
  id,
  "updated",
  operatorId,
  operatorName,
  previousData,
  updatedRecord.toJSON()
);

// In delete method
await logHistory(
  OperationHistory,
  MODEL_NAME,
  id,
  "deleted",
  operatorId,
  operatorName,
  recordData,
  null
);
```

## Benefits

✅ **Scalable** - Single generic model used by all entities
✅ **Robust** - Proper error handling, no data loss
✅ **Auditable** - Complete change history with timestamps
✅ **Queryable** - Indexed for fast searches
✅ **Maintainable** - Centralized logic, easy to update
✅ **Bulk Operations** - Efficient logging for large imports
✅ **Change Tracking** - Know exactly what changed
✅ **Non-Blocking** - History failures don't stop operations

## Database Migration

When you sync/migrate your database, Sequelize will automatically create the `operation_history` table with:
- Proper indexes
- JSONB columns for storing data
- All required fields

## API Endpoint Reference

New endpoint added to BudgetaryQuotationRouter:

```javascript
// In your route file
import { GetBudgetaryQuotationHistory } from "../controllers/BudgetaryQuotationController.js";

router.get("/:id/history", GetBudgetaryQuotationHistory);
```

Usage:
```
GET /api/budgetary-quotations/123/history
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "model_name": "BudgetaryQuotation",
      "record_id": 123,
      "status": "added",
      "operator_id": "OP123",
      "operator_name": "John Doe",
      "previous_data": null,
      "new_data": {...},
      "changes": null,
      "timestamp": "2024-01-20T10:30:00Z"
    },
    {
      "id": 2,
      "model_name": "BudgetaryQuotation",
      "record_id": 123,
      "status": "updated",
      "operator_id": "OP124",
      "operator_name": "Jane Smith",
      "previous_data": {...},
      "new_data": {...},
      "changes": {
        "presentStatus": { "old": "pending", "new": "approved" },
        "submittedValueInCrWithoutGST": { "old": 100, "new": 150 }
      },
      "timestamp": "2024-01-20T11:15:00Z"
    }
  ],
  "message": "Quotation history retrieved successfully"
}
```

## Next Steps

1. Update other controllers (DomesticLeads, ExportLeads, etc.) to use this pattern
2. Add history retrieval endpoints for each entity
3. Create admin dashboard to view operation history
4. Set up automated cleanup of old history records (optional)
5. Add search/filter API for advanced history queries
