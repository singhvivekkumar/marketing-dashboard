# 🎯 Visual Flow Diagram - Row Click vs Edit Icon

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUDGETARY QUOTATION TABLE                     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ID   │ BQ Title  │ Customer  │ Value   │ Status │ [✏️ 🗑️] │  │
│  │──────│───────────│───────────│─────────│────────│─────────│  │
│  │ BQ01 │ Software  │ Company A │ ₹15.5Cr │ ...    │ [✏️ 🗑️] │  │
│  │ BQ02 │ Defence   │ Company B │ ₹45.2Cr │ ...    │ [✏️ 🗑️] │  │
│  │ BQ03 │ Civil     │ Company C │ ₹22.7Cr │ ...    │ [✏️ 🗑️] │  │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
             │                            │
             │                            │
      CLICK ROW ANYWHERE          CLICK ✏️ EDIT ICON
             │                            │
             ▼                            ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │   DIALOG OPENS       │   │   DIALOG OPENS       │
    │   (VIEW MODE)        │   │   (VIEW MODE)        │
    │                      │   │                      │
    │  Blue Header ◄──────►│   │  Blue Header ◄──────►│
    │  VIEW MODE Chip      │   │  VIEW MODE Chip      │
    │                      │   │                      │
    │  ┌────────────────┐  │   │  ┌────────────────┐  │
    │  │ BQ Title: Soft │  │   │  │ BQ Title: Soft │  │
    │  │ Customer: ...  │  │   │  │ Customer: ...  │  │
    │  │ Value: ₹15.5Cr │  │   │  │ Value: ₹15.5Cr │  │
    │  │ Status: ...    │  │   │  │ Status: ...    │  │
    │  │                │  │   │  │                │  │
    │  │ (READ-ONLY)    │  │   │  │ (READ-ONLY)    │  │
    │  └────────────────┘  │   │  └────────────────┘  │
    │                      │   │                      │
    │  [Close]     ✖️      │   │  [Close] [✏️ Edit]  ✖️│
    │                      │   │                      │
    └──────────────────────┘   └──────────────────────┘
             │                            │
             │ Click Close               │ Click Edit Details
             │                            │
             ▼                            ▼
        DIALOG CLOSES          EDIT MODE ACTIVATED
                               ┌──────────────────────┐
                               │   DIALOG (EDIT)      │
                               │                      │
                               │  Orange Header ◄───┐ │
                               │  EDIT MODE Chip    │ │
                               │                      │
                               │  ┌────────────────┐  │
                               │  │ BQ Title: [Edit]  │
                               │  │ Customer: [Edit]  │
                               │  │ Value: [Edit]     │
                               │  │ Status: [Edit]    │
                               │  │                   │
                               │  │ (EDITABLE)        │
                               │  └────────────────┘  │
                               │                      │
                               │ [Cancel]  [💾 Save] │
                               │                      │
                               └──────────────────────┘
                                      │
                           Click Save Changes
                                      │
                                      ▼
                        ┌──────────────────────┐
                        │ Confirmation Dialog  │
                        │                      │
                        │ "Are you sure you    │
                        │  want to save?"      │
                        │                      │
                        │ [Cancel] [Confirm]   │
                        └──────────────────────┘
                                      │
                           Click Confirm
                                      │
                                      ▼
                        PUT /updateBudgetaryQuotation
                                      │
                                      ▼
                        ✅ Backend Update Success
                                      │
                                      ▼
                        🔄 Table Refreshed (No Reload)
                                      │
                                      ▼
                        ✅ Changes Visible in Table
```

---

## State Changes During Flow

### Row Click Flow
```
START
  ├─ dialogOpenedFrom = "rowClick"  ◄── KEY DIFFERENCE
  ├─ isEditMode = false
  ├─ editingRow = { ...row }
  └─ Dialog shows: [Close] only

