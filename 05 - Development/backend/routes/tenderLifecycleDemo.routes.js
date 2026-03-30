import { Router } from 'express';
import * as ctrl from '../controllers/analysisController'; // Note the .js extension

const router = Router();

router.patch('/:id/advance',  ctrl.advanceTender);  // POST body: { stage, ...fields }
router.get('/pipeline',       ctrl.getPipeline);     // Full funnel summary
router.get('/deadlines',      ctrl.getDeadlines);    // Alerts: CRITICAL / WARNING / WATCH
router.get('/insights',       ctrl.getInsights);     // Learning loop analytics

export default router;