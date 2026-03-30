/**
 * Dashboard Routes
  _/api/dashboard/_
 */

import express from "express";
import dashboardController, { getDomainAnalysis, getLead, getOrdersLast5year, getTenderTypeCount, getTopCustomers } from "../controllers/dashboardController.js"; // Note the .js extension

const router = express.Router();

// Get month data
// router.get('/month-data', dashboardController.getMonthData.bind(dashboardController));

// Get fiscal year summary
// router.get('/fy-summary', dashboardController.getFYSummary.bind(dashboardController));

// Get all FY data
// router.get('/all-fy', dashboardController.getAllFYData.bind(dashboardController));

// Get dashboard KPIs
// router.get("/kpis", dashboardController.getKPIs.bind(dashboardController));
router.get('/kpis', getLead);

router.get('/orders-5year',   getOrdersLast5year);
router.get('/domain-analysis',   getDomainAnalysis);
router.get('/tenderType-count',   getTenderTypeCount);
router.get('/top-customers', getTopCustomers);


// router.get("/bq-funnel", getBQFunnel);
// router.get("/order-distribution", getOrderDistribution);
// router.get("/quarterly", getQuarterly);
// router.get("/tender-type", getTenderType);
// router.get("/owner-performance", getOwnerPerformance);
// router.get("/kpis", getAnalysisKPIs);


// test 

export default router; // Use export default instead of module.exports
