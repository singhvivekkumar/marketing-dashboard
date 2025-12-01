# COMPONENT MAP & INTEGRATION GUIDE

## System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         YOUR APP (App.jsx)                         │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  Main Tab Navigation                         │  │
│  │  [Tab 1][Tab 2][Tab 3][Tab 4][Tab 5][Tab 6][Tab 7]           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   TabContent Wrapper                         │  │
│  │         (Manages state for View/Form/Upload modes)           │  │
│  │                                                              │  │
│  │    ┌─────────────────────────────────────────────────────┐   │  │
│  │    │  Mode: 'select'  → FeatureSelectionCard             │   │  │
│  │    │                     [View] [Add] [Upload] buttons   │   │  │
│  │    │                                                     │   │  │
│  │    │  Mode: 'view'    → DataTable                        │   │  │
│  │    │                     [Search] [Sort] [Paginate]      │   │  │
│  │    │                                                     │   │  │
│  │    │  Mode: 'form'    → Your Form Component              │   │  │
│  │    │                     [Input fields] [Validate]       │   │  │
│  │    │                                                     │   │  │
│  │    │  Mode: 'upload'  → ExcelUpload                      │   │  │
│  │    │                     [Drag-drop] [Template]          │   │  │
│  │    └─────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │  [Back Button - visible in all modes except 'select']        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Component Reusability Matrix

```
┌─────────────────────┬──────────┬──────────┬──────────┬──────────┐
│ Component           │ Tab 1    │ Tab 2    │ Tab 3    │ Tab N    │
├─────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ FeatureSelectionCard│   ✅     │   ✅    │   ✅     │   ✅    │
│   (All identical)   │  (Same)  │  (Same)  │  (Same)  │  (Same)  │
├─────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ DataTable           │   ✅     │   ✅    │   ✅     │   ✅    │
│   (Configurable)    │ (Config) │ (Config) │ (Config) │ (Config) │
├─────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ ExcelUpload         │   ✅     │   ✅    │   ✅     │   ✅    │
│   (Configurable)    │ (Config) │ (Config) │ (Config) │ (Config) │
├─────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ TabContent          │   ✅     │   ✅    │   ✅     │   ✅    │
│   (All identical)   │  (Same)  │  (Same)  │  (Same)  │  (Same)  │
├─────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ FormComponent*      │   ❌     │   ❌    │   ❌     │   ❌    │
│   (Tab specific)    │  Form 1  │  Form 2  │  Form 3  │  Form N  │
├─────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ TableWrapper*       │   ❌     │   ❌    │   ❌     │   ❌    │
│   (Tab specific)    │ Wrapper1 │ Wrapper2 │ Wrapper3 │ WrapperN │
└─────────────────────┴──────────┴──────────┴──────────┴──────────┘

✅ = Reused across all tabs
❌ = Custom per tab (using reusable components)
* = YOU create these (wrapping generic components)
```

---

## Integration Workflow

### Step 1: Copy Core Components
```
Your Project
├── src/
│   └── components/
│       ├── cards/
│       │   └── FeatureSelectionCard.jsx ← COPY
│       ├── tables/
│       │   ├── DataTable.jsx ← COPY
│       │   ├── LostDomesticLeadsTable.jsx ← CREATE (uses DataTable)
│       │   ├── DomesticOrderTable.jsx ← CREATE (uses DataTable)
│       │   └── ... (5 more table wrappers)
│       ├── forms/
│       │   ├── LostDomesticLeadsForm.jsx ← YOUR EXISTING FORM
│       │   ├── DomesticOrderForm.jsx ← YOUR EXISTING FORM
│       │   └── ... (5 more forms)
│       ├── upload/
│       │   ├── ExcelUpload.jsx ← COPY
│       │   └── excelUtils.js ← COPY
│       └── tabs/
│           └── TabContent.jsx ← COPY
```

