import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import * as XLSX from "xlsx";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import dayjs from "dayjs";

const OrederReceivedForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  // form here we have started file uploading logic
  const [browsefile, setbrowsefile] = useState(null);
  const [uploadFileData, setuploadFileData] = useState();
  const [orderData, setOrderData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [presentDate, setPrsentDate] = useState(new Date());
  const [ServerIp, SetServerIp] = useState("");
  const [SaveDataHardDiskURL, SetSaveDataHardDiskURL] = useState("");
  const [value, setValue] = useState(0);

  const orderTypes = ["ST", "MT"];

  const API = "/getOrderReceived";
  const API2 = "/pdfupload";

  let user = JSON.parse(localStorage.getItem("user"));
  console.log(" user object ", user);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contractName: "",
      customerName: "",
      customerAddress: "",
      orderReceivedDate: "",
      purchaseOrder: "",
      typeOfTender: "",
      valueWithoutGST: "",
      valueWithGST: "",
      JSON_competitors: "",
      remarks: "",
      contractCopy: "",
      // operator details
      OperatorId: "",
      OperatorName: "",
      OperatorRole: "",
      OperatorSBU: "",
      // files details
      fileName: "",
      filePath: "",
      hardDiskFileName: "",
      Dom_or_Export: "",
    },
  });

  // let user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`/config.json`)
      .then(function (response) {
        SetServerIp(response.data.project[0].ServerIP[0].NodeServerIP);
        axios
          .get(response.data.project[0].ServerIP[0].NodeServerIP + API)
          .then((response) => {
            setOrderData(response.data);
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

  const onSubmit = (data) => {
    // Convert string numbers to actual numbers with 2 decimal precision

    console.log(data);
    const formattedData = {
      contractName: data.contractName,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      orderReceivedDate: data.orderReceivedDate,
      purchaseOrder: data.purchaseOrder,
      typeOfTender: data.typeOfTender,
      valueWithoutGST: parseFloat(parseFloat(data.valueWithoutGST).toFixed(2)),
      valueWithGST: parseFloat(parseFloat(data.valueWithGST).toFixed(2)),
      JSON_competitors: data.JSON_competitors,
      remarks: data.remarks,
      attachment: selectedFile ? selectedFile.name : "",
      submittedAt: new Date().toISOString(),
      // new fields
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
      submittedAt: new Date().toISOString(),

      fileName: uploadFileData?.fileName,
      filePath: uploadFileData?.filePath,
      hardDiskFileName: uploadFileData?.hardDiskFileName,

      Dom_or_Export: "1",
    };

    // veiw the data of the form in JSON form
    console.log("Form Data:", JSON.stringify(formattedData, null, 2));

    axios
      .post(ServerIp + API, formattedData)
      .then((response) => {
        // console.log("formattedData after ")
        console.log(response.data);
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };

  const handleFileChange = (event) => {
    if (event.target.files[0].type.includes("pdf")) {
      setbrowsefile(event.target.files[0]);
      setSelectedFile(event.target.files[0]);
      // console.log(event.target.files[0]);
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
      alert("Please Select pdf only");
    }
  };

  const handleFileUpload = (event) => {
    event.preventDefault();

    if (browsefile && (user != null || user.id !== undefined)) {
      if (browsefile.type.includes("pdf")) {
        const formData = new FormData();

        const originalFileName = browsefile.name;
        const newFileName = user.id + "$" + originalFileName;

        const updatedFile = new File([browsefile], newFileName, {
          type: browsefile.type,
        });

        console.log("updated file by File class: ", updatedFile);

        formData.append("video", updatedFile);

        let TodayDate = dayjs();
        let NewTodayDate = TodayDate.format("DD-MM-YYYY hh:mm:ss a");
        setPrsentDate(NewTodayDate);

        fetch(SaveDataHardDiskURL, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log("res :8081/pdfupload", data);
            // console.log(newFileName);
            setuploadFileData({
              fileName: originalFileName,
              filePath: data.path,
              hardDiskFileName: data.fileName,
              createdDate: presentDate,
            });
          })
          .catch((error) => console.error(error));
      }
    } else {
      alert("Please Select pdf only or Server is Down");
    }
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
    setSelectedFile(null);
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  const handleDownloadJSON = () => {
    if (submittedData) {
      const dataStr = JSON.stringify(submittedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `domestic-order-${
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

      {/* ------------------------ CRETE FORM ------------------------ */}
      {value === 0 && (
        <Paper
          elevation={3}
          sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#ffffff" }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600, color: "#1976d2" }}
            >
              Domestic Order Received Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete all required fields to submit order information
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Order Details Section */}
            <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mb: 2, color: "#1976d2" }}
                >
                  📋 Order Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name="contractName"
                      control={control}
                      rules={{ required: "Contract Name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contract Name"
                          fullWidth
                          required
                          error={!!errors.contractName}
                          helperText={errors.contractName?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="orderReceivedDate"
                      control={control}
                      rules={{ required: "Order Received Date is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Order Received Date"
                          type="date"
                          fullWidth
                          required
                          error={!!errors.orderReceivedDate}
                          helperText={errors.orderReceivedDate?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Customer Information Section */}
            <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mb: 2, color: "#1976d2" }}
                >
                  👤 Customer Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="customerName"
                      control={control}
                      rules={{ required: "Customer Name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Customer Name"
                          fullWidth
                          required
                          error={!!errors.customerName}
                          helperText={errors.customerName?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="customerAddress"
                      control={control}
                      rules={{ required: "Customer Address is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Customer Address"
                          multiline
                          rows={3}
                          fullWidth
                          required
                          error={!!errors.customerAddress}
                          helperText={errors.customerAddress?.message}
                          variant="outlined"
                          placeholder="Enter complete customer address..."
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Document Information Section */}
            <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mb: 2, color: "#1976d2" }}
                >
                  📄 Document Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="purchaseOrder"
                      control={control}
                      rules={{
                        required:
                          "Purchase Order/Work Order Number is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Purchase Order/Work Order Number"
                          fullWidth
                          required
                          error={!!errors.purchaseOrder}
                          helperText={errors.purchaseOrder?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="typeOfTender"
                      control={control}
                      rules={{ required: "Order Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Order Type"
                          fullWidth
                          required
                          error={!!errors.typeOfTender}
                          helperText={errors.typeOfTender?.message}
                          variant="outlined"
                        >
                          {orderTypes.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Financial Details Section */}
            <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mb: 2, color: "#1976d2" }}
                >
                  💰 Financial Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Tooltip
                      title="Enter value in crore (e.g., 1.50 for 1.5 crore)"
                      arrow
                    >
                      <Controller
                        name="valueWithoutGST"
                        control={control}
                        rules={{
                          required: "Value without GST is required",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message:
                              "Please enter a valid number with max 2 decimals",
                          },
                          min: {
                            value: 0.01,
                            message: "Value must be greater than 0",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Value without GST (in Crore)"
                            // type="number"
                            fullWidth
                            required
                            error={!!errors.valueWithoutGST}
                            helperText={
                              errors.valueWithoutGST?.message ||
                              "Enter value in crore"
                            }
                            variant="outlined"
                            inputProps={{
                              step: "0.01",
                              min: "0",
                            }}
                            InputProps={{
                              startAdornment: (
                                <Typography sx={{ mr: 1 }}>₹</Typography>
                              ),
                              endAdornment: (
                                <Typography
                                  sx={{
                                    ml: 1,
                                    fontSize: "0.875rem",
                                    color: "text.secondary",
                                  }}
                                >
                                  Cr
                                </Typography>
                              ),
                            }}
                          />
                        )}
                      />
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Tooltip
                      title="Enter value in crore (e.g., 1.77 for 1.77 crore)"
                      arrow
                    >
                      <Controller
                        name="valueWithGST"
                        control={control}
                        rules={{
                          required: "Value with GST is required",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message:
                              "Please enter a valid number with max 2 decimals",
                          },
                          min: {
                            value: 0.01,
                            message: "Value must be greater than 0",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Value with GST (in Crore)"
                            // type="number"
                            fullWidth
                            required
                            error={!!errors.valueWithGST}
                            helperText={
                              errors.valueWithGST?.message ||
                              "Enter value in crore"
                            }
                            variant="outlined"
                            inputProps={{
                              step: "0.01",
                              min: "0",
                            }}
                            InputProps={{
                              startAdornment: (
                                <Typography sx={{ mr: 1 }}>₹</Typography>
                              ),
                              endAdornment: (
                                <Typography
                                  sx={{
                                    ml: 1,
                                    fontSize: "0.875rem",
                                    color: "text.secondary",
                                  }}
                                >
                                  Cr
                                </Typography>
                              ),
                            }}
                          />
                        )}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Competitors & Remarks Section */}
            <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mb: 2, color: "#1976d2" }}
                >
                  🏢 Competitors &amp; Remarks
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="JSON_competitors"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Competitors (Optional)"
                          multiline
                          rows={3}
                          fullWidth
                          variant="outlined"
                          placeholder="Enter competitor names separated by commas (e.g., Company A, Company B, Company C)"
                          helperText="List all competing companies for this order"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Remarks (Optional)"
                          multiline
                          rows={4}
                          fullWidth
                          variant="outlined"
                          placeholder="Add any additional comments or notes about this order..."
                          helperText="Any special notes or observations"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Attachments Section */}
            <Card sx={{ mb: 3, backgroundColor: "#f8f9fa" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, mb: 2, color: "#1976d2" }}
                >
                  📎 Attachments
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Upload Contract Copy / Work Order / Letter of Intent
                    (Optional)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Choose File
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ mt: 2, mb: 2, marginLeft: 24 }}
                    onClick={handleFileUpload}
                  >
                    Upload File
                  </Button>
                  {selectedFile && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={selectedFile.name}
                        onDelete={() => setSelectedFile(null)}
                        color="primary"
                        variant="outlined"
                        sx={{ maxWidth: "100%" }}
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1, color: "text.secondary" }}
                      >
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                mt: 4,
                flexWrap: "wrap",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ minWidth: 150, px: 4, py: 1.5 }}
              >
                Submit Order
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleReset}
                sx={{ minWidth: 150, px: 4, py: 1.5 }}
              >
                Reset Form
              </Button>
            </Box>
          </form>

          {/* Success Snackbar */}
          <Snackbar
            open={submitSuccess}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Form submitted successfully! Check console for JSON output.
            </Alert>
          </Snackbar>

          {/* Submitted Data Display */}
          {submittedData && (
            <Box sx={{ mt: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  📊 Submitted Data (JSON)
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDownloadJSON}
                  size="small"
                >
                  Download JSON
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  maxHeight: 500,
                  overflow: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  borderRadius: 2,
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {JSON.stringify(submittedData, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
        </Paper>
      )}
      
      {/* ------------------------ VIEW TABLE ------------------------ */}
      {value === 1 && (
        <ViewOrderRecievedData ViewData={orderData}></ViewOrderRecievedData>
      )}

      {/* ------------------------ BULK UPLOAD ------------------------ */}
      {value === 2 && (
        <ExcelUploadAndValidate user={user} ServerIp={ServerIp} />
      )}
    </Container>
  );
};

function ViewOrderRecievedData(props) {
  console.log("props viewOrderRecievedData", props);

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
                Contract Name
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Customer Name
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Customer Address
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Order Received Date
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Purchase Order
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Type of tender
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Value without GST
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Value with GST
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Competitors
              </TableCell>
              <TableCell
                style={{ fontWeight: "bolder", fontSize: "15px" }}
                align="left"
              >
                Remarks
              </TableCell>

              {/* <TableCell style={{ fontWeight: "bolder",fontSize:'15px' }} align="left">Created date</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.ViewData.data?.map((row, index) => (
              <TableRow key={row.id}>
                {/* contractName: "",
                customerName: "",
                customerAddress: "",
                orderReceivedDate: "",
                purchaseOrder: "",
                typeOfTender: "",
                valueWithoutGST: "",
                valueWithGST: "",
                JSON_competitors: "", */}
                <TableCell component="th" scope="row">
                  {row.contractName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.customerName}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.customerAddress}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.orderReceicedDate}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.purchaseOrder}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.typeOfTender}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.valueWithGST}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.valueWithoutGST}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.JSON_competitors}
                </TableCell>
                <TableCell style={{ fontSize: "14px" }} align="left">
                  {row.remarks}
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
// VIEW COMPONENT WITH SEARCH + FILTERS + SORT + EDIT / DELETE
// ---------------------------------------------------------------------------

function ExcelUploadAndValidate({ user, ServerIp }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const DB_COLUMNS = [
    "contractName",
    "customerName",
    "customerAddress",
    "orderReceivedDate",
    "purchaseOrder",
    "typeOfTender",
    "valueWithoutGST",
    "valueWithGST",
    "JSON_competitors",
    "remarks",
    "contractCopy",
    // user info
    "OperatorId",
    "OperatorName",
    "OperatorRole",
    "OperatorSBU",
  ];

  const DB_COLUMNS_MATCH = [
    "contractName",
    "customerName",
    "customerAddress",
    "orderReceivedDate",
    "purchaseOrder",
    "typeOfTender",
    "valueWithoutGST",
    "valueWithGST",
    "JSON_competitors",
    "remarks",
    "contractCopy",
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
      .post(ServerIp + "/orderReceivedBulkUpload", { excelData })
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

export default OrederReceivedForm;
