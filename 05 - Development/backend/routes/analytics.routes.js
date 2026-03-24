// backend/src/routes/analytics.routes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth.middleware');
const ctrl    = require('../controllers/analytics.controller');

// All analytics routes require authentication
router.use(auth);

router.get('/kpi',            ctrl.kpi);
router.get('/orders-5year',   ctrl.orders5year);
router.get('/lead-outcomes',  ctrl.leadOutcomes);
router.get('/lead-pipeline',  ctrl.leadPipeline);
router.get('/lead-subtypes',  ctrl.leadSubtypes);
router.get('/order-monthly',  ctrl.orderMonthly);
router.get('/bq-conversion',  ctrl.bqConversion);
router.get('/civil-defence',  ctrl.civilDefence);
router.get('/win-loss-domain',ctrl.winLossDomain);
router.get('/top-customers',  ctrl.topCustomers);
router.get('/lost-leads',     ctrl.lostLeads);
router.get('/monthly-report', ctrl.monthlyReport);
router.get('/yearly-report',  ctrl.yearlyReport);

module.exports = router;
