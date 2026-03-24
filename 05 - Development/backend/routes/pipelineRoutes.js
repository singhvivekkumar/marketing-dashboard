/**
 * Pipeline Routes
 * /api/pipeline/*
 */

const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipelineController');

// Pipeline status
router.get('/status', pipelineController.getPipelineStatus.bind(pipelineController));

// Pipeline by domain
router.get('/domain', pipelineController.getPipelineDomain.bind(pipelineController));

// Upcoming deadlines
router.get('/deadlines', pipelineController.getUpcomingDeadlines.bind(pipelineController));

// Deadline by ID
router.get('/deadlines/:id', pipelineController.getDeadlineById.bind(pipelineController));

// Pipeline KPIs
router.get('/kpis', pipelineController.getKPIPipeline.bind(pipelineController));

// Pipeline summary
router.get('/summary', pipelineController.getSummary.bind(pipelineController));

module.exports = router;
