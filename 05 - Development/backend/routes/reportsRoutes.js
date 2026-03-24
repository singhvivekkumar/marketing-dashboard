/**
 * Reports Routes
 * /api/reports/*
 */

const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// Yearly value trend
router.get('/yearly-value', reportsController.getYearlyValue.bind(reportsController));

// Win rate trend
router.get('/win-rate-trend', reportsController.getWinRateTrend.bind(reportsController));

// Year summary
router.get('/year-summary', reportsController.getYearSummary.bind(reportsController));

// Specific year
router.get('/year-summary/:id', reportsController.getYearById.bind(reportsController));

// Quarterly data
router.get('/quarterly', reportsController.getQuarterlyData.bind(reportsController));

// Tender type breakdown
router.get('/tender-type', reportsController.getTenderType.bind(reportsController));

// Lead owner performance
router.get('/lead-owner', reportsController.getLeadOwnerPerformance.bind(reportsController));

// Report summary
router.get('/summary', reportsController.getReportSummary.bind(reportsController));

// Export data
router.get('/export', reportsController.getExportData.bind(reportsController));

module.exports = router;
