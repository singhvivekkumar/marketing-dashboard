# Marketing Portal - Quick Reference Guide

## 🗺️ Application Structure

```
Marketing Portal
│
├── 📱 Dashboard Overview
│   ├── 7 Module Cards
│   ├── Statistics Display
│   └── Quick Navigation
│
├── 📋 Lead Creation (Module 01)
│   ├── List View
│   │   ├── Search & Filters
│   │   ├── Table Display
│   │   └── Pagination
│   └── Detail View
│       ├── Overview Tab
│       ├── Stage & Actions Tab
│       ├── Tech Analysis Tab
│       ├── Approvals Tab
│       └── Audit Log Tab
│
├── 📄 Tender Management (Module 03)
│   ├── List View with Deadline Alerts
│   ├── Status Tracking
│   └── Days Remaining
│
├── 📊 Budgetary Quotation (Module 02)
│   ├── BQ List
│   ├── Lead Reference
│   └── Value Tracking
│
├── ⚖️ Bidding (Module 04)
│   ├── Active Bids
│   ├── L1 Position
│   └── Negotiation Status
│
├── 🎯 Order Acquisition (Module 05)
│   ├── LOI/LOA Tracking
│   └── PO Management
│
├── 📦 Order Received (Module 06)
│   ├── Delivery Tracking
│   ├── Milestones
│   └── Status Updates
│
└── 🔭 Future Initiatives (Module 07)
    ├── Strategic Opportunities
    ├── R&D Programs
    └── Horizon Tracking
```

---

## 📂 File Organization

### Theme
```
frontend/src/theme/
└── darkTheme.js
    ├── Color Palette
    ├── Typography Settings
    └── Component Overrides
```

### Components (Reusable)
```
frontend/src/components/
├── MarketingPortalSidebar.js
│   ├── Module Navigation
│   ├── Active Highlighting
│   └── Quick Actions
└── MarketingPortalTopBar.js
    ├── Module Tag
    ├── Title Display
    └── Action Buttons
```

### Views (Module Screens)
```
frontend/src/views/
├── MarketingPortalDashboard.js
│   └── 7 Module Cards
├── LeadsModule.js
│   ├── Lead List
│   └── Lead Detail with Tabs
├── TenderModule.js
│   └── Tender List & Management
└── OtherModules.js
    ├── BQModule
    ├── BiddingModule
    ├── AcquisitionModule
    ├── OrderModule
    └── FutureModule
```

### Container
```
frontend/src/containers/
└── MarketingPortal.js
    ├── Theme Provider
    ├── State Management
    ├── View Routing
    └── Module Switching
```

### API Services
```
frontend/src/api/
└── marketingPortalService.js
    ├── leadService
    ├── tenderService
    ├── analyticsService
    ├── bqService
    ├── approvalService
    └── exportService
```

---

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Service Call
    ↓
Backend API
    ↓
JSON Response
    ↓
State Update
    ↓
Component Re-render
```

### Example: Fetching Leads
```
1. Component Mounts
   ↓
2. useEffect Hook Triggers
   ↓
3. leadService.getAllLeads() Called
   ↓
4. API Request: GET /api/leads
   ↓
5. Backend Processes Query
   ↓
6. JSON Response Returned
   ↓
7. setLeads(data) Updates State
   ↓
8. Component Re-renders with Data
   ↓
9. Table Displays Leads
```

---

## 🎨 Color System

### Primary Colors
```
Primary Blue        #4f9cf9  (Accent)
Primary Dark        #2563eb  (Buttons)
Primary Light       #1e40af  (Hover)
```

### Status Colors
```
Success Green       #22c55e  (Go, Complete)
Warning Amber       #f59e0b  (Pending, Review)
Error Red           #ef4444  (Failed, No-Go)
Info Cyan           #22d3ee  (Information)
```

### Background Colors
```
Dark BG             #0d0f14  (Main)
Paper BG            #13161e  (Cards)
Secondary BG        #1a1e29  (Hover)
Tertiary BG         #222736  (Deep)
```

### Text Colors
```
Primary Text        #d4daf0  (Main Content)
Secondary Text      #8892b0  (Labels)
Disabled Text       #4a567a  (Inactive)
```

---

## 🔑 Key Components

### Sidebar Navigation
```javascript
MarketingPortalSidebar
├── Props:
│   ├── activeModule (string)
│   ├── onModuleChange (function)
│   └── onNewLead (function)
└── Renders:
    ├── Logo Section
    ├── Module List
    ├── Quick Actions
    └── Footer Info
```

### Top Navigation Bar
```javascript
MarketingPortalTopBar
├── Props:
│   ├── activeModule (string)
│   ├── onNewLead (function)
│   └── onExport (function)
└── Renders:
    ├── Module Tag
    ├── Page Title
    └── Action Buttons
```

### Module Cards
```javascript
ModuleCard
├── Props:
│   ├── id, name, desc
│   ├── icon, iconBg
│   ├── stats[]
│   └── moduleColor
└── Features:
    ├── Click Navigation
    ├── Icon Display
    ├── Statistics
    └── Description
