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


# 1. Setup
mkdir tender-backend && cd tender-backend
npm install express pg dotenv cors helmet morgan uuid
npm install --save-dev nodemon

# 2. Database
psql -U postgres -c "CREATE DATABASE tender_management;"
psql -U postgres -d tender_management -f database-schema.sql

# 3. Start
npm run dev  # Runs on http://localhost:5000

All 7 forms have RESTful endpoints:

/api/lost-domestic-leads      (5 endpoints)
/api/domestic-order           (5 endpoints)
/api/budgetary-quotation      (5 endpoints)
/api/lead-submitted           (5 endpoints)
/api/domestic-leads-v2        (5 endpoints)
/api/export-leads             (5 endpoints)
/api/crm-leads                (5 endpoints)


🎯 Key Features
✅ MVC Architecture - Clean code organization
✅ 7 Form Types - Complete data models for all forms
✅ CRUD Operations - Full create/read/update/delete
✅ Pagination - Handle large datasets efficiently
✅ Error Handling - Comprehensive error responses
✅ Validation - Input validation on all endpoints
✅ Logging - Request/response logging with Morgan
✅ Security - Helmet.js, CORS, parameterized queries
✅ PostgreSQL - Production-grade database
✅ JSON API - Standard REST response format