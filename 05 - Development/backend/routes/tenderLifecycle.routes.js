// backend/src/routes/tenderLifecycle.routes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth.middleware');
const rbac    = require('../middleware/rbac.middleware');
const upload  = require('../config/multer');
const ctrl    = require('../controllers/tenderLifecycle.controller');

router.use(auth);

// ─── Dashboard & Analytics (place before :id routes) ──────────────────────────
router.get('/dashboard/summary',  ctrl.dashboardSummary);
router.get('/dashboard/calendar', ctrl.calendar);
router.get('/analytics',          ctrl.analytics);
router.get('/alerts/my',          ctrl.myAlerts);

// ─── CRUD ─────────────────────────────────────────────────────────────────────
router.post('/',    ctrl.create);
router.get('/',     ctrl.list);
router.get('/:id',  ctrl.getOne);
router.put('/:id',  ctrl.update);

// ─── Stage transitions ────────────────────────────────────────────────────────
router.put('/:id/stage',    ctrl.moveStage);
router.put('/:id/go-no-go', ctrl.goNoGo);

// ─── Actions / Checklist ──────────────────────────────────────────────────────
router.patch(
  '/:id/actions/:actionId',
  (req, _, next) => { req.uploadFolder = 'lifecycle'; next(); },
  upload.single('document'),
  ctrl.completeAction
);

// ─── Corrigendums ─────────────────────────────────────────────────────────────
router.post(
  '/:id/corrigendum',
  (req, _, next) => { req.uploadFolder = 'leads'; next(); },
  upload.single('file'),
  ctrl.addCorrigendum
);

// ─── Competitors ──────────────────────────────────────────────────────────────
router.post('/:id/competitors',                   ctrl.addCompetitor);
router.put ('/:id/competitors/:competitorId',     ctrl.updateCompetitor);

// ─── Consortium ───────────────────────────────────────────────────────────────
router.post('/:id/consortium', ctrl.addConsortiumMember);

// ─── Alerts ───────────────────────────────────────────────────────────────────
router.patch('/alerts/:alertId/read',    ctrl.markAlertRead);
router.patch('/alerts/:alertId/dismiss', ctrl.dismissAlert);

module.exports = router;
