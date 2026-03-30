// server.js - Main Express Server
import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import 'dotenv' from 'dotenv'; // Import dotenv as a module
import { config } from 'dotenv';
// Import routes
import routes from './routes/index.js'; // Add .js extension
// Import middleware
import errorHandler from './middleware/errorHandler.js'; //Add .js extension

config();
const app = express();

// Gobal Middleware
// app.use(helmet());
app.use(cors());
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Marketing Dashboard API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api", routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Marketing Dashboard Backend',
    version: '1.0.0',
    endpoints: {
      'Lost Domestic Leads': '/api/lost-domestic-leads',
      'Domestic Order': '/api/domestic-order',
      'Budgetary Quotation': '/api/budgetary-quotation',
      'Health Check': '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Global Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;  // Use export default instead of module.exports