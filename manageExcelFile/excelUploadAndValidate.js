import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

// import { DB_COLUMNS } from "./dbColumns";  
// // <-- import your DB column list

const DB_COLUMNS = [
  "serial_number",
  "tender_name",
  "customer",
  "tender_date",
  "bid_owner",
  "rfp_received_on",
  "emd_value",
  "rfp_due_date",
  "tender_ref_no",
];


export default function ExcelUploadAndValidate() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);

  // ----------------------------
  // HANDLE FILE UPLOAD
  // ----------------------------
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setSuccess("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert Excel to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        setError("Excel file is empty.");
        return;
      }

      const excelColumns = jsonData[0].map((col) => col.toString().trim());

      // Validate columns
      const missing = DB_COLUMNS.filter((col) => !excelColumns.includes(col));
      const extra = excelColumns.filter((col) => !DB_COLUMNS.includes(col));

      if (missing.length > 0 || extra.length > 0) {
        setError(
          `Column mismatch!
          Missing: ${missing.join(", ") || "None"}
          Extra: ${extra.join(", ") || "None"}`
        );
        return;
      }

      // Remove header & extract data rows
      const rows = jsonData.slice(1).map((row) => {
        const rowObj = {};
        DB_COLUMNS.forEach((col, index) => {
          rowObj[col] = row[index] || "";
        });
        return rowObj;
      });

      setExcelData(rows);
      setSuccess(`File validated successfully. Total rows: ${rows.length}`);
    };

    reader.readAsArrayBuffer(file);
  };

  // ----------------------------
  // SEND TO BACKEND
  // ----------------------------
  const handleUploadToServer = async () => {
    if (excelData.length === 0) {
      setError("No valid data found to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/leads/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: excelData }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Data successfully pushed into the database!");
      } else {
        setError(result.message || "Failed to upload data.");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Upload Excel (Validate + Import)
      </Typography>

      <Button
        variant="contained"
        component="label"
        sx={{ mt: 2 }}
      >
        Select Excel File
        <input
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleFileUpload}
        />
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}

      {/* Upload Button */}
      {excelData.length > 0 && (
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          onClick={handleUploadToServer}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Push to Database"}
        </Button>
      )}
    </Paper>
  );
}
