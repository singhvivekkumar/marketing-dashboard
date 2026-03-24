# React Marketing Portal Dashboard - Complete File Structure

## 📂 Project Directory Layout

```
marketing_portal_dashboard/
│
├── 📄 package.json                    # Dependencies and npm scripts
├── 📄 README.md                       # Full documentation
├── 📄 QUICK_START.md                  # Quick start guide (5 min setup)
├── 📄 CONVERSION_GUIDE.md             # HTML to React conversion details
├── 📄 .gitignore                      # Git ignore file
│
├── 📁 public/
│   └── 📄 index.html                  # HTML template for React
│
├── 📁 src/                            # Source code
│   ├── 📄 index.js                    # React entry point
│   ├── 📄 App.js                      # Main application component
│   ├── 📄 theme.js                    # MUI theme configuration
│   ├── 📄 mockData.js                 # All mock data (ready for API integration)
│   │
│   ├── 📁 components/                 # Reusable components
│   │   ├── 📄 Sidebar.js              # Navigation sidebar with mobile drawer
│   │   ├── 📄 TopBar.js               # Top navigation bar with tabs and FY selector
│   │   ├── 📄 KPIGrid.js              # KPI cards grid component
│   │   ├── 📄 ChartCard.js            # Chart card wrapper component
│   │   ├── 📄 Charts.js               # All Recharts chart components (18 variants)
│   │   │
│   │   └── 📁 views/                  # Dashboard view components
│   │       ├── 📄 DashboardOverview.js    # Dashboard - Overview tab
│   │       ├── 📄 DashboardAnalysis.js    # Dashboard - Analysis tab
│   │       ├── 📄 DashboardPipeline.js    # Dashboard - Pipeline tab
│   │       ├── 📄 Monitoring.js           # System monitoring view
│   │       ├── 📄 MonthlyReports.js       # Monthly reports view
│   │       └── 📄 YearlyAnalysis.js       # Yearly analysis view
│   │
│   └── 📁 services/                   # (Ready to add) API services
│       └── 📄 api.js                  # (To be created) API integration layer
│
└── 📁 build/                          # (Generated after npm run build)
    └── Production-optimized files
```

## 📊 File Statistics

### Total Files Created: 24
- React Components: 12
- View Components: 6
- Configuration Files: 3
- Documentation: 4

### Lines of Code (Approximate)
- Components: ~2,500 LOC
- Mock Data: ~300 LOC
- Theme & Config: ~150 LOC
- **Total: ~2,950 LOC**

## 🎯 Component Details

### Core Components (src/components/)

1. **Sidebar.js** (180 lines)
   - Navigation menu with 3 sections (Modules, Analytics, Admin)
   - Mobile responsive drawer
   - Active state management
   - Badge support for notifications

2. **TopBar.js** (95 lines)
   - Dynamic page title
   - Tab switching for sub-views
   - FY year selector (2022-2026)
   - Mobile menu trigger button

3. **KPIGrid.js** (65 lines)
   - Responsive grid (6 columns on desktop, 2 on mobile)
   - KPI cards with values and delta indicators
   - Color-coded status (up/down/neutral)
   - Hover effects

4. **ChartCard.js** (90 lines)
   - Reusable chart wrapper
   - Header with title and chip label
   - Legend support
   - Flexible content area

5. **Charts.js** (600+ lines)
   - 18 different chart types:
     * FiveYearChart (Mixed Bar+Line)
     * LeadOutcomesChart (Pie)
     * MonthlyTrendChart (Multi-Line)
     * CivilDefenceChart (Grouped Bar)
     * LeadSubTypesChart (Pie)
     * DomainWinLossChart (Stacked Bar)
     * Top10Chart (Horizontal Bar)
     * ConversionFunnelChart (Bar)
     * QuarterlyChart (Grouped Bar)
     * TenderTypeChart (Pie)
     * OwnerPerformanceChart (Horizontal Bar)
     * PipelineStatusChart (Bar)
     * PipelineDomainChart (Grouped Bar)
     * ValueDistributionChart (Bar)
     * YearlyValueChart (Bar)
     * WinRateTrendChart (Line)
     * ActivityChart (Stacked Bar)
     * ModuleUsageChart (Pie)

### View Components (src/components/views/)

1. **DashboardOverview.js** (285 lines)
   - 6 KPI cards
   - 8 charts (5-year history, outcomes, trend, civil vs defence, subtypes, domain, top 10)
   - Lost leads data table (5 sample rows)
   - Responsive grid layouts (2:1, 1:1:1, 2:1 grids)

2. **DashboardAnalysis.js** (50 lines)
   - 6 KPI cards
   - 5 analytical charts (funnel, distribution, QoQ, tender type, owner performance)
   - Grid layout optimization for analysis view

3. **DashboardPipeline.js** (155 lines)
   - 6 pipeline KPI cards
   - 2 pipeline charts
   - Upcoming deadlines table with status chips
   - Responsive table layout

4. **Monitoring.js** (150 lines)
   - 4 system status cards (System Status, Users, Records, Docs)
   - Activity chart (30-day data)
   - Module usage pie chart
   - Live monitoring dashboard

