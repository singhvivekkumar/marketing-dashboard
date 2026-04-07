// src/api/index.js  — all API call functions for every module
import api from './axios.config';

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (data)       => api.post('/auth/login', data),
  me:             ()           => api.get('/auth/me'),
  changePassword: (data)       => api.post('/auth/change-password', data),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersAPI = {
  list:       ()           => api.get('/users'),
  create:     (data)       => api.post('/users', data),
  update:     (id, data)   => api.put(`/users/${id}`, data),
  deactivate: (id)         => api.patch(`/users/${id}/deactivate`),
};

// ─── BQ ──────────────────────────────────────────────────────────────────────
export const bqAPI = {
  list:     (params)     => api.get('/bq', { params }),
  create:   (formData)   => api.post('/bq', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getOne:   (id)         => api.get(`/bq/${id}`),
  update:   (id, fd)     => api.put(`/bq/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:   (id)         => api.delete(`/bq/${id}`),
  download: (id)         => api.get(`/bq/${id}/download`, { responseType: 'blob' }),
};

// ─── Leads ───────────────────────────────────────────────────────────────────
export const leadsAPI = {
  list:                (params)       => api.get('/leads', { params }),
  create:              (formData)     => api.post('/leads', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getOne:              (id)           => api.get(`/leads/${id}`),
  update:              (id, fd)       => api.put(`/leads/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:              (id)           => api.delete(`/leads/${id}`),
  addCorrigendum:      (id, fd)       => api.post(`/leads/${id}/corrigendum`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  removeCorrigendum:   (id, cId)      => api.delete(`/leads/${id}/corrigendum/${cId}`),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const ordersAPI = {
  list:    (params)   => api.get('/orders', { params }),
  create:  (fd)       => api.post('/orders', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getOne:  (id)       => api.get(`/orders/${id}`),
  update:  (id, fd)   => api.put(`/orders/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove:  (id)       => api.delete(`/orders/${id}`),
};

// ─── R&D ─────────────────────────────────────────────────────────────────────
export const rndAPI = {
  list:   (params)   => api.get('/rnd', { params }),
  create: (fd)       => api.post('/rnd', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getOne: (id)       => api.get(`/rnd/${id}`),
  update: (id, fd)   => api.put(`/rnd/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id)       => api.delete(`/rnd/${id}`),
};

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsAPI = {
  kpi:           (params) => api.get('/analytics/kpi',           { params }),
  orders5year:   (params) => api.get('/analytics/orders-5year',  { params }),
  leadOutcomes:  (params) => api.get('/analytics/lead-outcomes', { params }),
  leadPipeline:  (params) => api.get('/analytics/lead-pipeline', { params }),
  leadSubtypes:  (params) => api.get('/analytics/lead-subtypes', { params }),
  orderMonthly:  (params) => api.get('/analytics/order-monthly', { params }),
  bqConversion:  (params) => api.get('/analytics/bq-conversion', { params }),
  civilDefence:  (params) => api.get('/analytics/civil-defence', { params }),
  winLossDomain: (params) => api.get('/analytics/win-loss-domain',{ params }),
  topCustomers:  (params) => api.get('/analytics/top-customers', { params }),
  lostLeads:     (params) => api.get('/analytics/lost-leads',    { params }),
  monthlyReport: (params) => api.get('/analytics/monthly-report',{ params }),
  yearlyReport:  (params) => api.get('/analytics/yearly-report', { params }),
};
