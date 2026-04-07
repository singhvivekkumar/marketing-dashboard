const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT token on every protected route.
 * Adds req.user = { id, username, role, full_name } if valid.
 * Usage: router.get('/route', authMiddleware, controller)
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role, full_name }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token is invalid or has expired. Please log in again.',
    });
  }
};
