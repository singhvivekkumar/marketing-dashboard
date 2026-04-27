import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// LEADS API
export const leadsAPI = {
  // Get all leads
  getLeads: (filters = {}) => api.get('/leads', { params: filters }),

  // Get lead by ID
  getLeadById: (id) => api.get(`/leads/${id}`),

  // Create new lead
  createLead: (data) => api.post('/leads', data),

  // Update lead
  updateLead: (id, data) => api.put(`/leads/${id}`, data),

  // Delete lead
  deleteLead: (id) => api.delete(`/leads/${id}`),

  // Get leads by stage
  getLeadsByStage: (stage) => api.get('/leads/stage/' + stage),

  // Search leads
  searchLeads: (query) => api.get('/leads/search', { params: { q: query } }),
};

// BIDDING PROCESS API
export const biddingProcessAPI = {
  // Get bidding process for a lead
  getBiddingProcess: (leadId) => api.get(`/leads/${leadId}/bidding-process`),

  // Create bidding process
  createBiddingProcess: (leadId, data) => api.post(`/leads/${leadId}/bidding-process`, data),

  // Update bidding process stage
  updateStage: (leadId, stage) =>
    api.put(`/leads/${leadId}/bidding-process/stage`, { currentStage: stage }),

  // Get stage history
  getStageHistory: (leadId) => api.get(`/leads/${leadId}/stage-history`),

  // Change go/no-go decision
  updateGoNoGo: (leadId, decision, reason) =>
    api.put(`/leads/${leadId}/bidding-process/go-no-go`, {
      goNoGoDecision: decision,
      reason,
    }),
};

// PRE-QUALIFICATION API
export const preQualificationAPI = {
  // Get pre-qualification
  getPreQualification: (leadId) => api.get(`/leads/${leadId}/pre-qualification`),

  // Submit pre-qualification
  submitPreQualification: (leadId, data) =>
    api.post(`/leads/${leadId}/pre-qualification`, data),

  // Update pre-qualification
  updatePreQualification: (leadId, data) =>
    api.put(`/leads/${leadId}/pre-qualification`, data),
};

