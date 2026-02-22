# Sample Data Template for CRM Dashboard

## Excel Template Structure

Your Excel file should have the following columns (in any order):

### Column Names & Descriptions

| Column Name | Data Type | Example | Description |
|-------------|-----------|---------|-------------|
| Lead_Id | Text | L001 | Unique identifier for each lead |
| Lead_Name | Text | Project Alpha | Name of the lead/opportunity |
| Lead_Status | Text | Won/Lost/Pending | Current status of the lead |
| Lead_Stages | Text | Planned/Achieved | Stage in pipeline |
| UNIT_SBU | Text | Defence SBU | Business unit/department |
| Lead_Owner | Text | John Doe | Person responsible for lead |
| Main_Customer | Text | Ministry of Defence | Customer organization |
| Lead_Type | Text | Defence/Civil | Type of lead |
| Value_in_Rs_(Lakhs) | Number | 50.5 | Lead value in lakhs |
| Creation_Date | Date | 2024-01-15 | When lead was created |
| Due_date | Date | 2024-06-30 | Expected close date |
| Tech_Bid_Open_Date | Date | 2024-02-10 | Technical bid opening date |
| Commercial_Bid_Opening_Date | Date | 2024-02-15 | Commercial bid opening date |
| PNC_Conclusion_Date | Date | 2024-03-20 | Conclusion date |
| Contracted_Date | Date | 2024-04-01 | Contract signed date |
| Reason | Text | Approved/Price High | Approval or rejection reason |
| Single_Multi_Vendor | Text | Single Vendor | Vendor type |
| Lead_Assignement_Status | Text | Approved | Assignment status |

---

## Sample Data

Create an Excel file with this data structure:

```
Lead_Id | Lead_Name | Lead_Status | Lead_Stages | UNIT_SBU | Lead_Owner | Main_Customer | Lead_Type | Value_in_Rs_(Lakhs) | Creation_Date | Due_date | Tech_Bid_Open_Date | Commercial_Bid_Opening_Date | PNC_Conclusion_Date | Contracted_Date | Reason | Single_Multi_Vendor | Lead_Assignement_Status
--------|-----------|-------------|-------------|----------|-----------|---------------|-----------|---------------------|---------------|----------|-------------------|---------------------------|------------------|------------------|--------|------------------|------------------------
L001 | Project Alpha | Won | Achieved | Defence SBU | John Doe | Ministry of Defence | Defence | 150.75 | 2024-01-15 | 2024-06-30 | 2024-02-10 | 2024-02-15 | 2024-03-20 | 2024-04-01 | Approved | Single Vendor | Approved
L002 | Infrastructure Beta | Lost | Planned | Civil SBU | Jane Smith | NHAI | Civil | 85.50 | 2024-01-20 | 2024-07-15 | 2024-02-12 | 2024-02-20 | 2024-03-25 |  | Price High | Multi Vendor | Regretted
L003 | Highway Project | Won | Achieved | Civil SBU | John Doe | PWD | Civil | 200.00 | 2024-02-01 | 2024-08-01 | 2024-02-15 | 2024-03-01 | 2024-03-30 | 2024-04-15 | Approved | Single Vendor | Approved
L004 | Defence Contract | Pending | Planned | Defence SBU | Robert Brown | Department of Defence | Defence | 120.30 | 2024-02-10 | 2024-09-01 | 2024-03-01 | 2024-03-10 |  |  | Under Review | Multi Vendor | Proposed
L005 | Metro Expansion | Lost | Planned | Civil SBU | Jane Smith | Delhi Metro | Civil | 450.00 | 2024-01-25 | 2024-07-20 | 2024-02-20 | 2024-03-05 | 2024-04-01 |  | Technical Issue | Single Vendor | SBU Assigned
```

---

## How to Create Excel File

### Using Microsoft Excel:
1. Open Excel
2. Enter column names in row 1
3. Fill in your lead data starting from row 2
4. Save as `.xlsx` format
5. Place in `src/Leads_Data/` folder

### Using Python/Pandas:
```python
import pandas as pd

data = {
    'Lead_Id': ['L001', 'L002', 'L003'],
    'Lead_Name': ['Project Alpha', 'Infrastructure Beta', 'Highway Project'],
    'Lead_Status': ['Won', 'Lost', 'Won'],
    'Lead_Stages': ['Achieved', 'Planned', 'Achieved'],
    'UNIT_SBU': ['Defence SBU', 'Civil SBU', 'Civil SBU'],
    'Lead_Owner': ['John Doe', 'Jane Smith', 'John Doe'],
    'Main_Customer': ['Ministry of Defence', 'NHAI', 'PWD'],
    'Lead_Type': ['Defence', 'Civil', 'Civil'],
    'Value_in_Rs_(Lakhs)': [150.75, 85.50, 200.00],
    'Creation_Date': ['2024-01-15', '2024-01-20', '2024-02-01'],
    'Due_date': ['2024-06-30', '2024-07-15', '2024-08-01'],
    'Tech_Bid_Open_Date': ['2024-02-10', '2024-02-12', '2024-02-15'],
    'Commercial_Bid_Opening_Date': ['2024-02-15', '2024-02-20', '2024-03-01'],
    'PNC_Conclusion_Date': ['2024-03-20', '2024-03-25', '2024-03-30'],
    'Contracted_Date': ['2024-04-01', None, '2024-04-15'],
    'Reason': ['Approved', 'Price High', 'Approved'],
    'Single_Multi_Vendor': ['Single Vendor', 'Multi Vendor', 'Single Vendor'],
    'Lead_Assignement_Status': ['Approved', 'Regretted', 'Approved']
}

df = pd.DataFrame(data)
df.to_excel('src/Leads_Data/sample_leads.xlsx', index=False)
```

---

## Notes

- **Column names are case-sensitive**: Use exact names shown above
- **Date format**: Use YYYY-MM-DD or let Excel format it
- **Optional columns**: Some columns can be empty (like Contracted_Date for pending leads)
- **Multiple files**: Dashboard supports multiple Excel files in `src/Leads_Data/`
- **Performance**: For >50k rows, split into multiple files by year/SBU

---

## Data Validation Tips

Before adding to dashboard, ensure:

1. ✅ No duplicate Lead_Id values
2. ✅ Lead_Status is one of: Won, Lost, Pending, etc.
3. ✅ Lead_Stages is one of: Planned, Achieved, etc.
4. ✅ Value_in_Rs_(Lakhs) is numeric (no text)
5. ✅ Dates are in YYYY-MM-DD format or recognized date format
6. ✅ No empty column headers
7. ✅ No extra spaces in column names

---

## Troubleshooting

### Issue: "No valid Excel files found"
- Check file extension is `.xlsx` or `.xls`
- Verify file is in `src/Leads_Data/` folder
- Ensure file isn't corrupted or opened elsewhere

### Issue: "Unknown columns"
- Check exact spelling and spacing of column names
- Column names are case-sensitive
- Remove any accidental spaces

### Issue: Data not loading
- Verify dates are recognized by Excel
- Check numeric values don't have currency symbols
- Ensure no hidden sheets

---

For more help, see:
- [README.md](README.md)
- [QUICKSTART.md](QUICKSTART.md)
- [CONFIG.md](CONFIG.md)
