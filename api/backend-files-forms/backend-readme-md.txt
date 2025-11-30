# Tender Management System - Backend API Documentation

## Project Overview

A professional Node.js/Express backend built with MVC architecture for managing tender/leads data across 7 different forms. The system integrates with PostgreSQL for persistent data storage and follows RESTful API conventions.

## Quick Start

### Prerequisites
- Node.js v14+
- PostgreSQL v12+
- npm/yarn

### Installation

```bash
# 1. Clone repository
git clone <repo-url>
cd tender-backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Create database and run schema
psql -U postgres -c "CREATE DATABASE tender_management;"
psql -U postgres -d tender_management -f database-schema.sql

# 5. Start server
npm run dev  # Development mode with auto-reload
# OR
npm start    # Production mode
```

Server runs on http://localhost:5000

## API Architecture

### MVC Structure

```
Models:
  - Represent database entities
  - Handle data operations (CRUD)
  - Validate business logic

Controllers:
  - Process requests
  - Call models
  - Format responses
  - Handle errors

Routes:
  - Define endpoints
  - Map to controllers
  - Handle middleware
```

### Response Format

All API responses follow standard JSON format:

```json
{
  "success": true/false,
  "message": "Operation description",
  "data": { /* response data */ },
  "timestamp": "2025-11-27T22:21:00Z"
}
```

## API Endpoints

### 1. Lost Domestic Leads
```
POST   /api/lost-domestic-leads
GET    /api/lost-domestic-leads
GET    /api/lost-domestic-leads/:id
PUT    /api/lost-domestic-leads/:id
DELETE /api/lost-domestic-leads/:id
```

**Example POST:**
```bash
curl -X POST http://localhost:5000/api/lost-domestic-leads \
  -H "Content-Type: application/json" \
  -d '{
    "serialNumber": "DL-001",
    "tenderName": "Supply of Equipment",
    "customer": "ABC Corp",
    "tenderType": "Open",
    "typeBid": "Competitive",
    "valueWithoutGST": 1000000,
    "valueWithGST": 1180000,
    "reasonLosing": "Price too high",
    "year": 2025,
    "competitors": [{"name": "Competitor A", "address": "Delhi"}]
  }'
```

### 2. Domestic Order
```
POST   /api/domestic-order
GET    /api/domestic-order
GET    /api/domestic-order/:id
PUT    /api/domestic-order/:id
DELETE /api/domestic-order/:id
```

### 3. Budgetary Quotation
```
POST   /api/budgetary-quotation
GET    /api/budgetary-quotation
GET    /api/budgetary-quotation/:id
PUT    /api/budgetary-quotation/:id
DELETE /api/budgetary-quotation/:id
```

### 4. Lead Submitted
```
POST   /api/lead-submitted
GET    /api/lead-submitted
GET    /api/lead-submitted/:id
PUT    /api/lead-submitted/:id
DELETE /api/lead-submitted/:id
```

### 5. Domestic Leads V2
```
POST   /api/domestic-leads-v2
GET    /api/domestic-leads-v2
GET    /api/domestic-leads-v2/:id
PUT    /api/domestic-leads-v2/:id
DELETE /api/domestic-leads-v2/:id
```

### 6. Export Leads
```
POST   /api/export-leads
GET    /api/export-leads
GET    /api/export-leads/:id
PUT    /api/export-leads/:id
DELETE /api/export-leads/:id
```

### 7. CRM Leads
```
POST   /api/crm-leads
GET    /api/crm-leads
GET    /api/crm-leads/:id
PUT    /api/crm-leads/:id
DELETE /api/crm-leads/:id
```

## Query Parameters

All GET endpoints support pagination:

```bash
GET /api/lost-domestic-leads?limit=50&offset=0
```

**Parameters:**
- `limit` - Number of records per page (default: 100)
- `offset` - Starting record number (default: 0)

## Error Handling

### Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Server Error |

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2025-11-27T22:21:00Z"
}
```

## Database Tables

### Lost Domestic Leads
- Tracks lost tender opportunities
- Stores competitor analysis
- Records technical and price comparisons

### Domestic Order
- Records received orders
- Tracks order values and dates
- Manages customer information

### Budgetary Quotation
- Stores quotation submissions
- Tracks quotation status
- Records Defence/Non-Defence classification

### Lead Submitted
- Complete tender lifecycle tracking
- Multiple approval stage tracking
- RFP and submission date management

### Domestic Leads V2
- Enhanced lead tracking
- Participation outcome tracking
- Comprehensive financial data

### Export Leads
- International tender tracking
- Global competitor management
- Export-specific fields

### CRM Leads
- Quick lead entry form
- Team assignment tracking
- Rapid lead capture

## Security Features

✅ **Helmet.js** - HTTP header security  
✅ **CORS** - Cross-origin resource sharing  
✅ **Input Validation** - All inputs validated  
✅ **Error Handling** - Comprehensive error handling  
✅ **Logging** - Request logging with Morgan  
✅ **Environment Variables** - Sensitive data protection  

## Development

### Running Tests
```bash
npm test
```

### Code Structure
- `/config` - Database configuration
- `/models` - Data models and business logic
- `/controllers` - Request handlers
- `/routes` - Route definitions
- `/middleware` - Custom middleware

### Debugging
```bash
NODE_DEBUG=* npm run dev
```

## Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure database backups
- [ ] Set up SSL/HTTPS
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Set secure password
- [ ] Test all endpoints

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "tender-api"
pm2 save
pm2 startup
```

## Database Backup & Restore

```bash
# Backup
pg_dump -U postgres -d tender_management > backup.sql

# Restore
psql -U postgres -d tender_management < backup.sql
```

## Monitoring

Check server health:
```bash
curl http://localhost:5000/health
```

## Support

For issues or questions:
1. Check API documentation
2. Review error messages
3. Check server logs
4. Verify database connectivity

## License

MIT
