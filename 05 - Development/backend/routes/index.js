import express from 'express';
import dashboardOverview from './dashboardRoutes.js'; // Note the .js extension
import dashboardPipeline from './pipelineRoutes.js'; // Note the .js extension
import dashboardAnalysis from './analysisRoutes.js'; // Note the .js extension

const router = express.Router();

router.use('/dashboard/overview', dashboardOverview);
router.use('/dashboard/pipeline', dashboardPipeline);
router.use('/dashboard/analysis', dashboardAnalysis);

export default router; // Use export default instead of module.exports