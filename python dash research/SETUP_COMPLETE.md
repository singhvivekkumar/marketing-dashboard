# 🎯 CRM Analytics Dashboard - Complete Setup Summary

## ✅ What's Been Set Up

Your CRM Analytics Dashboard is now configured with a complete professional environment:

### 📦 Project Structure
```
dash/
├── app.py                          ✅ Main entry point (updated)
├── requirements.txt                ✅ Latest dependencies
├── .env                           ✅ Environment config
├── .gitignore                     ✅ Git configuration
├── README.md                      ✅ Full documentation
├── QUICKSTART.md                  ✅ Quick start guide
├── CONFIG.md                      ✅ Configuration guide
├── setup.bat                      ✅ Windows setup script
├── run.bat                        ✅ Windows run script
└── src/
    ├── CRM_ERP_DASHBOARD.py      ✅ Main dashboard (existing)
    └── Leads_Data/               📁 (Create and add Excel files here)
```

### 🎨 Dashboard Features Included

**Executive Dashboard:**
- Total leads count
- Total pipeline value (₹ Lakhs)
- Top lead owner
- Top performing SBU
- Single vs Multi vendor split
- Approved/Non-approved reasons

**Analytics Views:**
1. **Lead Status Distribution** - Pie chart showing status breakdown
2. **Sector Analysis** - Civil vs Defence comparison
3. **SBU Performance** - Value by business unit
4. **Lead Ownership** - Leads per owner
5. **Stage Analysis** - Planned vs Achieved
6. **Lost Reasons** - Why deals were lost
7. **Yearly Trends** - Lead volume over time
8. **Date-Based Trends** - Key dates tracking
9. **Risk Heatmap** - Overdue leads visualization
10. **Top 10 Leads** - Highest value opportunities
11. **Financial Summary** - Value analysis by stage
12. **Raw Data Table** - Searchable, sortable data

**Smart Filters:**
- UNIT/SBU
- Main Customer
- Year
- Lead Type
- Lead Stage
- Lead Status

---

## 🚀 How to Run (Windows)

### Option 1: Using PowerShell (Recommended)

```powershell
# 1. Navigate to project
cd "c:\VIVEK  TECH\Python\dash"

# 2. Create virtual environment (first time only)
python -m venv venv

# 3. Activate it
venv\Scripts\Activate.ps1

# 4. Install dependencies (first time only)
pip install -r requirements.txt

# 5. Run dashboard
python app.py
```

### Option 2: Using Batch Scripts

```powershell
# Setup (first time only)
.\setup.bat

# Run dashboard
.\run.bat
```

### Option 3: Quick Start (if already set up)

```powershell
venv\Scripts\Activate.ps1
python app.py
```

**Dashboard runs at:** http://localhost:8050

---

## 📊 Adding Your Data

### Step 1: Place Excel Files
```
src/Leads_Data/
├── leads_2024.xlsx
├── leads_2023.xlsx
└── leads_archive.xlsx
```

### Step 2: Required Columns in Excel

Your Excel files must have these columns (exact names):

**Core Columns:**
- `Lead_Id` - Unique identifier
- `Lead_Name` - Lead name
- `Lead_Status` - Status (Won, Lost, Pending)
- `Lead_Stages` - Stage (Planned, Achieved)
- `UNIT_SBU` - Business unit
- `Lead_Owner` - Owner name
- `Main_Customer` - Customer name
- `Lead_Type` - Type/Category

**Financial:**
- `Value_in_Rs_(Lakhs)` - Value in lakhs

**Dates:**
- `Creation_Date`
- `Due_date`
- `Tech_Bid_Open_Date`
- `Commercial_Bid_Opening_Date`
- `PNC_Conclusion_Date`
- `Contracted_Date`

**Additional:**
- `Reason` - Approval/decline reason
- `Single_Multi_Vendor` - Vendor type
- `Lead_Assignement_Status` - Assignment status

### Step 3: Restart Dashboard
```powershell
# Stop (Ctrl+C)
# Run again
python app.py
```

---

## 🔧 Configuration

Edit `.env` file to customize:

```env
DASH_DEBUG=True          # Live updates & error details
DASH_HOST=0.0.0.0       # Network accessibility
DASH_PORT=8050          # Port number
DATA_FOLDER=src/Leads_Data
```

### Common Changes

**Change Port:**
```env
DASH_PORT=8051
```

**Disable Debug Mode (Production):**
```env
DASH_DEBUG=False
```

**localhost only:**
```env
DASH_HOST=127.0.0.1
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [README.md](README.md) | Full feature documentation |
| [QUICKSTART.md](QUICKSTART.md) | Step-by-step guide |
| [CONFIG.md](CONFIG.md) | Advanced configuration |
| [src/CRM_ERP_DASHBOARD.py](src/CRM_ERP_DASHBOARD.py) | Main code |

---

## ✨ Key Capabilities

### Multi-Level Filtering
Combine multiple filters to slice data by:
- Business Unit
- Customer
- Year
- Lead Type
- Lead Stage
- Lead Status

### Smart KPI Calculation
Automatic computation of:
- Total leads
- Pipeline value
- Top performers
- Approval rates
- Overdue tracking

### Risk Management
- Heatmap showing overdue leads
- By SBU and status
- Easy identification of bottlenecks

### Financial Insights
- Planned vs Achieved comparison
- Lost value analysis
- Value by business unit
- Yearly trends

### Data Export
- Searchable table view
- Sortable columns
- Copy/paste capability
- Filter within table

---

## 🆘 Troubleshooting

### Issue: "No module named dash"
```powershell
# Make sure virtual environment is activated
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Issue: "Port 8050 already in use"
```env
# Change in .env
DASH_PORT=8051
```

### Issue: "No data showing"
1. Check Excel files in `src/Leads_Data/`
2. Verify column names match exactly
3. Ensure no blank sheets
4. Check browser console (F12)

### Issue: "Permission denied when activating venv"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Excel file errors
- Skip temp files starting with `~$`
- Ensure `.xlsx` or `.xls` format
- Check for merged cells or unusual formatting

---

## 🎓 Next Steps

1. ✅ Setup environment (done)
2. 📂 Add Excel files to `src/Leads_Data/`
3. 🚀 Run `python app.py`
4. 🌐 Open http://localhost:8050
5. 📊 Use filters to analyze data
6. 📈 Customize charts (see CONFIG.md)
7. 🔐 Deploy to production (see CONFIG.md)

---

## 💡 Pro Tips

- **Hover over charts** for interactive details
- **Click buttons** to toggle sections
- **Filter combinations** for deep analysis
- **Table search** to find specific leads
- **Export data** from the raw table

---

## 📞 Support Resources

- Browser Console: Press **F12 → Console** for errors
- Terminal Output: Check for Python/library errors
- Excel Structure: Verify column names and data types
- Network: Use `http://your-ip:8050` for network access

---

**Your CRM Dashboard is Ready! 🎉**

Start with: `python app.py`

Access at: **http://localhost:8050**

---

Last updated: January 29, 2026