```

### Data Table
```javascript
Table
├── Headers (sticky)
├── Body (scrollable)
├── Chips for Status
├── Monospace for IDs
└── Click Handlers
```

---

## 📋 Module Features Checklist

### Lead Module
- [ ] ✅ List View
- [ ] ✅ Search & Filter
- [ ] ✅ Detail View
- [ ] ✅ Tabs (5 types)
- [ ] ✅ Stage Pipeline
- [ ] ✅ Quick Actions
- [ ] ⚠️ Form Validation (Todo)
- [ ] ⚠️ API Integration (Todo)

### Tender Module
- [ ] ✅ List View
- [ ] ✅ Filters
- [ ] ✅ Deadline Alerts
- [ ] ✅ Days Remaining
- [ ] ⚠️ Detail View (Todo)
- [ ] ⚠️ Corrigendum Tracker (Todo)

### Other Modules
- [ ] ✅ List Views
- [ ] ✅ Basic Filters
- [ ] ⚠️ Detail Views (Todo)
- [ ] ⚠️ Edit Functionality (Todo)

---

## 📊 Data Structure Examples

### Lead
```javascript
{
  id: "L-2526-001",
  projectName: "Radar Integration System",
  customer: "BEL, Bengaluru",
  type: "EOI",
  sector: "Defence",
  market: "Domestic",
  domain: "Electronics",
  stage: "Tech Analysis",
  status: "Go",
  owner: "Ravi Kumar",
  value: 95,
  created: "12 Apr 26"
}
```

### Tender
```javascript
{
  id: "T-2526-007",
  leadRef: "L-2526-001",
  project: "Radar Integration",
  customer: "BEL",
  stage: "Bid Preparation",
  submissionDate: "30 Apr 26",
  daysLeft: 5,
  value: 95,
  owner: "Ravi K."
}
```

---

## 🚀 Integration Steps

### Step 1: Ensure Dependencies
```bash
npm ls @mui/material
# Should show version 5.11+
```

### Step 2: Set API URL
```
.env file:
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Replace Mock Data
```javascript
// In each module view
import { leadService } from '../api/marketingPortalService';

useEffect(() => {
  leadService.getAllLeads()
    .then(setLeads)
    .catch(console.error);
}, []);
```

### Step 4: Test Each Module
- [ ] Dashboard loads
- [ ] Sidebar navigation works
- [ ] Top bar updates
- [ ] Lead list displays
- [ ] Lead detail opens
- [ ] Tabs switch correctly
- [ ] Other modules load

---

## 🔧 Customization Quick Tips

### Change Primary Color
```javascript
// In darkTheme.js
primary: {
  main: '#YOUR_COLOR_HERE',
  // ...
}
```

### Add New Module
```javascript
// 1. Create view file
// 2. Add to MarketingPortal.js switch
// 3. Add to sidebar config
// 4. wire up navigation
```

### Adjust Typography
```javascript
// In darkTheme.js
typography: {
  h5: {
    fontSize: 'YOUR_SIZE',
    // ...
  }
}
```

---

## 📈 Performance Tips

1. **Lazy Load Views**: Use React.lazy() for module views
2. **Memoize Components**: Use React.memo for table rows
3. **Cache API Data**: Implement service worker or React Query
4. **Virtual Scrolling**: Use react-window for large lists
5. **Code Splitting**: Split modules into separate bundles

---

## 🧪 Testing Checklist

- [ ] All modules load without errors
- [ ] Navigation between modules works
- [ ] Tables display data correctly
- [ ] Filters work as expected
- [ ] Detail views open on click
- [ ] Tabs switch content properly
- [ ] Buttons are clickable
- [ ] No console errors
- [ ] Responsive on different screens
- [ ] API calls working (when integrated)

---

## 🎯 Common Tasks

### How to Add New Filter?
1. Add Select to FilterBar component
2. Pass filter value to API call
3. Update component state on change

### How to Add New Column to Table?
1. Add <TableCell> to TableHead
2. Add <TableCell> to TableBody with data
3. Update data structure

### How to Style a Component?
```javascript
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  // ... more styles
}));
```

### How to Add Loading State?
```javascript
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  api.fetchData().finally(() => setLoading(false));
}, []);

return loading ? <Skeleton /> : <Content />;
```

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Theme not applying | Check ThemeProvider wrapper in MarketingPortal.js |
| API calls failing | Verify REACT_APP_API_URL in .env |
| Components not rendering | Check imports and file paths |
| Styles not working | Verify styled component syntax |
| Data not updating | Check useState and useEffect dependencies |

---

## 🔗 Quick Links

- **Installation**: See INSTALLATION.md
- **API Integration**: See INTEGRATION_GUIDE.md  
- **Features**: See MARKETING_PORTAL_README.md
- **Implementation**: See IMPLEMENTATION_SUMMARY.md

---

## 📱 Keyboard Shortcuts (Ready to Implement)

```
Cmd+K    Quick search
Cmd+N    New lead
Cmd+L    Go to leads
Cmd+T    Go to tenders
Esc      Close modal/sidebar
```

---

## 🎓 Learning Resources

- Material UI Docs: https://mui.com
- React Hooks: https://react.dev
- Styled Components: https://emotion.sh
- REST APIs: https://restfulapi.net

---

**Last Updated**: April 26, 2026  
**Quick Reference Version**: 2.0
