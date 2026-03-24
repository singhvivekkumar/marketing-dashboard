# Marketing Portal Analytics API Documentation

Complete API reference for the Marketing Portal Analytics Backend. All endpoints organized by models/resources for clear separation of concerns.

## Base URL

```
http://localhost:5000/api
```

## Response Format

All endpoints return JSON responses with this structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "additional_fields": "optional"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Dashboard Model: `/api/dashboard`

Manages dashboard data including monthly metrics and fiscal year summaries.

### 1. Get Monthly Data
**Endpoint:** `GET /api/dashboard/month-data`

**Query Parameters:**
- `fy` (optional): Fiscal year (e.g., "2026")

**Response:**
```json
{
  "success": true,
  "data": {
    "months": ["Apr", "May", "Jun", ...],
    "data": [
      {
        "month": "Apr",
        "orders": 8,
        "leads": 9,
        "bqs": 5,
        "value": 18.2,
        "won": 3,
        "lost": 2,
        "fy": "2026"
      }
    ]
  },
  "fy": "2026"
}
```

### 2. Get Fiscal Year Summary
**Endpoint:** `GET /api/dashboard/fy-summary`

**Query Parameters:**
- `fy` (optional): Fiscal year (default: "2026")

**Response:**
```json
{
  "success": true,
  "data": {
    "queue": 42,
    "orders": 128,
    "value": "₹247",
    "bq": 67,
    "wr": "34%",
    "lost": 38
  },
  "fy": "2026"
}
```

### 3. Get All Fiscal Year Data
**Endpoint:** `GET /api/dashboard/all-fy`

**Response:**
```json
{
  "success": true,
  "data": {
    "2026": { "queue": 42, "orders": 128, ... },
    "2025": { "queue": 35, "orders": 105, ... },
    ...
  },
  "years": ["2026", "2025", "2024", "2023", "2022"]
}
```

### 4. Get Dashboard KPIs
**Endpoint:** `GET /api/dashboard/kpis`

**Query Parameters:**
- `fy` (optional): Fiscal year (default: "2026")

**Response:**
```json
{
  "success": true,
  "data": {
    "leadsInQueue": 42,
    "totalOrders": 128,
    "orderValue": "₹247",
    "bqsSubmitted": 67,
    "winRate": "34%",
    "lostLeads": 38
  },
  "fy": "2026"
}
```

---

## Analytics Model: `/api/analytics`

Handles all analytics data: trends, distributions, comparisons, and performance metrics.

### 1. Get Five Year Trend
**Endpoint:** `GET /api/analytics/five-year-trend`

**Response:**
```json
{
  "success": true,
  "data": [
    { "fy": "FY 21-22", "orders": 75, "value": 148 },
    { "fy": "FY 22-23", "orders": 82, "value": 162 },
    ...
  ]
}
```

### 2. Get Lead Outcomes Distribution
**Endpoint:** `GET /api/analytics/lead-outcomes`

**Response:**
```json
{
  "success": true,
  "data": [
    { "name": "Won", "value": 34, "color": "#16a34a" },
    { "name": "Lost", "value": 22, "color": "#dc2626" },
    { "name": "Participated", "value": 30, "color": "#2563eb" },
    { "name": "Not-Part.", "value": 14, "color": "#d97706" }
  ]
}
```

### 3. Get Monthly Trend Comparison
**Endpoint:** `GET /api/analytics/monthly-trend`

**Query Parameters:**
- `fy` (optional): Filter by specific fiscal year

**Response:**
```json
{
  "success": true,
  "data": [
    { "month": "Apr", "FY 25-26": 8, "FY 24-25": 6 },
    { "month": "May", "FY 25-26": 6, "FY 24-25": 5 },
    ...
  ],
  "fy": "all"
}
```

### 4. Get Civil vs Defence Comparison
**Endpoint:** `GET /api/analytics/civil-defence`

**Response:**
```json
{
  "success": true,
  "data": [
    { "category": "Leads", "Civil": 68, "Defence": 44 },
    { "category": "Orders", "Civil": 78, "Defence": 50 },
    { "category": "BQs", "Civil": 55, "Defence": 30 }
  ]
}
```