// TECHNICAL BID API
export const technicalBidAPI = {
  // Get technical bid
  getTechnicalBid: (leadId) => api.get(`/leads/${leadId}/technical-bid`),

  // Submit technical bid
  submitTechnicalBid: (leadId, data) =>
    api.post(`/leads/${leadId}/technical-bid`, data),

  // Update technical bid
  updateTechnicalBid: (leadId, data) =>
    api.put(`/leads/${leadId}/technical-bid`, data),

  // Upload technical compliance documents
  uploadTechDocuments: (leadId, files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    return api.post(`/leads/${leadId}/technical-bid/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// COMMERCIAL BID API
export const commercialBidAPI = {
  // Get commercial bid
  getCommercialBid: (leadId) => api.get(`/leads/${leadId}/commercial-bid`),

  // Submit commercial bid
  submitCommercialBid: (leadId, data) =>
    api.post(`/leads/${leadId}/commercial-bid`, data),

  // Update commercial bid
  updateCommercialBid: (leadId, data) =>
    api.put(`/leads/${leadId}/commercial-bid`, data),

  // Track EMD payment
  updateEMDStatus: (leadId, emdData) =>
    api.put(`/leads/${leadId}/commercial-bid/emd`, emdData),

  // Track PBG
  updatePBGStatus: (leadId, pbgData) =>
    api.put(`/leads/${leadId}/commercial-bid/pbg`, pbgData),
};

// EVALUATION ROUNDS API
export const evaluationAPI = {
  // Get all evaluation rounds
  getEvaluationRounds: (leadId) =>
    api.get(`/leads/${leadId}/evaluation-rounds`),

  // Get specific evaluation round
  getEvaluationRound: (leadId, roundId) =>
    api.get(`/leads/${leadId}/evaluation-rounds/${roundId}`),

  // Add evaluation round
  addEvaluationRound: (leadId, data) =>
    api.post(`/leads/${leadId}/evaluation-rounds`, data),

  // Update evaluation round
  updateEvaluationRound: (leadId, roundId, data) =>
    api.put(`/leads/${leadId}/evaluation-rounds/${roundId}`, data),

  // Submit response to queries
  submitRoundResponse: (leadId, roundId, response) =>
    api.put(`/leads/${leadId}/evaluation-rounds/${roundId}/response`, response),
};

// RESULTS API
export const resultsAPI = {
  // Get result
  getResult: (leadId) => api.get(`/leads/${leadId}/result`),

  // Submit result
  submitResult: (leadId, data) =>
    api.post(`/leads/${leadId}/result`, data),

  // Update result
  updateResult: (leadId, data) =>
    api.put(`/leads/${leadId}/result`, data),

  // Record negotiation
  recordNegotiation: (leadId, negotiationData) =>
    api.put(`/leads/${leadId}/result/negotiation`, negotiationData),
};

// ORDERS API
export const ordersAPI = {
  // Get order details
  getOrder: (leadId) => api.get(`/leads/${leadId}/order`),

  // Create order received
  createOrder: (leadId, data) =>
    api.post(`/leads/${leadId}/order`, data),

  // Update order
  updateOrder: (leadId, data) =>
    api.put(`/leads/${leadId}/order`, data),

  // Get all orders
  getAllOrders: (filters = {}) =>
    api.get('/orders', { params: filters }),
};

// ANALYTICS API
export const analyticsAPI = {
  // Get stage-wise analytics
  getStageAnalytics: () => api.get('/analytics/stage-distribution'),

  // Get outcome analytics
  getOutcomeAnalytics: () => api.get('/analytics/outcomes'),

  // Get value analytics
  getValueAnalytics: () => api.get('/analytics/value-distribution'),

  // Get win rate
  getWinRate: (filters = {}) =>
    api.get('/analytics/win-rate', { params: filters }),

  // Get conversion rate (EOI -> BQ -> Tender -> Order)
  getConversionRate: () => api.get('/analytics/conversion-rate'),

  // Get pipeline value
  getPipelineValue: (stage) =>
    api.get('/analytics/pipeline-value', { params: { stage } }),

  // Get lead owner performance
  getOwnerPerformance: () =>
    api.get('/analytics/owner-performance'),

  // Get domain wise analytics
  getDomainAnalytics: () =>
    api.get('/analytics/domain-analytics'),
};

// ALERTS API
export const alertsAPI = {
  // Get pending alerts
  getPendingAlerts: () => api.get('/alerts/pending'),

  // Get alerts for a lead
  getLeadAlerts: (leadId) => api.get(`/leads/${leadId}/alerts`),

  // Mark alert as read
  markAlertAsRead: (alertId) =>
    api.put(`/alerts/${alertId}/read`),

  // Dismiss alert
  dismissAlert: (alertId) =>
    api.put(`/alerts/${alertId}/dismiss`),
};

// STAGE ACTIONS API
export const stageActionsAPI = {
  // Get stage actions
  getStageActions: (biddingProcessId) =>
    api.get(`/bidding-process/${biddingProcessId}/actions`),

  // Mark action as completed
  completeAction: (actionId, data) =>
    api.put(`/stage-actions/${actionId}/complete`, data),

  // Update action
  updateAction: (actionId, data) =>
    api.put(`/stage-actions/${actionId}`, data),
};

// FILE UPLOAD API
export const filesAPI = {
  // Upload document
  uploadDocument: (leadId, file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    return api.post(`/leads/${leadId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get document
  getDocument: (leadId, documentId) =>
    api.get(`/leads/${leadId}/documents/${documentId}`),

  // Delete document
  deleteDocument: (leadId, documentId) =>
    api.delete(`/leads/${leadId}/documents/${documentId}`),
};

export default api;
