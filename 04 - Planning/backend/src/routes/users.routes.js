// ─── backend/src/routes/users.routes.js ──────────────────────────────────────
const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const auth     = require('../middleware/auth.middleware');
const rbac     = require('../middleware/rbac.middleware');
const ctrl     = require('../controllers/users.controller');

// GET  /api/users        — list all users (manager, head, admin)
router.get('/',    auth, rbac('manager','head','admin'), ctrl.list);

// POST /api/users        — create user (admin only)
router.post('/', auth, rbac('admin'),
  [
    body('username').notEmpty(),
    body('email').isEmail(),
    body('full_name').notEmpty(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['executive','manager','head','admin']),
  ],
  ctrl.create
);

// PUT  /api/users/:id    — update user (admin only)
router.put('/:id',  auth, rbac('admin'), ctrl.update);

// PATCH /api/users/:id/deactivate — disable user (admin only)
router.patch('/:id/deactivate', auth, rbac('admin'), ctrl.deactivate);

module.exports = router;
