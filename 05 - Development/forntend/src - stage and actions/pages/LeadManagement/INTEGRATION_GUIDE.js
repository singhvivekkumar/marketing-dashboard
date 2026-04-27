// ============================================================================
// LEAD MANAGEMENT UI - INTEGRATION GUIDE
// ============================================================================

/**
 * HOW TO USE THE LEAD MANAGEMENT SYSTEM
 * 
 * This guide explains how to integrate the lead management UI components
 * with your React application.
 */

// ============================================================================
// 1. SETUP
// ============================================================================

/**
 * Step 1: Install required dependencies
 * npm install @mui/material @emotion/react @emotion/styled axios
 */

/**
 * Step 2: Add routes to your App.jsx or Router
 */

import { LeadDashboard } from './pages/LeadManagement';

const AppRoutes = () => (
  <Routes>
    <Route path="/leads" element={<LeadDashboard />} />
    {/* Other routes */}
  </Routes>
);

// ============================================================================
// 2. USAGE IN YOUR APP
// ============================================================================

/**
 * COMPONENT: LeadDashboard
 * 
 * Main component that displays the complete lead management interface
 * 
 * Location: pages/LeadManagement/LeadDashboard.jsx
 * 
 * Features:
 * - Lead statistics cards (Total, Active, In Qualification, Under Evaluation)
 * - Three view modes:
 *   1. Pipeline View - Kanban-style board showing leads in different stages
 *   2. Lead Details - Detailed view with all information and stage management
 *   3. List View - Table with filters and search
 * - Create new lead form
 * - Lead search and filtering
 * 
 * Data Flow:
 * 1. Component mounts → fetchLeads() from API
 * 2. User clicks "Create Lead" → Opens LeadForm dialog
 * 3. User submits form → POST /api/leads
 * 4. User selects lead → Shows LeadDetail component
 * 5. User changes stage → PUT /api/leads/{id}/bidding-process/stage
 */

// Example: Using LeadDashboard in your app
import React from 'react';
import { LeadDashboard } from '@/pages/LeadManagement';

function MarketingPortal() {
  return (
    <div>
      <LeadDashboard />
    </div>
  );
}

export default MarketingPortal;

// ============================================================================
// 3. COMPONENT HIERARCHY
// ============================================================================

/**
 * LeadDashboard (Main Container)
 * ├── Header with "Create Lead" button
 * ├── Stats Cards (4 cards)
 * ├── Tabs
 * │   ├── Tab 0: StagePipeline
 * │   │   └── 6 Stage Columns (Pre-Qual, Tech, Commercial, Eval, Result, Closed)
 * │   │       └── Lead Cards (clickable, hover effects)
 * │   ├── Tab 1: LeadDetail / EnhancedLeadDetail
 * │   │   ├── Lead Header
 * │   │   ├── Tabs
 * │   │   │   ├── Tender Details
 * │   │   │   ├── Bidding Process (with StageManagement)
 * │   │   │   ├── Stage History
 * │   │   │   ├── Documents
 * │   │   │   └── Timeline
 * │   │   └── StageManagement
 * │   │       └── Stepper with Stage Forms
 * │   │           ├── PreQualificationForm
 * │   │           ├── TechnicalBidForm
 * │   │           ├── CommercialBidForm
 * │   │           ├── EvaluationRoundForm
 * │   │           └── ResultForm
 * │   └── Tab 2: LeadList
 * │       ├── Search/Filter bar
 * │       └── Table with pagination
 * └── LeadForm Dialog (Create Modal)
 */

// ============================================================================
// 4. API INTEGRATION
// ============================================================================

/**
 * All API calls are handled through services/leadsAPI.js
 * 
 * Available API methods:
 */

import {
  leadsAPI,
  biddingProcessAPI,
  preQualificationAPI,
  technicalBidAPI,
  commercialBidAPI,
  evaluationAPI,
  resultsAPI,
  ordersAPI,
  analyticsAPI,
} from '@/services/leadsAPI';

// Example: Fetch leads
async function fetchLeads() {
  try {
    const response = await leadsAPI.getLeads({
      stage: 'Technical Qualification',
      limit: 50,
    });
    console.log('Leads:', response.data);
  } catch (error) {
    console.error('Error fetching leads:', error);
  }
}

// Example: Create lead
async function createNewLead(formData) {
  try {
    const response = await leadsAPI.createLead({
      tenderName: formData.tenderName,
      tenderType: formData.tenderType,
      // ... other fields
    });
    console.log('Lead created:', response.data);
  } catch (error) {
    console.error('Error creating lead:', error);
  }
}

// Example: Update stage
async function changeStage(leadId, newStage) {
  try {
    const response = await biddingProcessAPI.updateStage(leadId, newStage);
    console.log('Stage updated:', response.data);
  } catch (error) {
    console.error('Error updating stage:', error);
  }
}