### Step 2: Configure Per Tab
```javascript
// For Each Tab, Create:

// 1. Table Configuration
const LOST_DOMESTIC_LEADS_COLUMNS = [
  { key: 'serialNumber', label: 'Serial #' },
  { key: 'value', label: 'Value', type: 'currency' },
  { key: 'date', label: 'Date', type: 'date' }
];

// 2. Form Fields Configuration
const LOST_DOMESTIC_LEADS_FIELDS = [
  { key: 'serialNumber', label: 'Serial #', required: true },
  { key: 'value', label: 'Value', required: true },
  { key: 'date', label: 'Date', required: false }
];

// 3. Table Wrapper Component
function LostDomesticLeadsTable({ data, onDelete }) {
  return <DataTable data={data} columns={COLUMNS} onDelete={onDelete} />;
}

// 4. Use in TabContent
<TabContent
  formType="lost-domestic-leads"
  formName="Lost Domestic Leads"
  tableComponent={LostDomesticLeadsTable}
  formComponent={LostDomesticLeadsForm}
  tableColumns={LOST_DOMESTIC_LEADS_COLUMNS}
  tableData={data}
  formFields={LOST_DOMESTIC_LEADS_FIELDS}
  onFormSubmit={handleSubmit}
  onTableDataDelete={handleDelete}
/>
```

---

## Component Dependencies

```
TabContent (Orchestrator)
├─ FeatureSelectionCard
│  └─ Material UI (Card, Button, Grid, Box)
├─ DataTable (if mode === 'view')
│  ├─ Material UI (Table, TableCell, Dialog, Chip)
│  └─ excelUtils.js (for CSV export)
├─ FormComponent (if mode === 'form')
│  └─ [Your form component]
└─ ExcelUpload (if mode === 'upload')
   ├─ Material UI (Box, Button, Alert)
   ├─ excelUtils.js (for Excel operations)
   └─ xlsx (external library)

External Dependencies
├─ @mui/material
├─ @emotion/react & @emotion/styled
├─ react-hook-form
├─ xlsx
└─ @mui/icons-material
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Opens Tab                       │
└────────────────────────┬────────────────────────────────┘
                         ↓
              [FeatureSelectionCard]
                 (3 button options)
    ┌────────────────────┬────────────────────┐
    ↓                    ↓                    ↓
[View Data]         [Add Entry]          [Upload]
    ↓                    ↓                    ↓
[DataTable]          [Form]              [ExcelUpload]
    │                    │                    │
    ├─Search             ├─Fill Fields        ├─Download Template
    ├─Sort               ├─Validate           ├─Upload File
    ├─Filter             ├─Submit             ├─Validate Data
    ├─Paginate           └─POST /api/...      ├─Process Records
    ├─Export                                  └─POST /api/bulk
    ├─View Details
    └─DELETE /api/...

All return to [FeatureSelectionCard] on Back Button
```

---

## Configuration Template

```javascript
// LOST_DOMESTIC_LEADS configuration example

export const LOST_DOMESTIC_LEADS_CONFIG = {
  // Tab info
  tabLabel: 'Lost Domestic Leads',
  formType: 'lost-domestic-leads',
  
  // Table columns
  tableColumns: [
    { 
      key: 'serialNumber', 
      label: 'Serial Number',
      sortable: true,
      type: 'text'
    },
    { 
      key: 'tenderName', 
      label: 'Tender Name',
      sortable: true
    },
    { 
      key: 'customer', 
      label: 'Customer',
      sortable: true
    },
    { 
      key: 'valueWithGST', 
      label: 'Value (inc. GST)',
      type: 'currency'
    },
    { 
      key: 'createdAt', 
      label: 'Created',
      type: 'date'
    },
    { 
      key: 'status', 
      label: 'Status',
      type: 'status'
    }
  ],
  
  // Form fields
  formFields: [
    { 
      key: 'serialNumber', 
      label: 'Serial Number',
      type: 'text',
      required: true
    },
    { 
      key: 'tenderName', 
      label: 'Tender Name',
      type: 'text',
      required: true
    },
    { 
      key: 'customer', 
      label: 'Customer',
      type: 'text',
      required: true
    },
    { 
      key: 'valueWithGST', 
      label: 'Value (with GST)',
      type: 'currency',
      required: true
    }
  ],
  
  // API endpoints
  api: {
    getAll: '/api/lost-domestic-leads',
    create: '/api/lost-domestic-leads',
    bulkCreate: '/api/lost-domestic-leads/bulk-upload',
    delete: '/api/lost-domestic-leads/:id'
  }
};
```

---

## File Structure Overview