### 5. Get Lead Sub-Types Distribution
**Endpoint:** `GET /api/analytics/lead-subtypes`

**Response:**
```json
{
  "success": true,
  "data": [
    { "name": "Submitted", "value": 28, "color": "#2563eb" },
    { "name": "Domestic", "value": 35, "color": "#0d9488" },
    { "name": "Export", "value": 18, "color": "#7c3aed" },
    { "name": "CRM Lead", "value": 14, "color": "#d97706" },
    { "name": "Lost Lead", "value": 17, "color": "#dc2626" }
  ]
}
```

### 6. Get Domain-wise Win/Loss Performance
**Endpoint:** `GET /api/analytics/domain-performance`

**Query Parameters:**
- `domain` (optional): Filter by specific domain (e.g., "Radar")

**Response:**
```json
{
  "success": true,
  "data": [
    { "domain": "Radar", "Won": 12, "Lost": 5 },
    { "domain": "Telecom", "Won": 8, "Lost": 4 },
    { "domain": "CCTV", "Won": 15, "Lost": 7 },
    ...
  ],
  "domain": "all"
}
```

### 7. Get Top Customers
**Endpoint:** `GET /api/analytics/top-customers`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    { "name": "MoD", "value": 82 },
    { "name": "BEL", "value": 68 },
    { "name": "ONGC", "value": 54 },
    ...
  ],
  "count": 10
}
```

### 8. Get Lost Leads List
**Endpoint:** `GET /api/analytics/lost-leads`

**Query Parameters:**
- `domain` (optional): Filter by domain (e.g., "Civil", "Defence")
- `limit` (optional): Limit results

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tenderName": "Coastal Radar Network",
      "customer": "Indian Navy",
      "domain": "Defence",
      "value": "₹45.20",
      "competitor": "DRDO Pvt",
      "reason": "Higher price quoted",
      "date": "Jan '26"
    },
    ...
  ],
  "total": 5,
  "filtered": 5
}
```

### 9. Get Specific Lost Lead
**Endpoint:** `GET /api/analytics/lost-leads/:id`

**URL Parameters:**
- `id`: Lost lead ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "tenderName": "Coastal Radar Network",
    "customer": "Indian Navy",
    ...
  }
}
```

### 10. Get BQ Conversion Funnel
**Endpoint:** `GET /api/analytics/bq-conversion`

**Response:**
```json
{
  "success": true,
  "data": [
    { "stage": "BQs Submitted", "count": 67 },
    { "stage": "Converted to Lead", "count": 48 },
    { "stage": "Submitted to Tender", "count": 38 },
    { "stage": "Won Order", "count": 26 }
  ]
}
```

### 11. Get Order Value Distribution
**Endpoint:** `GET /api/analytics/order-distribution`

**Response:**
```json
{
  "success": true,
  "data": [
    { "band": "<5 Cr", "count": 12 },
    { "band": "5–20 Cr", "count": 38 },
    { "band": "20–50 Cr", "count": 45 },
    { "band": "50–100 Cr", "count": 25 },
    { "band": ">100 Cr", "count": 8 }
  ]
}
```

### 12. Get Analytics KPIs
**Endpoint:** `GET /api/analytics/kpis`

**Response:**
```json
{
  "success": true,
  "data": {
    "avgDealSize": "₹19.3",
    "bqConversion": "48%",
    "pipelineValue": "₹312",
    "avgLeadAge": 47,
    "exportLeads": 18,
    "soleBidding": "62%"
  }
}
```

---

## Pipeline Model: `/api/pipeline`

Manages pipeline data: status stages, upcoming deadlines, and value by domain.

### 1. Get Pipeline Status
**Endpoint:** `GET /api/pipeline/status`

**Response:**
```json
{
  "success": true,
  "data": [
    { "stage": "Identified", "count": 12 },
    { "stage": "In Prep", "count": 9 },
    { "stage": "Submitted", "count": 11 },
    { "stage": "Eval.", "count": 6 },
    { "stage": "Pre-bid", "count": 4 }
  ]
}
```

### 2. Get Pipeline Value by Domain
**Endpoint:** `GET /api/pipeline/domain`

**Query Parameters:**
- `domain` (optional): Filter by specific domain

**Response:**
```json
{
  "success": true,
  "data": [
    { "domain": "Radar", "Civil": 18, "Defence": 45 },
    { "domain": "Telecom", "Civil": 24, "Defence": 18 },
    { "domain": "CCTV", "Civil": 32, "Defence": 12 },
    ...
  ],
  "domain": "all"
}
```

### 3. Get Upcoming Deadlines
**Endpoint:** `GET /api/pipeline/deadlines`

**Query Parameters:**
- `days` (optional): Number of days ahead
- `status` (optional): Filter by status (e.g., "In progress", "Pending docs", "Draft ready")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tenderName": "Army Comms Upgrade",
      "customer": "MoD",
      "type": "Open",
      "value": "₹92.00",
      "deadline": "22 Mar '26",
      "owner": "Rajan K",
      "status": "In progress"
    },
    ...
  ],
  "count": 4
}
```

