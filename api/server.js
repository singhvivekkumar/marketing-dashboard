// server.js - Main Express Server

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const lostDomesticLeadsRoutes = require('./routes/lostDomesticLeads');
const domesticOrderRoutes = require('./routes/domesticOrder');
const budgetaryQuotationRoutes = require('./routes/budgetaryQuotation');
const leadSubmittedRoutes = require('./routes/leadSubmitted');
const domesticLeadsV2Routes = require('./routes/domesticLeadsV2');
const exportLeadsRoutes = require('./routes/exportLeads');
const crmLeadsRoutes = require('./routes/crmLeads');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Gobal Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Tender Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/lost-domestic-leads', lostDomesticLeadsRoutes);
app.use('/api/domestic-order', domesticOrderRoutes);
app.use('/api/budgetary-quotation', budgetaryQuotationRoutes);
app.use('/api/lead-submitted', leadSubmittedRoutes);
app.use('/api/domestic-leads', domesticLeadsRoutes);
app.use('/api/export-leads', exportLeadsRoutes);
app.use('/api/crm-leads', crmLeadsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Tender Management System Backend',
    version: '1.0.0',
    endpoints: {
      'Lost Domestic Leads': '/api/lost-domestic-leads',
      'Domestic Order': '/api/domestic-order',
      'Budgetary Quotation': '/api/budgetary-quotation',
      'Lead Submitted': '/api/lead-submitted',
      'Domestic Leads': '/api/domestic-leads',
      'Export Leads': '/api/export-leads',
      'CRM Leads': '/api/crm-leads',
      'Health Check': '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Global Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;