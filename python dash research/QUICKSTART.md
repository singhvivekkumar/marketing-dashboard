# Quick Start Guide - CRM Analytics Dashboard

## 🚀 Step-by-Step Setup

### Step 1: Open PowerShell in Project Folder
```powershell
cd "c:\VIVEK  TECH\Python\dash"
```

### Step 2: Create & Activate Virtual Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\Activate.ps1

# If you get permission error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 4: Prepare Your Data
```powershell
# Create data folder if needed
mkdir src\Leads_Data

# Copy your Excel files here
# Example: src\Leads_Data\leads_2024.xlsx
```

### Step 5: Run the Dashboard
```powershell
python app.py
```

### Step 6: Open in Browser
Navigate to: **http://localhost:8050**

---

## 📊 Dashboard Features

| Feature | Description |
|---------|-------------|
| **KPI Cards** | Total leads, value, top performers |
| **Lead Status** | Distribution pie chart |
| **Sector Analysis** | Civil vs Defence breakdown |
| **SBU Performance** | Value by business unit |
| **Owner Performance** | Leads per owner |
| **Financial Summary** | Planned vs Achieved vs Lost |
| **Risk Heatmap** | Overdue leads by SBU |
| **Top 10 Leads** | Highest value opportunities |
| **Trend Analysis** | Yearly and date-based trends |
| **Raw Data Table** | Searchable, sortable data |

---

## 📁 Required Excel Columns

Your Excel files should have these columns:

```
Lead_Id                          → Unique identifier
Lead_Name                        → Lead name
Lead_Status                      → Won/Lost/Pending
Lead_Stages                      → Planned/Achieved
UNIT_SBU                         → Business unit
Lead_Owner                       → Owner name
Main_Customer                    → Customer name
Lead_Type                        → Type/Category
Value_in_Rs_(Lakhs)            → Value in lakhs
Creation_Date                    → Created date
Due_date                         → Due date
Reason                          → Approval reason
Single_Multi_Vendor             → Vendor type
Tech_Bid_Open_Date              → Date
Commercial_Bid_Opening_Date     → Date
PNC_Conclusion_Date             → Date
Contracted_Date                 → Date
```

---

## 🔧 Troubleshooting

### Error: "Module not found"
```powershell
# Activate virtual environment
venv\Scripts\Activate.ps1

# Reinstall
pip install -r requirements.txt
```

### Error: "Port 8050 already in use"
Edit `.env`:
```
DASH_PORT=8051
```

### Error: "No data showing"
1. Check `src/Leads_Data/` has Excel files
2. Check column names match exactly
3. Check for blank sheets in Excel

### Error: "Permission denied"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\Activate.ps1
```

---

## 💡 Tips

- **Filter Data**: Use dropdown filters to slice by SBU, Customer, Year, etc.
- **Toggle Sections**: Click blue buttons to show/hide sections
- **Interactive Charts**: Hover over charts for tooltips
- **Export Table**: Copy data from raw table section

---

## 📞 Need Help?

1. Check browser console: **F12 → Console**
2. Check terminal for Python errors
3. Verify Excel file structure
4. Restart dashboard: **Ctrl+C** then `python app.py`

---

**Happy Analyzing! 📈**
