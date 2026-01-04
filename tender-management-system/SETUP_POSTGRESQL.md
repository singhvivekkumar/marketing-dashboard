# PostgreSQL Setup Instructions

## Issue Found
The server is trying to connect to PostgreSQL but authentication is failing.

```
✗ Error starting server: password authentication failed for user "postgres"
```

## Database Connection Details
- **Host**: 127.0.0.1
- **Port**: 5432
- **User**: postgres
- **Password**: bel123
- **Database**: TENDER_MANAGEMENT_SYSTEM

## Solutions

### Option 1: Install PostgreSQL (If not installed)

1. **Download PostgreSQL** from https://www.postgresql.org/download/windows/
2. **Run the installer** and follow these steps:
   - Accept default installation directory
   - Set password for postgres user as: **bel123**
   - Accept default port: **5432**
   - Complete the installation

3. **Start PostgreSQL** (usually starts automatically)

### Option 2: Verify PostgreSQL is Running

**Windows:**
1. Open Services (services.msc)
2. Look for "postgresql-x64-XX" service
3. Make sure it's running (status shows "Running")
4. If not running, right-click and select "Start"

### Option 3: Create the Database

Once PostgreSQL is running, create the database:

**Using pgAdmin (GUI):**
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `TENDER_MANAGEMENT_SYSTEM`
4. Owner: `postgres`
5. Click Create

**Using Command Line (psql):**
```bash
# Open Command Prompt
psql -U postgres

# Enter password: bel123

# In psql console, run:
CREATE DATABASE "TENDER_MANAGEMENT_SYSTEM";

# Exit with:
\q
```

### Option 4: Verify Connection

Test the connection from Windows CMD:

```bash
psql -h 127.0.0.1 -U postgres -d TENDER_MANAGEMENT_SYSTEM
```

When prompted, enter password: `bel123`

If successful, you'll see the psql prompt:
```
TENDER_MANAGEMENT_SYSTEM=#
```

## After Setup

Once PostgreSQL is running and the database is created, run:

```bash
node server.js
```

Or:

```bash
npm start
```

## Expected Output When Connected

```
╔════════════════════════════════════════╗
║   CRM Backend Server Started            ║
║   Port: 5000                            ║
║   Environment: development              ║
║   Database: TENDER_MANAGEMENT_SYSTEM    ║
╚════════════════════════════════════════╝
```

## Troubleshooting

**Error: "Connection refused"**
- PostgreSQL is not running
- Check if port 5432 is correct in .env file

**Error: "Database does not exist"**
- Database hasn't been created yet
- Follow Option 3 above

**Error: "Password authentication failed"**
- Wrong password
- Verify password is `bel123` in .env file
- Reset postgres user password if needed

**Can't connect to localhost**
- Try using `localhost` instead of `127.0.0.1` in .env
- Check if firewall is blocking port 5432
