/**
 * Global Express error handler.
 * Must be the LAST app.use() in server.js.
 */
module.exports = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(422).json({
      success: false,
      error: `File too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 20}MB.`,
    });
  }

  // Multer file type error
  if (err.message && err.message.includes('Only PDF')) {
    return res.status(422).json({ success: false, error: err.message });
  }

  // Sequelize unique constraint (e.g. duplicate PO/WO number)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors?.[0]?.path || 'field';
    return res.status(409).json({
      success: false,
      error: `Duplicate value: ${field} already exists.`,
    });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json({
      success: false,
      error: err.errors.map(e => e.message).join(', '),
    });
  }

  // Default 500
  return res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'An internal error occurred. Please try again.'
      : err.message,
  });
};
