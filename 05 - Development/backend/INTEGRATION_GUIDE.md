# Frontend-Backend Integration Guide

Complete guide to integrate your React frontend with the new model-based backend API.

## Quick Start

### 1. Update Frontend API Base URL

Create an `apiConfig.js` file in your frontend:

```javascript
// src/api/config.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD_MONTH_DATA: `${API_BASE_URL}/dashboard/month-data`,
  DASHBOARD_FY_SUMMARY: `${API_BASE_URL}/dashboard/fy-summary`,
  DASHBOARD_ALL_FY: `${API_BASE_URL}/dashboard/all-fy`,
  DASHBOARD_KPIS: `${API_BASE_URL}/dashboard/kpis`,

  // Analytics
  ANALYTICS_FIVE_YEAR: `${API_BASE_URL}/analytics/five-year-trend`,
  ANALYTICS_LEAD_OUTCOMES: `${API_BASE_URL}/analytics/lead-outcomes`,
  ANALYTICS_MONTHLY_TREND: `${API_BASE_URL}/analytics/monthly-trend`,
  ANALYTICS_CIVIL_DEFENCE: `${API_BASE_URL}/analytics/civil-defence`,
  ANALYTICS_LEAD_SUBTYPES: `${API_BASE_URL}/analytics/lead-subtypes`,
  ANALYTICS_DOMAIN_PERFORMANCE: `${API_BASE_URL}/analytics/domain-performance`,
  ANALYTICS_TOP_CUSTOMERS: `${API_BASE_URL}/analytics/top-customers`,
  ANALYTICS_LOST_LEADS: `${API_BASE_URL}/analytics/lost-leads`,
  ANALYTICS_BQ_CONVERSION: `${API_BASE_URL}/analytics/bq-conversion`,
  ANALYTICS_ORDER_DISTRIBUTION: `${API_BASE_URL}/analytics/order-distribution`,
  ANALYTICS_KPIS: `${API_BASE_URL}/analytics/kpis`,

  // Pipeline
  PIPELINE_STATUS: `${API_BASE_URL}/pipeline/status`,
  PIPELINE_DOMAIN: `${API_BASE_URL}/pipeline/domain`,
  PIPELINE_DEADLINES: `${API_BASE_URL}/pipeline/deadlines`,
  PIPELINE_KPIS: `${API_BASE_URL}/pipeline/kpis`,

  // Reports
  REPORTS_YEARLY_VALUE: `${API_BASE_URL}/reports/yearly-value`,
  REPORTS_WIN_RATE: `${API_BASE_URL}/reports/win-rate-trend`,
  REPORTS_YEAR_SUMMARY: `${API_BASE_URL}/reports/year-summary`,
  REPORTS_QUARTERLY: `${API_BASE_URL}/reports/quarterly`,
  REPORTS_TENDER_TYPE: `${API_BASE_URL}/reports/tender-type`,
  REPORTS_LEAD_OWNER: `${API_BASE_URL}/reports/lead-owner`,
};
```

### 2. Create API Service Layer

