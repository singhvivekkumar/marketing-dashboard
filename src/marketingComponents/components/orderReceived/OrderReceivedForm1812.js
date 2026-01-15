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
  Divider,
  Alert,
  Snackbar,
  Box,
  InputAdornment,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  Chip,
  CardContent,
  // Tab,
  MenuItem,
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  CircularProgress,
} from "@mui/material";
import * as FileSaver from "file-saver";
import {
  SearchRounded,
  NorthRounded,
  SouthRounded,
  RestartAltRounded,
  EditRounded,
  DeleteRounded,
  CloseRounded,
  CheckRounded,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import dayjs from "dayjs";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";

const STATUS_OPTIONS = [
  "Draft",
  "Submitted",
  "In Progress",
  "Under Review",
  "Won",
  "Lost",
  "On Hold",
];

const TENDER_TYPE_OPTIONS = ["ST", "MT", "Nom", "LT"];

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
        // WE SETTING THE API
        console.log(
          "LeadSubmitted is looking for server IP : ",
          response.data.project[0].ServerIP[0].NodeServerIP
        );
        SetServerIp(response.data.project[0].ServerIP[0].NodeServerIP);
        axios
          .get(response.data.project[0].ServerIP[0].NodeServerIP + API)
          .then((response) => {
            console.log(" error while getting API : ", response);
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
        console.log("Server Response:", response.data);
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
      link.download = `lead-submitted-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt:-8,
        py: 2,
        mb: 4,
        minHeight: "85vh",
        background: "linear-gradient(135deg, #e3eeff 0%, #f8fbff 100%)",
        borderRadius: 4,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Domestic Order Received Form
        </Typography>
      </Box>

      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        centered
        sx={{
          mb: 4,

          "& .MuiTabs-flexContainer": {
            justifyContent: "center", // ✅ center tab items
            gap: 1,
          },

          "& .MuiTab-root": {
            minHeight: 48,
            px: { xs: 2.5, sm: 4 },
            fontWeight: 700,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            textTransform: "none",
            borderRadius: 999,
            color: "#475569",
            transition: "all 0.25s ease",
            "&:hover": {
              backgroundColor: "rgba(59,130,246,0.12)",
              color: "#1e40af",
              transform: "translateY(-1px)",
            },
          },

          "& .Mui-selected": {
            color: "#ffffff !important",
            background:
              "linear-gradient(135deg,#2563eb 0%,#3b82f6 50%,#1d4ed8 100%)",
            boxShadow: "0 10px 28px rgba(37,99,235,0.45)",
          },

          "& .MuiTabs-indicator": {
            display: "none", // pill style
          },
        }}
      >
        <Tab label="Create Data" />
        <Tab label="View Data" />
        <Tab label="Bulk Upload" />
      </Tabs>

      {/* ------------------------ CREATE FORM ------------------------ */}
      {value === 0 && (
        <Container maxWidth="lg">
          <Paper
            elevation={10}
            sx={{
              p: { xs: 2, md: 5 },
              borderRadius: 2,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              // transition: "0.3s",
              boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
              // "&:hover": { transform: "scale(1.01)" },
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Order Details Section */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  // transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📋 Order Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
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

                  <Grid item xs={12} md={6}>
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
              </Card>

              {/* Customer Information Section */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  // transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  👤 Customer Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
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

                  <Grid item xs={12} md={6}>
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
              </Card>

              {/* Document Information Section */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  // transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📄 Document Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
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

                  <Grid item xs={12} md={6}>
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
              </Card>

              {/* Financial Details Section */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  // transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  💰 Financial Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
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

                  <Grid item xs={12} md={6}>
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
              </Card>

              {/* Competitors & Remarks Section */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  // transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  🏢 Competitors &amp; Remarks
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={6} md={6}>
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

                  <Grid item xs={6} md={6}>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Remarks (Optional)"
                          multiline
                          rows={3}
                          fullWidth
                          variant="outlined"
                          placeholder="Add any additional comments or notes about this order..."
                          helperText="Any special notes or observations"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Attachments Section */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  // transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
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
              </Card>

              {/* Form Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                  mt: 4,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 6,
                    py: 1.6,
                    fontSize: "1.1rem",
                    borderRadius: 3,
                    fontWeight: 700,
                    background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                    textTransform: "none",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      background: "linear-gradient(90deg, #0d47a1, #1e88e5)",
                    },
                  }}
                >
                  Submit Order
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleReset}
                  sx={{
                    px: 6,
                    py: 1.6,
                    fontSize: "1.1rem",
                    borderRadius: 3,
                    fontWeight: 700,
                    borderWidth: 2,
                    textTransform: "none",
                    "&:hover": {
                      transform: "scale(1.03)",
                      background: "#f4f6fb",
                    },
                  }}
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
              <Box sx={{ mt: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  📊 Submitted Data (JSON)
                </Typography>

                <Paper
                  sx={{
                    p: 3,
                    background: "#0d1117",
                    color: "#c9d1d9",
                    borderRadius: 4,
                    maxHeight: 500,
                    overflow: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.95rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </Paper>

                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: "#2e7d32",
                    "&:hover": { background: "#1b5e20" },
                  }}
                  onClick={handleDownloadJSON}
                >
                  Download JSON
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
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

const lightReadOnlyFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#f1f5ff",
    color: "#0f172a",
    "& fieldset": {
      borderColor: "#bfdbfe",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#1e3a8a",
    fontWeight: 600,
  },
  "& input": {
    cursor: "default",
  },
};

const lightTextFieldSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#ffffff",
    color: "#0f172a",
    "& fieldset": {
      borderColor: "#93c5fd",
    },
    "&:hover fieldset": {
      borderColor: "#3b82f6",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#1e3a8a",
    fontWeight: 600,
  },
};

function ViewOrderRecievedData(props) {
  console.log("props viewOrderRecievedData", props);

  const data = props.ViewData?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // READ-ONLY VIEW DIALOG STATE
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  // ---------------- HANDLERS ----------------

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleTenderTypeFilterChange = (e) =>
    setTenderTypeFilter(e.target.value);

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);

  const handleSortByChange = (e) => setSortBy(e.target.value);

  const toggleSortDirection = () =>
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleResetFilters = () => {
    setSearchTerm("");
    setTenderTypeFilter("all");
    setStatusFilter("all");
    setSortBy("dateCreated");
    setSortDirection("desc");
  };

  // DOWNLOAD ALL DATA AS EXCEL
  const handleDownloadAllData = () => {
    console.log("data given to handler : ", props.ViewData.data);
    if (!props.ViewData?.data || props.ViewData.data.length === 0) {
      alert("No data available to download");
      return;
    }

    // Convert JSON → worksheet
    const worksheet = XLSX.utils.json_to_sheet(props.ViewData.data);
    console.log(" worksheet : ", worksheet);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BudgetaryQuotations");
    console.log(" workbook : ", workbook);

    // Download file
    // XLSX.writeFile(workbook, "MyData.xlsx", FileSaver.saveAs);
    XLSX.writeFile(workbook, "MyData.xlsx", FileSaver.saveAs);

    // `Budgetary_Quotation_Data_${new Date().toISOString().slice(0, 10)}.xlsx`  // Original dynamic filename
    console.log(" work new book : ", workbook);
  };

  // Row Selection
  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  // OPEN EDIT DIALOG
  const handleEditClick = (row) => {
    setEditingRow({ ...row });
    setEditDialogOpen(true);
  };

  // UPDATE FIELD WHILE EDITING
  const handleEditFieldChange = (field, value) => {
    setEditingRow((prev) => ({ ...prev, [field]: value }));
  };

  // CANCEL EDIT
  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingRow(null);
  };

  // SAVE EDITED VALUES
  const handleEditSave = () => {
    console.log("Saving updated row:", editingRow);

    // TODO: update in backend or props function

    setEditDialogOpen(false);
  };
  // DELETE ROW
  const handleDeleteClick = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    console.log("Deleting row with ID:", id);

    // TODO: delete logic here
  };

  // DOUBLE CLICK → OPEN READ-ONLY VIEW
  const handleRowDoubleClick = (row) => {
    setViewRow(row);
    setViewDialogOpen(true);
  };

  // ===== TABLE STYLES =====
  const headerCellStyle = {
    fontWeight: 800,
    fontSize: 13,
    color: "#ecfeff",
    background:
      "linear-gradient(90deg, #0a47e0ff 0%, #1453b7ff 50%, #81a6daff 100%)",
    borderBottom: "none",
    whiteSpace: "nowrap",
  };

  const bodyCellStyle = {
    fontSize: 13,
    color: "#111827",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const ellipsisCell = {
    ...bodyCellStyle,
    maxWidth: 180,
  };

  const actionHeaderStyle = {
    ...headerCellStyle,
    textAlign: "center",
  };

  // ---------------- FILTER + SORT LOGIC ----------------
  const filteredSortedData =
    data &&
    data
      .filter((row) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          row.tenderName?.toLowerCase().includes(q) ||
          row.customerName?.toLowerCase().includes(q) ||
          row.tenderReferenceNo?.toLowerCase().includes(q) ||
          row.bidOwner?.toLowerCase().includes(q) ||
          row.customerAddress?.toLowerCase().includes(q);

        const matchesTenderType =
          tenderTypeFilter === "all" ||
          row.tenderType?.toLowerCase() === tenderTypeFilter.toLowerCase();

        const matchesStatus =
          statusFilter === "all" ||
          row.presentStatus?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesTenderType && matchesStatus;
      })
      .sort((a, b) => {
        let aVal;
        let bVal;

        switch (sortBy) {
          case "tenderDate":
            aVal = a.tenderDate || "";
            bVal = b.tenderDate || "";
            break;
          case "rfpDueDate":
            aVal = a.rfpDueDate || "";
            bVal = b.rfpDueDate || "";
            break;
          case "bidSubmittedOn":
            aVal = a.bidSubmittedOn || "";
            bVal = b.bidSubmittedOn || "";
            break;
          case "valueEMDInCrore":
            aVal = parseFloat(a.valueEMDInCrore) || 0;
            bVal = parseFloat(b.valueEMDInCrore) || 0;
            break;
          case "dateCreated":
          default:
            aVal = a.dateCreated || "";
            bVal = b.dateCreated || "";
            break;
        }

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

  return (
    <>
      {/* HEADER + CONTROLS */}
      <Box
        sx={{
          mb: 3,
          px: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
            boxShadow: 6,
            background:
              "linear-gradient(135deg, #e0f7ff 0%, #c8f0ff 40%, #a6e9ff 100%)",
            color: "#06283D",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                Order Received List
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.85, mt: 0.5, maxWidth: 520 }}
              >
                View, search, filter and manage all submitted tender leads in a
                single, elegant dashboard.
              </Typography>
            </Box>

            {/* SEARCH BOX */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by tender, customer, reference..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: "100%", sm: 260, md: 320 },
                backgroundColor: "rgba(240,248,255,0.9)",
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  color: "#0f172a",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(100,116,139,0.8)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#475569",
                },
              }}
            />
          </Box>

          {/* FILTERS + SORT */}
          <Box
            sx={{
              mt: 2.5,
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {/* TENDER TYPE FILTER */}
            <TextField
              select
              size="small"
              label="Tender Type"
              value={tenderTypeFilter}
              onChange={handleTenderTypeFilterChange}
              sx={{
                minWidth: 180,
                backgroundColor: "rgba(240,248,255,0.9)",
                borderRadius: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  color: "#0f172a",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(100,116,139,0.8)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": { color: "#475569" },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {TENDER_TYPE_OPTIONS.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            {/* STATUS FILTER */}
            <TextField
              select
              size="small"
              label="Present Status"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              sx={{
                minWidth: 170,
                backgroundColor: "rgba(240,248,255,0.9)",
                borderRadius: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  color: "#0f172a",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(100,116,139,0.8)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": { color: "#475569" },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            {/* SORT BY FILTER */}
            <TextField
              select
              size="small"
              label="Sort by"
              value={sortBy}
              onChange={handleSortByChange}
              sx={{
                minWidth: 170,
                backgroundColor: "rgba(240,248,255,0.9)",
                borderRadius: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  color: "#0f172a",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(100,116,139,0.8)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": { color: "#475569" },
              }}
            >
              <MenuItem value="dateCreated">Created Date</MenuItem>
              <MenuItem value="tenderDate">Tender Date</MenuItem>
              <MenuItem value="rfpDueDate">RFP Due Date</MenuItem>
              <MenuItem value="bidSubmittedOn">Bid Submitted On</MenuItem>
              <MenuItem value="valueEMDInCrore">EMD Value</MenuItem>
            </TextField>

            {/* SORT ICON BUTTON */}
            <Tooltip
              title={`Sort ${
                sortDirection === "asc" ? "Descending" : "Ascending"
              }`}
            >
              <IconButton
                onClick={toggleSortDirection}
                sx={{
                  ml: 0.5,
                  borderRadius: 2.5,
                  border: "1px solid rgba(148,163,184,0.7)",
                  backgroundColor: "rgba(240,248,255,0.9)",
                  color: "#0f172a",
                  "&:hover": {
                    backgroundColor: "rgba(224,242,254,1)",
                  },
                }}
              >
                {sortDirection === "asc" ? <SouthRounded /> : <NorthRounded />}
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              onClick={handleDownloadAllData}
              sx={{
                borderRadius: 999,
                background: "linear-gradient(135deg,#16a34a,#22c55e)",
                color: "#fff",
                textTransform: "none",
                px: 3,
                py: 0.9,
                fontWeight: 700,
                boxShadow: "0 6px 16px rgba(22,163,74,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg,#15803d,#16a34a)",
                },
              }}
            >
              Download All Data
            </Button>

            {/* RESET BUTTON */}
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              startIcon={<RestartAltRounded />}
              sx={{
                ml: { xs: 0, sm: "auto" },
                borderRadius: 999,
                border: "2px solid #0E4C92",
                color: "#0E4C92",
                textTransform: "none",
                px: 3,
                py: 0.8,
                fontWeight: 600,
                backgroundColor: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                transition: "0.2s ease",
                "&:hover": {
                  backgroundColor: "#d0eaff",
                  borderColor: "#0A3C7D",
                  color: "#0A3C7D",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1800px",
          mx: "auto",
          mt: 2,
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: 8,
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "50vh",
            minWidth: "100%",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              borderCollapse: "separate",
              borderSpacing: 0,
              "& th, & td": {
                borderRight: "1px solid rgba(203,213,225,0.8)",
              },
              "& th:last-child, & td:last-child": {
                borderRight: "none",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellStyle}>Tender Name</TableCell>
                <TableCell sx={headerCellStyle}>Customer Name</TableCell>
                <TableCell sx={headerCellStyle}>Customer Address</TableCell>
                <TableCell sx={{ ...headerCellStyle, minWidth: 200 }}>
                  Order Received Date
                </TableCell>
                <TableCell sx={headerCellStyle}>Purchase Order No</TableCell>
                <TableCell sx={headerCellStyle}>Tender Type</TableCell>
                <TableCell sx={headerCellStyle}>
                  Value in CR without GST
                </TableCell>
                <TableCell sx={headerCellStyle}>Value in CR with GST</TableCell>
                <TableCell sx={headerCellStyle}>Competitors</TableCell>
                <TableCell sx={headerCellStyle}>Remarks</TableCell>
                <TableCell sx={headerCellStyle}>
                  Contract Copy/ Work Order/LOI
                </TableCell>
                <TableCell sx={headerCellStyle}>Created Date</TableCell>
                <TableCell sx={actionHeaderStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>

            {/* defaultValues: {
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
    }, */}

            <TableBody>
              {filteredSortedData && filteredSortedData.length > 0 ? (
                filteredSortedData.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={selectedRow?.id === row.id}
                    onClick={() => handleRowSelect(row)}
                    onDoubleClick={() => handleRowDoubleClick(row)}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.18s ease-out",
                      "&:hover": {
                        backgroundColor: "rgba(59,130,246,0.06)",
                        boxShadow: 1,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontWeight: 600,
                        fontSize: 14,
                        maxWidth: 180,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {row.contractName}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontSize: 14,
                        maxWidth: 180,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {row.customerName}
                    </TableCell>

                    <TableCell
                      align="left"
                      sx={{
                        fontSize: 13,
                        maxWidth: 260,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {row.customerAddress}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.orderReceivedDate}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.purchaseOrder}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.typeOfTender}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.valueWithoutGST}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.valueWithGST}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.JSON_competitors}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.remarks}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.contractCopy}
                    </TableCell>

                    <TableCell align="left" sx={{ fontSize: 13 }}>
                      {row.dateCreated}
                    </TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(row);
                            }}
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "rgba(59,130,246,0.12)",
                              "&:hover": {
                                backgroundColor: "rgba(59,130,246,0.25)",
                              },
                            }}
                          >
                            <EditRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(row.id);
                            }}
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "rgba(239,68,68,0.12)",
                              "&:hover": {
                                backgroundColor: "rgba(239,68,68,0.25)",
                              },
                            }}
                          >
                            <DeleteRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={21} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#6b7280" }}>
                      No leads found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* EDIT DIALOG */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #f8fbff 0%, #eef5ff 50%, #e3eeff 100%)",
            color: "#0f172a",
            boxShadow: "0 25px 60px rgba(59,130,246,0.25)",
          },
        }}
      >
        {/* ---------------- TITLE ---------------- */}
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            color: "#0d47a1",
            background: "linear-gradient(90deg,#e3f2fd,#f8fbff)",
          }}
        >
          Edit Lead Submission
          <IconButton
            onClick={handleEditCancel}
            sx={{
              color: "#1e40af",
              "&:hover": { backgroundColor: "rgba(59,130,246,0.15)" },
            }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        {/* ---------------- CONTENT ---------------- */}
        <DialogContent
          dividers
          sx={{
            background: "#f8fbff",
            borderColor: "rgba(59,130,246,0.25)",
            px: 3,
            py: 2.5,
          }}
        >
          <Grid container spacing={2}>
            {[
              ["Tender Name", "tenderName"],
              ["Customer Name", "customerName"],
              ["Customer Address", "customerAddress", true],
              ["Bid Owner", "bidOwner"],
              ["Tender Date", "tenderDate", false, "date"],
              ["RFP Received On", "rfpReceivedOn", false, "date"],
              ["RFP Due Date", "rfpDueDate", false, "date"],
              ["EMD Value (Cr)", "valueEMDInCrore"],
              ["Tender Reference No", "tenderReferenceNo"],
              ["Website", "website"],
            ].map(([label, field, multiline, type], idx) => (
              <Grid item xs={12} md={multiline ? 12 : 6} key={idx}>
                <TextField
                  label={label}
                  type={type || "text"}
                  value={editingRow?.[field] || ""}
                  onChange={(e) => handleEditFieldChange(field, e.target.value)}
                  fullWidth
                  size="small"
                  multiline={!!multiline}
                  minRows={multiline ? 2 : undefined}
                  InputLabelProps={
                    type === "date" ? { shrink: true } : undefined
                  }
                  sx={lightTextFieldSx}
                />
              </Grid>
            ))}

            {/* Tender Type */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Tender Type"
                value={editingRow?.tenderType || ""}
                onChange={(e) =>
                  handleEditFieldChange("tenderType", e.target.value)
                }
                fullWidth
                size="small"
                sx={lightTextFieldSx}
              >
                {TENDER_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Present Status */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Present Status"
                value={editingRow?.presentStatus || ""}
                onChange={(e) =>
                  handleEditFieldChange("presentStatus", e.target.value)
                }
                fullWidth
                size="small"
                sx={lightTextFieldSx}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        {/* ---------------- ACTIONS ---------------- */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            background: "#f1f5ff",
            borderTop: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          <Button
            onClick={handleEditCancel}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 3,
              fontWeight: 600,
              color: "#1e40af",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleEditSave}
            startIcon={<CheckRounded />}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 4,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#2563eb 0%,#3b82f6 50%,#1d4ed8 100%)",
              boxShadow: "0 10px 25px rgba(59,130,246,0.45)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#1d4ed8 0%,#2563eb 50%,#1e40af 100%)",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* READ-ONLY VIEW DIALOG */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #f8fbff 0%, #eef5ff 50%, #e3eeff 100%)",
            color: "#0f172a",
            boxShadow: "0 25px 60px rgba(59,130,246,0.25)",
          },
        }}
      >
        {/* ---------------- TITLE ---------------- */}
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            color: "#0d47a1",
            background: "linear-gradient(90deg,#e3f2fd,#f8fbff)",
          }}
        >
          Budgetary Quotation – View Only
          <IconButton
            onClick={() => setViewDialogOpen(false)}
            sx={{
              color: "#1e40af",
              "&:hover": { backgroundColor: "rgba(59,130,246,0.15)" },
            }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        {/* ---------------- CONTENT ---------------- */}
        <DialogContent
          dividers
          sx={{
            background: "#f8fbff",
            borderColor: "rgba(59,130,246,0.25)",
            px: 3,
            py: 2.5,
          }}
        >
          {viewRow && (
            <Grid container spacing={2}>
              {Object.entries(viewRow).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={key}
                    value={value ?? ""}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={lightReadOnlyFieldSx}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        {/* ---------------- ACTIONS ---------------- */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            background: "#f1f5ff",
            borderTop: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setViewDialogOpen(false)}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 4,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#2563eb 0%,#3b82f6 50%,#1d4ed8 100%)",
              boxShadow: "0 10px 25px rgba(59,130,246,0.45)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#1d4ed8 0%,#2563eb 50%,#1e40af 100%)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
       mt: -4,
      minHeight: "50vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #eef5ff 0%, #f8fbff 100%)",
      borderRadius: 4,
      p: 3,
    }}
  >
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        maxWidth: 720,
        p: 4,
        borderRadius: 4,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
      }}
    >
      {/* TITLE */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          textAlign: "center",
          color: "#0d47a1",
          mb: 1,
        }}
      >
        Upload Domestic Leads Data
      </Typography>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "#64748b",
          mb: 3,
        }}
      >
        Upload Excel file (.xlsx / .xls) to bulk insert records into the
        system
      </Typography>

      {/* UPLOAD BOX */}
      {excelData.length === 0 && (
        <Box
          sx={{
            border: "2px dashed #93c5fd",
            borderRadius: 4,
            p: { xs: 4, sm: 6 }, // ⬅️ MORE INNER SPACE
            minHeight: 280, // ⬅️ INCREASED HEIGHT

            textAlign: "center",
            background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
            transition: "all 0.25s ease",
            "&:hover": {
              background: "linear-gradient(180deg, #eef5ff 0%, #e0f2fe 100%)",
              borderColor: "#3b82f6",
              boxShadow: "0 10px 30px rgba(59,130,246,0.15)",
            },
          }}
        >
          {/* ICON */}
          <Box
            sx={{
              mb: 2,
              animation: "float 3s ease-in-out infinite",
              "@keyframes float": {
                "0%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-8px)" },
                "100%": { transform: "translateY(0px)" },
              },
            }}
          >
            <CloudQueueRoundedIcon
              sx={{
                fontSize: 64,
                background: "linear-gradient(135deg, #93c5fd, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 8px 16px rgba(59,130,246,0.35))",
              }}
            />
          </Box>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}
          >
            Drag & drop your file here
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
            or click to browse (.xlsx or .xls)
          </Typography>

          {/* BROWSE FILE BUTTON */}
          <Button
            variant="contained"
            component="label"
            sx={{
              borderRadius: 999,
              px: 4,
              py: 1.2,
              fontWeight: 700,
              fontSize: 14,
              textTransform: "none",
              color: "#ffffff",

              background:
                "linear-gradient(135deg, #42a5f5 0%, #2563eb 50%, #1e40af 100%)",
              boxShadow: "0 8px 22px rgba(37,99,235,0.35)",

              transition: "all 0.25s ease",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)",
                boxShadow: "0 14px 32px rgba(37,99,235,0.45)",
                transform: "translateY(-2px) scale(1.03)",
              },

              "&:active": {
                transform: "scale(0.96)",
                boxShadow: "0 6px 14px rgba(37,99,235,0.35)",
              },
            }}
          >
            📁 Browse File
            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
      )}

      {/* STATUS MESSAGES */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {success}
        </Alert>
      )}

      {/* PUSH BUTTON (UNCHANGED LOGIC) */}
      {excelData.length > 0 && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleUploadToServer}
            disabled={loading}
            sx={{
              px: 5,
              py: 1.4,
              borderRadius: 999,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 8px 20px rgba(22,163,74,0.35)",
            }}
          >
            {loading ? (
              <CircularProgress size={26} sx={{ color: "#fff" }} />
            ) : (
              "Push Data to Database"
            )}
          </Button>
        </Box>
      )}
    </Paper>
  </Box>
  );
}

export default OrederReceivedForm;