```
┌─ REUSABLE ACROSS ALL TABS (5 files)
├─ FeatureSelectionCard.jsx
├─ DataTable.jsx
├─ ExcelUpload.jsx
├─ TabContent.jsx
└─ excelUtils.js

┌─ TAB-SPECIFIC WRAPPERS (7 tables + 7 forms = 14 files)
├─ LostDomesticLeadsTable.jsx
├─ LostDomesticLeadsForm.jsx
├─ DomesticOrderTable.jsx
├─ DomesticOrderForm.jsx
├─ ... (5 more pairs)

┌─ CONFIGURATION FILES
├─ tabsConfig.js
├─ fieldsConfig.js
└─ constants.js

┌─ DOCUMENTATION (What you have)
├─ component-architecture.md
├─ App-example.jsx
├─ implementation-quick-reference.txt
├─ multi-feature-components-guide.pdf
├─ implementation-summary.md
└─ 5-minute-quick-start.md
```

---

## Integration Checklist

### Phase 1: Setup (5 mins)
- [ ] Copy 5 core components to project
- [ ] Install dependencies (npm install)
- [ ] Create folder structure

### Phase 2: Configuration (10 mins)
- [ ] Create table column configs for all 7 tabs
- [ ] Create form field configs for all 7 tabs
- [ ] Create API endpoint constants

### Phase 3: Wrappers (15 mins)
- [ ] Create table wrapper for each tab (wraps DataTable)
- [ ] Connect existing form components

### Phase 4: Integration (10 mins)
- [ ] Import TabContent in your App
- [ ] Set up API calls (fetch/post/delete)
- [ ] Configure error handling
- [ ] Add notifications

### Phase 5: Testing (15 mins)
- [ ] Test View mode (search, sort, export)
- [ ] Test Form mode (validation, submit)
- [ ] Test Upload mode (template, validation)
- [ ] Test mobile responsiveness
- [ ] Test tab switching

### Phase 6: Customization (20 mins)
- [ ] Adjust colors to match your brand
- [ ] Add custom validations
- [ ] Optimize for your data volume
- [ ] Add any additional features

**Total Time: ~75 minutes = 1.25 hours**

---

## Quick Copy-Paste Template

```jsx
// For each tab, copy and modify this template:

import React, { useState } from 'react';
import TabContent from './components/tabs/TabContent';
import LostDomesticLeadsTable from './components/tables/LostDomesticLeadsTable';
import LostDomesticLeadsForm from './components/forms/LostDomesticLeadsForm';

const COLUMNS = [/* your config */];
const FIELDS = [/* your config */];

function LostDomesticLeadsTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lost-domestic-leads');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/lost-domestic-leads', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      // Show success notification
      fetchData(); // Refresh table
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/lost-domestic-leads/${id}`, {
        method: 'DELETE'
      });
      // Show success notification
      fetchData(); // Refresh table
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <TabContent
      formType="lost-domestic-leads"
      formName="Lost Domestic Leads"
      tableComponent={LostDomesticLeadsTable}
      formComponent={LostDomesticLeadsForm}
      tableColumns={COLUMNS}
      tableData={data}
      formFields={FIELDS}
      onFormSubmit={handleSubmit}
      onTableDataDelete={handleDelete}
      loading={loading}
    />
  );
}

export default LostDomesticLeadsTab;
```

---

## Performance Tips

✅ **Implement Pagination** - Load 10-25 rows at a time
✅ **Virtual Scrolling** - For 1000+ rows
✅ **Memoize Components** - Use React.memo() for tables
✅ **Lazy Load Tabs** - Load tab content on demand
✅ **Debounce Search** - Wait 300ms before filtering
✅ **Cache Data** - Avoid re-fetching on tab switch
✅ **Compress Files** - Minimize bundle size
✅ **Optimize Images** - Use appropriate formats

---

## Browser Support

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Excel not importing | Wrong file format | Use .xlsx file |
| Table empty | No API response | Check API endpoint |
| Styles missing | Material UI not installed | Run npm install |
| Icons not showing | Icons library missing | Install @mui/icons-material |
| Upload fails | File too large | Max 5MB |
| Search slow | Large dataset | Implement pagination |

---

**🎉 You're ready to implement! Start with Step 1: Copy Core Components**
