import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";

const tenderTypeOptions = ["ST", "MT", "Nom", "LT"];
const documentTypeOptions = ["RFP", "RFQ", "EOI", "BQ", "NIT", "RFI", "Others"];

const CRMLeadForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const API = "/getCRMLeads";
  let user = JSON.parse(localStorage.getItem("user"));
  console.log(" user object ", user);

  useEffect(() => {
    axios
      .get(`/config.json`)
      .then(function (response) {
        SetServerIp(response.data.project[0].ServerIP[0].NodeServerIP);

        axios
          .get(response.data.project[0].ServerIP[0].NodeServerIP + API)
          .then((response) => {
            console.log(response);
            setOrderData(response?.data);
          })
          .catch((error) => console.log(error.message));
      })
      .catch(function (error) {
        // console.log("config.json BudgetaryQuotationFormerror", error);
        SetServerIp("172.195.120.135");

        // console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }, []);

  // const defaultServerIp = "http://localhost:8082";
  // const serverIp = props?.ServerIp || defaultServerIp;

  // const SaveDataURL = `${serverIp}/CreateCRMLead`;
  // const GetDataURL = `${serverIp}/GetCRMLead`; // or /GetCRMLead based on backend

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leadID: "",
      issueDate: "",
      tenderName: "",
      organisation: "",
      documentType: "",
      tenderType: "",
      emdInCrore: "",
      approxTenderValueCrore: "",
      lastDateSubmission: "",
      preBidDate: "",
      teamAssigned: "",
      remarks: "",
      corrigendumInfo: "",
      // OperatorId:
      // OperatorName:
      // OperatorRole:
      // OperatorSBU:
    },
  });

  const onSubmit = (data) => {
    console.log("Raw Form Data:", data);

    const formattedData = {
      leadID: data.leadID,
      issueDate: data.issueDate,
      tenderName: data.tenderName,
      organisation: data.organisation,
      documentType: data.documentType,
      tenderType: data.tenderType,
      emdInCrore:
        data.emdInCrore !== ""
          ? parseFloat(parseFloat(data.emdInCrore).toFixed(5))
          : null,
      approxTenderValueCrore:
        data.approxTenderValueCrore !== ""
          ? parseFloat(parseFloat(data.approxTenderValueCrore).toFixed(5))
          : null,
      // emdInCrore:data.emdInCrore,
      // approxTenderValueCrore:data.approxTenderValueCrore,
      lastDateSubmission: data.lastDateSubmission,
      preBidDate: data.preBidDate,
      teamAssigned: data.teamAssigned,
      remarks: data.remarks || "",
      corrigendumInfo: data.corrigendumInfo || "",
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
      submittedAt: new Date().toISOString(),
    };

    console.log("Frontend Form Data:", JSON.stringify(formattedData, null, 2));

    // Old console block kept as comment:
    // console.log(
    //   "Budgetary Quotation Data:",
    //   JSON.stringify(formattedData, null, 2)
    // );

    axios
      .post(ServerIp + API, formattedData)
      .then((response) => {
        // console.log("formattedData after ")
        console.log("Server Response:", response.data);
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  // RESET
  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  // SNACKBAR CLOSE
  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  // DOWNLOAD JSON
  const handleDownloadJSON = () => {
    if (submittedData) {
      const dataStr = JSON.stringify(submittedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `crm-leads-${
        submittedData.serialNumber
      }-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Tabs value={value} onChange={(e, v) => setValue(v)}>
        <Tab label="Create Data"></Tab>
        <Tab label="View Data"></Tab>
        <Tab label="Bulk Upload"></Tab>
      </Tabs>

      {value === 0 && (
        <Paper
          elevation={3}
          sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#ffffff" }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h4" className="section-title">
              CRM Leads Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill all details below to submit the CRM lead form
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="tender-card">
              <CardContent>
                <Typography variant="h6" className="section-title">
                  CRM Lead Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {[
                    ["leadID", "Lead ID"],
                    ["issueDate", "Issue Date", "date"],
                    ["tenderName", "Tender Name"],
                    ["organisation", "Organisation"],
                  ].map(([name, label, type]) => (
                    <Grid item xs={12} md={6} key={name}>
                      <Controller
                        name={name}
                        control={control}
                        rules={{ required: `${label} is required` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type={type || "text"}
                            label={label}
                            InputLabelProps={{ shrink: true }}
                            className="text-field-style"
                            error={!!errors[name]}
                            helperText={errors[name]?.message}
                          />
                        )}
                      />
                    </Grid>
                  ))}

                  {/* Document Type */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="documentType"
                      control={control}
                      rules={{ required: "Document Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Document Type"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.documentType}
                          helperText={errors.documentType?.message}
                        >
                          {documentTypeOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Tender Type */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="tenderType"
                      control={control}
                      rules={{ required: "Tender Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Tender Type"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.tenderType}
                          helperText={errors.tenderType?.message}
                        >
                          {tenderTypeOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* EMD Value */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="emdInCrore"
                      control={control}
                      rules={{ required: "EMD value is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="EMD in Crore"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.emdInCrore}
                          helperText={errors.emdInCrore?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Approx Tender Value */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="approxTenderValueCrore"
                      control={control}
                      rules={{
                        required: "Approx Tender Value is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Approx Tender Value in Crore"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.approxTenderValueCrore}
                          helperText={errors.approxTenderValueCrore?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Last Date of Submission */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="lastDateSubmission"
                      control={control}
                      rules={{
                        required: "Last Date of Submission is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          label="Last Date of Submission"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.lastDateSubmission}
                          helperText={errors.lastDateSubmission?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Pre Bid Date */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="preBidDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="datetime-local"
                          fullWidth
                          label="Pre-bid Date & Time"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>

                  {/* Team Assigned */}
                  <Grid item xs={12}>
                    <Controller
                      name="teamAssigned"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Team Assigned"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.teamAssigned}
                          helperText={errors.teamAssigned?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={2}
                          label="Remarks"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>

                  {/* Corrigendum */}
                  <Grid item xs={12}>
                    <Controller
                      name="corrigendumInfo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Corrigendums Date & File"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* BUTTONS */}
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                className="btn-submit"
              >
                Submit
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                type="button"
                variant="outlined"
                size="large"
                className="btn-reset"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </form>

          {/* SUCCESS SNACKBAR */}
          <Snackbar
            open={submitSuccess}
            autoHideDuration={4500}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              CRM Lead submitted successfully!
            </Alert>
          </Snackbar>

          {/* JSON PREVIEW */}
          {submittedData && (
            <Box sx={{ mt: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Submitted Data (JSON)</Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleDownloadJSON}
                >
                  Download JSON
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  backgroundColor: "#f1f1f1",
                  maxHeight: 450,
                  overflow: "auto",
                  borderRadius: 2,
                }}
              >
                <pre>{JSON.stringify(submittedData, null, 2)}</pre>
              </Paper>
            </Box>
          )}
        </Paper>
      )}

      {value === 1 && orderData !== undefined && (
        <ViewCRMLeadData ViewData={orderData}></ViewCRMLeadData>
      )}

      {/* ------------------------ BULK UPLOAD ------------------------ */}
      {value === 2 && (
        <ExcelUploadAndValidate user={user} ServerIp={ServerIp} />
      )}


    </Container>
  );
};



function ViewCRMLeadData(props) {
  console.log("props view BudgetaryQuotationData", props.ViewData);

  return (
    <>
      {/* {console.log("rows", rows)} */}
      <Typography
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontWeight: "bold",
          color: "#000",
          fontSize: "1.4rem",
          textSizeAdjust: "auto",
          textAlign: "center",
          backgroundColor: "lavender",
        }}
      >
        User Profile Created List
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bolder", fontSize: "15px" }}>
                Lead ID
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Issue Date
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Tender Name
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Organisation
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Document Type
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Tender Type
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                EMD in Cr
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Approx Tender value in Cr
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Last Date of Submission
              </TableCell>

              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Pre-bid Date
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Team Assigned
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Remarks
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Corrigendum Info
              </TableCell>

              {/* <TableCell style={{ fontWeight: "bolder",fontSize:'15px' }} align="left">Created date</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.ViewData.data?.map((row, index) => (
              <TableRow key={row.id}>
                {/* leadID: "",
                issueDate: "",
                tenderName: "",
                organisation: "",
                documentType: "",
                tenderType: "",
                emdInCrore: "",
                approxTenderValueCrore: "",
                lastDateSubmission: "",
                preBidDate: "",
                teamAssigned: "",
                remarks: "",
                corrigendumInfo: "", */}
                <TableCell component="th" scope="row">
                  {row.leadID}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.issueDate}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.tenderName}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.organisation}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.documentType}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.tenderType}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.emdInCrore}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.approxTenderValueCrore}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.lastDateSubmission}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.preBidDate}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.teamAssigned}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.remarks}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.corrigendumInfo}
                </TableCell>
                <TableCell align="left">{row.dateCreated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

// ---------------------------------------------------------------------------
// PUSH 
// ---------------------------------------------------------------------------

function ExcelUploadAndValidate({ user, ServerIp }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const DB_COLUMNS = [
    "leadID",
    "issueDate",
    "tenderName",
    "organisation",
    "documentType",
    "tenderType",
    "emdInLakhs",
    "approxTenderValueLakhs",
    "lastDateSubmission",
    "preBidDate",
    "teamAssigned",
    "remarks",
    "corrigendumInfo",
    // user info
    "OperatorId",
    "OperatorName",
    "OperatorRole",
    "OperatorSBU",
  ];

  const DB_COLUMNS_MATCH = [
    "leadID",
    "issueDate",
    "tenderName",
    "organisation",
    "documentType",
    "tenderType",
    "emdInLakhs",
    "approxTenderValueLakhs",
    "lastDateSubmission",
    "preBidDate",
    "teamAssigned",
    "remarks",
    "corrigendumInfo",
  ];

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
      const missing = DB_COLUMNS_MATCH.filter(
        (col) => !excelColumns.includes(col)
      );
      const extra = excelColumns.filter(
        (col) => !DB_COLUMNS_MATCH.includes(col)
      );

      if (missing.length > 0 || extra.length > 0) {
        setError(
          `Column mismatch!
          Missing : ${missing.join(", ") || "None"}; 
          Extra : ${extra.join(", ") || "None"}`
        );
        return;
      }

      // Remove header & extract data rows

      console.log("jsonData from browse", jsonData);
      const rows = jsonData.slice(1).map((row) => {
        const rowObj = {};
        DB_COLUMNS.forEach((col, index) => {
          // if (col==="") {
          //   setError(`This field is blank`)
          //   return;
          // }
          if (col === "OperatorId") {
            rowObj[col] = user?.id || "291536";
            return;
          }

          if (col === "OperatorName") {
            rowObj[col] = user?.username;
            return;
          }

          if (col === "OperatorRole") {
            rowObj[col] = user?.userRole;
            return;
          }

          if (col === "OperatorSBU") {
            rowObj[col] = "Software SBU";
            return;
          } else {
            rowObj[col] = row[index] || "";
          }
        });
        return rowObj;
      });

      setExcelData(rows);
      setSuccess(`File validated successfully. Total rows: ${rows.length}`);
    };
    console.log(excelData);

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
    // setExcelData(...excelData, {
    //   OperatorId: user.id || "291536",
    //   OperatorName: user.username || "Vivek Kumar Singh",
    //   OperatorRole: user.userRole || "Lead Owner",
    //   OperatorSBU: "Software SBU",
    // })

    // VIEW FINALLY THE DATA IS GOING TO BACKEND
    console.log(
      "VIEW FINAL DATA IS GOING INTO BACKEND : ",
      excelData,
      "ServerIP : ",
      ServerIp
    );

    // HERE WE ARE CALLING THE API TO BULK UPLOAD
    axios
      .post(ServerIp + "/crmLeadsBulkUpload", { excelData })
      .then((response) => {
        console.log("Server response : ", response);
        if (response) {
          setSuccess("Data successfully pushed into the database!");
        } else {
          setError(response?.data || "Failed to upload data.");
        }
      })
      .catch((error) => {
        console.log(error.message);
        setError("Server error: " + error.message);
      })
      .finally(() => {
        console.log(" finally is hitted");
      });

    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        // border: 1,
      }}
    >
      <Paper elevation={3} sx={{ p: 6, maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom>
          Upload Excel
        </Typography>

        <Button variant="contained" component="label" sx={{ mt: 2 }}>
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
    </Box>
  );
}

export default CRMLeadForm;