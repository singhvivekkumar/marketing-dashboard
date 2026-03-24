# Marketing Portal Analytics Dashboard - React App

A professional marketing portal analytics dashboard built with React, Material UI, and Recharts. This is a complete conversion of the HTML dashboard to a modern React application with component-based architecture.

## 📋 Features

- **Modern React Architecture** - Component-based structure with clean separation of concerns
- **Material UI Components** - Professional UI components with consistent styling
- **Recharts Integration** - Interactive charts and visualizations
- **Multiple Views**:
  - Dashboard (Overview, Analysis, Pipeline tabs)
  - System Monitoring
  - Monthly Reports
  - Yearly Analysis
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Mock Data** - Pre-populated with realistic data ready for API integration
- **Customizable Theme** - Centralized MUI theme configuration

## 🗂️ Project Structure

```
src/
├── index.js                          # Entry point
├── App.js                            # Main application component
├── theme.js                          # MUI theme configuration
├── mockData.js                       # All mock data
├── components/
│   ├── Sidebar.js                    # Navigation sidebar
│   ├── TopBar.js                     # Top navigation bar
│   ├── KPIGrid.js                    # KPI cards component
│   ├── ChartCard.js                  # Chart wrapper component
│   ├── Charts.js                     # All Recharts components
│   └── views/
│       ├── DashboardOverview.js      # Dashboard overview tab
│       ├── DashboardAnalysis.js      # Dashboard analysis tab
│       ├── DashboardPipeline.js      # Dashboard pipeline tab
│       ├── Monitoring.js             # System monitoring view
│       ├── MonthlyReports.js         # Monthly reports view
│       └── YearlyAnalysis.js         # Yearly analysis view
public/
└── index.html                        # HTML template
package.json                          # Dependencies and scripts
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd "c:\Users\singh\Downloads\Project Marketing Portal\05 - Development\01 - frontend"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📦 Dependencies

- **React 18.2.0** - UI library
- **@mui/material 5.14.0** - Material Design components
- **@mui/icons-material 5.14.0** - Material icons
- **recharts 2.10.0** - React charting library
- **@emotion/react & @emotion/styled** - CSS-in-JS styling for MUI

## 🎨 Theme & Styling

The application uses Material UI's theming system with a custom theme configuration matching the original design:

- **Primary Color**: #2563eb (Blue)
- **Success Color**: #16a34a (Green)
- **Warning Color**: #d97706 (Amber)
- **Error Color**: #dc2626 (Red)
- **Secondary Color**: #7c3aed (Purple)
- **Info Color**: #0d9488 (Teal)

All colors and typography are defined in `src/theme.js` and can be easily customized.

## 📊 Charts

All charts are built with Recharts and include:

1. **5-Year History** - Mixed bar and line chart (FiveYearChart)
2. **Lead Outcomes** - Doughnut/pie chart (LeadOutcomesChart)
3. **Monthly Trend** - Multi-line chart (MonthlyTrendChart)
4. **Civil vs Defence** - Grouped bar chart (CivilDefenceChart)
5. **Lead Sub-Types** - Doughnut/pie chart (LeadSubTypesChart)
6. **Domain Win/Loss** - Stacked bar chart (DomainWinLossChart)
7. **Top 10 Customers** - Horizontal bar chart (Top10Chart)
8. **BQ Conversion Funnel** - Funnel bar chart (ConversionFunnelChart)
9. **Quarterly Comparison** - Grouped bar chart (QuarterlyChart)
10. **Tender Type** - Doughnut/pie chart (TenderTypeChart)
11. **Owner Performance** - Horizontal bar chart (OwnerPerformanceChart)
12. **Pipeline Status** - Bar chart (PipelineStatusChart)
13. **Pipeline Domain** - Grouped bar chart (PipelineDomainChart)
14. **Value Distribution** - Bar chart (ValueDistributionChart)
15. **Yearly Value** - Bar chart (YearlyValueChart)
16. **Win Rate Trend** - Line chart (WinRateTrendChart)
17. **Activity Stacked** - Stacked bar chart (ActivityChart)
18. **Module Usage** - Doughnut/pie chart (ModuleUsageChart)

## 🔄 API Integration

To replace mock data with real API calls:

1. Update `src/mockData.js` or create an API service file
2. Create API fetching functions (e.g., `src/services/api.js`)
3. Update components to use API data instead of mock data
4. Handle loading and error states

Example API integration pattern:
```javascript
// In your component
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchDataFromAPI()
    .then(response => setData(response.data))
    .catch(error => console.error(error))
    .finally(() => setLoading(false));
}, []);
```

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop**: Sidebar + full content
- **Tablet**: Adapted layouts with smaller grids
- **Mobile**: Collapsible sidebar, stacked layouts

## 🛠️ Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

## 📝 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not reversible)

## 🎯 Key Components

### Sidebar Component
- Navigation between sections (Dashboard, Monitoring, Reports, Yearly)
- Module selection (BQ Management, Lead Management, Orders, R&D)
- Active section highlighting
- Badge support (e.g., Lead count)
- Mobile responsive with drawer

### TopBar Component
- Dynamic title based on current section
- Tab switching for sub-views
- Fiscal Year (FY) selector
- Mobile menu trigger

### KPI Grid Component
- Responsive grid of KPI cards
- Support for delta indicators (up/down/neutral)
- Color-coded status
- Hover effects

### ChartCard Component
- Consistent card styling
- Header with title and optional chip
- Legend support
- Flexible content area for any chart type

## 🔑 Key Features Implemented

✅ Multi-section navigation  
✅ Tab-based sub-views  
✅ FY year selector with data updates  
✅ Responsive sidebar with mobile drawer  
✅ 18+ different chart types  
✅ Data tables with status indicators  
✅ KPI cards with trend indicators  
✅ Month selector for reports  
✅ Monitoring dashboard with live cards  
✅ Mock data structure ready for API integration  

## 📄 License

This project is part of the Marketing Portal project. All rights reserved.

## 👥 Support

For questions or issues, please contact the development team.
