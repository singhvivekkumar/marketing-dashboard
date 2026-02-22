# 🎯 CRM Analytics Dashboard - Complete Setup & Run Guide

## 📋 What You Have

A production-ready **CRM Analytics Dashboard** for tracking:
- ✅ Lead management (status, stages, ownership)
- ✅ Financial analytics (value, plans, losses)
- ✅ Sector analysis (Defence vs Civil)
- ✅ Risk management (overdue tracking)
- ✅ Business unit performance
- ✅ Customer relationships
- ✅ Trend analysis & forecasting

---

## 🚀 QUICK START (Windows PowerShell)

### First Time Setup (5 minutes)

```powershell
# 1. Open PowerShell and navigate to project
cd "c:\VIVEK  TECH\Python\dash"

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
venv\Scripts\Activate.ps1

# If you get a permission error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 4. Install dependencies (this takes 2-3 minutes)
pip install -r requirements.txt

# 5. Check if everything is installed
python check_install.py

# 6. Run the dashboard
python app.py
```

✅ **Dashboard is now running at:** http://localhost:8050

---

## 📂 Add Your Data

### Step 1: Place Excel Files
Copy your lead data Excel files to:
```
src/Leads_Data/
```

### Step 2: Excel Structure Required

Your Excel file needs these column names (exact spelling):

**Essential Columns:**
```
Lead_Id, Lead_Name, Lead_Status, Lead_Stages, UNIT_SBU, Lead_Owner,
Main_Customer, Lead_Type, Value_in_Rs_(Lakhs), Creation_Date, Due_date,
Reason, Single_Multi_Vendor, Lead_Assignement_Status
```

**Optional Date Columns:**
```
Tech_Bid_Open_Date, Commercial_Bid_Opening_Date, 
PNC_Conclusion_Date, Contracted_Date
```

👉 See [DATA_TEMPLATE.md](DATA_TEMPLATE.md) for sample data

### Step 3: Restart Dashboard
```powershell
# Stop current instance (Ctrl+C)
# Restart
python app.py
```

Your data will load automatically! 📊

---

## 📖 Documentation Files

| File | What It Contains |
|------|-----------------|
| [README.md](README.md) | Full feature documentation |
| [QUICKSTART.md](QUICKSTART.md) | Step-by-step setup guide |
| [CONFIG.md](CONFIG.md) | Advanced customization |
| [DATA_TEMPLATE.md](DATA_TEMPLATE.md) | Excel data template |
| [SETUP_COMPLETE.md](SETUP_COMPLETE.md) | Setup summary |

---

## 🎮 Using the Dashboard

### 📊 Dashboard Features

**Top Section - KPIs:**
- Total leads count
- Pipeline value (₹ Lakhs)
- Top lead owner & SBU
- Vendor type analysis
- Approval status breakdown

**Charts (Collapsible):**
1. Lead Status Distribution (Pie)
2. Civil vs Defence Sector (Pie)
3. SBU-wise Value (Bar)
4. Leads per Owner (Bar)
5. Planned vs Achieved (Bar)
6. Lost Leads Reason (Pie)
7. Yearly Trend (Line)
8. Date-based Trends (Line)
9. Risk Heatmap (Overdue tracking)
10. Top 10 Leads (Bar)
11. Financial Summary (Bar)

**Bottom Section - Data Table:**
- Raw data with search
- Sortable columns
- Exportable to CSV
- Filterable by any column

### 🔍 Using Filters

At the top, use dropdown filters:
```
[SBU/Unit] [Customer] [Year] [Lead Type] [Lead Stage] [Lead Status]
```

**Combine multiple filters** for deeper analysis:
- Example: Select "Defence SBU" + "2024" to see all defence leads from 2024
- All charts update automatically

### 📌 Toggle Sections

Click blue buttons to hide/show sections:
- "Show / Hide Executive KPIs"
- "Show / Hide Lead & Sector Analysis"
- "Show / Hide Plan / Lost / Trend"
- "Show / Hide Risk Heatmap"
- "Show / Hide Top 10 Leads"
- "Show / Hide Raw Table"

### 💡 Tips

