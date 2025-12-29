# CRM Backend API Documentation

## Server Configuration

**Base URL:** `http://localhost:5000`

## Available Endpoints

### Authentication
- `POST /auth/signin` - User sign in
- `POST /auth/logout` - User logout

### Budgetary Quotation
- `GET /getBudgetaryQuoatation` - Retrieve all budgetary quotations
- `POST /getBudgetaryQuoatation` - Create single budgetary quotation
- `POST /bqbulkUpload` - Bulk upload budgetary quotations

### CRM Leads
- `GET /getCRMLeads` - Retrieve all CRM leads
- `POST /getCRMLeads` - Create single CRM lead
- `POST /crmLeadsBulkUpload` - Bulk upload CRM leads

### Domestic Leads
- `GET /getDomesticLead` - Retrieve all domestic leads
- `POST /getDomesticLead` - Create single domestic lead
- `POST /domesticLeadsBulkUpload` - Bulk upload domestic leads

### Export Leads
- `GET /getExportLead` - Retrieve all export leads
- `POST /getExportLead` - Create single export lead
- `POST /exportLeadsBulkUpload` - Bulk upload export leads

### Lead Submitted
- `GET /getLeadSubmitted` - Retrieve all submitted leads
- `POST /getLeadSubmitted` - Create single submitted lead
- `POST /leadSubmittedBulkUpload` - Bulk upload submitted leads

### Lost Form
- `GET /getLostForms` - Retrieve all lost forms
- `POST /getLostForms` - Create single lost form
- `POST /lostFormBulkUpload` - Bulk upload lost forms

### Marketing Order Received
- `GET /getOrderReceived` - Retrieve all received orders
- `POST /getOrderReceived` - Create single received order
- `POST /orderReceivedBulkUpload` - Bulk upload received orders
- `POST /pdfupload` - Upload PDF files

### TPCR Form
- `GET /getTPCRForm` - Retrieve all TPCR forms
- `POST /getTPCRForm` - Create single TPCR form
- `POST /tpcrFormBulkUpload` - Bulk upload TPCR forms

### CPDS Form
- `GET /getCpdsForm` - Retrieve all CPDS forms
- `POST /getCpdsForm` - Create single CPDS form
- `POST /cpdsFormBulkUpload` - Bulk upload CPDS forms

### InHouse R&D
- `GET /getInHouseRd` - Retrieve all InHouse R&D data
- `POST /getInHouseRd` - Create single InHouse R&D entry
- `POST /inHouseRDBulkUpload` - Bulk upload InHouse R&D data

## System Endpoints
- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint

## Request/Response Format

### Request Headers
```json
{
  "Content-Type": "application/json",
  "x-access-token": "JWT_TOKEN_HERE"
}
```

### Response Format
**Success (200 OK):**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "error": {}
}
```

**Error (4xx/5xx):**
```json
{
  "message": "Error description",
  "error": "Error details",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database

**Type:** PostgreSQL  
**Connection:** See `.env` file for credentials  
**Sync Mode:** Automatic on server startup

## Environment Variables

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=bel123
DB_NAME=TENDER_MANAGEMENT_SYSTEM
PORT=5000
NODE_ENV=development
JWT_SECRET=nodeappRia-secret-key
```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Development Notes

- All timestamps are in ISO 8601 format
- Bulk uploads should send array of records in `excelData` field
- File uploads accept up to 50MB
- CORS is enabled for all origins
