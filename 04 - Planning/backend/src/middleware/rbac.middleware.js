/**
 * Role-Based Access Control middleware.
 * Usage: router.delete('/:id', auth, rbac('manager','head','admin'), controller)
 *
 * Roles hierarchy:
 *   executive  — can create/edit own records
 *   manager    — can create/edit all records + delete
 *   head       — full access + analytics
 *   admin      — full system access including user management
 */
module.exports = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated.' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: `Access denied. This action requires one of: ${allowedRoles.join(', ')}.`,
    });
  }

  next();
};