### 4. Get Specific Deadline
**Endpoint:** `GET /api/pipeline/deadlines/:id`

**URL Parameters:**
- `id`: Deadline ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "tenderName": "Army Comms Upgrade",
    ...
  }
}
```

### 5. Get Pipeline KPIs
**Endpoint:** `GET /api/pipeline/kpis`

**Response:**
```json
{
  "success": true,
  "data": {
    "openLeads": 42,
    "preBidPending": 8,
    "submissionsDue": 5,
    "corrigendums": 12,
    "consortiumDeals": 11,
    "expectedWin": "₹98"
  }
}
```

### 6. Get Pipeline Summary
**Endpoint:** `GET /api/pipeline/summary`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOpenLeads": 42,
    "upcomingDeadlines": 4,
    "stages": 5
  }
}
```

---

## Reports Model: `/api/reports`

Handles reporting data: yearly summaries, trends, and various analytical breakdowns.

### 1. Get Yearly Value Trend
**Endpoint:** `GET /api/reports/yearly-value`

**Response:**
```json
{
  "success": true,
  "data": [
    { "fy": "FY 21-22", "value": 148 },
    { "fy": "FY 22-23", "value": 162 },
    { "fy": "FY 23-24", "value": 182 },
    { "fy": "FY 24-25", "value": 208 },
    { "fy": "FY 25-26", "value": 247 }
  ]
}
```

### 2. Get Win Rate Trend
**Endpoint:** `GET /api/reports/win-rate-trend`

**Response:**
```json
{
  "success": true,
  "data": [
    { "fy": "FY 21-22", "rate": 27 },
    { "fy": "FY 22-23", "rate": 29 },
    { "fy": "FY 23-24", "rate": 38 },
    { "fy": "FY 24-25", "rate": 31 },
    { "fy": "FY 25-26", "rate": 34 }
  ]
}
```

### 3. Get Year Summary
**Endpoint:** `GET /api/reports/year-summary`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fy": "FY 2025–26",
      "bqs": 67,
      "leads": 112,
      "orders": 128,
      "value": "₹247",
      "winRate": "34%",
      "lost": 38,
      "growth": "+18.7%"
    },
    ...
  ],
  "count": 4
}
```

### 4. Get Specific Year Summary
**Endpoint:** `GET /api/reports/year-summary/:id`

**URL Parameters:**
- `id`: Year ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fy": "FY 2025–26",
    ...
  }
}
```

### 5. Get Quarterly Data
**Endpoint:** `GET /api/reports/quarterly`

**Query Parameters:**
- `fy` (optional): Filter by fiscal year

**Response:**
```json
{
  "success": true,
  "data": [
    { "quarter": "Q1", "FY 25-26": 24, "FY 24-25": 20 },
    { "quarter": "Q2", "FY 25-26": 29, "FY 24-25": 24 },
    { "quarter": "Q3", "FY 25-26": 33, "FY 24-25": 28 },
    { "quarter": "Q4", "FY 25-26": 42, "FY 24-25": 33 }
  ],
  "fy": "all"
}
```

