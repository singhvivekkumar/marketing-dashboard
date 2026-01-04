# CRM Backend Server - Complete Setup Guide

## 🎯 Project Overview

This is a Node.js/Express backend server for the Tender Management System with PostgreSQL database integration using Sequelize ORM.

## ✅ What's Been Set Up

### 1. **Node.js Dependencies** ✓
All required packages are installed:
- **express** (4.22.1) - Web framework
- **sequelize** (6.37.7) - ORM for database
- **pg** (8.16.3) - PostgreSQL driver
- **cors** (2.8.5) - Cross-origin support
- **dotenv** (17.2.3) - Environment variables
- **bcryptjs** (2.4.3) - Password hashing
- **jsonwebtoken** (9.0.3) - JWT authentication
- **express-validator** (7.3.1) - Input validation
- **nodemon** (2.0.22) - Development auto-reload

### 2. **Server Configuration** ✓
- `server.js` - Main entry point with all routes registered
- `.env` - Environment variables configured
- Database models created for all entities

### 3. **Database Models** ✓
Created models for:
- Users and Roles
- Budgetary Quotations
- CRM Leads
- Domestic & Export Leads
- Lost Forms
- TPCR Forms
- CPDS Forms
- InHouse R&D
- And more...

### 4. **API Routes** ✓
All routes are registered:
- Authentication routes
- Lead management routes (CRM, Domestic, Export)
- Form submission routes
- Bulk upload endpoints

---

## ⚠️ Current Issue: Database Connection

The server cannot connect to PostgreSQL because:
1. **PostgreSQL is not installed** OR
2. **PostgreSQL service is not running** OR
3. **Database "TENDER_MANAGEMENT_SYSTEM" doesn't exist** OR
4. **Credentials are incorrect**

---

## 🚀 Getting Started - Step by Step

### Step 1: Install PostgreSQL

**If PostgreSQL is NOT installed:**

1. Download from: https://www.postgresql.org/download/windows/
2. Run installer and use these settings:
   - **PostgreSQL Password**: `bel123`
   - **Port**: `5432`
3. Complete installation

**If PostgreSQL IS installed:**
- Skip to Step 2

### Step 2: Verify PostgreSQL is Running

**Windows:**
1. Press `Win + R`
2. Type `services.msc`
3. Look for `postgresql-x64-XX` service
4. If not running, right-click → Start
5. Close the window

### Step 3: Create the Database

**Method A: Using pgAdmin (Recommended)**
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `TENDER_MANAGEMENT_SYSTEM`
4. Click Create

**Method B: Using Command Line**
1. Open Command Prompt
2. Run:
```bash
psql -U postgres
```
3. Enter password: `bel123`
4. Run:
```sql
CREATE DATABASE "TENDER_MANAGEMENT_SYSTEM";
```
5. Exit: `\q`

### Step 4: Start the Server

Navigate to project folder and run:

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start

# OR Direct Node.js
node server.js
```

### Step 5: Verify Server is Running

When successful, you'll see:
```
╔════════════════════════════════════════╗
║   CRM Backend Server Started            ║
║   Port: 5000                            ║
║   Environment: development              ║
║   Database: TENDER_MANAGEMENT_SYSTEM    ║
╚════════════════════════════════════════╝
```

---

## 📡 Testing the API

### 1. **Health Check**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 15.234
}
```

### 2. **Welcome Endpoint**
```bash
curl http://localhost:5000/
```

Expected response:
```json
{
  "message": "Welcome to CRM Backend API",
  "status": "Server is running",
  "database": "Connected"
}
```

### 3. **Create Budgetary Quotation**

Using Postman or curl:

```bash
curl -X POST http://localhost:5000/getBudgetaryQuoatation \
  -H "Content-Type: application/json" \
  -d '{
    "bqTitle": "Sample Quote",
    "customerName": "ABC Company",
    "customerAddress": "123 Street",
    "leadOwner": "John Doe",
    "defenceAndNonDefence": "Defence",
    "estimateValueInCrWithoutGST": "50.00",
    "submittedValueInCrWithoutGST": "48.00",
    "dateOfLetterSubmission": "2024-01-01",
    "referenceNo": "REF001",
    "presentStatus": "Pending",
    "OperatorId": "E001",
    "OperatorName": "Admin User",
    "OperatorRole": "Admin",
    "OperatorSBU": "Sales"
  }'
```

---

## 📁 Project Structure

```
tender-management-system/
├── server.js                 # Main entry point
├── package.json              # Dependencies
├── .env                       # Environment variables
├── API_DOCUMENTATION.md       # API endpoints
├── SETUP_POSTGRESQL.md        # PostgreSQL setup
├── README.md                  # This file
├── src/
│   ├── config/
│   │   ├── auth.config.js
│   │   └── db.config.js
│   ├── controllers/           # Business logic
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── middleware/            # Auth & validation
│   └── uploads/               # File uploads
└── node_modules/              # Dependencies
```

---

## 🔧 Environment Variables (.env)

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=bel123
DB_NAME=TENDER_MANAGEMENT_SYSTEM

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=nodeappRia-secret-key
JWT_EXPIRATION=24h

# Files
MAX_FILE_SIZE=50mb
UPLOAD_DIR=./uploads
```

---

## 📊 Database Connection Flow

```
Frontend (React/Web App)
         ↓
    Server.js (Node.js/Express)
         ↓
    Routes → Controllers
         ↓
    Models (Sequelize ORM)
         ↓
    PostgreSQL Database
```

---

## 🆘 Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module` | Missing files | Run `npm install` |
| `password authentication failed` | Wrong credentials | Check .env file, verify PostgreSQL password |
| `ECONNREFUSED` | PostgreSQL not running | Start PostgreSQL service |
| `database does not exist` | DB not created | Create database (see Step 3) |
| `port 5000 already in use` | Port conflict | Change PORT in .env |

---

## 📝 Available API Endpoints

### Authentication
- `POST /auth/signin` - Sign in
- `POST /auth/logout` - Sign out

### Budgetary Quotation
- `GET /getBudgetaryQuoatation` - Get all
- `POST /getBudgetaryQuoatation` - Create
- `POST /bqbulkUpload` - Bulk upload

### CRM Leads
- `GET /getCRMLeads` - Get all
- `POST /getCRMLeads` - Create
- `POST /crmLeadsBulkUpload` - Bulk upload

### Domestic Leads
- `GET /getDomesticLead` - Get all
- `POST /getDomesticLead` - Create
- `POST /domesticLeadsBulkUpload` - Bulk upload

### Other Endpoints
See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete list.

---

## 🎯 Next Steps

1. ✅ Install PostgreSQL (if needed)
2. ✅ Create the database
3. ✅ Start the server
4. ✅ Test endpoints with Postman/curl
5. ✅ Connect from frontend application

---

## 💡 Tips

- Use Postman for testing API endpoints: https://www.postman.com/
- Check server logs for debugging
- Use `npm run dev` during development for auto-reload
- Tables are created automatically when server starts
- All timestamps use ISO 8601 format

---

## 📞 Support

For issues:
1. Check [SETUP_POSTGRESQL.md](SETUP_POSTGRESQL.md)
2. Review error message carefully
3. Check if PostgreSQL is running
4. Verify database credentials in .env
5. Check `.env` file exists in root directory

---

**Last Updated**: December 28, 2025
**Server Version**: 1.0.0
**Node Version**: v14+ recommended
