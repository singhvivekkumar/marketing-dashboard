import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
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
  Tabs,
  Tab,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Menu,
  Checkbox,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import axios from "axios";
import * as XLSX from "xlsx";
// import * as FileSaver from "file-saver";
import {
  CloseRounded,
  DeleteRounded,
  EditRounded,
  NorthRounded,
  RestartAltRounded,
  SearchRounded,
  SouthRounded,
} from "@mui/icons-material";
// import dummyData2 from "./dummyData2.json";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const multilineProps = { multiline: true, rows: 2 };

// NEW CHANGE FOR TABLE
const TPCR_SOURCE_OPTIONS = [
  "Indian Airforce",
  "Indian Navy",
  "Indian Army",
  "Joint Services",
];
const STATUS_OPTIONS = ["System", "Subsystem"];

const CPDSForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [uploadFileData, setuploadFileData] = useState();
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // form here we have started file uploading logic
  const [browsefile, setbrowsefile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [presentDate, setPrsentDate] = useState(new Date());
  const [SaveDataHardDiskURL, SetSaveDataHardDiskURL] = useState("");

  const API = "/getCpdsForm";

  let user = JSON.parse(localStorage.getItem("user"));
  console.log(" user object ", user);

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pdsNo: "",
      title: "",
      remarks: "",
      // files details
      fileName: "",
      filePath: "",
      hardDiskFileName: "",
    },
  });

  const onSubmit = (data) => {
    // console.log("Raw Form Data:", data);
    // Convert string numbers to actual numbers with 2 decimal precision
    const formattedData = {
      pdsNo: data.pdsNo,
      title: data.title,
      remarks: data.remarks,

      fileName: uploadFileData?.fileName,
      filePath: uploadFileData?.filePath,
      hardDiskFileName: uploadFileData?.hardDiskFileName,
      submittedAt: new Date().toISOString(),
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
    };

    console.log("Frontend Form Data:", JSON.stringify(formattedData, null, 2));

    // console.log(
    //   "Budgetary Quotation Data:",
    //   JSON.stringify(formattedData, null, 2)
    // );
    axios
      .post(ServerIp + API, formattedData)
      .then((response) => {
        console.log("formattedData after ");
        console.log("Server Response:", response.data);
        setOrderData(response.data);
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
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
      link.download = `domestic-leads-${
        submittedData.serialNumber
      }-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
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
      const res = await fetch(ServerIp + "/getCpdsForm", {
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

  return (
    <Container
      maxWidth="xl"
      // disableGutters
      sx={{
        mt: -15,
        py: 2,
        mb: 4,
        minHeight: "85vh",
        background: "linear-gradient(135deg, #e3eeff 0%, #f8fbff 100%)",
        borderRadius: 4,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          CPDS
        </Typography>

        <Divider
        flexItem
        sx={{
          background: "linear-gradient(135deg, #0d47a1 , #42a5f5, #1e88e5)",
          height: "4px",
          mt: 3,
        }}
      />
      </Box>

      {/* ------------------------ TABS ------------------------ */}
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        centered
        sx={{
          mt: -3,
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
        <Tab label="Create Data" />
        <Tab label="CPDS Document" />
        <Tab label="View Data" />
        <Tab label="Bulk Upload" />
      </Tabs>

      {/* ------------------------ EXORT LEAD FORM ------------------------ */}

      {value === 0 && (
        <Container maxWidth="lg">
          <Paper
            elevation={10}
            sx={{
              p: { xs: 2, md: 5 },
              borderRadius: 5,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              // transition: "0.3s",
              boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
              // "&:hover": { transform: "scale(1.01)" },
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* SECTION 1 */}
              <Card
                sx={{
                  mb: 4,
                  mt: -3,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
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
                  📌 Compendium of Problem Definition Statement
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* Tender SL No */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="pdsNo"
                      control={control}
                      rules={{ required: "PDS No is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="PDS No"
                          error={!!errors.pdsNo}
                          helperText={errors.pdsNo?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Title */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Title"
                          error={!!errors.title}
                          helperText={errors.title?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12} md={8}>
                    <Controller
                      name="remarks"
                      control={control}
                      rules={{ required: "Remarks is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Remarks"
                          error={!!errors.remarks}
                          helperText={errors.remarks?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Attachments Section */}
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
                              {/* FILE NAME (CLICK TO PREVIEW IN NEW TAB) */}
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
                                  onClick={() => window.open(fileUrl, "_blank")}
                                >
                                  {file.name}
                                </Typography>
                              </Tooltip>

                              {/* REMOVE BUTTON */}
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
              </Card>

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
                  type="button"
                  variant="outlined"
                  size="large"
                  className="btn-reset"
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

            {/* Snackbar */}
            <Snackbar
              open={submitSuccess}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                severity="success"
                sx={{ fontSize: "1rem" }}
                onClose={handleCloseSnackbar}
              >
                Tender submitted successfully!
              </Alert>
            </Snackbar>

            {/* JSON OUTPUT */}
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

                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    backgroundColor: "#1e1e1e",
                    color: "#d4d4d4",
                    maxHeight: 500,
                    overflow: "auto",
                    borderRadius: 2,
                  }}
                >
                  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      )}

      {/* ------------------------ CPDS DOCUMENT UPLOAD ------------------------ */}
      {value === 1 && <CPDSDocument ServerIp={ServerIp} />}

      {/* ------------------------ VIEW TABLE ------------------------ */}
      {value === 2 && orderData !== undefined && (
        <ViewCPDSData ViewData={orderData} ServerIp={ServerIp} />
      )}

      {/* ------------------------ BULK UPLOAD ------------------------ */}
      {value === 3 && (
        <ExcelUploadAndValidate user={user} ServerIp={ServerIp} />
      )}
    </Container>
  );
};

function CPDSDocument(props) {
  // Extract ServerIp from props
  const ServerIp = props.ServerIp || "";

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // form here we have started file uploading logic
  const [browsefile, setbrowsefile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [presentDate, setPrsentDate] = useState(new Date());

  //upload file states

  const createEmptyRow = () => ({
    documentType: "",
    file: null,
    uploaded: false,
  });

  const [documents, setDocuments] = useState([createEmptyRow()]); // ✅ minimum one row


  const [documentIds, setDocumentIds] = useState([]);

  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  const UPLOAD_ENDPOINT = `/cpds/uploadDocument`;
  const UPDATE_ENDPOINT = `/cpds/updateDocument`;

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

  const handleClear = (index) => {
    const updated = [...documents];
    updated.splice(index, 1);

    if (updated.length === 0) {
      updated.push({ documentType: "", file: null, uploaded: false });
    }

    setDocuments(updated);
  };

  const DOCUMENT_TYPES = [{ id: "tpcrDoc", label: "Tpcr Doc" }];

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
      const res = await fetch(ServerIp + "/getTPCRForm", {
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

  return (<div>
    {/* Attachments Section */}
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
              background: "linear-gradient(135deg, #2563eb, #60a5fa)",
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
                      handleDocumentTypeChange(index, e.target.value)
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
                      boxShadow: "0 10px 20px rgba(59,130,246,0.22)",
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
                <Grid item xs={4} md={1} sx={{ textAlign: "center" }}>
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
  </div>);
}

// ------------------------------------------------------------------------
// VIEW COMPONENT WITH SEARCH + FILTERS + SORT + EDIT / DELETE
// ------------------------------------------------------------------------

function ViewCPDSData(props) {
  console.log("ViewCPDSData for view the table : ", props);
  const data = props.ViewData?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [tempEditingRow, setTempEditingRow] = useState(null);
  const [dialogOpenedFrom, setDialogOpenedFrom] = useState("rowClick"); // "rowClick" or "editIcon"

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [idDeleteOpen, setIdDeleteOpen] = useState(null);

  // COLUMN SELECTION STATE
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const columnMenuOpen = Boolean(columnMenuAnchor);

  // Store data in local state for updates
  const [tableData, setTableData] = useState(props.ViewData.data || []);

  // Extract ServerIp from props
  const ServerIp = props.ServerIp || "";

  // Sync with parent data when it changes
  useEffect(() => {
    if (props.ViewData.data) {
      setTableData(props.ViewData.data);
    }
  }, [props.ViewData.data]);

  // READ-ONLY VIEW DIALOG STATE
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  //  defaultValues: {
  //       tpcrSlno: "",
  //       tpcrSource: "",
  //       domain: "",
  //       projectName: "",
  //       isYourSBULeadSBU: "",
  //       leadSBUName: "",
  //       qty: "",
  //       sOrSsUnderThisProject: "",
  //       businessValue: "",
  //       drdoRemarks: "",
  //     },

  // COLUMN VISIBILITY STATE
  const [visibleColumns, setVisibleColumns] = useState({
    pdsNo: true,
    title: true,
    remarks: true,
    actions: true,
  });

  // DEFINE ALL AVAILABLE COLUMNS
  const leadColumns = [
    { id: "actions", label: "Actions" },
    { id: "pdsNo", label: "PDS No" },
    { id: "title", label: "Title" },
    { id: "remarks", label: "Remarks" },
  ];

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

  // HANDLE COLUMS ACTION MENU OPEN
  const handleColumnToggle = (id) => {
    setVisibleColumns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // COLUMN SELECTION HANDLERS
  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  // // DOWNLOAD ALL DATA AS EXCEL
  // const handleDownloadAllData = () => {
  //   console.log("data given to handler : ", props.ViewData.data);
  //   if (!props.ViewData?.data || props.ViewData.data.length === 0) {
  //     alert("No data available to download");
  //     return;
  //   }

  //   // Convert JSON → worksheet
  //   const worksheet = XLSX.utils.json_to_sheet(props.ViewData.data);
  //   console.log(" worksheet : ", worksheet);

  //   // Create workbook
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "BudgetaryQuotations");
  //   console.log(" workbook : ", workbook);

  //   // Download file
  //   // XLSX.writeFile(workbook, "MyData.xlsx", FileSaver.saveAs);
  //   XLSX.writeFile(workbook, "MyData.xlsx", FileSaver.saveAs);

  //   // `Budgetary_Quotation_Data_${new Date().toISOString().slice(0, 10)}.xlsx`  // Original dynamic filename
  //   console.log(" work new book : ", workbook);
  // };

  // OPEN DIALOG FROM ROW CLICK (VIEW MODE ONLY)
  const handleRowClick = (row) => {
    setTempEditingRow({ ...row }); // Store original data
    setEditingRow({ ...row }); // Set for viewing
    setIsEditMode(false); // Start in VIEW mode
    setDialogOpenedFrom("rowClick"); // Mark as opened from row click
    setEditDialogOpen(true);
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
    setIsEditMode(false);
    setConfirmSaveOpen(false);
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

  // DELETE ROW
  const handleDeleteRow = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this entry?")) return;

    console.log("Deleting row with ID:", id);
    const deleteData = {
      id: id,
    };
    console.log(
      "api for delete in domestic lead : ",
      `${ServerIp}/getCpdsForm`
    );
    // TODO: delete logic here
    try {
      await axios.delete(`${ServerIp}/getCpdsForm`, {
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
        `${ServerIp}/getCpdsForm`,
        updatePayload
      );

      console.log("res from server : ", response);

      if (response.data.success || response.status === 200) {
        console.log("Backend Response:", response.data);

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

  // const actionHeaderStyle = {
  //   ...headerCellStyle,
  //   textAlign: "center",
  // };
  console.log("filteredSortedData:");

  //   const bodyCellStyle = {
  //     fontSize: 13,
  //     color: "#111827",
  //     whiteSpace: "nowrap",
  //     textOverflow: "ellipsis",
  //     overflow: "hidden",
  //   };

  //   const ellipsisCell = {
  //     ...bodyCellStyle,
  //     maxWidth: 180,
  //   };

  const actionHeaderStyle = {
    ...headerCellStyle,
    textAlign: "center",
  };

  // ---------------- FILTER + SORT LOGIC ----------------
  const filteredSortedData =
    tableData &&
    tableData
      .filter((row) => {
        const q = searchTerm.trim().toLowerCase();

        const matchesSearch =
          !q ||
          row.pdsNo?.toLowerCase().includes(q) ||
          row.title?.toLowerCase().includes(q) ||
          row.remarks?.toLowerCase().includes(q);

        const matchesTenderType =
          tenderTypeFilter === "all" ||
          row.tenderType?.toLowerCase() === tenderTypeFilter.toLowerCase();

        const matchesStatus =
          statusFilter === "all" ||
          row.presentStatus?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesTenderType && matchesStatus;
      })
      .sort((a, b) => {
        let aVal = 0;
        let bVal = 0;

        switch (sortBy) {
          /* 🔢 NUMERIC SORTS */
          case "qty":
            aVal = Number(a.qty) || 0;
            bVal = Number(b.qty) || 0;
            break;

          case "businessValue":
            aVal = Number(a.businessValue) || 0;
            bVal = Number(b.businessValue) || 0;
            break;

          case "valueEMDInCrore":
            aVal = Number(a.valueEMDInCrore) || 0;
            bVal = Number(b.valueEMDInCrore) || 0;
            break;

          /* 📅 DATE SORTS */
          case "bidSubmittedOn":
            aVal = new Date(a.bidSubmittedOn || 0).getTime();
            bVal = new Date(b.bidSubmittedOn || 0).getTime();
            break;

          case "dateCreated":
          default:
            aVal = new Date(a.dateCreated || 0).getTime();
            bVal = new Date(b.dateCreated || 0).getTime();
            break;
        }

        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      });

  console.log(filteredSortedData);

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
                CPDS Data View
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
            {/* TPCR Source FILTER */}
            <TextField
              select
              size="small"
              label="TPCR Source"
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
              {TPCR_SOURCE_OPTIONS.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            {/* STATUS FILTER */}
            <TextField
              select
              size="small"
              label="System / Subsystem"
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
              <MenuItem value="qty">Quantity</MenuItem>
              <MenuItem value="busniessValue">Busniess Value</MenuItem>
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
                <TableCell
                  align="center"
                  sx={{
                    ...headerCellStyle,
                    fontWeight: 800,
                    fontSize: 13,
                    color: "#f9fafb",
                    // background:
                    //   "linear-gradient(90deg,#0ea5e9 0%,#2563eb 50%,#4f46e5 100%)",
                    borderBottom: "none",
                    whiteSpace: "nowrap",
                    minWidth: 140,
                    maxWidth: 150,
                  }}
                >
                  Actions
                </TableCell>

                {leadColumns.map((col) =>
                  visibleColumns[col.id] ? (
                    <TableCell
                      key={col.id}
                      align="left"
                      sx={{
                        ...headerCellStyle,
                        fontWeight: 800,
                        fontSize: 13,
                        color: "#f9fafb",
                        // background:
                        //   "linear-gradient(90deg,#0ea5e9 0%,#2563eb 50%,#4f46e5 100%)",
                        borderBottom: "none",
                        whiteSpace: "nowrap",
                        ...(col.id === "customerAddress" && { minWidth: 200 }),
                        ...(col.id === "competitorsInfo" && { minWidth: 220 }),
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredSortedData.length > 0 ? (
                filteredSortedData.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={selectedRow?.id === row.id}
                    onClick={() => handleRowClick(row)}
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
                    {/* DYNAMIC COLUMNS RENDERING */}
                    {leadColumns.map((col) => {
                      if (!visibleColumns[col.id]) return null;

                      //                 pdsNo: data.pdsNo,
                      // title: data.title,
                      // remarks: data.remarks,

                      // RENDER ACTIONS COLUMN
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
                                    maxWidth: 35,
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
                                    maxWidth: 35,
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
                        );
                      }

                      // RENDER PRESENT STATUS WITH CHIP
                      if (col.id === "presentStatus") {
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{ fontSize: 13 }}
                          >
                            <Chip
                              size="small"
                              label={row.presentStatus || "-"}
                              sx={{
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 700,
                                backgroundColor:
                                  row.presentStatus === "Lost"
                                    ? "rgba(248,113,113,0.18)"
                                    : row.presentStatus === "In Progress" ||
                                      row.presentStatus === "Under Review"
                                    ? "rgba(234,179,8,0.18)"
                                    : row.presentStatus === "Won"
                                    ? "rgba(52,211,153,0.18)"
                                    : "rgba(148,163,184,0.25)",
                                color:
                                  row.presentStatus === "Lost"
                                    ? "#b91c1c"
                                    : row.presentStatus === "In Progress" ||
                                      row.presentStatus === "Under Review"
                                    ? "#92400e"
                                    : row.presentStatus === "Won"
                                    ? "#15803d"
                                    : "#111827",
                              }}
                            />
                          </TableCell>
                        );
                      }

                      //                   defaultValues: {
                      //   tpcrSlno: "",
                      //   tpcrSource: "",
                      //   domain: "",
                      //   projectName: "",
                      //   isYourSBULeadSBU: "",
                      //   leadSBUName: "",
                      //   qty: "",
                      //   sOrSsUnderThisProject: "",
                      //   businessValue: "",
                      //   drdoRemarks: "",

                      // RENDER TENDER NAME AS HEADER
                      if (col.id === "pdsNo") {
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
                            {row.pdsNo}
                          </TableCell>
                        );
                      }

                      // RENDER CUSTOMER ADDRESS WITH MORE WIDTH
                      if (col.id === "title") {
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{
                              fontSize: 13,
                              maxWidth: 260,
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {row.title}
                          </TableCell>
                        );
                      }

                      // RENDER LONG TEXT COLUMNS WITH ELLIPSIS
                      // RENDER LONG TEXT COLUMNS WITH ELLIPSIS
                      if (["remarks"].includes(col.id)) {
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{
                              fontSize: 13,
                              maxWidth: 180,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {row[col.id]}
                          </TableCell>
                        );
                      }

                      // DEFAULT COLUMN RENDERING
                      return (
                        <TableCell
                          key={col.id}
                          align="left"
                          sx={{ fontSize: 13 }}
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
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            background: "#ffffff",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.15), 0 10px 30px rgba(30,64,95,0.2)",
            maxHeight: "90vh",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
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
            background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)",
            color: "#ffffff",
            borderBottom: "3px solid #60a5fa",
            py: 2.5,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
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
              <Typography variant="caption" sx={{ color: "#bfdbfe", mt: 0.5 }}>
                Reference: {editingRow?.tenderReferenceNo || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={isEditMode ? "EDIT MODE" : "VIEW MODE"}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                background: isEditMode ? "#fbbf24" : "#60a5fa",
                color: isEditMode ? "#1f2937" : "#ffffff",
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
          {/* defaultValues: {
      tpcrSlno: "",
      tpcrSource: "",
      domain: "",
      projectName: "",
      isYourSBULeadSBU: "",
      leadSBUName: "",
      qty: "",
      sOrSsUnderThisProject: "",
      businessValue: "",
      drdoRemarks: "",
    }, */}

          <Box sx={{ p: 2.5 }}>
            {/* TENDER INFORMATION SECTION */}
            <Box sx={{ mb: 3 }}>
              <Typography
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
                <Box
                  sx={{
                    width: 4,
                    height: 20,
                    background: "#1e40af",
                    borderRadius: 1,
                  }}
                />
                CPDS Details
              </Typography>
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
                  { label: "PDS No", key: "pdsNo" },
                  { label: "Title", key: "title" },
                  { label: "Remarks", key: "remarks" },
                  //   { label: "Document Type", key: "documentType" },
                  //   { label: "Tender Dated", key: "tenderDated", isDate: true },
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
          </Box>
        </DialogContent>
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
                  maxWidth: 180,
                  letterSpacing: "0.5px",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                Close
              </Button> */}
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
                  letterSpacing: "0.5px",
                  maxWidth: 180,
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
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              "&:hover": { backgroundColor: "#e2e8f0" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#ffffff",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                boxShadow: "0 8px 24px rgba(239,68,68,0.3)",
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
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              "&:hover": { backgroundColor: "#e2e8f0" },
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

  // ✅ FIXED SAMPLE FILE DOWNLOAD (Bulk Upload)
  const handleDownloadSampleExcel = () => {
    const fileUrl = "/sample/CPDS_Sample.xlsx"; // fixed public path
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "CPDS_Sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //   defaultValues: {
  //       tpcrSlno: "",
  //       tpcrSource: "",

  //       domain: "",
  //       projectName: "",
  //       isYourSBULeadSBU: "",
  //       leadSBUName: "",
  //       qty: "",
  //       sOrSsUnderThisProject: "",
  //       businessValue: "",
  //       drdoRemarks: "",
  //     },

  const DB_COLUMNS = [
    "pdsNo",
    "title",
    "remarks",
    // user info
    "OperatorId",
    "OperatorName",
    "OperatorRole",
    "OperatorSBU",
  ];

  const DB_COLUMNS_MATCH = ["pdsNo", "title", "remarks"];

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
      .post(ServerIp + "/tpcrFormBulkUpload", { excelData })
      .then((response) => {
        console.log("hitted");
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
          Upload CPDS Data
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

export default CPDSForm;
