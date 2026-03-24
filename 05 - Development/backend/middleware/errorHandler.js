const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.toString() : 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;