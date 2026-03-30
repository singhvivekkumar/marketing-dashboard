// frontend/src/api/lifecycle.api.js
import api from './axios.config';

export const lifecycleAPI = {
  // Core CRUD
  create: (data) => api.post('/lifecycle', data),
  list: (params) => api.get('/lifecycle', { params }),
  getOne: (id) => api.get(`/lifecycle/${id}`),
  update: (id, data) => api.put(`/lifecycle/${id}`, data),

  // Stage management
  moveStage: (id, data) => api.put(`/lifecycle/${id}/stage`, data),
  goNoGo: (id, data) => api.put(`/lifecycle/${id}/go-no-go`, data),

  // Actions
  completeAction: (id, actionId, fd) =>
    api.patch(`/lifecycle/${id}/actions/${actionId}`, fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Corrigendums
  addCorrigendum: (id, fd) =>
    api.post(`/lifecycle/${id}/corrigendum`, fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Competitors
  addCompetitor: (id, data) => api.post(`/lifecycle/${id}/competitors`, data),
  updateCompetitor: (id, competitorId, data) => api.put(`/lifecycle/${id}/competitors/${competitorId}`, data),

  // Consortium
  addConsortiumMember: (id, data) => api.post(`/lifecycle/${id}/consortium`, data),

  // Alerts
  myAlerts: () => api.get('/lifecycle/alerts/my'),
  markRead: (alertId) => api.patch(`/lifecycle/alerts/${alertId}/read`),
  dismiss: (alertId) => api.patch(`/lifecycle/alerts/${alertId}/dismiss`),

  // Dashboard & analytics
  dashboardSummary: () => api.get('/lifecycle/dashboard/summary'),
  calendar: () => api.get('/lifecycle/dashboard/calendar'),
  analytics: (p) => api.get('/lifecycle/analytics', { params: p }),
};