Dialog Actions:
  ├─ IF dialogOpenedFrom === "rowClick"
  │  └─ DO NOT show Edit Details button
  └─ Show only Close button
```

### Edit Icon Flow  
```
START
  ├─ dialogOpenedFrom = "editIcon"  ◄── KEY DIFFERENCE
  ├─ isEditMode = false
  ├─ editingRow = { ...row }
  └─ Dialog shows: [Close] [✏️ Edit Details]

Dialog Actions:
  ├─ IF dialogOpenedFrom === "editIcon"
  │  └─ DO show Edit Details button
  └─ User can click to enter EDIT MODE
     ├─ isEditMode = true
     ├─ Header color: Blue → Orange
     ├─ Buttons: [Close] [✏️ Edit] → [Cancel] [💾 Save]
     └─ Fields become editable
```

---

## Header Color Guide

```
┌─────────────────────────────────────────┐
│  DIALOG HEADER - BLUE (VIEW MODE)       │
│  ────────────────────────────────────   │
│  Background: #1e3a5f → #2d5a8c gradient │
│  Color: White text                      │
│  Chip: "VIEW MODE" (blue)               │
│  When: Opening from row click           │
│        OR opening from edit icon        │
│        (before entering edit mode)      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  DIALOG HEADER - ORANGE (EDIT MODE)     │
│  ────────────────────────────────────   │
│  Background: #f59e0b → #ea580c gradient │
│  Color: White text                      │
│  Chip: "EDIT MODE" (yellow)             │
│  When: User clicked "Edit Details"      │
│        and started editing              │
└─────────────────────────────────────────┘
```

---

## Button Visibility Matrix

| Scenario | Close | Edit Details | Cancel | Save Changes |
|----------|-------|--------------|--------|--------------|
| **Row Click (View Mode)** | ✅ | ❌ | - | - |
| **Edit Icon (View Mode)** | ✅ | ✅ | - | - |
| **Edit Icon (Edit Mode)** | - | - | ✅ | ✅ |

---

## Data Flow Diagram

```
┌─────────────────────────────────────┐
│    MOCK DATA (10 records)           │
│    mockBudgetaryQuotationData        │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌─────────────┐
        │ Component   │
        │ useEffect   │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │ tableData   │
        │ state       │
        └──────┬──────┘
               │
               ▼
        ┌──────────────────────┐
        │ Table Render         │
        │ (10 rows visible)    │
        └──────┬───────────────┘
               │
       ┌───────┴────────┐
       │                │
    CLICK ROW        CLICK ✏️
       │                │
       ▼                ▼
  handleRowClick   handleEditClick
       │                │
       ▼                ▼
    Dialog Open      Dialog Open
  (View Only)      (With Edit Option)
       │                │
       │        Click Edit Details
       │                │
       │                ▼
       │         EDIT MODE
       │         Modify Data
       │                │
       │        Click Save
       │                │
       └────────┬───────┘
                │
                ▼
        Confirmation Dialog
                │
        Click Confirm
                │
                ▼
        axios.put() → Backend
                │
                ▼
        Update Success
                │
                ▼
        setTableData(updated)
                │
                ▼
        Table Refreshes
        (NO PAGE RELOAD)
```

---

## Conditional Rendering Logic

```javascript
// In Dialog Actions:

IF !isEditMode (Not editing)
  ├─ Show Close button (always)
  │
  └─ IF dialogOpenedFrom === "editIcon"
     └─ Show Edit Details button
        
ELSE IF isEditMode (Currently editing)
  ├─ Show Cancel button
  └─ Show Save Changes button
```

---

## Summary

| Aspect | Row Click | Edit Icon |
|--------|-----------|-----------|
| **Purpose** | Quick view | Edit data |
| **Edit Button** | ❌ Hidden | ✅ Visible |
| **Workflow** | View → Close | View → Edit → Save → Confirm |
| **Accidental Edit Risk** | None | Prevented by 2-step process |
| **User Intent** | Just looking | Wants to modify |

