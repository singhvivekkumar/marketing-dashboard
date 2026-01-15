import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataTable from './DataTable'; // Separate component for the table
import parseExcel from '../utils/parseExcel';

function TabbedExcelTable() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [excelData, setExcelData] = React.useState({}); // Store parsed data by sheet name
  const [selectedFile, setSelectedFile] = React.useState(null);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLoadExcel = async () => {
    if (selectedFile) {
      try {
        const parsedData = await parseExcel(selectedFile);
        setExcelData(parsedData);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        // Show error to the user
      }
    } else {
      alert("Please select an Excel file.");
    }
  };


  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <button onClick={handleLoadExcel}>Load Excel</button>

      <Tabs value={activeTab} onChange={handleTabChange}>
        {Object.keys(excelData).map((sheetName, index) => (
          <Tab key={index} label={sheetName} />
        ))}
      </Tabs>

      {Object.entries(excelData).map(([sheetName, data]) => (
        activeTab === parseInt(Object.keys(excelData).indexOf(sheetName)) && (
          <DataTable key={sheetName} data={data} sheetName={sheetName}/>
        )
      ))}
    </div>
  );
}

export default TabbedExcelTable;