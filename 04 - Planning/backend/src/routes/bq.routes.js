const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const auth    = require('../middleware/auth.middleware');
const rbac    = require('../middleware/rbac.middleware');
const upload  = require('../config/multer');
const ctrl    = require('../controllers/bq.controller');

// Set upload folder for BQ files
const setBQFolder = (req, _, next) => { req.uploadFolder = 'bq'; next(); };

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET  /api/bq          — list all BQs (with filters + pagination)
router.get('/', auth, ctrl.list);

// POST /api/bq          — create new BQ (multipart form + optional PDF)
router.post('/',
  auth,
  setBQFolder,
  upload.single('bq_document'),
  [
    body('bq_title').notEmpty().withMessage('BQ Title is required.'),
    body('customer_name').notEmpty().withMessage('Customer Name is required.'),
    body('customer_address').notEmpty().withMessage('Customer Address is required.'),
    body('defence_type').isIn(['Defence','Non-Defence']).withMessage('Defence/Non-Defence is required.'),
    body('estimated_value_cr').isFloat({ min: 0 }).withMessage('Estimated Value must be a positive number.'),
    body('submitted_value_cr').isFloat({ min: 0 }).withMessage('Submitted Value must be a positive number.'),
    body('submission_date').isDate().withMessage('Submission Date is required.'),
    body('present_status').notEmpty().withMessage('Present Status is required.'),
  ],
  ctrl.create
);

// GET  /api/bq/:id      — get single BQ (for edit modal pre-fill)
router.get('/:id', auth, ctrl.getOne);

// PUT  /api/bq/:id      — update BQ (supports file replacement)
router.put('/:id',
  auth,
  setBQFolder,
  upload.single('bq_document'),
  ctrl.update
);

// DELETE /api/bq/:id    — soft delete (manager, head, admin only)
router.delete('/:id', auth, rbac('manager','head','admin'), ctrl.remove);

// GET /api/bq/:id/download — stream file from local disk
router.get('/:id/download', auth, ctrl.download);

module.exports = router;
