// ─── backend/src/routes/auth.routes.js ───────────────────────────────────────
const express    = require('express');
const { body }   = require('express-validator');
const router     = express.Router();
const controller = require('../controllers/auth.controller');
const auth       = require('../middleware/auth.middleware');

// POST /api/auth/login
router.post('/login',
  [
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  controller.login
);

// GET /api/auth/me  — get logged-in user profile
router.get('/me', auth, controller.me);

// POST /api/auth/change-password
router.post('/change-password', auth,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
  ],
  controller.changePassword
);

module.exports = router;
