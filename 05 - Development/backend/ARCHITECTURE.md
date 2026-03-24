# Backend Architecture & Project Structure

## Overview

Your backend has been restructured with a **Model-Based Architecture** where every model (Dashboard, Analytics, Pipeline, Reports) is completely separated with its own:
- **Service** - Data management and business logic
- **Controller** - Request handling and response formatting
- **Routes** - API endpoint definitions

This ensures **scalability**, **maintainability**, and **clear separation of concerns**.

---

## Directory Structure

```
backend/
├── services/                          # Business logic & data management
│   ├── dashboardService.js            # Dashboard data (monthly, FY summaries)
│   ├── analyticsService.js            # Analytics (trends, distributions)
│   ├── pipelineService.js             # Pipeline (status, deadlines, domains)
│   └── reportsService.js              # Reports (yearly data, summaries)
│
├── controllers/                       # Request handlers
│   ├── dashboardController.js         # Dashboard endpoints
│   ├── analyticsController.js         # Analytics endpoints
│   ├── pipelineController.js          # Pipeline endpoints
│   └── reportsController.js           # Reports endpoints
│
├── routes/                            # API route definitions
│   ├── dashboardRoutes.js             # Dashboard routes
│   ├── analyticsRoutes.js             # Analytics routes
│   ├── pipelineRoutes.js              # Pipeline routes
│   └── reportsRoutes.js               # Reports routes
│
├── server.js                          # Main Express server
├── package.json                       # Dependencies
├── .env                               # Environment variables
├── API_DOCUMENTATION.md               # Complete API reference
└── README.md                          # Project readme
```

---

## Data Models & Structure

### 1. Dashboard Model

**Service:** `dashboardService.js`

**Data Entities:**
```javascript
monthlyData     // 12-month data (orders, leads, BQs, value, won, lost)
fiscalYearData  // Multi-year FY summaries (2022-2026)
```

**Key Methods:**
- `getMonthData(fy)` - Get month-by-month data
- `getMonthsWithData(fy)` - Get months + data combined
- `getFYSummary(fy)` - Get summary for specific fiscal year
- `getAllFYData()` - Get all fiscal years
- `getKPIs(fy)` - Get KPI cards

**API Endpoints:**
```
GET /api/dashboard/month-data        # Monthly data
GET /api/dashboard/fy-summary        # FY summary
GET /api/dashboard/all-fy            # All FY data
GET /api/dashboard/kpis              # KPI metrics
```

---

### 2. Analytics Model

**Service:** `analyticsService.js`

**Data Entities:**
```javascript
fiveYearTrend          // 5-year order & value history
leadOutcomes           // Won/Lost/Participated distribution
monthlyTrend           // Month-over-month comparison
civilDefence           // Civil vs Defence split
leadSubTypes           // Lead type distribution
domainWinLoss          // Domain performance
topCustomers           // Top 10 customers
lostLeads              // Lost tender data with reasons
bqConversion           // BQ → Lead → Order funnel
orderValueDistribution // Order size bands
```

**Key Methods:**
- `getFiveYearTrend()` - Historical data
- `getLeadOutcomes()` - Lead distribution
- `getMonthlyTrend(fy)` - Month comparison
- `getCivilDefence()` - Sector split
- `getDomainPerformance(domain)` - Domain analytics
- `getLostLeads(domain, limit)` - Filter lost tenders
- `getLostLeadById(id)` - Specific tender details
- `getBQConversion()` - Conversion funnel
- `getOrderValueDistribution()` - Deal size bands

**API Endpoints:**
```
GET /api/analytics/five-year-trend       # 5-year data
GET /api/analytics/lead-outcomes         # Lead distribution
GET /api/analytics/monthly-trend         # Month comparison
GET /api/analytics/civil-defence         # Civil vs Defence
GET /api/analytics/lead-subtypes         # Lead types
GET /api/analytics/domain-performance    # Domain metrics
GET /api/analytics/top-customers         # Top 10
GET /api/analytics/lost-leads            # Lost tenders
GET /api/analytics/lost-leads/:id        # Specific lead
GET /api/analytics/bq-conversion         # Conversion funnel
GET /api/analytics/order-distribution    # Deal sizes
GET /api/analytics/kpis                  # Analytics KPIs
```

---

### 3. Pipeline Model

**Service:** `pipelineService.js`

**Data Entities:**
```javascript
pipelineStatus     // Stages: Identified, In Prep, Submitted, Eval, Pre-bid
pipelineDomain     // Value by domain (Civil/Defence)
upcomingDeadlines  // Tenders with deadlines & status
```

**Key Methods:**
- `getPipelineStatus()` - Pipeline stages
- `getPipelineDomain(domain)` - Value by domain
- `getUpcomingDeadlines(days, status)` - Deadlines with filters
- `getDeadlineById(id)` - Specific deadline
- `getKPIPipeline()` - Pipeline KPIs
- `getSummary()` - Summary data

**API Endpoints:**
```
GET /api/pipeline/status              # Pipeline stages
GET /api/pipeline/domain              # Value by domain
GET /api/pipeline/deadlines           # Upcoming deadlines
GET /api/pipeline/deadlines/:id       # Specific deadline
GET /api/pipeline/kpis                # Pipeline KPIs
GET /api/pipeline/summary             # Summary
```

---

### 4. Reports Model

**Service:** `reportsService.js`

