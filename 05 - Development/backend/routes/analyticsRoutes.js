/**
 * Analytics Routes
 * /api/analytics/*
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Five year trend
router.get('/five-year-trend', analyticsController.getFiveYearTrend.bind(analyticsController));

// Lead outcomes
router.get('/lead-outcomes', analyticsController.getLeadOutcomes.bind(analyticsController));

// Monthly trend
router.get('/monthly-trend', analyticsController.getMonthlyTrend.bind(analyticsController));

// Civil vs Defence
router.get('/civil-defence', analyticsController.getCivilDefence.bind(analyticsController));

// Lead sub-types
router.get('/lead-subtypes', analyticsController.getLeadSubTypes.bind(analyticsController));

// Domain performance
router.get('/domain-performance', analyticsController.getDomainPerformance.bind(analyticsController));

// Top customers
router.get('/top-customers', analyticsController.getTopCustomers.bind(analyticsController));

// Lost leads list
router.get('/lost-leads', analyticsController.getLostLeads.bind(analyticsController));

// Lost lead by ID
router.get('/lost-leads/:id', analyticsController.getLostLeadById.bind(analyticsController));

// BQ conversion funnel
router.get('/bq-conversion', analyticsController.getBQConversion.bind(analyticsController));

// Order value distribution
router.get('/order-distribution', analyticsController.getOrderValueDistribution.bind(analyticsController));

// Analytics KPIs
router.get('/kpis', analyticsController.getKPIAnalytics.bind(analyticsController));

module.exports = router;