5. **MonthlyReports.js** (220 lines)
   - Interactive month selector (12 months)
   - 8 detailed month breakdown cards
   - Monthly value chart
   - Leads vs BQs comparison chart
   - Selected month highlighting

6. **YearlyAnalysis.js** (200 lines)
   - 6 KPI cards
   - Year-over-year value chart
   - Win rate trend chart
   - 5-year summary table
   - Growth indicators for each year

## 📋 Data Structure (mockData.js)

### Data Arrays/Objects
- **MONTHS** (12 items) - Month abbreviations
- **monthData** (12 items) - Monthly statistics
- **fyData** (5 items) - Fiscal year data by year
- **fiveYearData** (5 items) - 5-year history
- **leadOutcomesData** (4 items) - Lead outcome distribution
- **monthlyTrendData** (12 items) - Monthly trends with comparisons
- **civilDefenceData** (3 items) - Civil vs Defence breakdown
- **leadSubTypesData** (5 items) - Lead sub-types distribution
- **domainWinLossData** (6 items) - Win/loss by domain
- **top10CustomersData** (10 items) - Top customers
- **lostLeadsTableData** (5 items) - Lost leads details
- **bqConversionFunnelData** (4 items) - Funnel stages
- **orderValueDistributionData** (5 items) - Value bands
- **quarterlyData** (4 items) - Q1-Q4 comparison
- **tenderTypeData** (5 items) - Tender types
- **leadOwnerData** (5 items) - Team member performance
- **pipelineStatusData** (5 items) - Pipeline stages
- **pipelineDomainData** (5 items) - Pipeline by domain
- **upcomingDeadlinesData** (4 items) - Upcoming tenders
- **yearlyValueData** (5 items) - Yearly values
- **winRateTrendData** (5 items) - Win rate by year
- **yearSummaryData** (5 items) - Year summary with growth
- **monitoringData** (object) - System monitoring metrics
- **moduleUsageData** (4 items) - Module usage distribution

## 🎨 Styling Configuration

### Theme File (src/theme.js)
- **Primary Colors**:
  - Blue: #2563eb (primary actions)
  - Purple: #7c3aed (secondary)
  - Teal: #0d9488 (info)
  - Green: #16a34a (success)
  - Amber: #d97706 (warning)
  - Red: #dc2626 (error)

- **Typography**:
  - Font Family: DM Sans (primary), DM Mono (monospace)
  - Custom typography variants (h1-h6)
  - Standardized font sizes and weights

- **Component Overrides**:
  - MuiButton styling
  - MuiCard styling
  - MuiSelect styling

## 🔄 State Management

### App-level State (App.js)
- activeSection: 'dashboard' | 'monitoring' | 'reports' | 'yearly'
- activeTab: 'overview' | 'analysis' | 'pipeline'
- fy: '2026' | '2025' | '2024' | '2023' | '2022'
- mobileOpen: boolean (sidebar drawer state)

### Component-level State
- MonthlyReports.js: selectedMonth (0-11)

## 🚀 Ready-to-Implement Features

1. ✅ Navigation structure
2. ✅ All charts and visualizations
3. ✅ Tab switching
4. ✅ Year selector
5. ✅ Month selector (reports)
6. ✅ Data tables
7. ✅ Status cards
8. ✅ KPI cards with trends
9. ✅ Mobile responsive design
10. ✅ Material UI theme

## 🔗 Dependencies Overview

- **react@18.2.0** - Core React library
- **@mui/material@5.14.0** - 50+ UI components
- **@mui/icons-material@5.14.0** - Material Design icons (1000+)
- **recharts@2.10.0** - React charting library
- **@emotion/react@11.11.0** - Styling library for MUI
- **@emotion/styled@11.11.0** - Styled components for MUI

## 📝 Documentation Files

1. **README.md** - Complete documentation (features, setup, dependencies, etc.)
2. **QUICK_START.md** - 5-minute quick start guide
3. **CONVERSION_GUIDE.md** - Detailed HTML to React conversion notes
4. **FILE_STRUCTURE.md** - This file (directory overview)

## 🎯 Next Steps for Integration

1. **API Connection**:
   - Create `src/services/api.js`
   - Replace mock data with API calls
   - Add loading and error states

2. **Authentication**:
   - Add login/logout functionality
   - Implement authorization checks
   - Secure API endpoints

3. **Testing**:
   - Add Jest unit tests
   - Add React Testing Library tests
   - Add E2E tests with Cypress

4. **Performance**:
   - Code splitting with React.lazy
   - Memoization for expensive components
   - Image optimization

5. **Deployment**:
   - Build optimized production version
   - Deploy to hosting platform
   - Setup CI/CD pipeline

## 📦 Build Output

When running `npm run build`, generates:
- Optimized bundle (minified, Tree-shaken)
- CSS chunking
- Image optimization
- Service worker (if configured)
- Size optimizations

## 🎓 Learning Resources for Team

- React Components: All well-commented
- MUI Documentation: https://mui.com/
- Recharts Documentation: https://recharts.org/
- Material Design: https://material.io/design/

## 📞 Support

All files include:
- Clear naming conventions
- Organized folder structure
- Modular components
- Well-documented code
- Easy to extend and maintain

---

**Project Status**: ✅ Complete and Ready for API Integration
**React Version**: 18.2.0
**Last Updated**: March 2026
