import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
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
  Checkbox,
  Menu,
  Chip,
  Zoom,
  Link,
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
} from "@mui/icons-material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { PdfViewerDialog } from "../budgetaryQuotation/pdfViewerDialog";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

const tenderTypeOptions = ["ST", "MT", "Nom", "LT"];
const documentTypeOptions = ["RFP", "RFQ", "EOI", "BQ", "NIT", "RFI", "Others"];

const STATUS_OPTIONS = ["RFP", "RFQ", "EOI", "BQ", "NIT", "RFI", "Others"];

const TENDER_TYPE_OPTIONS = ["ST", "MT", "LT"];

const CRMLeadForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // to map document ids after upload to leadId from backend;
  // store document ids to update lead document mapping later
  const [documentIds, setDocumentIds] = useState([]);

  // Dynamic state for dropdowns with hardcoded fallbacks
  const [dynamicOptions, setDynamicOptions] = useState({
    tenderType: ["SL", "MT", "LT"],
    // tenderType: [],
    documentType: ["RFP", "EOI", "NIT", "BQ", "RFQ"],
  });

  // Document Upload States
  const [documentFile, setDocumentFile] = useState(null);

  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  //
  const [browsefile, setbrowsefile] = useState(null);
  const [presentDate, setPrsentDate] = useState(new Date());
  const [SaveDataHardDiskURL, SetSaveDataHardDiskURL] = useState("");
  const [uploadFileData, setuploadFileData] = useState();

  const API = "/getCRMLeads";
  const UPLOAD_API = "/fileUpload";
  let user = JSON.parse(localStorage.getItem("user"));
  // console.log(" user object ", user);

  useEffect(() => {
    axios
      .get(`/config.json`)
      .then(function (response) {
        // WE SETTING THE API
        const nodeIp = response.data.project[0].ServerIP[0].NodeServerIP;
        // console.log(
        //   " CRM Lead is looking for server IP : ",
        //   response.data.project[0].ServerIP[0].NodeServerIP
        // );
        SetServerIp(nodeIp);
        axios
          .get(response.data.project[0].ServerIP[0].NodeServerIP + API)
          .then((response) => {
            // console.log(" Response while hitting API : ", response);
            setOrderData(response.data);
          });

        axios
          .get(nodeIp + "/getCRMLeadFilters")
          .then((res) => {
            if (res.data.success) {
              // console.log("Defence getDomesticLeadFilters:", res.data.data.type.length);
              setDynamicOptions({
                // Only override defaults if the database actually has values
                tenderType:
                  res.data.data.type.length > 0
                    ? res.data.data.type
                    : ["SL", "MT", "LT"],

                documentType:
                  res.data.data.doc.length > 0
                    ? res.data.data.doc
                    : ["RFP", "EOI", "BQ", "NIT", "RFQ"],
              });
            }
          })
          .catch((error) => console.log("Filter fetch error:", error.message));
      })
      .catch(function (error) {
        // console.log("config.json BudgetaryQuotationFormerror", error);
        SetServerIp("172.195.120.135");

        // console.log(error);
      });
  }, [submitSuccess]);

  // const defaultServerIp = "http://localhost:8082";
  // const serverIp = props?.ServerIp || defaultServerIp;

  // const SaveDataURL = `${serverIp}/CreateCRMLead`;
  // const GetDataURL = `${serverIp}/GetCRMLead`; // or /GetCRMLead based on backend

  const {
    control,
    handleSubmit,
    watch,
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
      emdInLakhs: "",
      approxTenderValueLakhs: "",
      lastDateSubmission: "",
      preBidDate: "",
      teamAssigned: "",
      remarks: "",
      corrigendumInfo: "",
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
      // Dom_or_Export: "",
    },
  });

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

  const UPLOAD_ENDPOINT = `/uploadDocument`;
  const UPDATE_ENDPOINT = `/updateDocument`;

  const DOCUMENT_TYPES = [
    { id: "rfp", label: "RFP" },
    { id: "boq", label: "BoQ" },
  ];

  const today = new Date().toLocaleDateString("en-CA");
  const now = new Date().toLocaleString("sv-SE").slice(0, 16);
  const lastDateSubmission = watch("lastDateSubmission");

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

  const onSubmit = (data) => {
    console.log("Raw Form Data:", data);
    console.log("USer:", user);

    const formattedData = {
      leadID: data.leadID,
      issueDate: data.issueDate,
      tenderName: data.tenderName,
      organisation: data.organisation,
      documentType: data.documentType,
      tenderType: data.tenderType,
      emdInLakhs:
        data.emdInLakhs !== ""
          ? parseFloat(parseFloat(data.emdInLakhs).toFixed(5))
          : null,
      approxTenderValueLakhs:
        data.approxTenderValueLakhs !== ""
          ? parseFloat(parseFloat(data.approxTenderValueLakhs).toFixed(5))
          : null,
      // emdInLakhs:data.emdInLakhs,
      // approxTenderValueLakhs:data.approxTenderValueLakhs,
      lastDateSubmission: data.lastDateSubmission,
      preBidDate: data.preBidDate,
      teamAssigned: data.teamAssigned,
      remarks: data.remarks || "",
      corrigendumInfo: data.corrigendumInfo || "",
      attachment: selectedFiles.map((f) => f.name),
      // fileName: uploadFileData?.fileName,
      // filePath: uploadFileData?.filePath,
      // hardDiskFileName: uploadFileData?.hardDiskFileName,

      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
      submittedAt: new Date().toISOString(),
      // // rfp: uploadFileData?.map((f) => f.originalName),
      // FileName: uploadFileData?.map((f) => f.savedName),
      // FilePath: uploadFileData?.map((f) => f.filePath),
      // HardDiskFileName: uploadFileData?.map((f) => f.savedName),
    };

    console.log("Frontend Form Data:", JSON.stringify(formattedData, null, 2));

    // Old console block kept as comment:
    // console.log(
    //   "Budgetary Quotation Data:",
    //   JSON.stringify(formattedData, null, 2)
    // );

    // HERE WE ARE CALLING THE API
    axios
      .post(ServerIp + API, formattedData)
      .then((response) => {
        // console.log("formattedData after ")
        console.log("Server Response:", response.data);
        documentIds.forEach((docId, index) => {
          if (docId) {
            // Map document to lead using documentIds[index] and response.data.leadId
            console.log(
              `Mapping document ID ${documentIds[index]} to lead ID ${response.data.id}`,
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
        // ✅ reset form fields after submit
        reset();

        // Optional: Scroll user to success card
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => console.log(error.message));
  };

  // RESET
  const handleReset = () => {
    reset();
    setSubmittedData(null);
    setSelectedFiles([]);
    setuploadFileData(null);
  };

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
        file.type.includes("word"),
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
      const res = await fetch(ServerIp + "/crmFileUpload", {
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocumentFile(file);
      setbrowsefile(file);
    } else {
      alert("Please Select pdf only");
    }
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

  // const handleFileUpload = async () => {
  //   if (selectedFiles.length === 0) {
  //     alert("Please select files");
  //     return;
  //   }

  //   const formData = new FormData();
  //   selectedFiles.forEach((file) => formData.append("files", file));

  //   try {
  //     const res = await fetch(ServerIp + "/fileUpload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     console.log("Uploaded files:", data);
  //     setuploadFileData(data);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Upload failed");
  //   }
  // };

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
        borderRadius: 1,
      }}
    >
      {/* Title */}

      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" }, // Fluid font size
            background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textAlign: { xs: "center" }, // Center text on small screens
          }}
        >
          CRM Leads
        </Typography>
      </Box>
      {/* <Divider  flexItem sx={{ backgroundColor: '#A9D6E5', height: '4px', mt: 4}}/> */}

      <Divider
        flexItem
        sx={{
          background: "linear-gradient(135deg, #0d47a1 , #42a5f5, #1e88e5)",
          height: { xs: "3px", md: "4px" }, // Slightly thinner on mobile
          mt: { xs: 1, md: 2 },
        }}
      />
      {/* ------------------------ TABS ------------------------ */}
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mt: { xs: 1, md: 1 },
          mb: 1,
          // This targets the internal flex container to center the tabs
          "& .MuiTabs-flexContainer": {
            justifyContent: { xs: "flex-start", md: "center" },
          },
          "& .MuiTab-root": {
            fontWeight: 700,
            fontSize: { xs: "0.85rem", sm: "1rem" },
            textTransform: "none",
            minWidth: { xs: 80, sm: 160 },
            px: { xs: 2, sm: 4 },
          },
          "& .Mui-selected": {
            color: "#0d47a1 !important",
          },
          "& .MuiTabs-indicator": {
            height: { xs: 3, md: 4 },
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
            {submitSuccess ? (
              <Zoom in={submitSuccess}>
                <Box
                  sx={{
                    mt: -3,
                    textAlign: "center",
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, md: 6 },
                  }}
                >
                  <Card
                    sx={{
                      mx: "auto",
                      maxWidth: 720,
                      borderRadius: 5,
                      p: { xs: 3, md: 5 },
                      // background:
                      //   "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(235,248,255,0.92))",
                      backdropFilter: "blur(14px)",
                      boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
                      border: "1px solid rgba(59,130,246,0.18)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 90,
                        height: 90,
                        mx: "auto",
                        mb: 2,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        // background:
                        //   "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(59,130,246,0.12))",
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{ fontSize: 55, color: "#16a34a" }}
                      />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        letterSpacing: 0.2,
                        // background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
                        background: "#1e88e5",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      Form Submitted Successfully!
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 900,
                        letterSpacing: 0.2,
                        // background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
                        background: "#16a34a",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {submittedData.leadReferenceNo}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 15.5,
                        color: "rgba(15,23,42,0.75)",
                        fontWeight: 500,
                      }}
                    >
                      Your CRM Lead details were recorded successfully. You can
                      now submit another form if needed.
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<RestartAltRoundedIcon />}
                        onClick={() => {
                          setSubmitSuccess(false);
                          setSubmittedData(null);
                          reset(); // clear again for safety
                        }}
                        sx={{
                          px: 5,
                          py: 1.4,
                          borderRadius: 999,
                          fontWeight: 800,
                          textTransform: "none",
                          maxWidth: 300,
                          background: "linear-gradient(90deg,#2563eb,#38bdf8)",
                          boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg,#1d4ed8,#0ea5e9)",
                          },
                        }}
                      >
                        Submit Another Form
                      </Button>

                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setValue(1)} // go to View Data tab
                        sx={{
                          px: 5,
                          py: 1.4,
                          maxWidth: 280,
                          borderRadius: 999,
                          fontWeight: 800,
                          textTransform: "none",
                        }}
                      >
                        View Submitted Data
                      </Button>
                    </Box>
                  </Card>
                </Box>
              </Zoom>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
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
                    📋 CRM Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={4}>
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
                              label={label}
                              fullWidth
                              type={type || "text"}
                              InputLabelProps={{ shrink: true }}
                              error={!!errors[name]}
                              helperText={errors[name]?.message}
                              // sx={textFieldStyle}
                              inputProps={
                                type === "date"
                                  ? { max: today } // ✅ disables future dates ONLY for Issue Date
                                  : undefined
                              }
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
                        name="emdInLakhs"
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
                            error={!!errors.emdInLakhs}
                            helperText={errors.emdInLakhs?.message}
                          />
                        )}
                      />
                    </Grid>

                    {/* Approx Tender Value */}
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="approxTenderValueLakhs"
                        control={control}
                        rules={{
                          required: "Approx Tender Value is required",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Approx Tender Value in Lakhs"
                            InputLabelProps={{ shrink: true }}
                            className="text-field-style"
                            error={!!errors.approxTenderValueLakhs}
                            helperText={errors.approxTenderValueLakhs?.message}
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
                            fullWidth
                            type="date"
                            label="Last Date of Submission"
                            InputLabelProps={{ shrink: true }}
                            // sx={textFieldStyle}
                            error={!!errors.lastDateSubmission}
                            helperText={errors.lastDateSubmission?.message}
                            inputProps={{
                              min: today, // ✅ past dates disabled
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Pre Bid Date */}
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="preBidDate"
                        control={control}
                        rules={{
                          validate: (value) =>
                            !lastDateSubmission ||
                            value <= `${lastDateSubmission}T23:59`
                              ? true
                              : "Pre-bid date must be on or before Last Date of Submission",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="datetime-local"
                            label="Pre-bid Date & Time"
                            InputLabelProps={{ shrink: true }}
                            // sx={textFieldStyle}
                            inputProps={{
                              min: now, // ✅ past date-time disabled
                              max: lastDateSubmission
                                ? `${lastDateSubmission}T23:59`
                                : undefined,
                            }}
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
                </Card>

                {/* Attachments Section */}
                {/* <Card
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
                      Upload Contract Copy / Work Order / boq
                      (Optional)
                    </Typography>

                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ mt: 2, mb: 2 }}
                    >
                      Choose Files
                      <input
                        type="file"
                        hidden
                        multiple
                        accept=".pdf,.jpg,.xlsx,.doc,.docx,.xls"
                        onChange={handleFileChange}
                      />
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{ mt: 2, mb: 2, ml: 3, maxWidth: 140 }}
                      onClick={handleFileUpload}
                    >
                      Upload Files
                    </Button>

                    {selectedFiles.length > 0 && (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {selectedFiles.map((file, index) => {
                          const fileUrl = URL.createObjectURL(file);

                          return (
                            <Grid item xs={12} md={6} key={index}>
                              <Card
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 2,
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                }}
                              >
                                FILE NAME (CLICK TO PREVIEW IN NEW TAB)
                                <Tooltip title="Click to preview">
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: 600,
                                      color: "#1e40af",
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                      maxWidth: "75%",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                    onClick={() =>
                                      window.open(fileUrl, "_blank")
                                    }
                                  >
                                    {file.name}
                                  </Typography>
                                </Tooltip>

                                REMOVE BUTTON
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  onClick={() =>
                                    setSelectedFiles((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    )
                                  }
                                  sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                  }}
                                >
                                  Remove
                                </Button>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                  </Box>
                </Card> */}

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
                            Upload RFP/BoQ/PriceBid Format
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
                                      e.target.value,
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
                                    <MenuItem
                                      key={docType.id}
                                      value={docType.id}
                                    >
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
                                        e.target.files?.[0],
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
                                    doc.uploaded ||
                                    !doc.file ||
                                    !doc.documentType
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
                                      onClick={() =>
                                        handleRemoveDocument(index)
                                      }
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

                {/* BUTTONS */}
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
                  &nbsp;&nbsp;&nbsp;
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
                      maxWidth: 180,
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
            )}

            {/* SUCCESS SNACKBAR */}
            <Snackbar
              open={submitSuccess}
              autoHideDuration={4500}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                CRM Lead submitted successfully!
              </Alert>
            </Snackbar>

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

      {value === 1 && orderData !== undefined && (
        <ViewCRMLeadData
          ViewData={orderData}
          user={user} // 👈 Passes user object to fix 'no-undef'
          ServerIp={ServerIp} // 👈 Passes the IP to fix the 404 error
        />
      )}

      {/* ------------------------ BULK UPLOAD ------------------------ */}
      {value === 2 && (
        <ExcelUploadAndValidate
          user={user}
          ServerIp={ServerIp} // 👈 Ensure ServerIp is passed here too
        />
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

function ViewCRMLeadData(props) {
  // console.log("props view ViewCRMLeadData", props);

  // 1. Define 'user' from props to fix the 'no-undef' error
  const user = props.user;

  // 2. Define 'ServerIp' with your specific backend port as the fallback
  const ServerIp = props.ServerIp || "http://localhost:8082";

  // 3. Store data in local state for updates
  const [tableData, setTableData] = useState(props.ViewData.data || []);

  // --- ADD THESE TWO FUNCTIONS HERE ---

  // 1. Converts DD.MM.YYYY (from DB) to YYYY-MM-DD (for Browser)
  const formatDateForInput = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return "";

    // Handle standard Date (DD.MM.YYYY)
    if (dateStr.includes(".") && !dateStr.includes(":")) {
      const [day, month, year] = dateStr.split(".");
      return `${year}-${month}-${day}`;
    }

    // Handle Datetime (DD.MM.YYYY HH:MM:SS) for preBidDate
    if (dateStr.includes(".") && dateStr.includes(":")) {
      const [datePart, timePart] = dateStr.split(" ");
      const [day, month, year] = datePart.split(".");
      return `${year}-${month}-${day}T${timePart.slice(0, 5)}`;
    }

    return dateStr;
  };

  // 2. Converts YYYY-MM-DD (from Browser) back to DD.MM.YYYY (for DB)
  const formatDateForStorage = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string" || !dateStr.includes("-"))
      return dateStr || "";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  //Count rows
  useEffect(() => {
    if (props.ViewData.data) {
      setTableData(props.ViewData.data);
    }
  }, [props.ViewData.data]);

  // Sync with parent data when it changes
  useEffect(() => {
    if (props.ViewData.data) {
      setTableData(props.ViewData.data);
    }
  }, [props.ViewData.data]);

  //for Total Rows Count
  const totalRows = tableData?.length || 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");
  const [dialogOpenedFrom, setDialogOpenedFrom] = useState("rowClick"); // "rowClick" or "editIcon"

  const [selectedRow, setSelectedRow] = useState(null);
  // Document Upload States
  const [documentFile, setDocumentFile] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [tempEditingRow, setTempEditingRow] = useState(null);

  // DELETE ROW
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [idDeleteOpen, setIdDeleteOpen] = useState(null);

  // READ-ONLY VIEW DIALOG STATE
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  // COLUMN VISIBILITY STATE
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const columnMenuOpen = Boolean(columnMenuAnchor);

  const [visibleColumns, setVisibleColumns] = useState({
    leadID: true,
    leadReferenceNo: true,
    issueDate: true,
    tenderName: true,
    organisation: true,
    documentType: true,
    tenderType: true,
    emdInLakhs: true,
    approxTenderValueLakhs: true,
    lastDateSubmission: true,
    preBidDate: true,
    teamAssigned: true,
    remarks: true,
    corrigendumInfo: true,
    rfp: true,
    boq: true,
    dateCreated: false,
    actions: true,
  });

  //Multiple upload States
  const [newFiles, setNewFiles] = useState([]);

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
    { id: "rfp", label: "RFP" },
    { id: "boq", label: "BoQ" },
  ];

  const [docEditRows, setDocEditRows] = useState([]); // existing docs for editing
  const [docSaving, setDocSaving] = useState(false);

  //for handleConfirmSave

  // COLUMN DEFINITIONS
  const leadColumns = [
    { id: "actions", label: "Actions" },
    { id: "leadReferenceNo", label: "Lead Reference No." },
    { id: "leadID", label: "Lead Id" },
    { id: "issueDate", label: "Issue Date" },
    { id: "tenderName", label: "Tender Name" },
    { id: "organisation", label: "Organisation" },
    { id: "documentType", label: "Document Type" },
    { id: "tenderType", label: "Tender Type" },
    { id: "emdInLakhs", label: "EMD in Lakhs" },
    { id: "approxTenderValueLakhs", label: "Approx Tender Value in Lakhs" },
    { id: "lastDateSubmission", label: "Last Date of Submission" },
    { id: "preBidDate", label: "Pre-bid Date" },
    { id: "teamAssigned", label: "Team Assigned" },
    { id: "remarks", label: "Remarks" },
    { id: "corrigendumInfo", label: "Corrigendums Date & File" },
    { id: "rfp", label: "RFP" },
    { id: "boq", label: "BoQ" },
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
  };

  // DELETE ROW
  const handleDeleteRow = async (id) => {
    try {
      const deleteData = {
        id: id,
        OperatorId: user?.id || "291536",
        OperatorName: user?.username || "Vivek Kumar Singh",
      };

      // Note: Your router uses "/getDeleteCRMLeads"
      await axios.delete(`${ServerIp}/getDeleteCRMLeads`, {
        data: deleteData,
        headers: { "Content-Type": "application/json" },
      });

      setTableData(tableData.filter((item) => item.id !== id));
      setConfirmDeleteOpen(false);
      alert("✅ Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("❌ Failed to delete.");
    }
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
        { headers: { "Content-Type": "multipart/form-data" } },
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

    if (row?.rfp) {
      initDocs.push({
        documentId: row.rfp.documentId,
        documentType: "rfp",
        originalFileName: row.rfp.originalFileName,
        storedFileName: row.rfp.storedFileName,
        file: null, // replacement file
      });
    }
    if (row?.boq) {
      initDocs.push({
        documentId: row.boq.documentId,
        documentType: "boq",
        originalFileName: row.boq.originalFileName,
        storedFileName: row.boq.storedFileName,
        file: null,
      });
    }

    setDocEditRows(initDocs.length ? initDocs : []);
  };

  // OPEN DIALOG FROM EDIT ICON (READY TO EDIT)
  // const handleEditClick = (row) => {
  //   setTempEditingRow({ ...row }); // Store original data
  //   setEditingRow({ ...row }); // Set for editing
  //   setIsEditMode(false); // Start in VIEW mode but with edit option
  //   setDialogOpenedFrom("editIcon"); // Mark as opened from edit icon
  //   setEditDialogOpen(true);

  //   const initDocs = [];

  //   if (row?.rfp) {
  //     initDocs.push({
  //       documentId: row.rfp.documentId,
  //       documentType: "rfp",
  //       originalFileName: row.rfp.originalFileName,
  //       storedFileName: row.rfp.storedFileName,
  //       file: null, // replacement file
  //     });
  //   }
  //   if (row?.boq) {
  //     initDocs.push({
  //       documentId: row.boq.documentId,
  //       documentType: "boq",
  //       originalFileName: row.boq.originalFileName,
  //       storedFileName: row.boq.storedFileName,
  //       file: null,
  //     });
  //   }

  //   setDocEditRows(initDocs.length ? initDocs : []);
  // };

  const handleEditClick = (row) => {
    setTempEditingRow({ ...row }); // Store original data
    setEditingRow({ ...row }); // Set for editing
    setIsEditMode(false); // Start in VIEW mode but with edit option
    setDialogOpenedFrom("editIcon"); // Mark as opened from edit icon
    setEditDialogOpen(true);

    const initDocs = [];

    if (row?.contractCopy) {
      initDocs.push({
        documentId: row.rfp.documentId,
        documentType: "rfp",
        originalFileName: row.rfp.originalFileName,
        storedFileName: row.rfp.storedFileName,
        file: null, // replacement file
      });
    }
    if (row?.boq) {
      initDocs.push({
        documentId: row.boq.documentId,
        documentType: "boq",
        originalFileName: row.boq.originalFileName,
        storedFileName: row.boq.storedFileName,
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
        { headers: { "Content-Type": "multipart/form-data" } },
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
            : d,
        ),
      );

      // ✅ also update editingRow so view section shows updated file
      setEditingRow((prev) => {
        if (!prev) return prev;
        const key = docRow.documentType; // rfp / boq
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
  // const handleConfirmSave = async () => {
  //   try {
  //     // 1. Prepare data and ensure Operator details are present for history logging
  //     const { id, ...restOfData } = editingRow;

  //     const updatePayload = {
  //       id: id,
  //       ...restOfData,
  //       // Explicitly pull these to ensure they aren't missing
  //       OperatorId: user?.id || "291536",
  //       OperatorName: user?.username || "Vivek Kumar Singh",
  //     };

  //     // 2. Remove leadReferenceNo if it is null to avoid unique constraint issues
  //     if (updatePayload.leadReferenceNo === null) {
  //       delete updatePayload.leadReferenceNo;
  //     }

  //     console.log("🚀 Sending Update Request:", updatePayload);

  //     const response = await axios.put(
  //       `${ServerIp}/getUpdateCRMLeads`,
  //       updatePayload,
  //     );

  //     if (response.data.success || response.status === 200) {
  //       const updatedTableData = tableData.map((row) =>
  //         row.id === editingRow.id ? { ...editingRow } : row,
  //       );
  //       setTableData(updatedTableData);
  //       alert("✅ CRM Lead updated successfully!");
  //       setConfirmSaveOpen(false);
  //       setEditDialogOpen(false);
  //       setIsEditMode(false);
  //     }
  //   } catch (error) {
  //     console.error("❌ Backend Error:", error.response?.data || error.message);
  //     alert(
  //       `Failed to save: ${
  //         error.response?.data?.message || "Internal Server Error"
  //       }`,
  //     );
  //   }
  // };

  const handleConfirmSave = async () => {
    try {
      // 1. Destructure ID from the data
      const { id, ...restOfData } = editingRow;

      // 2. Build the payload and EXPLICITLY include Operator details
      // Your backend history service will fail if these are missing.
      const updatePayload = {
        id: id,
        ...restOfData,
        // Use Rakshitha (from your profile) or the logged-in user
        OperatorId: user?.id || "291536",
        OperatorName: user?.username || "Rakshitha",
      };

      // 3. Prevent Unique Constraint conflicts with null Reference Nos
      if (updatePayload.leadReferenceNo === null) {
        delete updatePayload.leadReferenceNo;
      }

      console.log("🚀 Sending Update Request:", updatePayload);

      const response = await axios.put(
        `${ServerIp}/getUpdateCRMLeads`,
        updatePayload,
      );

      if (response.data.success || response.status === 200) {
        const updatedTableData = tableData.map((row) =>
          row.id === editingRow.id ? { ...editingRow } : row,
        );
        setTableData(updatedTableData);
        alert("✅ CRM Lead updated successfully!");
        setConfirmSaveOpen(false);
        setEditDialogOpen(false);
        setIsEditMode(false);
      }
    } catch (error) {
      // Detailed error logging to see the exact backend failure
      const errorMsg = error.response?.data?.message || error.message;
      console.error("❌ Backend Error Detail:", error.response?.data);
      alert(`Failed to save: ${errorMsg}`);
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
    console.log("ID to delete:", id);
    setIdDeleteOpen(id);
    setConfirmDeleteOpen(true); // Open confirmation dialog
  };

  // DOUBLE CLICK → OPEN READ-ONLY VIEW
  const handleRowDoubleClick = (row) => {
    setViewRow(row);
    setViewDialogOpen(true);
  };

  //New Document Preview

  const handleDownloadFile = async (documentId, hardDiskFileName, fileName) => {
    console.log("Downloading file:", hardDiskFileName);

    axios
      .get(`${ServerIp}/getOrderReceived/${documentId}/download`, {
        responseType: "blob",
      })
      .then((response) => {
        // 1. Get the content type from headers (or infer from file extension)
        const contentType = response.headers["content-type"];
        const fileBlob = new Blob([response.data], { type: contentType });

        const url = window.URL.createObjectURL(fileBlob);

        // 2. Identify the file extension
        const fileExtension = fileName.split(".").pop().toLowerCase();

        // 3. Logic for Preview vs Download
        const previewableTypes = ["pdf", "jpg", "jpeg", "png"];

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
          alert(
            "This file format cannot be previewed and has been downloaded instead.",
          );
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

  // ===== TABLE STYLES =====
  const headerCellStyle = {
    fontWeight: 800,
    fontSize: 13,
    color: "#ecfeff",
    background: "linear-gradient(90deg, #001F54, #034078)",
    // "linear-gradient(90deg, #0a47e0ff 0%, #1453b7ff 50%, #81a6daff 100%)",
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

  // ---------------- FILTER + SORT LOGIC ----------------
  const filteredSortedData =
    tableData &&
    tableData
      .filter((row) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          row.tenderName?.toLowerCase().includes(q) ||
          row.organisation?.toLowerCase().includes(q) ||
           row.leadReferenceNo?.toLowerCase().includes(q) ||
          row.leadID?.toLowerCase().includes(q) ||
          row.preBidDate?.toLowerCase().includes(q) ||
          row.teamAssigned?.toLowerCase().includes(q);

        const matchesTenderType =
          tenderTypeFilter === "all" ||
          row.tenderType?.toLowerCase() === tenderTypeFilter.toLowerCase();

        const matchesStatus =
          statusFilter === "all" ||
          row.documentType?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesTenderType && matchesStatus;
      })
      .sort((a, b) => {
        let aVal;
        let bVal;

        // defaultValues: {
        //   leadID: "",
        //   issueDate: "",
        //   tenderName: "",
        //   organisation: "",
        //   documentType: "",
        //   tenderType: "",
        //   emdInLakhs: "",
        //   approxTenderValueLakhs: "",
        //   lastDateSubmission: "",
        //   preBidDate: "",
        //   teamAssigned: "",
        //   remarks: "",
        //   corrigendumInfo: "",

        switch (sortBy) {
          case "issueDate":
            aVal = a.issueDate || "";
            bVal = b.issueDate || "";
            break;
          case "emdInLakhs":
            aVal = a.emdInLakhs || "";
            bVal = b.emdInLakhs || "";
            break;
          case "approxTenderValueLakhs":
            aVal = a.approxTenderValueLakhs || "";
            bVal = b.approxTenderValueLakhs || "";
            break;
          case "lastDateSubmission":
            aVal = parseFloat(a.lastDateSubmission) || 0;
            bVal = parseFloat(b.lastDateSubmission) || 0;
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
                CRM lead List
              </Typography>
              {/* <Typography
                variant="body2"
                sx={{ opacity: 0.85, mt: 0.5, maxWidth: 520 }}
              >
                View, search, filter and manage all submitted tender leads in a
                single, elegant dashboard.
              </Typography> */}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {/* TOTAL ROW COUNT DISPLAY */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {/* Left side: count */}
                <Chip
                  label={`Total Entries: ${totalRows}`}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    px: 1,
                    py: 1,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(21,101,192,0.25)",
                    // transition: "0.3s",
                    // "&:hover": {
                    //   transform: "scale(1.05)",
                    //   boxShadow: "0 6px 16px rgba(21,101,192,0.35)",
                    // },
                  }}
                />

                {/* Right side: optional subtitle */}
                {/* <Typography
                  variant="body2"
                  sx={{
                    color: "#1e3a8a",
                    fontWeight: 500,
                    opacity: 0.85,
                  }}
                >
                  Showing live data from database
                </Typography> */}
              </Box>

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

            {/* Document FILTER */}
            <TextField
              select
              size="small"
              label="Document Type"
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

            {/* defaultValues: {
      leadID: "",
      issueDate: "",
      tenderName: "",
      organisation: "",
      documentType: "",
      tenderType: "",
      emdInLakhs: "",
      approxTenderValueLakhs: "",
      lastDateSubmission: "",
      preBidDate: "",
      teamAssigned: "",
      remarks: "",
      corrigendumInfo: "", */}

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
              <MenuItem value="issueDate">Issue Date</MenuItem>
              <MenuItem value="emdInLakhs">EMD In Lakhs</MenuItem>
              <MenuItem value="approxTenderValueLakhs">
                Approx Tender Value In Lakhs
              </MenuItem>
              <MenuItem value="lastDateSubmission">
                Late Date Submission
              </MenuItem>
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
                  maxWidth: 50,
                }}
              >
                {sortDirection === "asc" ? <SouthRounded /> : <NorthRounded />}
              </IconButton>
            </Tooltip>

            {/* DOWNLOAD BUTTON */}
            {/* <Button
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
            </Button> */}

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
                maxWidth: 130,
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Box>

      {/* TABLE */}
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
                {/* ACTION COLUMN */}
                <TableCell
                  align="center"
                  sx={{
                    ...headerCellStyle,
                    minWidth: 140,
                  }}
                >
                  Actions
                </TableCell>

                {/* ✅ SERIAL NUMBER COLUMN */}
                <TableCell
                  align="center"
                  sx={{
                    ...headerCellStyle,
                    minWidth: 60,
                  }}
                >
                  Sl No
                </TableCell>

                {/* DYNAMIC COLUMNS */}
                {leadColumns.map((col) =>
                  visibleColumns[col.id] ? (
                    <TableCell key={col.id} sx={headerCellStyle}>
                      {col.label}
                    </TableCell>
                  ) : null,
                )}
              </TableRow>
            </TableHead>

            {/* leadID: "",
      issueDate: "",
      tenderName: "",
      organisation: "",
      documentType: "",
      tenderType: "",
      emdInLakhs: "",
      approxTenderValueLakhs: "",
      lastDateSubmission: "",
      preBidDate: "",
      teamAssigned: "",
      remarks: "",
      corrigendumInfo: "",
      // OperatorId:
      // OperatorName:
      // OperatorRole:
      // OperatorSBU:
    }, */}

            <TableBody>
              {filteredSortedData && filteredSortedData.length > 0 ? (
                filteredSortedData.map((row, index) => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => handleRowClick(row)}
                    sx={{ cursor: "pointer" }}
                  >
                    {/* ACTIONS COLUMN */}
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents triggering the row's handleRowClick
                              handleEditClick(row);
                            }}
                            sx={{
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
                              e.stopPropagation(); // Prevents triggering the row's handleRowClick
                              handleDeleteClick(row.id);
                            }}
                            sx={{
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

                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {index + 1}
                    </TableCell>

                    {/* RENDER DYNAMIC COLUMNS */}
                    {leadColumns.map((col) => {
                      if (!visibleColumns[col.id] || col.id === "actions")
                        return null;
                      return <TableCell key={col.id}>{row[col.id]}</TableCell>;
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={leadColumns.length + 1} align="center">
                    No data found
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
                {editingRow?.tenderName || "Lead Details"}
              </Typography>
              {/* <Typography variant="caption" sx={{ color: "#bfdbfe", mt: 0.5 }}>
                Reference: {editingRow?.tenderReferenceNo || "N/A"}
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
                mr: 8,
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

        {/* 
      

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
                  { label: "Lead ID", key: "leadID" },
                  { label: "Issue Date", key: "issueDate", isDate: true },
                  {
                    label: "Last Date of Submission",
                    key: "lastDateSubmission",
                    isDate: true,
                  },
                  { label: "Tender Name", key: "tenderName" },
                  { label: "Organisation", key: "organisation" },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={
                      {
                        /* your existing styles */
                      }
                    }
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {field.label}
                    </Typography>

                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        // 1. Force the type to "date" if the field is marked as a date
                        type={field.isDate ? "date" : "text"}
                        // 2. Format the value specifically for the browser input
                        value={
                          field.isDate
                            ? formatDateForInput(editingRow?.[field.key])
                            : editingRow?.[field.key] || ""
                        }
                        // 3. Format the date back to DD.MM.YYYY before saving to state
                        onChange={(e) => {
                          const val = e.target.value;
                          const finalValue = field.isDate
                            ? formatDateForStorage(val)
                            : val;
                          handleEditFieldChange(field.key, finalValue);
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 1 }}
                      />
                    ) : (
                      <Typography sx={{ mt: 1, fontWeight: 600 }}>
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* CUSTOMER INFORMATION SECTION
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
                  { label: "Customer Name", key: "customerName" },
                  { label: "Lead Owner", key: "leadOwner" },
                  { label: "Civil / Defence", key: "civilOrDefence" },
                  { label: "Business Domain", key: "businessDomain" },
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
              </Box> */}

            {/* Customer Address - Full Width */}
            {/* <Box
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
            </Box> */}

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
                  { label: "EMD in Lakhs", key: "emdInLakhs" },
                  {
                    label: "Approx Tender in Lakhs",
                    key: "approxTenderValueLakhs",
                  },
                  // {
                  //   label: "Submitted Value (Cr, w/o GST)",
                  //   key: "submittedValueInCrWithoutGST",
                  // },
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
                    label: "Last Date of Submission",
                    key: "lastDateSubmission",
                    isDate: true,
                  },
                  // { label: "Sole / Consortium", key: "soleOrConsortium" },
                  {
                    label: "Pre-Bid Meeting Date",
                    key: "preBidDate",
                    isDate: "true",
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
                    label: "Team Assigned",
                    key: "teamAssigned",
                  },
                  { label: "Remarks", key: "remarks" },
                  { label: "Corrigendum Info", key: "corrigendumInfo" },
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

            {/* ADDITIONAL INFORMATION SECTION */}
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
                                      e.target.files[0],
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
                  {editingRow?.rfp && (
                    <>
                      <Typography
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.85rem",
                        }}
                      >
                        RFP :
                      </Typography>
                      <Link
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDownloadFile(
                            editingRow?.rfp?.documentId,
                            editingRow?.rfp?.storedFileName,
                            editingRow?.rfp?.originalFileName,
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
                        {editingRow?.rfp?.originalFileName}
                      </Link>
                    </>
                  )}
                  {editingRow?.boq && (
                    <>
                      <Typography
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.85rem",
                        }}
                      >
                        BoQ :
                      </Typography>
                      <Link
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile(
                            editingRow?.boq.documentId,
                            editingRow?.boq.storedFileName,
                            editingRow?.boq?.originalFileName,
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
                        {editingRow?.boq.originalFileName}
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
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                  maxWidth: 180,
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
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
      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            background: "#f8fafc",
            borderBottom: "2px solid #ef4444",
          }}
        >
          ⚠️ Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography sx={{ color: "#475569" }}>
            Are you sure you want to delete this CRM Lead? This action will
            permanently remove the record from the database.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, background: "#f8fafc" }}>
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            sx={{ color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDeleteRow(idDeleteOpen)}
            sx={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              fontWeight: 700,
            }}
          >
            ✓ Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
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
  const [selectedFiles, setSelectedFile] = useState([]);

  // ✅ FIXED SAMPLE FILE DOWNLOAD (Bulk Upload)
  const handleDownloadSampleExcel = () => {
    const fileUrl = "/sample/CRM_Lead_Sample.xlsx"; // fixed public path
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "CRM_Lead_Sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const DB_COLUMNS = [
    "leadID",
    "leadReferenceNo",
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
    "leadReferenceNo",
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
        (col) => !excelColumns.includes(col),
      );
      const extra = excelColumns.filter(
        (col) => !DB_COLUMNS_MATCH.includes(col),
      );

      if (missing.length > 0 || extra.length > 0) {
        setError(
          `Column mismatch!
          Missing : ${missing.join(", ") || "None"}; 
          Extra : ${extra.join(", ") || "None"}`,
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
      ServerIp,
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
          position: "relative", // ✅ REQUIRED FOR TOP-RIGHT BUTTON
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
        }}
      >
        {/* DOWNLOAD SAMPLE BUTTON */}

        {/* <Box sx={{ position: "absolute", top: 16, right: 16 }}>
<Button
// startIcon={<CloudQueueRoundedIcon />}
onClick={handleDownloadSampleExcel}
sx={{
  borderRadius: 999,
  px: 3,
  py: 0.9,
  fontWeight: 700,
  fontSize: 13,
  textTransform: "none",

  color: "#2563eb",
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",

  boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "#dbeafe",
    borderColor: "#60a5fa",
    transform: "translateY(-1px)",
  },
}}
>
Download Sample Excel
</Button>
</Box> */}

        <Box sx={{ position: "absolute", top: 20, right: 19 }}>
          <Button
            variant="contained"
            onClick={handleDownloadSampleExcel}
            component="label"
            sx={{
              borderRadius: 999,
              px: 2,
              py: 1.2,
              fontWeight: 900,
              fontSize: 12,
              textTransform: "none",
              color: "#ffffff",
              // background:
              //   "linear-gradient(135deg, #42a5f5 0%, #2563eb 50%, #1e40af 100%)",
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              color: "#1e40af",
              border: "1.5px solid #bae6fd",
              transition: "all 0.25s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #e0f2fe, #dbeafe)",
                boxShadow: "0 14px 32px rgba(37,99,235,0.45)",
                transform: "translateY(-2px) scale(1.03)",
              },
              "&:active": {
                transform: "scale(0.96)",
                boxShadow: "0 6px 14px rgba(37,99,235,0.35)",
              },
            }}
          >
            Sample format
          </Button>
        </Box>

        {/* TITLE */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            color: "#0d47a1",
            mb: 1,
            mt: 8, // ✅ prevents overlap with button
          }}
        >
          Upload Lost Lead Data
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
              p: { xs: 4, sm: 6 },
              minHeight: 280,
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

        {/* PUSH BUTTON */}
        {excelData.length > 0 && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
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

export default CRMLeadForm;
