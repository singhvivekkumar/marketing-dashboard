# CRM Analytics Dashboard

A comprehensive Dash-based analytics dashboard for CRM lead management and ERP analysis.

## Features

- 📊 **Executive KPIs**: Total leads, value, top performers
- 📈 **Lead Analytics**: Status distribution, lead stages, ownership analysis
- 💰 **Financial Summary**: Planned vs achieved value, lost leads analysis
- 📅 **Trend Analysis**: Yearly trends, date-based tracking
- ⚠️ **Risk Management**: Heatmap of overdue leads by SBU and status
- 🎯 **Top Performers**: High-value leads visualization
- 🔍 **Data Filtering**: Multi-filter support (SBU, Customer, Year, Lead Type, Stage, Status)
- 📋 **Raw Data Export**: Searchable and sortable data table

## Project Structure

```
dash/
├── app.py                          # Main entry point
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── README.md                      # This file
└── src/
    ├── CRM_ERP_DASHBOARD.py      # Main dashboard application
    └── Leads_Data/               # Excel data files (add your data here)
```

## Setup Instructions

### 1. Create Virtual Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate it (Windows PowerShell)
venv\Scripts\Activate.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3. Add Your Data

Place your Excel files (.xlsx or .xls) in the `src/Leads_Data/` folder:

```powershell
mkdir src\Leads_Data
# Copy your Excel files here
```

### 4. Configure Environment

Edit `.env` file if needed:

```
DASH_DEBUG=True
DASH_HOST=0.0.0.0
DASH_PORT=8050
DATA_FOLDER=src/Leads_Data
```

### 5. Run the Dashboard

```powershell
python app.py
```

Dashboard will be available at: **http://localhost:8050**

## Required Excel Columns

The dashboard expects the following columns in your Excel files:

- `Lead_Id` - Unique lead identifier
- `Lead_Name` - Name of the lead
- `Lead_Status` - Current status (Won, Lost, Pending, etc.)
- `Lead_Stages` - Stage (Planned, Achieved, etc.)
- `UNIT_SBU` - Business unit or SBU
- `Lead_Owner` - Person responsible
- `Main_Customer` - Customer name
- `Lead_Type` - Type of lead
- `Value_in_Rs_(Lakhs)` - Lead value in lakhs
- `Creation_Date` - When lead was created
- `Due_date` - Due date
- `Reason` - Approval/Decision reason
- `Single_Multi_Vendor` - Vendor type
- Date columns: `Tech_Bid_Open_Date`, `Commercial_Bid_Opening_Date`, `PNC_Conclusion_Date`, `Contracted_Date`

## Usage

1. **Filter Data**: Use the dropdown filters at the top to slice data
2. **Toggle Sections**: Click buttons to show/hide dashboard sections
3. **Interactive Charts**: Hover over charts for details
4. **Export Data**: Use the raw table section to view and filter detailed data

## Troubleshooting

### Module not found error
```powershell
# Make sure virtual environment is activated
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Port already in use
Edit `.env` and change `DASH_PORT` to a different value (e.g., 8051)

### No data showing
1. Ensure Excel files are in `src/Leads_Data/`
2. Check Excel column names match expected format
3. Check browser console for errors (F12)

## Development

### Code Style

```powershell
# Format code
black src/

# Check style
flake8 src/
```

### Adding Features

The main logic is in [src/CRM_ERP_DASHBOARD.py](src/CRM_ERP_DASHBOARD.py):
- Callbacks are at the bottom of the file
- Modify the `update_dashboard()` function to add new filters or charts
- Add new graphs using Plotly Express (`px.`) or Graph Objects (`go.`)

## Performance Tips

- For large datasets (>50k rows), consider:
  - Pre-filtering data before upload
  - Using `dash_virtualized` for tables
  - Caching data with `@cache.memoize()`

## Support

For issues or questions, check:
1. Browser console (F12 → Console tab)
2. Terminal output for Python errors
3. Excel file column names and data types

## License

Internal Use Only

---

**Last Updated**: January 2026