```javascript
// src/services/api.js
import { API_ENDPOINTS } from '../api/config';

class APIService {
  async fetchData(endpoint, params = {}) {
    try {
      const url = new URL(endpoint);
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Dashboard APIs
  getDashboardMonthData(fy = '2026') {
    return this.fetchData(API_ENDPOINTS.DASHBOARD_MONTH_DATA, { fy });
  }

  getDashboardFYSummary(fy = '2026') {
    return this.fetchData(API_ENDPOINTS.DASHBOARD_FY_SUMMARY, { fy });
  }

  getDashboardKPIs(fy = '2026') {
    return this.fetchData(API_ENDPOINTS.DASHBOARD_KPIS, { fy });
  }

  // Analytics APIs
  getAnalyticsFiveYears() {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_FIVE_YEAR);
  }

  getLeadOutcomes() {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_LEAD_OUTCOMES);
  }

  getMonthlyTrend(fy = null) {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_MONTHLY_TREND, { fy });
  }

  getCivilDefence() {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_CIVIL_DEFENCE);
  }

  getLeadSubTypes() {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_LEAD_SUBTYPES);
  }

  getDomainPerformance(domain = null) {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_DOMAIN_PERFORMANCE, { domain });
  }

  getTopCustomers(limit = 10) {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_TOP_CUSTOMERS, { limit });
  }

  getLostLeads(domain = null, limit = null) {
    const params = {};
    if (domain) params.domain = domain;
    if (limit) params.limit = limit;
    return this.fetchData(API_ENDPOINTS.ANALYTICS_LOST_LEADS, params);
  }

  getBQConversion() {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_BQ_CONVERSION);
  }

  getOrderDistribution() {
    return this.fetchData(API_ENDPOINTS.ANALYTICS_ORDER_DISTRIBUTION);
  }

  // Pipeline APIs
  getPipelineStatus() {
    return this.fetchData(API_ENDPOINTS.PIPELINE_STATUS);
  }

  getPipelineDomain(domain = null) {
    return this.fetchData(API_ENDPOINTS.PIPELINE_DOMAIN, { domain });
  }

  getUpcomingDeadlines(status = null) {
    return this.fetchData(API_ENDPOINTS.PIPELINE_DEADLINES, { status });
  }

  getPipelineKPIs() {
    return this.fetchData(API_ENDPOINTS.PIPELINE_KPIS);
  }

  // Reports APIs
  getYearlyValue() {
    return this.fetchData(API_ENDPOINTS.REPORTS_YEARLY_VALUE);
  }

  getWinRateTrend() {
    return this.fetchData(API_ENDPOINTS.REPORTS_WIN_RATE);
  }

  getYearSummary() {
    return this.fetchData(API_ENDPOINTS.REPORTS_YEAR_SUMMARY);
  }

  getQuarterlyData(fy = null) {
    return this.fetchData(API_ENDPOINTS.REPORTS_QUARTERLY, { fy });
  }

  getTenderType() {
    return this.fetchData(API_ENDPOINTS.REPORTS_TENDER_TYPE);
  }

  getLeadOwnerPerformance() {
    return this.fetchData(API_ENDPOINTS.REPORTS_LEAD_OWNER);
  }
}

export default new APIService();
```

---

## Update Components

### Example: DashboardOverview.js

**Before (using mock data):**
```javascript
import * as mockData from '../mockData';

export default function DashboardOverview() {
  return (
    <Box>
      <FiveYearChart data={mockData.fiveYearData} />
      <LeadOutcomesChart data={mockData.leadOutcomesData} />
    </Box>
  );
}
```

**After (using API):**
```javascript
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export default function DashboardOverview() {
  const [data, setData] = useState({
    fiveYearData: [],
    leadOutcomes: [],
    monthlyTrend: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fiveYear, outcomes, monthly] = await Promise.all([
        apiService.getAnalyticsFiveYears(),
        apiService.getLeadOutcomes(),
        apiService.getMonthlyTrend(),
      ]);

      setData({
        fiveYearData: fiveYear,
        leadOutcomes: outcomes,
        monthlyTrend: monthly,
        loading: false,
        error: null,
      });
    } catch (error) {
      setData(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  if (data.loading) return <Box>Loading...</Box>;
  if (data.error) return <Box>Error: {data.error}</Box>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ChartCard title="5-year order history">
            <FiveYearChart data={data.fiveYearData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard title="Lead outcomes">
            <LeadOutcomesChart data={data.leadOutcomes} />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
```

---

## Component Integration Examples

### 1. KPI Grid Component

```javascript
// src/components/KPIGrid.js
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export default function KPIGrid({ section = 'dashboard' }) {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        let data;
        if (section === 'dashboard') {
          data = await apiService.getDashboardKPIs();
        } else if (section === 'analytics') {
          data = await apiService.getAnalyticsKPIs();
        } else if (section === 'pipeline') {
          data = await apiService.getPipelineKPIs();
        }
        
        // Transform API response to component format
        const kpiCards = Object.entries(data).map(([key, value]) => ({
          label: formatLabel(key),
          value,
        }));
        
        setKpis(kpiCards);
      } catch (error) {
        console.error('Error loading KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKPIs();
  }, [section]);

  if (loading) return <Box>Loading KPIs...</Box>;

  return (
    <Grid container spacing={2}>
      {kpis.map((kpi, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Card>
            <CardContent>
              <Typography variant="small">{kpi.label}</Typography>
              <Typography variant="h4">{kpi.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
```

### 2. Lost Leads Table Component

