/**
 * Dashboard Routes
 * /api/dashboard/*
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Get month data
router.get('/month-data', dashboardController.getMonthData.bind(dashboardController));

// Get fiscal year summary
router.get('/fy-summary', dashboardController.getFYSummary.bind(dashboardController));

// Get all FY data
router.get('/all-fy', dashboardController.getAllFYData.bind(dashboardController));

// Get dashboard KPIs
router.get('/kpis', dashboardController.getKPIs.bind(dashboardController));

module.exports = router;