### 6. Get Tender Type Breakdown
**Endpoint:** `GET /api/reports/tender-type`

**Response:**
```json
{
  "success": true,
  "data": [
    { "name": "Open", "value": 38, "color": "#2563eb" },
    { "name": "Limited", "value": 22, "color": "#0d9488" },
    { "name": "Single Source", "value": 18, "color": "#7c3aed" },
    { "name": "Nomination", "value": 12, "color": "#d97706" },
    { "name": "Rate Contract", "value": 10, "color": "#9ca3af" }
  ]
}
```

### 7. Get Lead Owner Performance
**Endpoint:** `GET /api/reports/lead-owner`

**Response:**
```json
{
  "success": true,
  "data": [
    { "owner": "Rajan K", "value": 68 },
    { "owner": "Priya S", "value": 52 },
    { "owner": "Anil M", "value": 44 },
    { "owner": "Deepa R", "value": 38 },
    { "owner": "Sanjay V", "value": 28 }
  ]
}
```

### 8. Get Report Summary
**Endpoint:** `GET /api/reports/summary`

**Response:**
```json
{
  "success": true,
  "data": {
    "currentFY": "FY 2025–26",
    "totalOrders": 128,
    "totalValue": "₹247",
    "averageWinRate": "32%",
    "totalLeads": 112,
    "generatedDate": "2026-03-24T10:30:00.000Z",
    "yearsAvailable": 4
  }
}
```

### 9. Export Report Data
**Endpoint:** `GET /api/reports/export`

**Query Parameters:**
- `format` (optional): "json" (default) or "csv"

**Response:**
```json
{
  "success": true,
  "data": {
    "format": "json",
    "yearlyValue": [...],
    "winRateTrend": [...],
    "yearSummary": [...],
    "quarterlyData": [...],
    "tenderType": [...],
    "leadOwner": [...],
    "exportDate": "2026-03-24T10:30:00.000Z"
  }
}
```

---

## Health Check

### Health Status
**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "Marketing Portal Analytics API is running",
  "timestamp": "2026-03-24T10:30:00.000Z"
}
```

---

## Architecture

The API is built with a clear separation of concerns:

```
├── models/                 # Data models
├── services/              # Business logic services
│   ├── dashboardService.js
│   ├── analyticsService.js
│   ├── pipelineService.js
│   └── reportsService.js
├── controllers/           # Request handlers
│   ├── dashboardController.js
│   ├── analyticsController.js
│   ├── pipelineController.js
│   └── reportsController.js
├── routes/               # API endpoints
│   ├── dashboardRoutes.js
│   ├── analyticsRoutes.js
│   ├── pipelineRoutes.js
│   └── reportsRoutes.js
├── middleware/           # Express middleware
└── server.js             # Main server file
```

### Service-to-Controller Flow

Each service is responsible for:
- Data management and aggregation
- Business logic and calculations
- Filtering and sorting

Each controller is responsible for:
- Request validation
- Calling appropriate services
- Response formatting
- Error handling

Each route file is responsible for:
- Defining URL patterns
- Mapping to controller methods
- Grouping related endpoints

---

## Error Handling

All errors return with status codes and consistent format:

**400 Bad Request** - Invalid parameters
**404 Not Found** - Resource not found
**500 Internal Server Error** - Server error

Error response format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Example Usage from Frontend

```javascript
// Get dashboard KPIs
fetch('http://localhost:5000/api/dashboard/kpis?fy=2026')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Get analytics data
fetch('http://localhost:5000/api/analytics/lost-leads?domain=Civil&limit=5')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Get pipeline deadlines
fetch('http://localhost:5000/api/pipeline/deadlines?status=In%20progress')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Get reports
fetch('http://localhost:5000/api/reports/year-summary')
  .then(res => res.json())
  .then(data => console.log(data.data));
```

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

Version: 1.0.0  
Last Updated: March 24, 2026