```javascript
// src/components/LostLeadsTable.js
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress 
} from '@mui/material';
import apiService from '../services/api';

export default function LostLeadsTable() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await apiService.getLostLeads();
        setLeads(data);
      } catch (error) {
        console.error('Error loading lost leads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tender Name</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Domain</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Competitor</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.tenderName}</TableCell>
              <TableCell>{lead.customer}</TableCell>
              <TableCell>{lead.domain}</TableCell>
              <TableCell>{lead.value}</TableCell>
              <TableCell>{lead.competitor}</TableCell>
              <TableCell>{lead.reason}</TableCell>
              <TableCell>{lead.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

### 3. With Fiscal Year Filter

```javascript
// src/views/DashboardOverview.js
import { useState, useEffect } from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import apiService from '../services/api';

export default function DashboardOverview() {
  const [fy, setFY] = useState('2026');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [fy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const monthData = await apiService.getDashboardMonthData(fy);
      const summary = await apiService.getDashboardFYSummary(fy);
      
      setData({ monthData, summary });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Select value={fy} onChange={(e) => setFY(e.target.value)}>
        <MenuItem value="2026">FY 2026</MenuItem>
        <MenuItem value="2025">FY 2025</MenuItem>
        <MenuItem value="2024">FY 2024</MenuItem>
      </Select>

      {loading ? <Box>Loading...</Box> : (
        <Box>
          {/* Your charts here using data */}
        </Box>
      )}
    </Box>
  );
}
```

---

## Environment Setup

### 1. Create `.env` in frontend root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Use in your app:

```javascript
// Available via process.env.REACT_APP_API_URL
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

---

## Run Both Servers

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## Error Handling Best Practice

```javascript
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await apiService.getData();
    // Process result
  } catch (err) {
    setError(err.message);
    console.error('API Error:', err);
  } finally {
    setLoading(false);
  }
};
```

---

## API Call Patterns

### Pattern 1: Single Fetch
```javascript
useEffect(() => {
  apiService.getLeadOutcomes()
    .then(data => setData(data))
    .catch(err => setError(err.message));
}, []);
```

### Pattern 2: Multiple Parallel Fetches
```javascript
useEffect(() => {
  Promise.all([
    apiService.getLeadOutcomes(),
    apiService.getMonthlyTrend(),
    apiService.getDomainPerformance(),
  ])
    .then(([outcomes, trend, domains]) => {
      setData({ outcomes, trend, domains });
    })
    .catch(err => setError(err.message));
}, []);
```

### Pattern 3: Sequential with Dependencies
```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const outcomes = await apiService.getLeadOutcomes();
      // Use outcomes in next call
      const domain = await apiService.getDomainPerformance(
        outcomes[0].name
      );
      setData({ outcomes, domain });
    } catch (err) {
      setError(err.message);
    }
  };

  loadData();
}, []);
```

---

## Testing API Integration

### Test individual endpoints:
```bash
# Dashboard
curl http://localhost:5000/api/dashboard/kpis

# Analytics
curl http://localhost:5000/api/analytics/five-year-trend

# Pipeline
curl http://localhost:5000/api/pipeline/deadlines

# Reports
curl http://localhost:5000/api/reports/year-summary
```

### Browser Development Tools:
```javascript
// In browser console:
fetch('http://localhost:5000/api/dashboard/month-data?fy=2026')
  .then(r => r.json())
  .then(d => console.log(d.data));
```

---

## CORS Configuration

The backend allows requests from frontend:

```javascript
// server.js - Already configured
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

If you get CORS errors:
1. Ensure backend is running on port 5000
2. Ensure frontend is running on port 3000
3. Check `.env` in backend has proper FRONTEND_URL

---

## Migration Checklist

- [ ] Create `src/api/config.js` with endpoints
- [ ] Create `src/services/api.js` with APIService class
- [ ] Update components to use API instead of mockData
- [ ] Remove mockData imports
- [ ] Test each component with backend
- [ ] Set up environment variables
- [ ] Remove mock data file after migration
- [ ] Update documentation

---

## Rollback to Mock Data

If you need to revert:

```javascript
// Temporarily use mock data for testing
import * as mockData from '../mockData';

// Use directly in component:
const data = mockData.fiveYearData;

// Or create a wrapper:
const useChartData = (chart) => {
  return mockData[`${chart}Data`];
};
```

---

Version: 1.0.0  
Last Updated: March 24, 2026
