# Marketing Portal - Integration Guide

## Overview

This guide explains how to integrate the React + Material UI Marketing Portal with your existing backend API.

## Quick Start

### 1. Install Dependencies

Ensure all required MUI packages are installed:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### 2. Import Marketing Portal in App.js

The Marketing Portal is already added to your App.js. It's accessible via the sidebar under "Bidding Management" in the Portal section.

### 3. Configure API Endpoints

Update your API base URL in `api/marketingPortalService.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

Add to your `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Integration Examples

### Fetching Leads with Real Data

Replace the mock data in `views/LeadsModule.js`:

```javascript
import { leService } from '../api/marketingPortalService';
import { useEffect, useState } from 'react';

export default function LeadsModule() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await leadService.getAllLeads();
        setLeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    // ... rest of component with leads data
  );
}
```

### Creating a New Lead

```javascript
import { leadService } from '../api/marketingPortalService';

const handleCreateLead = async (formData) => {
  try {
    const newLead = await leadService.createLead({
      projectName: formData.projectName,
      customer: formData.customer,
      leadType: formData.leadType,
      sector: formData.sector,
      market: formData.market,
      domain: formData.domain,
      owner: formData.owner,
      estimatedValue: formData.estimatedValue,
      remarks: formData.remarks,
    });
    
    console.log('Lead created:', newLead);
    // Refresh list or navigate
  } catch (error) {
    console.error('Failed to create lead:', error);
  }
};
```

### Updating Lead Stage

```javascript
import { leadService } from '../api/marketingPortalService';

const handleStageUpdate = async (leadId, newStage, remarks) => {
  try {
    const updated = await leadService.updateLeadStage(leadId, newStage, remarks);
    console.log('Lead stage updated:', updated);
    // Update UI
  } catch (error) {
    console.error('Failed to update stage:', error);
  }
};
```

### Fetching Dashboard Metrics

```javascript
import { analyticsService } from '../api/marketingPortalService';

useEffect(() => {
  const fetchMetrics = async () => {
    try {
      const metrics = await analyticsService.getDashboardMetrics();
      // Update dashboard with metrics
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  fetchMetrics();
}, []);
```

## Backend API Requirements

Ensure your backend exposes the following endpoints:

### Leads API
- `GET /api/leads` - List all leads
- `GET /api/leads/:id` - Get lead details
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `GET /api/leads/:id/approvals` - Get approval chain
- `GET /api/leads/:id/audit-log` - Get audit log

### Tenders API
- `GET /api/tenders` - List all tenders
- `GET /api/tenders/:id` - Get tender details
- `POST /api/tenders` - Create new tender
- `PUT /api/tenders/:id` - Update tender
- `GET /api/tenders/:id/approvals` - Get approvals

### BQ API
- `GET /api/bq` - List all BQs
- `GET /api/bq/:id` - Get BQ details
- `POST /api/leads/:leadId/bq` - Create BQ from lead

### Analytics API
- `GET /api/dashboard/metrics` - Dashboard metrics
- `GET /api/pipeline` - Pipeline data
- `GET /api/analytics/trends` - Analytics trends

### Export API
- `GET /api/{module}/export?format=csv` - Export as CSV
- `GET /api/{module}/export?format=pdf` - Export as PDF

## Expected Data Formats

### Lead Object
```javascript
{
  id: "L-2526-001",
  projectName: "Radar Integration System",
  customer: "BEL, Bengaluru",
  contactPerson: "Shri R.P. Nair",
  leadType: "EOI", // or "RFI", "Customer Input"
  sector: "Defence", // or "Non-Defence"
  market: "Domestic", // or "Export"
  domain: "Electronics",
  stage: "Tech Analysis", // Various stages
  status: "Go", // "Go", "No-Go", "Reviewing", etc.
  owner: "Ravi Kumar",
  estimatedValue: 95, // in Crore
  remarks: "...",
  created: "2026-04-12",
  updated: "2026-04-14"
}
```

### Tender Object
```javascript
{
  id: "T-2526-007",
  leadRef: "L-2526-001",
  tenderRef: "BEL/GM/PROJ/2526/089",
  project: "Radar Integration",
  customer: "BEL",
  stage: "Bid Preparation",
  submissionDate: "2026-04-30",
  value: 95, // in Crore
  emdAmount: 0.95, // in Crore
  owner: "Ravi K.",
  created: "2026-04-10"
}
```

