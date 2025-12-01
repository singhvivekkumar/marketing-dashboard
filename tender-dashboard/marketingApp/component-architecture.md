# Tender Management Dashboard - Component Architecture

## Project Structure
 
```
tender-dashboard/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── TabNavigation.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── SnackbarNotification.jsx
│   │   ├── cards/
│   │   │   ├── FeatureSelectionCard.jsx          # Three button selection card
│   │   │   └── FeatureSelectionCard.module.css
│   │   ├── forms/
│   │   │   ├── LostDomesticLeadsForm.jsx
│   │   │   ├── DomesticOrderForm.jsx
│   │   │   ├── BudgetaryQuotationForm.jsx
│   │   │   ├── LeadSubmittedForm.jsx
│   │   │   ├── DomesticLeadsV2Form.jsx
│   │   │   ├── ExportLeadsForm.jsx
│   │   │   ├── CRMLeadsForm.jsx
│   │   │   ├── FormField.jsx                      # Reusable form field component
│   │   │   └── forms.config.js                    # Form configurations
│   │   ├── tables/
│   │   │   ├── DataTable.jsx                      # Reusable table component
│   │   │   ├── DataTable.module.css
│   │   │   ├── LostDomesticLeadsTable.jsx
│   │   │   ├── DomesticOrderTable.jsx
│   │   │   ├── BudgetaryQuotationTable.jsx
│   │   │   ├── LeadSubmittedTable.jsx
│   │   │   ├── DomesticLeadsV2Table.jsx
│   │   │   ├── ExportLeadsTable.jsx
│   │   │   └── CRMLeadsTable.jsx
│   │   ├── upload/
│   │   │   ├── ExcelUpload.jsx                    # Excel upload component
│   │   │   ├── ExcelUpload.module.css
│   │   │   ├── excelUtils.js                      # Excel parsing utilities
│   │   │   └── sampleData.js                      # Sample Excel data
│   │   └── tabs/
│   │       ├── TabContent.jsx                     # Main tab content wrapper
│   │       └── TabContent.module.css
│   ├── hooks/
│   │   ├── useForms.js                            # Custom hook for form management
│   │   ├── useTableData.js                        # Custom hook for table data
│   │   └── useExcelUpload.js                      # Custom hook for Excel upload
│   ├── config/
│   │   ├── tabsConfig.js                          # Tab configurations
│   │   ├── fieldsConfig.js                        # Field definitions
│   │   └── constants.js                           # Constants and enums
│   ├── utils/
│   │   ├── excelGenerator.js                      # Generate sample Excel
│   │   ├── dataFormatter.js                       # Format data for display
│   │   └── validation.js                          # Validation utilities
│   ├── data/
│   │   ├── mockData.js                            # Mock data for development
│   │   └── sampleExcel.xlsx                       # Sample Excel file
│   ├── styles/
│   │   ├── theme.js                               # Material UI theme
│   │   ├── global.css
│   │   └── responsive.css
│   ├── App.jsx                                    # Main app component
│   └── index.js                                   # Entry point
├── public/
│   └── index.html
├── package.json
└── README.md
```

## Component Descriptions

### 1. FeatureSelectionCard.jsx
Shows three buttons when tab is first opened:
- View Data (table view)
- Add Form (entry form)
- Bulk Upload (Excel upload)

### 2. DataTable.jsx
Generic reusable table component for all data types with:
- Pagination
- Search/filter
- Sorting
- Export to Excel
- Delete/Edit actions

### 3. ExcelUpload.jsx
Handles Excel file upload with:
- Drag and drop
- File validation
- Sample Excel download
- Progress indication
- Error handling

### 4. FormField.jsx
Reusable form field component supporting:
- Text input
- Date picker
- Select dropdown
- Textarea
- Number input
- Currency input

### 5. TabContent.jsx
Main wrapper that manages:
- Feature selection state
- Form state management
- Table data state
- Component switching

## File Organization Benefits

✅ **Modularity** - Each component is independent
✅ **Reusability** - Common components shared
✅ **Maintainability** - Clear folder structure
✅ **Scalability** - Easy to add new forms
✅ **Separation of Concerns** - Components, hooks, utils separated
✅ **Configuration-Driven** - Centralized configs
✅ **Testing** - Easy to test individual components
✅ **Import Clarity** - Organized imports

## Key Features

### Feature Selection Card
```jsx
<FeatureSelectionCard
  onSelectView={() => setMode('view')}
  onSelectForm={() => setMode('form')}
  onSelectUpload={() => setMode('upload')}
/>
```

### Data Table
```jsx
<DataTable
  data={data}
  columns={columns}
  onDelete={handleDelete}
  onEdit={handleEdit}
  onExport={handleExport}
/>
```

### Excel Upload
```jsx
<ExcelUpload
  onUpload={handleBulkUpload}
  template={sampleTemplate}
  fields={requiredFields}
/>
```

## Usage Pattern

1. Open tab → Shows FeatureSelectionCard
2. Click "View Data" → Shows DataTable
3. Click back or reset → Back to FeatureSelectionCard
4. Click "Add Form" → Shows Form
5. Click "Bulk Upload" → Shows ExcelUpload

## State Management

```jsx
const [mode, setMode] = useState('select');  // 'select', 'view', 'form', 'upload'
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

## API Integration Points

1. **View Data** → GET /api/{formType}
2. **Submit Form** → POST /api/{formType}
3. **Bulk Upload** → POST /api/{formType}/bulk-upload
4. **Delete Record** → DELETE /api/{formType}/{id}
5. **Update Record** → PUT /api/{formType}/{id}

## Responsive Behavior

- **Mobile** - Stack components vertically
- **Tablet** - Adjust spacing
- **Desktop** - Full featured layout

## Performance Optimizations

✅ Lazy loading of tables
✅ Virtual scrolling for large datasets
✅ Memoized components
✅ Debounced search
✅ Pagination to reduce load

## Error Handling

- File upload validation
- API error responses
- Form validation errors
- Network errors
- User-friendly error messages

## Sample Data Structure

Each table displays:
- All form fields
- Creation date
- Last update date
- Status indicators
- Action buttons (Edit, Delete, View)