// Example: Submit pre-qualification
async function submitPreQual(leadId, formData) {
  try {
    const response = await preQualificationAPI.submitPreQualification(leadId, formData);
    console.log('Pre-qualification submitted:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================================================
// 5. WORKFLOW: CREATING AND MANAGING A LEAD
// ============================================================================

/**
 * WORKFLOW: Complete Lead Lifecycle
 * 
 * Step 1: CREATE LEAD
 * ─────────────────
 * User fills LeadForm with:
 *   - Tender Name, Reference No
 *   - Tender Type, Document Type
 *   - Portal, Sector, Domain
 *   - Estimated Value
 *   - Last Submission Date
 * 
 * POST /api/leads
 * Response: {id, tenderName, ...}
 * Auto-creates: bidding_process with current_stage = 'Pre-Qualification'
 * 
 * 
 * Step 2: PRE-QUALIFICATION
 * ─────────────────────────
 * User navigates to Lead Detail → Bidding Process tab
 * StageManagement stepper shows Pre-Qualification stage
 * User clicks "Enter Data" → PreQualificationForm opens
 * Form captures:
 *   - Turnover criteria met (checkbox + document)
 *   - Experience criteria met (checkbox + document)
 *   - MSME/Startup status
 *   - Submission date
 *   - PQ submission package
 * 
 * POST /api/leads/{id}/pre-qualification
 * 
 * 
 * Step 3: TECHNICAL QUALIFICATION
 * ────────────────────────────────
 * User clicks "Change Stage" → Selects 'Technical Qualification'
 * PUT /api/leads/{id}/bidding-process/stage
 * 
 * User enters technical bid data:
 *   - Submission date, mode, receipt no
 *   - Technical compliance details
 *   - Deviations noted
 *   - Customer queries & our response
 *   - Technical eval result
 * 
 * POST /api/leads/{id}/technical-bid
 * 
 * 
 * Step 4: COMMERCIAL QUALIFICATION
 * ─────────────────────────────────
 * User advances to Commercial stage
 * Enters pricing data:
 *   - Bid price, GST, final price
 *   - EMD details (amount, paid date, bank)
 *   - PBG details if required
 *   - Submission details
 * 
 * POST /api/leads/{id}/commercial-bid
 * 
 * 
 * Step 5: EVALUATION
 * ──────────────────
 * Might have multiple evaluation rounds
 * Each round:
 *   - Customer asks queries
 *   - We respond
 *   - Status updated
 * 
 * POST /api/leads/{id}/evaluation-rounds (can add multiple)
 * PUT /api/leads/{id}/evaluation-rounds/{roundId}
 * 
 * 
 * Step 6: RESULT
 * ──────────────
 * Customer announces result (L1, L2, L3, etc.)
 * User enters:
 *   - Our L-position
 *   - Our bid price vs L1 price
 *   - Negotiation details (if applicable)
 *   - Final outcome (Won/Lost)
 *   - Loss reason if lost
 *   - Order value if won
 * 
 * POST /api/leads/{id}/result
 * 
 * 
 * Step 7: ORDERS (If Won)
 * ──────────────────────
 * When order is received:
 * POST /api/leads/{id}/order
 * Captures:
 *   - PO/WO number
 *   - Order received date
 *   - Order value
 *   - Delivery period
 *   - Contract documents
 */

// ============================================================================
// 6. KEY FEATURES BY COMPONENT
// ============================================================================

/**
 * LEAD LIST VIEW
 * ──────────────
 * Table showing all leads with:
 * - Tender name, reference, domain
 * - Sector (Civil/Defence)
 * - Tender type
 * - Value in crores
 * - Current stage (with color chip)
 * - Outcome (Won/Lost/Pending)
 * - Action buttons (View, Edit)
 * - Search and filter
 * - Pagination
 * 
 * Colors:
 * - Blue (Civil), Purple (Defence)
 * - Green (Success), Red (Error), Orange (Warning)
 */

/**
 * PIPELINE VIEW (KANBAN BOARD)
 * ─────────────────────────────
 * 6 columns representing stages:
 * 1. Pre-Qualification (Blue)
 * 2. Technical Qualification (Orange)
 * 3. Commercial Qualification (Purple)
 * 4. Evaluation (Green)
 * 5. Result (Pink)
 * 6. Closed (Gray)
 * 
 * Each column shows:
 * - Count of leads
 * - Total value in that stage
 * - Lead cards (clickable)
 * 
 * Card shows:
 * - Tender name (truncated)
 * - Reference
 * - Domain, Subtype
 * - Value
 * - Outcome status
 * - Click to view details
 */

/**
 * STAGE MANAGEMENT STEPPER
 * ────────────────────────
 * Visual stepper showing all stages:
 * 1. ✓ Pre-Qualification (completed)
 * 2. ⏳ Technical Qualification (in progress)
 * 3. ⏳ Commercial Qualification (pending)
 * 4. ⏳ Evaluation (pending)
 * 5. 🏆 Result (pending)
 * 
 * For each stage:
 * - Click "Enter Data" to open form
 * - Click "View/Edit" to modify existing data
 * 
 * Current stage shows:
 * - Days spent in stage
 * - Health status (Green/Amber/Red)
 * - Go/No-Go decision
 * - Overdue indicator
 */

/**
 * EVALUATION ROUNDS
 * ─────────────────
 * Special handling for Evaluation stage
 * Can add multiple rounds:
 * - Technical Clarification
 * - Financial Clarification
 * - Negotiation
 * - Reverse Auction
 * - Presentation/Demo
 * - Site Visit
 * 
 * Each round tracks:
 * - Customer queries
 * - Our response
 * - Status (Pending/Submitted/Closed)
 * - Documents
 */

// ============================================================================
// 7. DATA STRUCTURE
// ============================================================================

/**
 * COMPLETE LEAD OBJECT (from API)
 */
const leadObject = {
  // Tender Core
  id: 'uuid',
  tenderName: 'string',
  tenderReferenceNo: 'string',
  tenderType: 'Open|Limited|Single Source|Nomination|Rate Contract',
  documentType: 'RFP|RFQ|NIT|EOI|GeM Bid',
  portalName: 'GeM|CPPP|eProcurement|Defence Portal|Direct',

  // Classification
  civilDefence: 'Civil|Defence|Both',
  businessDomain: 'string',
  leadSubtype: 'Domestic|Export|CRM|Government|JV|Other',
  soleConsortium: 'Sole|Consortium',

  // Financial
  estimatedValueCr: 'number',
  submittedValueCr: 'number',
  emdValue: 'number',
  orderWonValueCr: 'number',

  // Timeline
  tenderDated: 'date',
  lastSubmissionDate: 'date',
  biddingProcess: {
    id: 'uuid',
    currentStage: 'Pre-Qualification|Technical Qualification|Commercial Qualification|Evaluation|Result|Closed',
    goNoGoDecision: 'Go|No-Go|Pending',
    healthStatus: 'Green|Amber|Red',
    daysInCurrentStage: 'number',
    isOverdue: 'boolean',
    priority: 'Low|Normal|High|Critical',
  },

  // Outcome
  outcome: 'Won|Lost|Pending|Not-Participated|Withdrawn|Cancelled',
  openClosed: 'Open|Closed',
  reasonForLosing: 'string (if Lost)',

  // Customer
  customer: {
    id: 'uuid',
    companyName: 'string',
    contactPerson: 'string',
    email: 'string',
    phone: 'string',
    address: 'string',
    city: 'string',
    state: 'string',
    pincode: 'string',
  },

  // Audit
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  createdBy: 'uuid',
};

// ============================================================================
// 8. ENVIRONMENT SETUP
// ============================================================================

/**
 * .env Configuration
 */
const envConfig = {
  REACT_APP_API_URL: 'http://localhost:5000/api',
  REACT_APP_AUTH_TOKEN: 'stored in localStorage after login',
};

/**
 * Backend Requirements
 */
const backendRequirements = {
  database: 'PostgreSQL with schema from lead_management_redesign.sql',
  endpoints: 'All routes defined in backend/routes/leadManagement.routes.js',
  authentication: 'JWT token required in Authorization header',
  CORS: 'Configured for localhost:3000 (frontend)',
};

// ============================================================================
// 9. ERROR HANDLING
// ============================================================================

/**
 * API Errors are handled by axios interceptor
 * Add custom error handling in your app:
 */

import api from '@/services/leadsAPI';

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Show permission denied
      console.error('Permission denied');
    } else if (error.response?.status === 404) {
      // Resource not found
      console.error('Resource not found');
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// 10. CUSTOMIZATION POINTS
// ============================================================================

/**
 * To customize colors, themes, or behaviors:
 * 1. Edit component styles (sx prop in MUI components)
 * 2. Create custom Material-UI theme
 * 3. Override API base URL in .env
 * 4. Add new fields to forms (update SQL schema first)
 * 5. Create new stage types or evaluation round types
 * 6. Add file upload handlers
 * 7. Integrate with your notification/toast system
 * 8. Connect to your analytics API
 * 9. Add role-based access control
 * 10. Implement custom caching logic
 */

export const apiMethods = [
  'leadsAPI','biddingProcessAPI','preQualificationAPI','technicalBidAPI',
  'commercialBidAPI','evaluationAPI','resultsAPI',
];

export const integrationGuide = {
  setupGuide: true,
  components: [ /* ... */ ],
  apiMethods,
};

// export default integrationGuide;
