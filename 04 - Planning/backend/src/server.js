const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve uploaded files from local disk ────────────────────────────────────
// Files stored at backend/uploads/ are accessible via /uploads/bq/filename.pdf
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/users',     require('./routes/users.routes'));
app.use('/api/bq',        require('./routes/bq.routes'));
app.use('/api/leads',     require('./routes/leads.routes'));
app.use('/api/orders',    require('./routes/orders.routes'));
app.use('/api/rnd',       require('./routes/rnd.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date(), env: process.env.NODE_ENV });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(require('./middleware/error.middleware'));

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  Marketing Portal API`);
  console.log(`  Running on : http://localhost:${PORT}`);
  console.log(`  Health     : http://localhost:${PORT}/api/health`);
  console.log(`  Env        : ${process.env.NODE_ENV}\n`);
});
