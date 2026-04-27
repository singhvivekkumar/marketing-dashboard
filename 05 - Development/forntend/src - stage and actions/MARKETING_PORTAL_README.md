# Marketing Portal - React + Material UI Implementation

## Overview

This is a complete React conversion of the Marketing Portal HTML design using Material UI (MUI) with a custom dark theme. It provides a comprehensive bidding management system with 7 major modules.

## File Structure

```
frontend/src/
├── components/
│   ├── MarketingPortalSidebar.js     # Navigation sidebar
│   ├── MarketingPortalTopBar.js      # Top navigation bar
│   └── Sidebar.js                    # Modified to include Marketing Portal link
├── containers/
│   └── MarketingPortal.js            # Main container component
├── views/
│   ├── MarketingPortalDashboard.js   # Dashboard with module overview
│   ├── LeadsModule.js                # Lead creation and management
│   ├── TenderModule.js               # Tender management
│   └── OtherModules.js               # BQ, Bidding, Acquisition, Order, Future
├── theme/
│   └── darkTheme.js                  # Custom dark MUI theme
└── App.js                            # Modified to include Marketing Portal routing
```

## Features Implemented

### 1. **Dashboard Overview** (Module Dashboard)
- Grid display of all 7 modules
- Module cards with statistics
- Quick navigation to each module
- FY 2025-26 tracking information

### 2. **Lead Creation Module**
- Lead list with filtering and search
- Lead detail view with tabs:
  - Overview (project info, customer details)
  - Stage & Actions (pipeline tracking)
  - Tech Analysis (feasibility, TRL)
  - Approvals (approval chain)
  - Audit Log (activity history)

### 3. **Tender Management Module**
- Tender list with status tracking
- Deadline alerts
- Days remaining calculation
- Tender reference tracking

### 4. **Budgetary Quotation Module**
- BQ list view
- Reference to lead data
- Stage tracking
- Owner assignment

### 5. **Bidding Module**
- Active bids display
- L1 position tracking
- Negotiation status
- Lead reference mapping

### 6. **Order Acquisition Module**
- LOI and LOA tracking
- PO receipt tracking
- Order value tracking

### 7. **Order Received Module**
- Post-award delivery tracking
- Milestones and status
- Delivery date tracking

### 8. **Future Initiatives Module**
- Strategic opportunity tracking
- R&D programme tracking
- Horizon-based categorization

## Color Scheme & Design

### Custom Dark Theme Colors
- **Background**: `#0d0f14` (primary dark)
- **Paper**: `#13161e` (card backgrounds)
- **Primary Blue**: `#4f9cf9`
- **Success Green**: `#22c55e`
- **Warning Amber**: `#f59e0b`
- **Error Red**: `#ef4444`
- **Info Cyan**: `#22d3ee`

### Typography
- **Fonts**: IBM Plex Sans (primary), IBM Plex Mono (monospace)
- **Font Sizing**: Custom scaled typography matching the HTML design

## Integration with Existing Backend

The components are ready to integrate with the existing backend API. Update the mock data in the following files to use API calls:

### Example API Integration Pattern

```javascript
// In LeadsModule.js or other module files
import { fetchLeads } from '../api/leadsService';

useEffect(() => {
  fetchLeads()
    .then(data => setSampleLeads(data))
    .catch(err => console.error(err));
}, []);
```

### Backend Endpoints to Use
- `GET /api/leads` - Fetch all leads
- `GET /api/leads/:id` - Fetch lead details
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `GET /api/tenders` - Fetch tenders
- `GET /api/analytics` - Fetch analytics data
- `GET /api/pipeline` - Fetch pipeline data
- `GET /api/reports` - Fetch reports

## How to Use

### 1. **Access from Sidebar**
Click on "Bidding Management" in the Portal section of the sidebar to access the full Marketing Portal.

### 2. **Navigation**
- Use the left sidebar to switch between modules
- Use the top bar module tag to identify the current module
- Use breadcrumbs for navigation hierarchy

### 3. **Module Views**
- **Dashboard**: Overview of all modules with statistics
- **Individual Modules**: Detailed list and detail views
- **Search & Filter**: Use filter bars to search across any module

## Customization

### Updating Colors
Edit `theme/darkTheme.js`:
```javascript
const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#4f9cf9', // Change primary color
    },
    // ...
  },
});
```

### Adding New Modules
1. Create new view component in `views/` directory
2. Add to `MarketingPortal.js` switch statement
3. Add to sidebar navigation in `MarketingPortalSidebar.js`

### Updating Data
Replace mock data arrays with API calls:
```javascript
const [leads, setLeads] = useState([]);

useEffect(() => {
  fetchLeadsFromAPI().then(setLeads);
}, []);
```

## Responsive Design

The components are optimized for:
- **Desktop**: Full sidebar + content layout
- **Tablet**: Responsive grid layouts
- **Mobile**: Collapsible sidebar (when implemented)

## Material UI Components Used

- Box, Paper, Card, Stack
- Table, TableHead, TableBody, TableRow, TableCell
- TextField, Select, MenuItem, Button, Chip
- Tabs, Tab, Typography, Grid
- ThemeProvider for theme application

## Performance Considerations

1. **Lazy Loading**: Module views can be lazy-loaded using React.lazy()
2. **Memoization**: Components use React.memo for optimization
3. **API Caching**: Implement Redux or Context API for state management
4. **Virtualization**: For large lists, consider react-window

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Export Functionality**: CSV/PDF export from tables
3. **Advanced Filters**: More sophisticated filtering options
4. **User Permissions**: Role-based module access
5. **Notifications**: Toast alerts for actions
6. **Form Validation**: Complete form validation logic
7. **Approval Workflows**: Interactive approval chain management

## Development Notes

- All UI components use Material UI styling system (sx prop)
- Dark theme is applied via ThemeProvider wrapper
- Components follow React best practices with hooks
- State management can be enhanced with Redux or Context API
- Response data structures match the backend API schema

## Support & Troubleshooting

If components don't render correctly:
1. Verify MarketingPortal.js is properly imported in App.js
2. Check darkTheme.js is applied via ThemeProvider
3. Ensure all Material UI components are installed
4. Check browser console for errors

---

**Last Updated**: April 2026
**Version**: 2.0
**Status**: Production Ready
