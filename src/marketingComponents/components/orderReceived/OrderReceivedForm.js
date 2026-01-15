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
import * as FileSaver from "file-saver";

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
  // Tab,
  MenuItem,
  Checkbox,
  Menu,
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  CircularProgress,
  Link,
} from "@mui/material";

import {
  SearchRounded,
  NorthRounded,
  SouthRounded,
  RestartAltRounded,
  EditRounded,
  DeleteRounded,
  CloseRounded,
} from "@mui/icons-material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useForm, Controller, set } from "react-hook-form";
import axios from "axios";
import dayjs from "dayjs";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { PdfViewerDialog } from "../budgetaryQuotation/pdfViewerDialog";

const STATUS_OPTIONS = [
  "Draft",
  "Submitted",
  "In Progress",
  "Under Review",
  "Won",
  "Lost",
  "On Hold",
];

const TENDER_TYPE_OPTIONS = ["ST", "MT", "LT"];

const OrederReceivedForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // form here we have started file uploading logic
  const [browsefile, setbrowsefile] = useState(null);
  const [uploadFileData, setuploadFileData] = useState();
  const [orderData, setOrderData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [presentDate, setPrsentDate] = useState(new Date());
  const [ServerIp, SetServerIp] = useState("");
  const [SaveDataHardDiskURL, SetSaveDataHardDiskURL] = useState("");
  const [value, setValue] = useState(0);
  // document upload states for multiple documents
  // const [documents, setDocuments] = useState([
  //   { documentType: "", file: null, uploaded: false },
  // ]);
  // to map document ids after upload to leadId from backend;
  // store document ids to update lead document mapping later
  const [documentIds, setDocumentIds] = useState([]);

  //upload file states

  const [newFiles, setNewFiles] = useState([]); // State for new batch uploads

  const createEmptyRow = () => ({
    documentType: "",
    file: null,
    uploaded: false,
  });

  const [documents, setDocuments] = useState([createEmptyRow()]); // ✅ minimum one row

  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  const orderTypes = ["ST", "MT"];

  const API = "/getOrderReceived";

  const UPLOAD_ENDPOINT = `/uploadDocument`;
  const UPDATE_ENDPOINT = `/updateDocument`;

  const DOCUMENT_TYPES = [
    { id: "contractCopy", label: "Contract Copy" },
    { id: "letterOfIntent", label: "Letter of Intent" },
  ];

  // =============================================
  const handleDocumentTypeChange = (index, value) => {
    console.log("Selected Document Type:", value);
    const updated = [...documents];
    updated[index].documentType = value;
    setDocuments(updated);
  };

  const handleFileChangeDropdown = (index, file) => {
    const updated = [...documents];
    updated[index].file = file;
    setDocuments(updated);
  };

  const handleUpload = async (index) => {
    const doc = documents[index];

    if (!doc.documentType || !doc.file) {
      alert("Please select document type and file");
      return;
    }

    const formData = new FormData();
    formData.append("file", doc.file);
    formData.append("documentType", doc.documentType);
    formData.append("uploadedBy", "M001");

    // 🔗 API call here
    // await uploadLeadDocument(formData);
    fetch(ServerIp + UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Document upload response:", data);
        const updated = [...documentIds];
        updated[index] = data.documentId;
        setDocumentIds(updated);
        // Handle success (e.g., show a message, update state)
      })
      .catch((error) => console.error("Error uploading document:", error));

    const updated = [...documents];
    updated[index].uploaded = true;

    // Add new empty row if less than 4
    if (updated.length < 4) {
      updated.push({ documentType: "", file: null, uploaded: false });
    }

    setDocuments(updated);
  };

  const handleClear = (index) => {
    const updated = [...documents];
    updated.splice(index, 1);

    if (updated.length === 0) {
      updated.push({ documentType: "", file: null, uploaded: false });
    }

    setDocuments(updated);
  };

  // =============================================

  let user = JSON.parse(localStorage.getItem("user"));
  console.log(" user object ", user);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectTitle: "",
      customerName: "",
      customerAddress: "",
      defenceOrCivil: "",
      PoCoWoNo: "",
      orderRxdDate: "",
      qty: "",
      valueWithoutGST: "",
      valueWithGST: "",
      tenderType: "",
      deliverySchedule: "",
      remarks: "",
      JSON_competitors: "",
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
            console.log(" Response while hitting the API : ", response);
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

    // defaultValues: {
    //   projectTitle: "",
    //   customerName: "",
    //   customerAddress: "",
    //   defenceOrCivil: "",
    //   PoCoWoNo: "",
    //   orderRxdDate: "",
    //   qty: "",
    //   valueWithoutGST: "",
    //   valueWithGST: "",
    //   tenderType: "",
    //   deliverySchedule: "",
    //   remarks: "",
    //   JSON_competitors: "",
    //   contractCopy: "",

    console.log(data);
    const formattedData = {
      projectTitle: data.projectTitle,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      defenceOrCivil: data.defenceOrCivil,
      PoCoWoNo: data.PoCoWoNo,
      orderRxdDate: data.orderRxdDate,
      qty: data.qty,
      valueWithoutGST: parseFloat(parseFloat(data.valueWithoutGST).toFixed(2)),
      valueWithGST: parseFloat(parseFloat(data.valueWithGST).toFixed(2)),
      tenderType: data.tenderType,
      deliverySchedule: data.deliverySchedule,
      remarks: data.remarks,
      JSON_competitors: data.JSON_competitors,
      attachment: selectedFiles.map((f) => f.name),

      submittedAt: new Date().toISOString(),
      // new fields
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",

      // contractCopy: uploadFileData?.map((f) => f.originalName),
      // FileName: uploadFileData?.map((f) => f.savedName),
      // FilePath: uploadFileData?.map((f) => f.filePath),
      // HardDiskFileName: uploadFileData?.map((f) => f.savedName),

      Dom_or_Export: "1",
    };

    // veiw the data of the form in JSON form
    console.log("Form Data:", JSON.stringify(formattedData, null, 2));

    axios
      .post(ServerIp + API, formattedData)
      .then((response) => {
        // console.log("formattedData after ")
        console.log("Server Response:", response.data);
        documentIds.forEach((docId, index) => {
          if (docId) {
            // Map document to lead using documentIds[index] and response.data.leadId
            console.log(
              `Mapping document ID ${documentIds[index]} to lead ID ${response.data.id}`
            );
            // 🔗 API call to map document to lead can be made here
            axios.put(ServerIp + UPDATE_ENDPOINT, {
              documentId: documentIds[index],
              leadId: response.data.id,
            });
          }
        });
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // const validFiles = files.filter(
    //   (file) => file.type.includes("pdf") || file.type.includes("image")
    // );

    const validFiles = files.filter(
      (file) =>
        file.type.includes("pdf") ||
        file.type.includes("image") ||
        file.type.includes("sheet") ||
        file.type.includes("word")
    );

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    console.log(" how many selected : ", selectedFiles);
  };

  const handleFileUpload = async () => {
    console.log(" how many selected from upload : ", selectedFiles);
    if (selectedFiles.length === 0) {
      alert("Please select files");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    console.log("formData send to backend : ", formData);

    try {
      const res = await fetch(ServerIp + "/orderFileUpload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Uploaded files: ", data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
    setSelectedFiles([]);
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  //upload file handles
  const showSnack = (msg, severity = "success") => {
    setSnack({ open: true, msg, severity });
  };

  const handleAddDocument = () => {
    setDocuments((prev) => [...prev, createEmptyRow()]);
    showSnack("New document row added!", "info");
  };

  const handleRemoveDocument = (index) => {
    if (documents.length === 1) {
      showSnack("At least one document row is required.", "warning");
      return;
    }

    setDocuments((prev) => prev.filter((_, i) => i !== index));
    showSnack("Document row removed.", "info");
  };

  const today = new Date().toLocaleDateString("en-CA");

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
        mt: 0,
        py: 1,
        minHeight: "85vh",
        background: "linear-gradient(135deg, #e3eeff 0%, #f8fbff 100%)",
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Order Received
      </Typography>

      <Divider
        flexItem
        sx={{
          background: "linear-gradient(135deg, #0d47a1 , #42a5f5, #1e88e5)",
          height: "4px",
          mt: 3,
        }}
      />

      {/* ------------------------ TABS ------------------------ */}
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        centered
        sx={{
          mb: 4,
          "& .MuiTab-root": {
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            px: 4,
          },
          "& .Mui-selected": {
            color: "#0d47a1 !important",
          },
          "& .MuiTabs-indicator": {
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #0d47a1, #42a5f5, #1e88e5)",
          },
        }}
      >
        <Tab
          icon={<AddCircleOutlineRoundedIcon />}
          iconPosition="start"
          label="Create Data"
        />
        <Tab
          icon={<VisibilityOutlinedIcon />}
          iconPosition="start"
          label="View Data"
        />
        <Tab
          icon={<CloudUploadOutlinedIcon />}
          iconPosition="start"
          label="Bulk Upload"
        />
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
                  mt: -5,
                  mb: 3,
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

                {/* 
                //   defaultValues: {
                //   projectTitle: "",
                //   customerName: "",
                //   customerAddress: "",
                //   defenceOrCivil: "",
                //   PoCoWoNo: "",
                //   orderRxdDate: "",
                //   qty: "",
                //   valueWithoutGST: "",
                //   valueWithGST: "",
                //   tenderType: "",
                //   deliverySchedule: "",
                //   remarks: "",
                //   JSON_competitors: "",
                //   contractCopy: "", */}

                <Grid container spacing={4}>
                  {/* {projectTitle} */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="projectTitle"
                      control={control}
                      rules={{ required: "Project Title is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Project Title"
                          fullWidth
                          required
                          error={!!errors.projectTitle}
                          helperText={errors.projectTitle?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  {/* {defenceOrCivil} */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="defenceOrCivil"
                      control={control}
                      rules={{ required: "Defence/Civil is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Defence/Civil"
                          fullWidth
                          required
                          error={!!errors.defenceOrCivil}
                          helperText={errors.defenceOrCivil?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  {/* {orderRxdDate} */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="orderRxdDate"
                      control={control}
                      rules={{ required: "Order Received Date is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Order Received Date"
                          type="date"
                          fullWidth
                          required
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.orderRxdDate}
                          helperText={errors.orderRxdDate?.message}
                          // sx={inputStyle()}
                          inputProps={{
                            max: today, // ✅ disables future dates, allows today & past
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Customer Information Section */}
              <Card
                sx={{
                  mt: -1,
                  mb: 3,
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
                  mt: -1,
                  mb: 3,
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
                  {/* {PoCoWoNo} */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="PoCoWoNo"
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
                          error={!!errors.PoCoWoNo}
                          helperText={errors.PoCoWoNo?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  {/* {qty} */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="qty"
                      control={control}
                      rules={{
                        required: "Quantity",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Quantity"
                          fullWidth
                          required
                          error={!!errors.qty}
                          helperText={errors.qty?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  {/* {tenderType} */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="tenderType"
                      control={control}
                      rules={{ required: "Order Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Type of Bid"
                          fullWidth
                          required
                          error={!!errors.tenderType}
                          helperText={errors.tenderType?.message}
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
                  mt: -1,
                  mb: 3,
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
                  {/* {valueWithoutGST} */}
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

                  {/* {valueWithGST} */}
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
                  mt: -1,
                  mb: 3,
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
                      name="deliverySchedule"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Delivery Schedule"
                          multiline
                          rows={3}
                          fullWidth
                          variant="outlined"
                          placeholder="Delivery Schedule to be entered"
                          // helperText="List all competing companies for this order"
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
                  <Grid item xs={6} md={6}>
                    <Controller
                      name="JSON_competitors"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Competitors"
                          multiline
                          rows={3}
                          fullWidth
                          variant="outlined"
                          placeholder="Enter competitor names separated by commas (e.g., Company A, Company B, Company C)..."
                          helperText="List all competing companies for this order"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Attachments Section */}
              {/* <Box
                sx={{
                  minHeight: "100vh",
                  p: { xs: 2, sm: 4 },
                  background:
                    "linear-gradient(135deg, rgba(234,246,253,1), rgba(207,233,247,1), rgba(182,223,245,1))",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              > */}
              <Box sx={{ width: "100%", maxWidth: 1800 }}>
                {/* ===================== Attachments Section ===================== */}
                <Card
                  sx={{
                    mt: 1,
                    mb: 3,
                    p: { xs: 2, sm: 3, md: 3.5 },
                    borderRadius: 4,
                    // background:
                    //   "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(245,250,255,0.75))",
                    backdropFilter: "blur(18px)",
                    border: "1px solid rgba(148,163,184,0.25)",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                    overflow: "hidden",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      // background:
                      //   "radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 55%)",
                      pointerEvents: "none",
                    },
                  }}
                >
                  {/* Header */}
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 800,
                            letterSpacing: 0.3,
                            color: "#0f172a",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          📎 Attachments
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(30,41,59,0.75)" }}
                        >
                          Upload Contract Copy / Letter of Intent (Optional)
                        </Typography>
                      </Box>

                      {/* ✅ Add Document Button */}
                      <Button
                        onClick={handleAddDocument}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                          borderRadius: 2.5,
                          textTransform: "none",
                          fontWeight: 800,
                          maxWidth: 180,
                          px: 2.4,
                          py: 1.15,
                          boxShadow: "0 12px 26px rgba(59,130,246,0.22)",
                          background:
                            "linear-gradient(135deg, #2563eb, #60a5fa)",
                          "&:hover": {
                            boxShadow: "0 18px 34px rgba(59,130,246,0.28)",
                            // transform: "translateY(-1px)",
                          },
                        }}
                      >
                        Add Document
                      </Button>
                    </Box>

                    <Divider sx={{ mt: 2.5, mb: 2, opacity: 0.5 }} />

                    {/* Documents List */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {documents.map((doc, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            // p: { xs: 1.5, sm: 2 },
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid rgba(148,163,184,0.25)",
                            background: "rgba(255,255,255,0.7)",
                            boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
                            transition: "0.25s ease",
                            // position: "relative",
                            "&:hover": {
                              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          {/* ✅ Remove Button (Top Right) */}
                          {/* <Box
                              sx={{ position: "absolute", top: 10, right: 10,}}
                            >
                              <Tooltip title="Remove this document row">
                                <span>
                                  <IconButton
                                    onClick={() => handleRemoveDocument(index)}
                                    disabled={documents.length === 1}
                                    sx={{
                                      borderRadius: 2,
                                      background: "rgba(239,68,68,0.08)",
                                      "&:hover": {
                                        background: "rgba(239,68,68,0.16)",
                                      },
                                    }}
                                  >
                                    <DeleteOutlineIcon
                                      sx={{
                                        color:
                                          documents.length === 1
                                            ? "rgba(148,163,184,0.9)"
                                            : "#ef4444",
                                      }}
                                    />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Box> */}

                          <Grid container spacing={2} alignItems="center">
                            {/* Document Type */}
                            <Grid item xs={12} md={3}>
                              <TextField
                                select
                                label="Document Type"
                                fullWidth
                                size="small"
                                value={doc.documentType}
                                onChange={(e) =>
                                  handleDocumentTypeChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                disabled={doc.uploaded}
                                sx={{
                                  // minWidth:200,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                    height: "45px",
                                    backgroundColor: "rgba(241,248,255,0.95)",
                                    "& fieldset": {
                                      borderColor: "rgba(148,163,184,0.35)",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "rgba(59,130,246,0.65)",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#3b82f6",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiInputLabel-root": {
                                    color: "#334155",
                                  },
                                }}
                              >
                                {DOCUMENT_TYPES.map((docType) => (
                                  <MenuItem key={docType.id} value={docType.id}>
                                    {docType.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>

                            {/* Choose File */}
                            <Grid item xs={12} md={4}>
                              <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                disabled={doc.uploaded}
                                sx={{
                                  borderRadius: 2.5,
                                  height: "45px",
                                  // py: 1.45,
                                  // minWidth:250,
                                  textTransform: "none",
                                  fontWeight: 650,
                                  borderColor: "rgba(59,130,246,0.35)",
                                  color: "#0f172a",
                                  background: "rgba(255,255,255,0.85)",
                                  "&:hover": {
                                    borderColor: "#3b82f6",
                                    background: "rgba(239,246,255,0.8)",
                                  },
                                  overflow: "hidden", // Prevents long filenames from breaking UI
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  display: "block",
                                }}
                              >
                                {doc.file ? doc.file.name : "Choose File"}
                                <input
                                  type="file"
                                  hidden
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  onChange={(e) =>
                                    handleFileChangeDropdown(
                                      index,
                                      e.target.files?.[0]
                                    )
                                  }
                                />
                              </Button>

                              {/* {doc.file && (
                                <Box
                                  sx={{
                                    // mt: 1,
                                    display: "flex",
                                    // gap: 1,
                                    // flexWrap: "wrap",
                                    // alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                    position: "absolute",
                                    bottom: -18,
                                  }}
                                >
                                  <Chip
                                    label={`Size: ${(
                                      doc.file.size / 1024
                                    ).toFixed(2)} KB`}
                                    size="small"
                                    sx={{
                                      // borderRadius: 2,
                                      background: "rgba(59,130,246,0.10)",
                                      color: "#1e3a8a",
                                      // fontWeight: 700,
                                      height: 16,
                                      fontSize: "0.65rem",
                                      borderRadius: 1,
                                    }}
                                  />

                                  {doc.uploaded && (
                                    <Chip
                                      label="Uploaded"
                                      size="small"
                                      color="success"
                                      sx={{
                                        // borderRadius: 2,
                                        background: "rgba(34,197,94,0.12)",
                                        // color: "#166534",
                                        // fontWeight: 800,
                                        height: 16,
                                        fontSize: "0.65rem",
                                        borderRadius: 1,
                                      }}
                                    />
                                  )}
                                </Box>
                              )} */}
                            </Grid>

                            {/* Upload Button */}
                            <Grid item xs={4} md={2}>
                              <Button
                                variant="contained"
                                fullWidth
                                disabled={
                                  doc.uploaded || !doc.file || !doc.documentType
                                }
                                onClick={() => handleUpload(index)}
                                sx={{
                                  borderRadius: 2.5,
                                  height: "45px",
                                  // maxWidth: 100,
                                  // py: 1.45,
                                  textTransform: "none",
                                  fontWeight: 800,
                                  boxShadow:
                                    "0 10px 20px rgba(59,130,246,0.22)",
                                  background:
                                    "linear-gradient(135deg, #2563eb, #60a5fa)",
                                  "&:hover": {
                                    boxShadow:
                                      "0 14px 26px rgba(59,130,246,0.30)",
                                    transform: "translateY(-1px)",
                                  },
                                }}
                              >
                                Upload
                              </Button>
                            </Grid>

                            {/* Clear Button */}
                            <Grid item xs={4} md={2}>
                              <Button
                                variant="outlined"
                                // color="error"
                                fullWidth
                                onClick={() => handleClear(index)}
                                sx={{
                                  borderRadius: 2.5,
                                  // py: 1.45,
                                  textTransform: "none",
                                  height: "45px",
                                  fontWeight: 800,
                                  borderColor: "rgba(239,68,68,0.45)",
                                  background: "rgba(255,255,255,0.85)",
                                  "&:hover": {
                                    borderColor: "#ef4444",
                                    background: "rgba(254,242,242,0.9)",
                                  },
                                }}
                              >
                                Clear
                              </Button>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              md={1}
                              sx={{ textAlign: "center" }}
                            >
                              <Tooltip title="Remove this document row">
                                <span>
                                  <IconButton
                                    onClick={() => handleRemoveDocument(index)}
                                    disabled={documents.length === 1}
                                    sx={{
                                      borderRadius: 2,
                                      background: "rgba(239,68,68,0.08)",
                                      "&:hover": {
                                        background: "rgba(239,68,68,0.16)",
                                      },
                                      p: 1.2, // Padding to match visual weight of buttons
                                    }}
                                  >
                                    <DeleteOutlineIcon
                                      sx={{
                                        color:
                                          documents.length === 1
                                            ? "rgba(148,163,184,0.9)"
                                            : "#ef4444",
                                      }}
                                    />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </Card>

                {/* Snackbar */}
                <Snackbar
                  open={snack.open}
                  autoHideDuration={2500}
                  onClose={() => setSnack((s) => ({ ...s, open: false }))}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                  <Alert
                    severity={snack.severity}
                    variant="filled"
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
                    sx={{ borderRadius: 2 }}
                  >
                    {snack.msg}
                  </Alert>
                </Snackbar>
              </Box>

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
                    maxWidth: 180,
                    background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                    textTransform: "none",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      background: "linear-gradient(90deg, #0d47a1, #1e88e5)",
                    },
                  }}
                >
                  Submit
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
                    maxWidth: 180,
                    fontWeight: 700,
                    borderWidth: 2,
                    textTransform: "none",
                    "&:hover": {
                      transform: "scale(1.03)",
                      background: "#f4f6fb",
                    },
                  }}
                >
                  Reset
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
        <ViewOrderRecievedData
          ViewData={orderData}
          setOrderData={setOrderData}
          ServerIp={ServerIp}
        />
        // <h1>Rakshitha </h1>
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

  // Store data in local state for updates
  const [tableData, setTableData] = useState(props.ViewData.data || []);

  // Extract ServerIp from props
  const ServerIp = props.ServerIp || "";

  // Sync with parent data when it changes
  useEffect(() => {
    const tableArray = props.ViewData.data;
    tableArray.sort((a, b) => {
      return a.id - b.id;
    });

    // setTableData(props.ViewData.data);
    // API for all
    const fetchDocuments = async () => {
      const updatedTableArray = await Promise.all(
        tableArray.map(async (item) => {
          try {
            const response = await axios.get(
              `${ServerIp}/getOrderReceived/${item.id}/documents`
            );
            const documentsArray = response.data;
            const contractCopyDoc = documentsArray.find(
              (doc) => doc.documentType === "contractCopy"
            );
            const letterOfIntentDoc = documentsArray.find(
              (doc) => doc.documentType === "letterOfIntent"
            );

            return {
              ...item,
              contractCopy: contractCopyDoc ? { ...contractCopyDoc } : null, // Use spread to copy and handle null case
              letterOfIntent: letterOfIntentDoc
                ? { ...letterOfIntentDoc }
                : null, //Use spread to copy and handle null
            };
          } catch (error) {
            console.error(
              "Error fetching documents for item ID:",
              item.id,
              error
            );
            return item; // Return original item if there's an error
          }
        })
      );

      setTableData(updatedTableArray);
    };

    fetchDocuments();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // const [yearFilter, setYearFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState(dayjs());

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [idDeleteOpen, setIdDeleteOpen] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [tempEditingRow, setTempEditingRow] = useState(null);

  const [dialogOpenedFrom, setDialogOpenedFrom] = useState("rowClick"); // "rowClick" or "editIcon"

  const [docEditRows, setDocEditRows] = useState([]); // existing docs for editing
  const [docSaving, setDocSaving] = useState(false);

  //Multiple upload States
  const [newFiles, setNewFiles] = useState([]);

  // READ-ONLY VIEW DIALOG STATE
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  // COLUMN VISIBILITY STATE
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const columnMenuOpen = Boolean(columnMenuAnchor);

  // to map document ids after upload to leadId from backend;
  // store document ids to update lead document mapping later
  const [allDocumentIds, setAllDocumentIds] = useState([]);

  // document upload states for multiple documents
  // const [documents, setDocuments] = useState([
  //   { documentType: "", file: null, uploaded: false },
  // ]);

  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [titleName, setTitleName] = useState("");

  const createEmptyRow = () => ({
    documentType: "",
    file: null,
    uploaded: false,
  });

  const [documents, setDocuments] = useState([createEmptyRow()]); // ✅ minimum one row

  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  const UPLOAD_ENDPOINT = `/uploadDocument`;
  const UPDATE_ENDPOINT = `/updateDocument`;

  // to map document ids after upload to leadId from backend;
  // store document ids to update lead document mapping later
  const [documentIds, setDocumentIds] = useState([]);

  const DOCUMENT_TYPES = [
    { id: "contractCopy", label: "Contract Copy" },
    { id: "letterOfIntent", label: "Letter of Intent" },
  ];

  const [visibleColumns, setVisibleColumns] = useState({
    projectTitle: true,
    customerName: true,
    customerAddress: true,
    defenceOrCivil: true,
    PoCoWoNo: true,
    orderRxdDate: true,
    qty: true,
    valueWithoutGST: true,
    valueWithGST: true,
    tenderType: true,
    deliverySchedule: true,
    remarks: true,
    JSON_competitors: true,
    contractCopy: true,
    letterOfIntent: true,
    dateCreated: true,
    actions: true,
  });

  // COLUMN DEFINITIONS
  const leadColumns = [
    { id: "actions", label: "Actions" },
    { id: "projectTitle", label: "Project Title" },
    { id: "customerName", label: "Customer Name" },
    { id: "customerAddress", label: "Customer Address" },
    { id: "defenceOrCivil", label: "Defence/Civil" },
    { id: "PoCoWoNo", label: "Po/Co/Wo No." },
    { id: "orderRxdDate", label: "Order Received Date" },
    { id: "qty", label: "Purchase Order No" },
    { id: "valueWithoutGST", label: "Value in CR without GST" },
    { id: "valueWithGST", label: "Value in CR with GST" },
    { id: "tenderType", label: "Tender Type" },
    { id: "deliverySchedule", label: "Delivery Schedule" },
    { id: "remarks", label: "Remarks" },
    { id: "JSON_competitors", label: "Competitors" },
    { id: "contractCopy", label: "Contract Copy" },
    { id: "letterOfIntent", label: "Letter Of Intent" },
    // { id: "attachments", label: "Attachments" },
    { id: "dateCreated", label: "Created Date" },
  ];

  // COLUMN HANDLERS
  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  const handleColumnToggle = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

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
    setYearFilter(null);
  };

  //File Upload

  //upload file handles
  const showSnack = (msg, severity = "success") => {
    setSnack({ open: true, msg, severity });
  };

  const handleAddDocument = () => {
    setDocuments((prev) => [...prev, createEmptyRow()]);
    showSnack("New document row added!", "info");
  };

  const handleRemoveDocument = (index) => {
    if (documents.length === 1) {
      showSnack("At least one document row is required.", "warning");
      return;
    }

    setDocuments((prev) => prev.filter((_, i) => i !== index));
    showSnack("Document row removed.", "info");
  };

  //Batch File Upload

  // 1. Handle selection of multiple files
  const handleMultipleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...selectedFiles]);
  };

  // 2. Remove a file from the selection list before uploading
  const removeFileFromSelection = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 3. Upload all selected files
  const handleBatchUpload = async () => {
    if (newFiles.length === 0) return alert("Please select files first");

    try {
      setDocSaving(true);
      const formData = new FormData();

      // Append all files to the "files" key
      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await axios.post(
        `${ServerIp}/documents/upload-multiple/${editingRow.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Files uploaded successfully");
      setNewFiles([]); // Clear selection
      // Refresh your list here if necessary
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setDocSaving(false);
    }
  };

  // DELETE ROW
  const handleDeleteRow = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this entry?")) return;

    console.log("Deleting row with ID:", id);
    const deleteData = {
      id: id,
    };
    console.log(
      "api for delete in domestic lead : ",
      `${ServerIp}/getOrderReceived`
    );
    // TODO: delete logic here
    try {
      await axios.delete(`${ServerIp}/getOrderReceived`, {
        data: deleteData, // Send the data in the request body
        headers: {
          "Content-Type": "application/json", // VERY IMPORTANT: Set the Content-Type
        },
      });
      // Show success notification
      setTableData(
        tableData.filter((item) => item.id !== id) // Create a new array excluding the item with the given id
      );
      setConfirmDeleteOpen(false);
      alert("✅ Deleted successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("❌ Failed to Delete. Please try again.");
    }
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

  // // Row Selection
  // const handleRowSelect = (row) => {
  //   setSelectedRow(row);
  // };

  // OPEN DIALOG FROM ROW CLICK (VIEW MODE ONLY)
  const handleRowClick = (row) => {
    setTempEditingRow({ ...row }); // Store original data
    setEditingRow({ ...row }); // Set for viewing
    setIsEditMode(false); // Start in VIEW mode
    setDialogOpenedFrom("rowClick"); // Mark as opened from row click
    setEditDialogOpen(true);
    console.log(" editingRow data : ", editingRow);

    const initDocs = [];

    if (row?.contractCopy) {
      initDocs.push({
        documentId: row.contractCopy.documentId,
        documentType: "contractCopy",
        originalFileName: row.contractCopy.originalFileName,
        storedFileName: row.contractCopy.storedFileName,
        file: null, // replacement file
      });
    }
    if (row?.letterOfIntent) {
      initDocs.push({
        documentId: row.letterOfIntent.documentId,
        documentType: "letterOfIntent",
        originalFileName: row.letterOfIntent.originalFileName,
        storedFileName: row.letterOfIntent.storedFileName,
        file: null,
      });
    }

    setDocEditRows(initDocs.length ? initDocs : []);
  };

  // OPEN EDIT DIALOG
  const handleEditClick = (row) => {
    setTempEditingRow({ ...row }); // Store original data
    setEditingRow({ ...row }); // Set for editing
    setIsEditMode(false); // Start in VIEW mode but with edit option
    setDialogOpenedFrom("editIcon"); // Mark as opened from edit icon
    setEditDialogOpen(true);

    const initDocs = [];

    if (row?.contractCopy) {
      initDocs.push({
        documentId: row.contractCopy.documentId,
        documentType: "contractCopy",
        originalFileName: row.contractCopy.originalFileName,
        storedFileName: row.contractCopy.storedFileName,
        file: null, // replacement file
      });
    }
    if (row?.letterOfIntent) {
      initDocs.push({
        documentId: row.letterOfIntent.documentId,
        documentType: "letterOfIntent",
        originalFileName: row.letterOfIntent.originalFileName,
        storedFileName: row.letterOfIntent.storedFileName,
        file: null,
      });
    }

    setDocEditRows(initDocs.length ? initDocs : []);
  };

  //UPDATE FILES (EDIT DIALOG)

  const handleReplaceFileSelect = (index, file) => {
    setDocEditRows((prev) => {
      const updated = [...prev];
      updated[index].file = file;
      return updated;
    });
  };

  const handleUpdateExistingDocument = async (docRow) => {
    if (!docRow?.documentId) return;

    if (!docRow.file) {
      alert("Please choose a replacement file first");
      return;
    }

    try {
      setDocSaving(true);

      const formData = new FormData();
      formData.append("file", docRow.file);

      const res = await axios.put(
        `${ServerIp}/documents/${docRow.documentId}/replace`,
        //`${ServerIp}/updateReplaceDocument`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Document updated successfully");

      // ✅ update UI values after replacement
      const updatedDoc = res.data?.doc;

      setDocEditRows((prev) =>
        prev.map((d) =>
          d.documentId === docRow.documentId
            ? {
                ...d,
                originalFileName: updatedDoc.originalFileName,
                storedFileName: updatedDoc.storedFileName,
                file: null,
              }
            : d
        )
      );

      // ✅ also update editingRow so view section shows updated file
      setEditingRow((prev) => {
        if (!prev) return prev;
        const key = docRow.documentType; // contractCopy / letterOfIntent
        return {
          ...prev,
          [key]: {
            ...prev[key],
            originalFileName: updatedDoc.originalFileName,
            storedFileName: updatedDoc.storedFileName,
          },
        };
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update document");
    } finally {
      setDocSaving(false);
    }
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

  // ENTER EDIT MODE
  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  // SAVE EDITED VALUES
  const handleEditSave = () => {
    setConfirmSaveOpen(true);
    console.log("Saving updated row:", editingRow);
  };

  // CONFIRM AND SAVE TO BACKEND
  const handleConfirmSave = async () => {
    try {
      console.log("Confirmed - Updating row:", editingRow);

      // Call real update API
      const updatePayload = {
        id: editingRow.id, // Include ID for update
        ...editingRow, // Rest of data to edit
      };

      // Replace with your actual API endpoint
      // const API_ENDPOINT = `/getBudgetaryQuotation/${updatePayload?.id}`;

      const response = await axios.put(
        `${ServerIp}/getOrderReceived`,
        updatePayload
      );

      console.log("res from server : ", response);

      if (response.data.success || response.status === 200) {
        documentIds.forEach((docId, index) => {
          if (docId) {
            // Map document to lead using documentIds[index] and response.data.leadId
            console.log(
              `Mapping document ID ${documentIds[index]} to lead ID ${response.data.id}`
            );
            // 🔗 API call to map document to lead can be made here
            axios.put(ServerIp + UPDATE_ENDPOINT, {
              documentId: documentIds[index],
              leadId: response.data.id,
            });
          }
        });

        // Update the local table data with the new values
        const updatedTableData = tableData.map((row) =>
          row.id === editingRow.id ? editingRow : row
        );
        setTableData(updatedTableData);

        // Notify parent component about update if callback provided
        if (props.onDataUpdate) {
          props.onDataUpdate(updatedTableData);
        }

        // Show success notification
        alert("✅ Changes saved successfully!");
        setConfirmSaveOpen(false);
        setEditDialogOpen(false);
        setIsEditMode(false);
        setEditingRow(null);
        setTempEditingRow(null);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("❌ Failed to save changes. Please try again.");
    }
  };

  // CANCEL EDIT MODE
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingRow({ ...tempEditingRow });
  };

  // Delete VALUES - SHOW CONFIRMATION DIALOG
  const handleDeleteClick = (id) => {
    console.log("Saving updated row:", editingRow);
    setIdDeleteOpen(id);
    setConfirmDeleteOpen(true); // Open confirmation dialog
  };

  // DOUBLE CLICK → OPEN READ-ONLY VIEW
  const handleRowDoubleClick = (row) => {
    setViewRow(row);
    setViewDialogOpen(true);
  };

  // const handleGetDocumentIds = async (rowId) => {
  //   try {
  //     console.log("row.id : ", rowId);
  //     await axios
  //       .get(ServerIp + `/getOrderReceived/${rowId}/documents`)
  //       .then((response) => {
  //         console.log(
  //           " response by getOrderReceived/documents : ",
  //           response.data
  //         );
  //         // setAllDocumentIds(response.data);
  //         response.data.forEach( (doc, index) => {
  //           // if (doc.documentType === "contractCopy") setContractCopy(doc)
  //           // if (doc.documentType === "letterOfIntent") setLetterOfIntent(doc)
  //         })
  //       })
  //       .catch((error) => console.log(error.message));
  //   } catch (error) {
  //     console.log("error : ", error);
  //   }
  // };

  // DOWNLOAD DOCUMENT PREVIEW
  // const handleDownloadFile = async (documentId, hardDiskFileName, fileName) => {
  //   // let serverDocPath = (filePath + "\\" + hardDiskFileName);
  //   console.log(" this hardiskFileName ", hardDiskFileName);

  //   axios
  //     .get(`${ServerIp}/getOrderReceived/${documentId}/download`, {
  //       responseType: "blob",
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       const pdfBlob = new Blob([response.data], { type: "application/pdf" });
  //       setTitleName(`${fileName}`);
  //       setOpen(true);
  //       // Create a temporary URL for the Blob
  //       const url = window.URL.createObjectURL(pdfBlob);
  //       setPdfUrl(url);
  //       // Create a temporary <a> element to trigger the download
  //       // const tempLink = document.createElement("a");
  //       // tempLink.href = url;
  //       // tempLink.setAttribute("download", `bill_${User_Id}_${date}.pdf`); // Set the desired filename for the downloaded file
  //       // Append the <a> element to the body and click it to trigger the downl
  //       // document.body.appendChild(tempLink);
  //       // tempLink.click();
  //       // tempLink.remove();
  //       // Clean up the temporary elements and URL
  //       // document.body.removeChild(tempLink);
  //       // window.URL.revokeObjectURL(url);
  //       // window.open(url, "_blank");
  //     })
  //     // .then((blob) => {
  //     //   const url = window.URL.createObjectURL(blob);
  //     //   const a = document.createElement("a");
  //     //   a.href = url;
  //     //   a.download = fileName; // specify the filename here
  //     //   document.body.appendChild(a);
  //     //   a.click();
  //     //   a.remove();
  //     //   window.URL.revokeObjectURL(url);
  //     // })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  //New Document Preview

  const handleDownloadFile = async (documentId, hardDiskFileName, fileName) => {
    console.log("Downloading file:", hardDiskFileName);

    axios.get(`${ServerIp}/getOrderReceived/${documentId}/download`, {
        responseType: "blob",
    })
    .then((response) => {
        // 1. Get the content type from headers (or infer from file extension)
        const contentType = response.headers['content-type'];
        const fileBlob = new Blob([response.data], { type: contentType });
        
        const url = window.URL.createObjectURL(fileBlob);
        
        // 2. Identify the file extension
        const fileExtension = fileName.split('.').pop().toLowerCase();
        
        // 3. Logic for Preview vs Download
        const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png'];

        if (previewableTypes.includes(fileExtension)) {
            // It's an image or PDF: Open in your Modal/Previewer
            setTitleName(fileName);
            setPdfUrl(url); // Ensure your preview component handles <img> tags too
            setOpen(true);
        } else {
            // It's Excel, Word, or other: Trigger automatic download
            const tempLink = document.createElement("a");
            tempLink.href = url;
            tempLink.setAttribute("download", fileName);
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            // Cleanup memory
            window.URL.revokeObjectURL(url);
            alert("This file format cannot be previewed and has been downloaded instead.");
        }
    })
    .catch((error) => {
        console.error("Download Error:", error);
    });
};

  // OPEN DOCUMENT PREVIEW
  const handleDocumentClick = (documentId, storedFileName, fileName) => {
    if (!storedFileName) {
      alert("No document available for this record");
      return;
    }

    // custom logic
    handleDownloadFile(documentId, storedFileName, fileName);

    // Open document in new window/tab
    // In production, this would open the actual file from your document server
    // window.open(filePath, "_blank");
    console.log(`Opening document: ${storedFileName}`);
  };

  const handleDocumentTypeChange = (index, value) => {
    console.log("Selected Document Type:", value);
    const updated = [...documents];
    updated[index].documentType = value;
    setDocuments(updated);
  };

  const handleFileChangeDropdown = (index, file) => {
    const updated = [...documents];
    updated[index].file = file;
    setDocuments(updated);
  };

  const handleUpload = async (index) => {
    const doc = documents[index];

    if (!doc.documentType || !doc.file) {
      alert("Please select document type and file");
      return;
    }

    const formData = new FormData();
    formData.append("file", doc.file);
    formData.append("documentType", doc.documentType);
    formData.append("uploadedBy", "M001");

    // 🔗 API call here
    // await uploadLeadDocument(formData);
    fetch(ServerIp + UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Document upload response:", data);
        const updated = [...documentIds];
        updated[index] = data.documentId;
        console.log("file uploaded by dialog box of OR : ", updated);
        setDocumentIds(updated);
        // Handle success (e.g., show a message, update state)
      })
      .catch((error) => console.error("Error uploading document:", error));

    const updated = [...documents];
    updated[index].uploaded = true;

    // Add new empty row if less than 4
    if (updated.length < 4) {
      updated.push({ documentType: "", file: null, uploaded: false });
    }

    setDocuments(updated);
  };

  const handleClear = (index) => {
    const updated = [...documents];
    updated.splice(index, 1);

    if (updated.length === 0) {
      updated.push({ documentType: "", file: null, uploaded: false });
    }

    setDocuments(updated);
  };

  // useEffect(() => []); // Dependency array:  The effect runs only when rowId changes

  // ===== TABLE STYLES =====
  const headerCellStyle = {
    fontWeight: 800,
    fontSize: 13,
    color: "#ecfeff",
    background: "linear-gradient(90deg, #001F54, #034078)",
    // background:
    //   "linear-gradient(90deg, #0a47e0ff 0%, #1453b7ff 50%, #81a6daff 100%)",
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
    minWidth: 140,
    maxWidth: 150,
  };

  // defaultValues: {
  //   projectTitle: "",
  //   customerName: "",
  //   customerAddress: "",
  //   defenceOrCivil: "",
  //   PoCoWoNo: "",
  //   orderRxdDate: "",
  //   qty: "",
  //   valueWithoutGST: "",
  //   valueWithGST: "",
  //   tenderType: "",
  //   deliverySchedule: "",
  //   remarks: "",
  //   JSON_competitors: "",
  //   contractCopy: "",
  //   letterOfIntent: "",
  // ---------------- FILTER + SORT LOGIC ----------------
  const filteredSortedData =
    tableData &&
    tableData
      .filter((row) => {
        const q = searchTerm.toLowerCase();

        const matchesSearch =
          !q ||
          row.projectTitle?.toLowerCase().includes(q) ||
          row.customerName?.toLowerCase().includes(q) ||
          row.orderRxdDate?.toLowerCase().includes(q) ||
          row.PoCoWoNo?.toLowerCase().includes(q) ||
          row.customerAddress?.toLowerCase().includes(q);

        const matchesTenderType =
          tenderTypeFilter === "all" ||
          row.tenderType?.toLowerCase() === tenderTypeFilter.toLowerCase();

        const matchesStatus =
          statusFilter === "all" ||
          row.presentStatus?.toLowerCase() === statusFilter.toLowerCase();

        // const matchesYear =
        //   !yearFilter || dayjs(row.orderRxdDate).year() === yearFilter.year();

        return (
          matchesSearch && matchesTenderType && matchesStatus
          //  && matchesYear
        );
      })

      .sort((a, b) => {
        let aVal;
        let bVal;

        switch (sortBy) {
          case "projectTitle":
            aVal = a.projectTitle || "";
            bVal = b.projectTitle || "";
            break;
          case "PoCoWoNo":
            aVal = a.PoCoWoNo || "";
            bVal = b.PoCoWoNo || "";
            break;
          case "orderRxdDate":
            aVal = a.orderRxdDate || "";
            bVal = b.orderRxdDate || "";
            break;
          case "valueWithoutGST":
            aVal = parseFloat(a.valueWithoutGST) || 0;
            bVal = parseFloat(b.valueWithoutGST) || 0;
            break;
          case "valueWithGST":
            aVal = parseFloat(a.valueWithGST) || 0;
            bVal = parseFloat(b.valueWithGST) || 0;
            break;
          case "qty":
            aVal = parseFloat(a.qty) || 0;
            bVal = parseFloat(b.qty) || 0;
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
      <Box sx={{ mb: 3, px: { xs: 1, sm: 0 } }}>
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            background: `linear-gradient(135deg,#EAF6FD 0%,#CFE9F7 5%,#B6DFF5 45%, #9CCEF0 100%,#6FAFD8 60%)`,
            border: "1px solid rgba(111,182,232,0.5)",
            boxShadow:
              "0 16px 40px rgba(15,23,42,0.15), inset 0 1px 0 rgba(255,255,255,0.85)",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.35), transparent 55%)",
              pointerEvents: "none",
            },
          }}
        >
          {/* =====================================================
       TOP ROW : TITLE + SEARCH + COLUMN TOGGLE
       ===================================================== */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              zIndex: 1,
            }}
          >
            {/* -------------------------------
          PAGE TITLE
         ------------------------------- */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 0.6,
                  color: "#0F172A",
                }}
              >
                Order Received Data View
              </Typography>
            </Box>

            {/* -------------------------------
          SEARCH + COLUMN VISIBILITY
         ------------------------------- */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {/* SEARCH FIELD */}
              <TextField
                size="small"
                placeholder="Search title, customer, lead owner..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded sx={{ color: "#2563EB" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: { xs: "100%", sm: 290 },
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: 14,
                    fontWeight: 500,
                    "& fieldset": {
                      borderColor: "#6FB6E8",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3B82F6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2563EB",
                      borderWidth: 2,
                      boxShadow: "0 0 0 3px rgba(37,99,235,0.25)",
                    },
                  },
                }}
              />

              {/* COLUMN TOGGLE */}
              <Tooltip title="Show / Hide Columns">
                <IconButton
                  onClick={handleColumnMenuOpen}
                  sx={{
                    height: 44,
                    width: 44,
                    borderRadius: 2,
                    background: "linear-gradient(145deg, #6FB6E8, #3B82F6)",
                    color: "#ffffff",
                    // boxShadow: "0 8px 20px rgba(37,99,235,0.45)",
                    transition: "0.25s ease",
                    "&:hover": {
                      transform: "translateY(-2px) scale(1.05)",
                      // boxShadow: "0 12px 28px rgba(37,99,235,0.6)",
                    },
                  }}
                >
                  <ViewColumnIcon />
                </IconButton>
              </Tooltip>

              {/* COLUMN MENU */}
              <Menu
                anchorEl={columnMenuAnchor}
                open={columnMenuOpen}
                onClose={handleColumnMenuClose}
                PaperProps={{
                  sx: {
                    minWidth: 280,
                    maxHeight: 400,
                    borderRadius: 2,
                    boxShadow: "0 16px 36px rgba(0,0,0,0.25)",
                  },
                }}
              >
                {leadColumns.map((col) => (
                  <MenuItem
                    key={col.id}
                    onClick={() => handleColumnToggle(col.id)}
                    sx={{ display: "flex", gap: 1 }}
                  >
                    <Checkbox
                      checked={visibleColumns[col.id]}
                      size="small"
                      sx={{
                        color: "#3B82F6",
                        "&.Mui-checked": { color: "#2563EB" },
                      }}
                    />
                    {col.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

          {/* =====================================================
       FILTERS + SORTING CONTROLS
       ===================================================== */}
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

            {/* YEAR FILTER */}
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year"]}
                label="Year"
                value={yearFilter}
                minDate={dayjs("2018-01-01")} // ✅ START FROM 2018
                onChange={(newValue) => setYearFilter(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      minWidth: 140,
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
                      "& .MuiInputLabel-root": {
                        color: "#475569",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider> */}

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

            {/* SORT DIRECTION */}
            <IconButton
              onClick={toggleSortDirection}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(145deg, #93C5FD, #60A5FA)",
                color: "#0F172A",
                maxWidth: 45,
                boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
                "&:hover": {
                  transform: "scale(1.08)",
                },
              }}
            >
              {sortDirection === "asc" ? <SouthRounded /> : <NorthRounded />}
            </IconButton>

            {/* RESET */}
            <Button
              variant="contained"
              onClick={handleResetFilters}
              startIcon={<RestartAltRounded />}
              sx={{
                ml: { xs: 0, sm: "auto" },
                borderRadius: 999,
                px: 3,
                py: 0.8,
                fontWeight: 700,
                background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                maxWidth: 120,
                "&:hover": {
                  background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1800px",
          mx: "auto",
          mt: 0,
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: 8,
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "48vh",
            // minWidth: "100%",
            scrollbarGutter: "stable",
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
                {/* <TableCell sx={actionHeaderStyle}>Actions</TableCell> */}
                {leadColumns.map((col) =>
                  visibleColumns[col.id] ? (
                    <TableCell
                      key={col.id}
                      sx={{
                        ...headerCellStyle,
                        ...(col.id === "customerAddress" && {
                          minWidth: 200,
                        }),
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData && filteredSortedData.length > 0 ? (
                filteredSortedData.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={selectedRow?.id === row.id}
                    onClick={() => handleRowClick(row)}
                    // onDoubleClick={() => handleRowDoubleClick(row)}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.18s ease-out",
                      "&:hover": {
                        backgroundColor: "rgba(59,130,246,0.06)",
                        boxShadow: 1,
                        transform: "translateY(-1px)",
                      },
                      overflow: "hidden",
                    }}
                  >
                    {leadColumns.map((col) => {
                      if (!visibleColumns[col.id]) return null;

                      // RENDER CONTRACT NAME AS HEADER
                      if (col.id === "projectTitle") {
                        return (
                          <TableCell
                            key={col.id}
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
                            {row.projectTitle}
                          </TableCell>
                        );
                      }

                      // RENDER CUSTOMER contractCopy DOCUMENT WITH MIN WIDTH
                      if (col.id === "contractCopy") {
                        // console.log("kkkkkkkkkkkkkkk : ", row.contractCopy);
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{ fontSize: 13, onClick: "disabled" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.contractCopy ? (
                              <>
                                <Link
                                  rel="noopener"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    handleDownloadFile(
                                      row.contractCopy.documentId,
                                      row.contractCopy.storedFileName,
                                      row.contractCopy?.originalFileName
                                    );
                                  }}
                                  sx={{
                                    cursor: "pointer",
                                    color: "#1e40af",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    "&:hover": {
                                      textDecoration: "underline",
                                      color: "#0d47a1",
                                    },
                                  }}
                                >
                                  {row.contractCopy?.originalFileName}
                                </Link>
                              </>
                            ) : (
                              <Typography
                                sx={{
                                  color: "#9ca3af",
                                  fontSize: "0.85rem",
                                }}
                              >
                                No document
                              </Typography>
                            )}
                          </TableCell>
                        );
                      }

                      // RENDER CUSTOMER letterOfIntent DOCUMENT WITH MIN WIDTH
                      if (col.id === "letterOfIntent") {
                        // console.log(
                        //   "lllllllllllllllllllllllll : ",
                        //   row.letterOfIntent
                        // );
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{ fontSize: 13, onClick: "disabled" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.letterOfIntent ? (
                              <>
                                <Link
                                  rel="noopener"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // console.log("contractCopy : ", row.contractCopy);
                                    handleDownloadFile(
                                      row.letterOfIntent.documentId,
                                      row.letterOfIntent.storedFileName,
                                      row.letterOfIntent?.originalFileName
                                    );
                                  }}
                                  sx={{
                                    cursor: "pointer",
                                    color: "#1e40af",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    "&:hover": {
                                      textDecoration: "underline",
                                      color: "#0d47a1",
                                    },
                                  }}
                                >
                                  {row.letterOfIntent?.originalFileName}
                                </Link>
                              </>
                            ) : (
                              <Typography
                                sx={{
                                  color: "#9ca3af",
                                  fontSize: "0.85rem",
                                }}
                              >
                                No document
                              </Typography>
                            )}
                          </TableCell>
                        );
                      }

                      // RENDER ACTIONS
                      if (col.id === "actions") {
                        return (
                          <TableCell key={col.id} align="center">
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
                                    maxWidth: 40,
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
                                    maxWidth: 40,
                                  }}
                                >
                                  <DeleteRounded fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        );
                      }

                      // if (col.id === "attachments") {
                      //   return (
                      //     <TableCell key={col.id}>
                      //       {(row.FilePath || []).length === 0 ? (
                      //         "-"
                      //       ) : (
                      //         <Stack spacing={0.5}>
                      //           {row.FilePath.map((path, i) => (
                      //             <Typography
                      //               key={i}
                      //               sx={{
                      //                 fontSize: 12,
                      //                 color: "#2563eb",
                      //                 cursor: "pointer",
                      //                 textDecoration: "underline",
                      //               }}
                      //               onClick={() => window.open(path, "_blank")}
                      //             >
                      //               {row.FileName?.[i]}
                      //             </Typography>
                      //           ))}
                      //         </Stack>
                      //       )}
                      //     </TableCell>
                      //   );
                      // }

                      // RENDER OTHER COLUMNS
                      return (
                        <TableCell
                          key={col.id}
                          align="left"
                          sx={{
                            fontSize: 13,
                            maxWidth: 180,
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {row[col.id]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      leadColumns.filter((c) => visibleColumns[c.id]).length
                    }
                    align="center"
                    sx={{ py: 4 }}
                  >
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

      {/* EDIT DIALOG - VIEW MODE & EDIT MODE - PROFESSIONAL BLUE THEME */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            background: "#ffffff",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.15), 0 10px 30px rgba(30,64,95,0.2)",
            maxHeight: "80vh",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 2,
            background: isEditMode
              ? "linear-gradient(135deg,#778DA9 20%, #9CCEF0 100%,#6FAFD8 60%)" // GREYBLUE (Edit)
              : "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)", // BLUE (View)
            color: "#ffffff",
            borderBottom: isEditMode
              ? "3px solid #33415C"
              : "3px solid #60a5fa",
            py: 2.5,
            transition: "all 0.3s ease", // smooth color change
          }}
        >
          {/* title and heading */}
          <Box display="flex" alignItems="center" gap={4}>
            <Box
              sx={{
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              📋
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#ffffff" }}
              >
                {"Order Received Details"}
              </Typography>
              {/* <Typography variant="caption" sx={{ color: "#bfdbfe", mt: 0.5 }}>
                Reference: {editingRow?.PoCoWoNo || "N/A"}
              </Typography> */}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={isEditMode ? "EDIT MODE" : "VIEW MODE"}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                background: isEditMode ? "#33415C" : "#60a5fa",
                color: isEditMode ? "#ffffff" : "#ffffff",
                ml: 3,
              }}
            />
            {/* Close Button */}
            <IconButton
              onClick={handleEditCancel}
              sx={{
                color: "#ffffff",
                maxWidth: 40,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <CloseRounded />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* // defaultValues: {
    //   projectTitle: "",
    //   customerName: "",
    //   customerAddress: "",
    //   defenceOrCivil: "",
    //   PoCoWoNo: "",
    //   orderRxdDate: "",
    //   qty: "",
    //   valueWithoutGST: "",
    //   valueWithGST: "",
    //   tenderType: "",
    //   deliverySchedule: "",
    //   remarks: "",
    //   JSON_competitors: "",
    //   contractCopy: "",
    //   letterOfIntent: "", */}

        {/* CONTENT - TABULAR MATRIX FORMAT */}
        <DialogContent
          sx={{
            background: "#f8fafc",
            p: 0,
            maxHeight: "calc(90vh - 130px)",
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#e2e8f0",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#94a3b8",
              borderRadius: "4px",
            },
            "@media (max-height: 800px)": {
              maxHeight: "calc(85vh - 130px)",
            },
          }}
        >
          <Box sx={{ p: 1.5 }}>
            {/* TENDER INFORMATION SECTION */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  { label: "Project Title Name", key: "projectTitle" },
                  { label: "Customer Name", key: "customerName" },
                  { label: "Tender Type", key: "tenderType" },
                  // { label: "Tender Dated", key: "tenderDated", isDate: true },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        type={field.isDate ? "date" : "text"}
                        InputLabelProps={
                          field.isDate ? { shrink: true } : undefined
                        }
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* CUSTOMER INFORMATION SECTION */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  { label: "Defence/ Civil", key: "defenceOrCivil" },
                  { label: "Po/Co/Wo No.", key: "PoCoWoNo" },
                  { label: "Order Rxd Date", key: "orderRxdDate" },
                  { label: "Quantity", key: "qty" },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {/* EDIT MODE */}
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        type={field.isDate ? "datetime-local" : "text"}
                        /* 🔒 Reference Number Disabled in Edit Mode */
                        disabled={field.key === "PoCoWoNo"}
                        InputLabelProps={
                          field.isDate ? { shrink: true } : undefined
                        }
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,

                            /* Grey background when disabled */
                            background:
                              field.key === "PoCoWoNo" ? "#f1f5f9" : "#ffffff",

                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            fontWeight: 600,

                            /* Muted text when disabled */
                            color:
                              field.key === "PoCoWoNo" ? "#64748b" : "#1e293b",
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Customer Address - Full Width */}
              <Box
                sx={{
                  background: "#ffffff",
                  border: "1px solid #e0e7ff",
                  borderRadius: 2,
                  p: 2,
                  mt: 2,
                  "&:hover": {
                    borderColor: "#60a5fa",
                    boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {/* <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: "0.7rem",
                  }}
                >
                  Customer Address
                </Typography> */}
                {isEditMode ? (
                  <TextField
                    value={editingRow?.customerAddress || ""}
                    onChange={(e) =>
                      handleEditFieldChange("customerAddress", e.target.value)
                    }
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                    sx={{
                      mt: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        background: "#ffffff",
                        "& fieldset": {
                          borderColor: "#60a5fa",
                        },
                        "&:hover fieldset": {
                          borderColor: "#1e40af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1e40af",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        color: "#1e293b",
                        fontWeight: 600,
                      },
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      mt: 1,
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {editingRow?.customerAddress || "-"}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* FINANCIAL DETAILS SECTION */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  // { label: "Value of EMD", key: "valueOfEMD" },
                  {
                    label: "Value Without GST",
                    key: "valueWithoutGST",
                  },
                  {
                    label: "Value With GST",
                    key: "valueWithGST",
                  },
                  // {
                  //   label: "Order Won Value (Cr, w/o GST)",
                  //   key: "orderWonValueInCrWithoutGST",
                  // },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* TIMELINE SECTION */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  {
                    label: "Order Received Date",
                    key: "orderRxdDate",
                    isDate: true,
                  },
                  // { label: "Sole / Consortium", key: "soleOrConsortium" },
                  {
                    label: "PO/WO No.",
                    key: "PoCoWoNo",
                  },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        type={field.isDate ? "datetime-local" : "text"}
                        InputLabelProps={
                          field.isDate ? { shrink: true } : undefined
                        }
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* STATUS & RESULTS SECTION */}
            <Box sx={{ mb: 3 }}>
              {/* <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: "#1e3a5f",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Box sx={{ width: 4, height: 20, background: "#1e40af", borderRadius: 1 }} />
                Status & Results
              </Typography> */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  {
                    label: "Competitors",
                    key: "deliverySchedule",
                  },
                  { label: "Remarks", key: "remarks" },
                  // { label: "Present Status", key: "presentStatus" },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Attachments Section only for edit mode */}

            {isEditMode && (
              <Card
                sx={{
                  mt: 1,
                  mb: 3,
                  p: { xs: 2, sm: 3, md: 3.5 },
                  borderRadius: 4,
                  // background:
                  //   "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(245,250,255,0.75))",
                  backdropFilter: "blur(18px)",
                  border: "1px solid rgba(148,163,184,0.25)",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  overflow: "hidden",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    // background:
                    //   "radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 55%)",
                    pointerEvents: "none",
                  },
                }}
              >
                {/* Header */}

                {isEditMode && (
                  <Card
                    sx={{
                      mt: 2,
                      p: 2.5,
                      borderRadius: 3,
                      border: "1px dashed #cbd5e1",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, mb: 2 }}>
                      📁 Multi-Format Document Manager
                    </Typography>

                    {/* Section 1: Upload New Files */}
                    <Box
                      sx={{ mb: 4, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, color: "#475569" }}
                      >
                        Upload New Documents (Supports PDF, DOCX, XLSX, JPG,
                        PNG)
                      </Typography>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<span>+</span>}
                        >
                          Select Files
                          <input
                            hidden
                            multiple // 👈 Critical for multi-select
                            type="file"
                            // 👈 Added Excel (xlsx/xls) and Word (doc/docx) mimetypes
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.csv"
                            onChange={handleMultipleFileSelect}
                          />
                        </Button>

                        <Button
                          variant="contained"
                          color="success"
                          disabled={newFiles.length === 0 || docSaving}
                          onClick={handleBatchUpload}
                        >
                          {docSaving
                            ? "Uploading..."
                            : `Upload ${newFiles.length} Files`}
                        </Button>
                      </Stack>

                      {/* Preview of files selected but not yet uploaded */}
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ mt: 2 }}
                      >
                        {newFiles.map((f, i) => (
                          <Chip
                            key={i}
                            label={f.name}
                            onDelete={() => removeFileFromSelection(i)}
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Section 2: Existing Documents (Your previous replacement logic) */}
                    <Typography sx={{ fontWeight: 700, mb: 1, fontSize: 14 }}>
                      Existing Attachments
                    </Typography>
                    <Stack spacing={1.5}>
                      {docEditRows.map((d, index) => (
                        <Paper
                          key={d.documentId}
                          variant="outlined"
                          sx={{ p: 1.5, borderRadius: 2 }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {d.originalFileName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {d.documentType}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <Button
                                fullWidth
                                variant="text"
                                size="small"
                                component="label"
                                sx={{ border: "1px dashed #ccc" }}
                              >
                                {d.file ? d.file.name : "Replace this file"}
                                <input
                                  hidden
                                  type="file"
                                  onChange={(e) =>
                                    handleReplaceFileSelect(
                                      index,
                                      e.target.files[0]
                                    )
                                  }
                                />
                              </Button>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Button
                                fullWidth
                                size="small"
                                variant="contained"
                                disabled={!d.file || docSaving}
                                onClick={() => handleUpdateExistingDocument(d)}
                              >
                                Update
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Stack>
                  </Card>
                )}

                <Divider sx={{ mt: 2.5, mb: 2, opacity: 0.5 }} />
              </Card>
            )}

            {/* DOCUMENT VIEW - VIEW MODE ONLY */}
            {!isEditMode ? (
              <Box>
                <Box
                  sx={{
                    background: "#ffffff",
                    border: "1px solid #e0e7ff",
                    borderRadius: 2,
                    p: 2,
                    "&:hover": {
                      borderColor: "#60a5fa",
                      boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography
                      sx={{
                        color: "#1e3a5f",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      📎 Document
                    </Typography>
                  </Box>
                  {editingRow?.contractCopy && (
                    <>
                      <Typography
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.85rem",
                        }}
                      >
                        Contract Copy :
                      </Typography>
                      <Link
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDownloadFile(
                            editingRow?.contractCopy?.documentId,
                            editingRow?.contractCopy?.storedFileName,
                            editingRow?.contractCopy?.originalFileName
                          );
                        }}
                        sx={{
                          cursor: "pointer",
                          color: "#1e40af",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                            color: "#0d47a1",
                          },
                        }}
                      >
                        {editingRow?.contractCopy?.originalFileName}
                      </Link>
                    </>
                  )}
                  {editingRow?.letterOfIntent && (
                    <>
                      <Typography
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.85rem",
                        }}
                      >
                        Letter of intent :
                      </Typography>
                      <Link
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile(
                            editingRow?.letterOfIntent.documentId,
                            editingRow?.letterOfIntent.storedFileName,
                            editingRow?.letterOfIntent?.originalFileName
                          );
                        }}
                        sx={{
                          cursor: "pointer",
                          color: "#1e40af",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                            color: "#0d47a1",
                          },
                        }}
                      >
                        {editingRow?.letterOfIntent.originalFileName}
                      </Link>
                    </>
                  )}
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                }}
              >
                No document
              </Typography>
            )}

            {/* <Box sx={{ md: 3 }}>
            <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
              <Typography fontWeight={700}>Attachments</Typography>
              <Stack spacing={1}>
                {editingRow?.FilePath?.map((path, i) => (
                  <Button
                    key={i}
                    variant="outlined"
                    onClick={() => window.open(path, "_blank")}
                  >
                    {editingRow.FileName[i]}
                  </Button>
                ))}
              </Stack>
              </Box>
            </Box> */}
          </Box>
        </DialogContent>

        {/* DIALOG ACTIONS */}
        <DialogActions
          sx={{
            background: "#f8fafc",
            borderTop: "1px solid #e0e7ff",
            p: 2.5,
            gap: 1.5,
          }}
        >
          {!isEditMode ? (
            <>
              {/* <Button
                onClick={handleEditCancel}
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                  backgroundColor: "#e2e8ff",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                Close
              </Button> */}
              {dialogOpenedFrom === "editIcon" && (
                <Button
                  onClick={handleEnterEditMode}
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, #1e40af 0%, #1e3a5f 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    maxWidth: 180,
                    letterSpacing: "0.5px",
                    px: 3,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1e3a5f 0%, #162e4a 100%)",
                      boxShadow: "0 8px 24px rgba(30,64,95,0.3)",
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  ✏️ Edit Details
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={handleCancelEdit}
                sx={{
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, #999999 0%, #777777 100%)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  maxWidth: 160,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #555555 0%, #333333 100%)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                  maxWidth: 200,
                  px: 3,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                💾 Save Changes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* CONFIRMATION DIALOG */}
      <Dialog
        open={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "#ffffff",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#1e3a5f",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "2px solid #fbbf24",
          }}
        >
          <Box sx={{ fontSize: 28 }}>⚠️</Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#1e3a5f" }}>
              Confirm Update
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Please review before saving
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography sx={{ color: "#475569", lineHeight: 1.6 }}>
            You are about to update this tender record with the following
            changes. This action will be synced to the database immediately.
          </Typography>
          <Box
            sx={{
              mt: 2.5,
              p: 2,
              background: "#f0f9ff",
              border: "1px solid #bfdbfe",
              borderRadius: 2,
              color: "#1e3a5f",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            📌 Make sure all fields are correct before confirming.
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            background: "#f8fafc",
            borderTop: "1px solid #e0e7ff",
            p: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={() => setConfirmSaveOpen(false)}
            sx={{
              color: "#ffffff",
              background: "linear-gradient(135deg, #999999 0%, #777777 100%)",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              maxWidth: 160,
              "&:hover": {
                background: "linear-gradient(135deg, #555555 0%, #333333 100%)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              maxWidth: 220,
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
              },
            }}
          >
            ✓ Yes, Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "#ffffff",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#1e3a5f",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "2px solid #fbbf24",
          }}
        >
          <Box sx={{ fontSize: 28 }}>⚠️</Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#1e3a5f" }}>
              Confirm Update
            </Typography>
            {/* <Typography variant="caption" sx={{ color: "#64748b" }}>
              Please review before saving
            </Typography> */}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography sx={{ color: "#475569", lineHeight: 1.6 }}>
            You are about to delete this tender record. This action will be
            synced to the database immediately.
          </Typography>
          {/* <Box
            sx={{
              mt: 2.5,
              p: 2,
              background: "#f0f9ff",
              border: "1px solid #bfdbfe",
              borderRadius: 2,
              color: "#1e3a5f",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            📌 Make sure all fields are correct before confirming.
          </Box> */}
        </DialogContent>
        <DialogActions
          sx={{
            background: "#f8fafc",
            borderTop: "1px solid #e0e7ff",
            p: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            sx={{
              color: "#ffffff",
              background: "linear-gradient(135deg, #999999 0%, #777777 100%)",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              maxWidth: 160,
              "&:hover": {
                background: "linear-gradient(135deg, #555555 0%, #333333 100%)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteRow(idDeleteOpen)}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#ffffff",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              maxWidth: 160,
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                boxShadow: "0 8px 24px rgba(239,68,68,0.3)",
              },
            }}
          >
            ✓ Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show pdf in object */}
      <PdfViewerDialog
        open={open}
        onClose={() => setOpen(false)}
        pdfUrl={pdfUrl}
        title={titleName}
      />
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
  const [selectedFiles, setSelectedFile] = useState([]);
  const [uploadFileData, setuploadFileData] = useState();

  // defaultValues: {
  //   projectTitle: "",
  //   customerName: "",
  //   customerAddress: "",
  //   defenceOrCivil: "",
  //   PoCoWoNo: "",
  //   orderRxdDate: "",
  //   qty: "",
  //   valueWithoutGST: "",
  //   valueWithGST: "",
  //   tenderType: "",
  //   deliverySchedule: "",
  //   remarks: "",
  //   JSON_competitors: "",

  const DB_COLUMNS = [
    "projectTitle",
    "customerName",
    "customerAddress",
    "defenceOrCivil",
    "PoCoWoNo",
    "orderRxdDate",
    "qty",
    "valueWithoutGST",
    "valueWithGST",
    "tenderType",
    "deliverySchedule",
    "remarks",
    "JSON_competitors",
    "contractCopy",
    "letterOfIntent",
    // user info
    "OperatorId",
    "OperatorName",
    "OperatorRole",
    "OperatorSBU",
  ];

  const DB_COLUMNS_MATCH = [
    "projectTitle",
    "customerName",
    "customerAddress",
    "defenceOrCivil",
    "PoCoWoNo",
    "orderRxdDate",
    "qty",
    "valueWithoutGST",
    "valueWithGST",
    "tenderType",
    "deliverySchedule",
    "remarks",
    "JSON_competitors",
    "contractCopy",
    "letterOfIntent",
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
        mb: 5,
        minHeight: "70vh",
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
          mb: 8,
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
          Upload Order Received Data
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
              mb: 5,
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
                mb: 4,
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