### Approval Chain Object
```javascript
{
  id: "L-2526-001",
  approvals: [
    {
      level: "L1",
      name: "Dept. Head — Electronics",
      role: "Shri K. Venkatraman, DGM",
      status: "Approved", // "Approved", "Pending", "Rejected"
      date: "2026-04-14"
    },
    {
      level: "L2",
      name: "Business Dev Head",
      role: "Ms. Priya Nair, VP — BD",
      status: "Pending",
      date: null
    }
  ]
}
```

## State Management (Optional Enhancement)

For better state management, consider implementing Redux or Context API:

### Example with Context API

```javascript
// contexts/MarketingPortalContext.js
import React, { createContext, useState, useCallback } from 'react';
import { leadService } from '../api/marketingPortalService';

export const MarketingPortalContext = createContext();

export function MarketingPortalProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async (filters) => {
    setLoading(true);
    try {
      const data = await leadService.getAllLeads(filters);
      setLeads(data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createLead = useCallback(async (leadData) => {
    try {
      const newLead = await leadService.createLead(leadData);
      setLeads([...leads, newLead]);
      return newLead;
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  }, [leads]);

  return (
    <MarketingPortalContext.Provider
      value={{ leads, selectedLead, setSelectedLead, fetchLeads, createLead, loading }}
    >
      {children}
    </MarketingPortalContext.Provider>
  );
}
```

## Error Handling

All API service functions throw errors that should be caught:

```javascript
try {
  const data = await leadService.getAllLeads();
} catch (error) {
  // Handle error - show toast, update UI, etc.
  showErrorMessage(error.message);
}
```

## Authentication (If Required)

Add authentication tokens to API calls:

```javascript
// Update marketingPortalService.js
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Use in API calls:
const response = await fetch(url, {
  method: 'GET',
  headers: getHeaders(),
});
```

## Performance Optimization

### 1. Lazy Load Modules
```javascript
const LeadsModule = React.lazy(() => import('../views/LeadsModule'));
const TenderModule = React.lazy(() => import('../views/TenderModule'));

// In component:
<Suspense fallback={<Loading />}>
  {activeModule === 'lead' && <LeadsModule />}
</Suspense>
```

### 2. Implement Caching
```javascript
let leadsCache = null;

export const getAllLeads = async () => {
  if (leadsCache) return leadsCache;
  
  const data = await fetch('/api/leads').then(r => r.json());
  leadsCache = data;
  return data;
};
```

### 3. Use React Query
```javascript
import { useQuery } from 'react-query';

const { data: leads, isLoading } = useQuery('leads', leadService.getAllLeads);
```

## Testing

Example test for API service:

```javascript
// __tests__/marketingPortalService.test.js
import { leadService } from '../api/marketingPortalService';

describe('Lead Service', () => {
  it('should fetch all leads', async () => {
    const leads = await leadService.getAllLeads();
    expect(Array.isArray(leads)).toBe(true);
  });

  it('should create a new lead', async () => {
    const newLead = await leadService.createLead({
      projectName: 'Test Project',
      customer: 'Test Customer',
    });
    expect(newLead.id).toBeDefined();
  });
});
```

## Common Issues & Solutions

### Issue: API calls not working
**Solution**: Check that REACT_APP_API_URL is set in .env and backend is running

### Issue: CORS errors
**Solution**: Enable CORS in backend:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: Components not updating after API calls
**Solution**: Ensure state is updated correctly after API response:
```javascript
const data = await leadService.updateLead(id, updates);
setLeads(leads.map(l => l.id === id ? data : l));
```

## Deployment

### Production Environment Variables
```
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

### Build Command
```bash
npm run build
```

## Support & Debugging

Enable debug logging:

```javascript
// In marketingPortalService.js
const DEBUG = process.env.REACT_APP_DEBUG === 'true';

const log = (msg, data) => {
  if (DEBUG) console.log(`[MarketingPortal] ${msg}`, data);
};
```

---

**Last Updated**: April 2026
**Version**: 2.0
