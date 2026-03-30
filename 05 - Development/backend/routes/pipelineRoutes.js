/**
 * Pipeline Routes
 * /api/pipeline/*
 */

import express from "express";
import { getKPIPipeline, getUpcomingSubmissions, getPipelineStatus,
    getPipelineDomain,
   } from "../controllers/pipelineController.js"; // Note the .js extension

const router = express.Router();
// Pipeline status
// router.get('/status', pipelineController.getPipelineStatus.bind(pipelineController));

// Pipeline by domain
// router.get('/domain', pipelineController.getPipelineDomain.bind(pipelineController));

// Upcoming deadlines
// router.get('/deadlines', pipelineController.getUpcomingDeadlines.bind(pipelineController));
router.get('/deadlines', getUpcomingSubmissions)
// Deadline by ID
// router.get('/deadlines/:id', pipelineController.getDeadlineById.bind(pipelineController));

// Pipeline KPIs
// router.get('/kpis', pipelineController.getKPIPipeline.bind(pipelineController));
router.get('/kpis', getKPIPipeline);

router.get("/kpis", getKPIPipeline);
router.get("/status", getPipelineStatus);
router.get("/domain", getPipelineDomain);


// Pipeline summary
// router.get('/summary', pipelineController.getSummary.bind(pipelineController));

export default router;