**Data Entities:**
```javascript
yearlyValue       // Year-over-year value trend
winRateTrend      // Win rate progression
yearSummary       // Annual summaries (BQs, leads, orders, etc.)
quarterlyData     // Q1-Q4 comparison
tenderType        // Open, Limited, Single Source, etc.
leadOwner         // Individual performance metrics
```

**Key Methods:**
- `getYearlyValue()` - Value trend
- `getWinRateTrend()` - Win rate progression
- `getYearSummary()` - Annual summaries
- `getYearById(id)` - Specific year
- `getQuarterlyData(fy)` - Quarterly metrics
- `getTenderType()` - Tender breakdown
- `getLeadOwnerPerformance()` - Team performance
- `getReportSummary()` - Overall summary
- `getExportData(format)` - Exportable data

**API Endpoints:**
```
GET /api/reports/yearly-value        # Value trend
GET /api/reports/win-rate-trend      # Win rate trend
GET /api/reports/year-summary        # Annual data
GET /api/reports/year-summary/:id    # Specific year
GET /api/reports/quarterly           # Q1-Q4 data
GET /api/reports/tender-type         # Tender breakdown
GET /api/reports/lead-owner          # Team performance
GET /api/reports/summary             # Overall summary
GET /api/reports/export              # Export data
```

---

## Request-Response Flow

### Example: Get Dashboard KPIs

```
1. Frontend Request
   GET /api/dashboard/kpis?fy=2026

2. Route Handler (dashboardRoutes.js)
   - Matches GET /kpis
   - Passes to dashboardController.getKPIs()

3. Controller (dashboardController.js)
   - Extracts query params: fy = '2026'
   - Calls dashboardService.getKPIs(fy)
   - Formats response

4. Service (dashboardService.js)
   - Retrieves data from fiscalYearData
   - Extracts KPI values
   - Returns { leadsInQueue, totalOrders, ... }

5. Response to Frontend
   {
     "success": true,
     "data": { leadsInQueue, totalOrders, ... },
     "fy": "2026"
   }
```

---

## Adding New Endpoints

### To add a new endpoint:

1. **Add data in the Service:**
   ```javascript
   // services/newService.js
   class NewService {
     getNewData() {
       return newDataSet;
     }
   }
   module.exports = new NewService();
   ```

2. **Create Controller method:**
   ```javascript
   // controllers/newController.js
   class NewController {
     getNewData(req, res) {
       try {
         const data = newService.getNewData();
         res.json({ success: true, data });
       } catch (error) {
         res.status(400).json({ success: false, error: error.message });
       }
     }
   }
   ```

3. **Add Route:**
   ```javascript
   // routes/newRoutes.js
   router.get('/new-data', controller.getNewData.bind(controller));
   ```

4. **Register in server.js:**
   ```javascript
   app.use('/api/new', newRoutes);
   ```

---

## Service Pattern

Each service follows this pattern:

```javascript
class ServiceName {
  // Public methods that return formatted data
  
  // Helper method prefix: _privateHelper()
  _helperMethod() { ... }
  
  // Data always comes from imports/constants
  // No database calls yet (ready for DB integration)
}

module.exports = new ServiceName();
```

---

## Controller Pattern

Each controller follows this pattern:

```javascript
class ControllerName {
  // method(req, res)
  // 1. Extract params
  // 2. Call service
  // 3. Format response
  // 4. Send JSON
  // 5. Catch errors
}

module.exports = new ControllerName();
```

---

## Database Integration Ready

The architecture is ready for database integration:

1. **Services** can easily swap mock data for database queries
2. **Controllers** don't need changes
3. **Routes** don't need changes
4. **Frontend** continues to work

Example migration:
```javascript
// BEFORE: Mock data
const data = analyticsData.lostLeads;

// AFTER: Database query
const data = await db.LostLeads.findAll({ where: { ... } });
```

---

## Error Handling

All endpoints handle errors consistently:

1. **Service** throws errors with clear messages
2. **Controller** catches and formats response
3. **Response** includes HTTP status code

```javascript
controller.method(req, res) {
  try {
    const data = service.getData();       // May throw
    res.json({ success: true, data });   // Success
  } catch (error) {
    res.status(400).json({               // Error
      success: false,
      error: error.message
    });
  }
}
```

---

## Environment Configuration

```env
# .env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## Testing Individual Models

You can test each model in isolation:

```bash
# Test Dashboard
curl http://localhost:5000/api/dashboard/kpis

# Test Analytics
curl http://localhost:5000/api/analytics/lost-leads

# Test Pipeline
curl http://localhost:5000/api/pipeline/deadlines

# Test Reports
curl http://localhost:5000/api/reports/year-summary
```

---

## Best Practices Applied

✅ **Separation of Concerns** - Each model is independent  
✅ **Single Responsibility** - Services handle logic, controllers handle HTTP  
✅ **DRY Principle** - No duplication across models  
✅ **Scalability** - Easy to add new models  
✅ **Maintainability** - Clear folder structure and naming  
✅ **Error Handling** - Consistent error responses  
✅ **Documentation** - Every endpoint documented  

---

## Quick Reference

| Layer | File | Responsibility |
|-------|------|-----------------|
| **Route** | `*Routes.js` | URL patterns, HTTP verbs |
| **Controller** | `*Controller.js` | Request/response handling |
| **Service** | `*Service.js` | Data logic, calculations |
| **Data** | Within service | Mock data (ready for DB) |

---

## Running the Server

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Server will be available at:
# http://localhost:5000
```

---

Version: 1.0.0  
Architecture: Model-Based Separation  
Last Updated: March 24, 2026
