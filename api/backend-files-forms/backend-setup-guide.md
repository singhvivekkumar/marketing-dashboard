# Tender Management System - Node.js Backend Setup Guide

![Dashboard Screenshot](../../public/Gemini_Generated_Image_toazsotoazsotoaz.png)

## Project Structure

```
tender-backend/
├── config/
│   └── database.js
├── controllers/
│   ├── lostDomesticLeadsController.js
│   ├── domesticOrderController.js
│   ├── budgetaryQuotationController.js
│   ├── leadSubmittedController.js
│   ├── domesticLeadsController.js
│   ├── exportLeadsController.js
│   └── crmLeadsController.js
├── models/
│   ├── LostDomesticLead.js
│   ├── DomesticOrder.js
│   ├── BudgetaryQuotation.js
│   ├── LeadSubmitted.js
│   ├── DomesticLead.js
│   ├── ExportLead.js
│   └── CRMLead.js
├── routes/
│   ├── lostDomesticLeads.js
│   ├── domesticOrder.js
│   ├── budgetaryQuotation.js
│   ├── leadSubmitted.js
│   ├── domesticLeads.js
│   ├── exportLeads.js
│   └── crmLeads.js
├── middleware/
│   ├── errorHandler.js
│   └── validation.js
├── .env
├── .env.example
├── server.js
├── package.json
└── README.md
```

## Installation Steps

### 1. Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 2. Install Dependencies

```bash
npm install express pg dotenv cors helmet morgan uuid
npm install --save-dev nodemon
```

### 3. Environment Variables (.env)

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tender_management
DB_USER=postgres
DB_PASSWORD=your_password

# App
APP_NAME=Tender Management System
LOG_LEVEL=debug
```

### 4. Create PostgreSQL Database

```sql
CREATE DATABASE tender_management;
```

## API Endpoints

### Lost Domestic Leads
- POST `/api/lost-domestic-leads` - Create new lead
- GET `/api/lost-domestic-leads` - Get all leads
- GET `/api/lost-domestic-leads/:id` - Get single lead
- PUT `/api/lost-domestic-leads/:id` - Update lead
- DELETE `/api/lost-domestic-leads/:id` - Delete lead

### Domestic Order
- POST `/api/domestic-order` - Create new order
- GET `/api/domestic-order` - Get all orders
- GET `/api/domestic-order/:id` - Get single order
- PUT `/api/domestic-order/:id` - Update order
- DELETE `/api/domestic-order/:id` - Delete order

### Budgetary Quotation
- POST `/api/budgetary-quotation` - Create new quotation
- GET `/api/budgetary-quotation` - Get all quotations
- GET `/api/budgetary-quotation/:id` - Get single quotation
- PUT `/api/budgetary-quotation/:id` - Update quotation
- DELETE `/api/budgetary-quotation/:id` - Delete quotation

### Lead Submitted
- POST `/api/lead-submitted` - Create new lead
- GET `/api/lead-submitted` - Get all leads
- GET `/api/lead-submitted/:id` - Get single lead
- PUT `/api/lead-submitted/:id` - Update lead
- DELETE `/api/lead-submitted/:id` - Delete lead

### Domestic Leads
- POST `/api/domestic-leads-` - Create new lead
- GET `/api/domestic-leads-` - Get all leads
- GET `/api/domestic-leads-/:id` - Get single lead
- PUT `/api/domestic-leads-/:id` - Update lead
- DELETE `/api/domestic-leads-/:id` - Delete lead

### Export Leads
- POST `/api/export-leads` - Create new lead
- GET `/api/export-leads` - Get all leads
- GET `/api/export-leads/:id` - Get single lead
- PUT `/api/export-leads/:id` - Update lead
- DELETE `/api/export-leads/:id` - Delete lead

### CRM Leads
- POST `/api/crm-leads` - Create new lead
- GET `/api/crm-leads` - Get all leads
- GET `/api/crm-leads/:id` - Get single lead
- PUT `/api/crm-leads/:id` - Update lead
- DELETE `/api/crm-leads/:id` - Delete lead

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* form data */ },
  "timestamp": "2025-11-27T22:21:00Z"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error",
  "timestamp": "2025-11-27T22:21:00Z"
}
```

## Database Tables

Each form has a corresponding PostgreSQL table with fields matching the JSON structure from the frontend forms.

### Example: Lost Domestic Leads Table
```sql
CREATE TABLE lost_domestic_leads (
  id SERIAL PRIMARY KEY,
  serial_number VARCHAR(255) NOT NULL,
  tender_name VARCHAR(255) NOT NULL,
  customer VARCHAR(255) NOT NULL,
  tender_type VARCHAR(100),
  type_bid VARCHAR(100),
  value_without_gst DECIMAL(15, 2),
  value_with_gst DECIMAL(15, 2),
  reason_losing TEXT,
  year INTEGER,
  partner VARCHAR(255),
  competitors_info JSONB,
  technical_scores JSONB,
  quoted_prices JSONB,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development Tips

1. **Start Server in Development Mode:**
   ```bash
   npm run dev
   ```

2. **View Logs:**
   - Morgan logs HTTP requests
   - All responses logged with Morgan

3. **Test APIs:**
   - Use Postman or Thunder Client
   - Import provided Postman collection
   - All endpoints return JSON

4. **Database Migrations:**
   - Run SQL schema files in migrations folder
   - Ensure PostgreSQL is running before starting server

## Security Features

✅ Helmet.js - HTTP header security  
✅ CORS - Cross-origin resource sharing  
✅ Input validation - All inputs validated  
✅ Error handling - Comprehensive error handling  
✅ Logging - Morgan request logging  
✅ Environment variables - Sensitive data protected  

## Error Handling

All errors are caught and logged with detailed messages. Common error codes:
- 400 - Bad Request (validation error)
- 404 - Not Found (resource not found)
- 500 - Internal Server Error

## Database Backup

```bash
# Backup database
pg_dump tender_management > backup.sql

# Restore database
psql tender_management < backup.sql
```

## Deployment


### Production Setup
1. Set NODE_ENV=production
2. Use process manager (PM2)
3. Set up reverse proxy (Nginx)
4. Enable HTTPS
5. Configure database backups
6. Set up monitoring

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "tender-backend"
pm2 save
```

## Support & Documentation

For detailed API documentation, see the individual route files and controller documentation. All endpoints follow RESTful conventions.