- **Hover over charts** for tooltips with details
- **Click legend items** to show/hide data series
- **Search table** using the filter bar above data
- **Export data** by copying from table cells
- **Combine filters** for specific analysis

---

## ⚙️ Configuration

Edit [.env](file:.env) to customize:

```env
# Debug mode (show errors, live reload)
DASH_DEBUG=True

# Server access
DASH_HOST=0.0.0.0      # Network accessible
# DASH_HOST=127.0.0.1  # Localhost only

# Port number
DASH_PORT=8050

# Data folder
DATA_FOLDER=src/Leads_Data
```

**Common Changes:**

Change port (if 8050 is busy):
```env
DASH_PORT=8051
```

Disable debug mode (production):
```env
DASH_DEBUG=False
```

---

## 🔧 Troubleshooting

### ❌ "No module named 'dash'"
```powershell
# Ensure virtual environment is active
venv\Scripts\Activate.ps1
# Reinstall
pip install -r requirements.txt
```

### ❌ "Port 8050 already in use"
```env
# Edit .env and change:
DASH_PORT=8051
```

### ❌ "No data showing in dashboard"
1. ✅ Check Excel files are in `src/Leads_Data/`
2. ✅ Verify column names match exactly (case-sensitive)
3. ✅ Check for empty sheets in Excel
4. ✅ Restart dashboard: `python app.py`

### ❌ "Permission denied when activating venv"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\Activate.ps1
```

### ❌ "Dates not showing correctly"
- Ensure Excel dates are in format: YYYY-MM-DD
- Or let Excel format them naturally
- Empty date cells are OK

---

## 🎓 Common Tasks

### View only Defence SBU data
1. Click SBU dropdown
2. Select "Defence SBU"
3. All charts update automatically

### Find top customer by value
1. Look at "SBU-wise Lead Value" chart
2. Or sort "Top 10 Leads" by value
3. Use Main_Customer filter for detailed view

### Check overdue leads
1. Find "Risk Heatmap" section
2. Red boxes show overdue count by SBU & status
3. Darker red = more overdue

### Export lead data
1. Scroll to "Raw Table" section
2. Select all rows needed
3. Copy to clipboard
4. Paste in Excel

---

## 📱 Access from Other Computers

To access dashboard from another computer on your network:

1. Find your computer's IP address:
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Edit [.env](file:.env):
```env
DASH_HOST=0.0.0.0
```

3. Access from other computer:
```
http://your-computer-ip:8050
```

Example: `http://192.168.1.100:8050`

---

## 🚀 Next Steps

### Immediate (Today)
- ✅ Run `python app.py`
- ✅ Access http://localhost:8050
- ✅ Add your Excel data to `src/Leads_Data/`

### Short Term (This Week)
- 📊 Explore dashboard features
- 🔍 Practice filtering & analysis
- 📈 Create standard reports

### Medium Term (This Month)
- 🎨 Customize charts (see CONFIG.md)
- 📱 Share dashboard with team
- 🔐 Set up security/authentication

### Long Term (This Quarter)
- 🗄️ Consider database instead of Excel
- 📊 Add forecasting models
- 📱 Deploy to production server

---

## 📞 Support Checklist

When troubleshooting, check:

- [ ] Python version is 3.8+: `python --version`
- [ ] Virtual environment is activated
- [ ] All packages installed: `pip list | grep dash`
- [ ] Excel files in correct folder
- [ ] Column names match exactly
- [ ] Check browser console (F12) for errors
- [ ] Port is not already in use
- [ ] Check `.env` configuration

---

## 🎉 You're Ready!

Everything is set up. Just:

```powershell
# 1. Activate virtual environment
venv\Scripts\Activate.ps1

# 2. Run dashboard
python app.py

# 3. Open browser to http://localhost:8050
```

**Happy analyzing!** 📊📈💼

---

For detailed information:
- Setup details → [SETUP_COMPLETE.md](SETUP_COMPLETE.md)
- Quick guide → [QUICKSTART.md](QUICKSTART.md)
- Configuration → [CONFIG.md](CONFIG.md)
- Data template → [DATA_TEMPLATE.md](DATA_TEMPLATE.md)

Last updated: January 29, 2026
