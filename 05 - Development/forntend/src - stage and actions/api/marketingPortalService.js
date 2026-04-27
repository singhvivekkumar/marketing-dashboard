/**
 * Marketing Portal API Services
 * Handles all API calls for the Marketing Portal modules
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Leads Module Services
 */
export const leadService = {
  /**
   * Fetch all leads with optional filters
   * @param {Object} filters - Filter parameters (sector, status, owner, etc.)
   * @returns {Promise<Array>} Array of leads
   */
  getAllLeads: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/leads?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return await response.json();
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  /**
   * Fetch single lead by ID
   * @param {string} leadId - Lead reference ID
   * @returns {Promise<Object>} Lead details
   */
  getLeadById: async (leadId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`);
      if (!response.ok) throw new Error('Failed to fetch lead');
      return await response.json();
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  },

  /**
   * Create new lead
   * @param {Object} leadData - Lead information
   * @returns {Promise<Object>} Created lead with ID
   */
  createLead: async (leadData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      if (!response.ok) throw new Error('Failed to create lead');
      return await response.json();
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  /**
   * Update lead details
   * @param {string} leadId - Lead ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated lead
   */
  updateLead: async (leadId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update lead');
      return await response.json();
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  /**
   * Update lead stage
   * @param {string} leadId - Lead ID
   * @param {string} newStage - New stage value
   * @param {string} remarks - Stage update remarks
   * @returns {Promise<Object>} Updated lead
   */
  updateLeadStage: async (leadId, newStage, remarks = '') => {
    return leadService.updateLead(leadId, { stage: newStage, remarks });
  },
};

/**
 * Tender Module Services
 */
export const tenderService = {
  /**
   * Fetch all tenders
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} Array of tenders
   */
  getAllTenders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/tenders?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch tenders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tenders:', error);
      throw error;
    }
  },

  /**
   * Fetch tender by ID
   * @param {string} tenderId - Tender reference ID
   * @returns {Promise<Object>} Tender details
   */
  getTenderById: async (tenderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tenders/${tenderId}`);
      if (!response.ok) throw new Error('Failed to fetch tender');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tender:', error);
      throw error;
    }
  },

  /**
   * Create new tender
   * @param {Object} tenderData - Tender information
   * @returns {Promise<Object>} Created tender
   */
  createTender: async (tenderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tenders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenderData),
      });
      if (!response.ok) throw new Error('Failed to create tender');
      return await response.json();
    } catch (error) {
      console.error('Error creating tender:', error);
      throw error;
    }
  },

  /**
   * Update tender stage
   * @param {string} tenderId - Tender ID
   * @param {string} newStage - New stage
   * @returns {Promise<Object>} Updated tender
   */
  updateTenderStage: async (tenderId, newStage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tenders/${tenderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!response.ok) throw new Error('Failed to update tender');
      return await response.json();
    } catch (error) {
      console.error('Error updating tender:', error);
      throw error;
    }
  },
};

/**
 * Dashboard & Analytics Services
 */
export const analyticsService = {
  /**
   * Fetch dashboard data
   * @returns {Promise<Object>} Dashboard metrics
   */
  getDashboardMetrics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/metrics`);
      if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  /**
   * Fetch pipeline data
   * @returns {Promise<Object>} Pipeline information
   */
  getPipelineData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pipeline`);
      if (!response.ok) throw new Error('Failed to fetch pipeline data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pipeline data:', error);
      throw error;
    }
  },

  /**
   * Fetch analytics trends
   * @returns {Promise<Object>} Analytics data
   */
  getAnalyticsTrends: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/trends`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
};

/**
 * Budgetary Quotation Services
 */
export const bqService = {
  /**
   * Fetch all BQs
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Array>} Array of BQs
   */
  getAllBQs: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/bq?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch BQs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching BQs:', error);
      throw error;
    }
  },

  /**
   * Fetch BQ by reference ID
   * @param {string} bqId - BQ reference ID
   * @returns {Promise<Object>} BQ details
   */
  getBQById: async (bqId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bq/${bqId}`);
      if (!response.ok) throw new Error('Failed to fetch BQ');
      return await response.json();
    } catch (error) {
      console.error('Error fetching BQ:', error);
      throw error;
    }
  },

  /**
   * Create BQ from lead
   * @param {string} leadId - Lead reference ID
   * @param {Object} bqData - BQ information
   * @returns {Promise<Object>} Created BQ
   */
  createBQFromLead: async (leadId, bqData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}/bq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bqData),
      });
      if (!response.ok) throw new Error('Failed to create BQ');
      return await response.json();
    } catch (error) {
      console.error('Error creating BQ:', error);
      throw error;
    }
  },
};

/**
 * Approval & Audit Services
 */
export const approvalService = {
  /**
   * Fetch approval chain for a lead/tender
   * @param {string} entityId - Entity ID (lead/tender)
   * @param {string} entityType - Type of entity ('lead' or 'tender')
   * @returns {Promise<Array>} Approval chain
   */
  getApprovalChain: async (entityId, entityType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${entityType}s/${entityId}/approvals`);
      if (!response.ok) throw new Error('Failed to fetch approvals');
      return await response.json();
    } catch (error) {
      console.error('Error fetching approvals:', error);
      throw error;
    }
  },

  /**
   * Submit for approval
   * @param {string} entityId - Entity ID
   * @param {string} entityType - Type of entity
   * @param {Array<string>} approverIds - IDs of approvers
   * @returns {Promise<Object>} Approval submission result
   */
  submitForApproval: async (entityId, entityType, approverIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${entityType}s/${entityId}/submit-approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverIds }),
      });
      if (!response.ok) throw new Error('Failed to submit for approval');
      return await response.json();
    } catch (error) {
      console.error('Error submitting for approval:', error);
      throw error;
    }
  },

  /**
   * Fetch audit log for an entity
   * @param {string} entityId - Entity ID
   * @param {string} entityType - Type of entity
   * @returns {Promise<Array>} Audit log entries
   */
  getAuditLog: async (entityId, entityType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${entityType}s/${entityId}/audit-log`);
      if (!response.ok) throw new Error('Failed to fetch audit log');
      return await response.json();
    } catch (error) {
      console.error('Error fetching audit log:', error);
      throw error;
    }
  },
};

/**
 * Export & Reporting Services
 */
export const exportService = {
  /**
   * Export data as CSV
   * @param {string} moduleType - Module to export (leads, tenders, etc.)
   * @param {Object} filters - Optional filters
   * @returns {Promise<Blob>} CSV file blob
   */
  exportToCSV: async (moduleType, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/${moduleType}/export?${queryParams}&format=csv`);
      if (!response.ok) throw new Error('Failed to export data');
      return await response.blob();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  /**
   * Export data as PDF
   * @param {string} moduleType - Module to export
   * @param {Object} filters - Optional filters
   * @returns {Promise<Blob>} PDF file blob
   */
  exportToPDF: async (moduleType, filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/${moduleType}/export?${queryParams}&format=pdf`);
      if (!response.ok) throw new Error('Failed to export data');
      return await response.blob();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },
};
