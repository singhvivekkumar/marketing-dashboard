import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './src/models/index.js';

// Import routes
import { BudgetaryQuotationRouter } from './src/routes/BudgetaryQuotationRouter.js';
import { CRMLeadsRouter } from './src/routes/CRMLeadsRouter.js';
import { DomesticLeadsRouter } from './src/routes/DomesticLeadsRouter.js';
import { ExportLeadsRouter } from './src/routes/ExportLeadsRouter.js';
import { LeadSubmittedRouter } from './src/routes/LeadSubmittedRouter.js';
import { LostFormRouter } from './src/routes/LostFormRouter.js';
import { MarketingOrderReceivedDomExpRouter } from './src/routes/MarketingOrderReceivedDomExpRouter.js';
import { TpcrFormRouter } from './src/routes/TpcrFormRouter.js';
import { CpdsFormRouter } from './src/routes/CpdsFormRouter.js';
import { InHouseRdRouter } from './src/routes/InHouseRdRouter.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to CRM Backend API',
    status: 'Server is running',
    database: 'Connected'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Register all routes
BudgetaryQuotationRouter(app);
LeadSubmittedRouter(app);
DomesticLeadsRouter(app);
ExportLeadsRouter(app);
CRMLeadsRouter(app);
MarketingOrderReceivedDomExpRouter(app);
LostFormRouter(app);
TpcrFormRouter(app);
CpdsFormRouter(app);
InHouseRdRouter(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Database sync and server start
const syncDatabase = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✓ Database connection authenticated');

    // Sync all models with database
    await db.sequelize.sync({ alter: false });
    console.log('✓ Database synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔═════════════════════════════════════════════════════════════════════╗
║   CRM Backend Server Started                                        ║
║   Port: ${PORT}                                                     ║
║   Environment: ${process.env.NODE_ENV || 'development'}             ║
║   Database: ${process.env.DB_NAME || 'TENDER_MANAGEMENT_SYSTEM'}    ║
╚═════════════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
};

// Start the application
syncDatabase();
