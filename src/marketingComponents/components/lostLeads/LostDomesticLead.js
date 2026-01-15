import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
  Grid,
  InputAdornment,
  Card,
  Container,
  CircularProgress,
  Checkbox,
  Menu,
} from "@mui/material";
import * as XLSX from "xlsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";

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
import { useForm, Controller } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";

const LostForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const tenderTypes = ["single tender", "EOI", "RFI", "RFP", "BQ"];
  const documentTypeOptions = ["PDF", "Docx"];

  const API = "/getLostForms";

  let user = JSON.parse(localStorage.getItem("user"));
  console.log(" user object ", user);

  // ------------------- NETWORKING -------------------
  useEffect(() => {
    axios
      .get(`/config.json`)
      .then(function (response) {
        const nodeServer =
          response.data.project[0].ServerIP[0].NodeServerIP + API;
        console.log("LostForm API: ", nodeServer);
        SetServerIp(response.data.project[0].ServerIP[0].NodeServerIP);

        axios
          .get(nodeServer)
          .then((res) => {
            console.log("GOT DATA FROM LOST FORM", res);
            setOrderData(res.data);
          })
          .catch((error) => console.log(error.message));
      })
      .catch(function (error) {
        console.log("config.json LostForm error", error);
        SetServerIp("172.195.120.135");
      })
      .finally(function () {
        // always executed
      });
  }, []);

  // ------------------- FORM CONFIG -------------------
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tenderName: "",
      tenderReferenceNo: "",
      customerName: "",
      customerAddress: "",
      tenderType: "",
      documentType: "",
      valueInCrWithoutGST: "",
      valueInCrWithGST: "",
      reasonForLossing: "",
      yearWeLost: "",
      partners: "",
      competitors: "",
      technicalScore: "",
      quotedPrice: "",
    },
  });

  // ------------------- SUBMIT HANDLER -------------------
  const onSubmit = (data) => {
    console.log("Raw Form Data:", data);

    const formattedData = {
      tenderName: data.tenderName,
      tenderReferenceNo: data.tenderReferenceNo,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      tenderType: data.tenderType,
      documentType: data.documentType,
      valueInCrWithoutGST:
        data.valueInCrWithoutGST !== ""
          ? parseFloat(parseFloat(data.valueInCrWithoutGST).toFixed(5))
          : null,
      valueInCrWithGST:
        data.valueInCrWithGST !== ""
          ? parseFloat(parseFloat(data.valueInCrWithGST).toFixed(5))
          : null,
      reasonForLossing: data.reasonForLossing,
      yearWeLost: data.yearWeLost,
      partners: data.partners,
      competitors: data.competitors,
      technicalScore: data.technicalScore || "",
      quotedPrice: data.quotedPrice || "",
      OperatorId: user?.id || "291536",
      OperatorName: user?.username || "Vivek Kumar Singh",
      OperatorRole: user?.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
    };

    console.log(
      "Frontend Form of lost data:",
      JSON.stringify(formattedData, null, 2)
    );

    axios
      .post(ServerIp + API, formattedData)
      .then((response) => {
        console.log("Server Response:", response.data);
        setOrderData(response.data);
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  // ------------------- RESET -------------------
  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  // ------------------- SNACKBAR CLOSE -------------------
  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  // ------------------- DOWNLOAD JSON -------------------
  const handleDownloadJSON = () => {
    if (submittedData) {
      const dataStr = JSON.stringify(submittedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lost-form-${
        submittedData.serialNumber || "entry"
      }-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // ------------------- RENDER -------------------
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
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Lost Domestic Lead
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
          md: 4,
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
              borderRadius: 5,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              transition: "0.3s",
              boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
              // "&:hover": { transform: "scale(1.01)" },
            }}
          >
            {/* ------------------- FORM START ------------------- */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ---------------- SECTION: BASIC INFO ---------------- */}
              <Card
                sx={{
                  mt: -5,
                  mb: 3,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   // transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📋 Basic Tender Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* tenderName */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="tenderName"
                      control={control}
                      rules={{ required: "Tender Name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Tender Name"
                          fullWidth
                          required
                          error={!!errors.tenderName}
                          helperText={errors.tenderName?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                              "&.Mui-focused": {
                                boxShadow: "0 0 15px #90caf9",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* tenderReferenceNo */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="tenderReferenceNo"
                      control={control}
                      rules={{ required: "Tender Reference No is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Tender Reference No"
                          fullWidth
                          required
                          error={!!errors.tenderReferenceNo}
                          helperText={errors.tenderReferenceNo?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                              "&.Mui-focused": {
                                boxShadow: "0 0 15px #90caf9",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* customerName */}
                  <Grid item xs={12} sm={4}>
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                              "&.Mui-focused": {
                                boxShadow: "0 0 15px #90caf9",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* customerAddress */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="customerAddress"
                      control={control}
                      rules={{ required: "Customer Address is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Customer Address"
                          fullWidth
                          required
                          error={!!errors.customerAddress}
                          helperText={errors.customerAddress?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                              "&.Mui-focused": {
                                boxShadow: "0 0 15px #90caf9",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* tenderType */}
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="tenderType"
                      control={control}
                      rules={{ required: "Tender Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Tender Type"
                          fullWidth
                          required
                          error={!!errors.tenderType}
                          helperText={errors.tenderType?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              minWidth: 200,
                            },
                          }}
                        >
                          {tenderTypes.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* documentType */}
                  <Grid item xs={12} sm={3}>
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
                          error={!!errors.documentType}
                          helperText={errors.documentType?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              minWidth: 200,
                            },
                          }}
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
                </Grid>
              </Card>

              {/* ---------------- SECTION: FINANCIAL ---------------- */}
              <Card
                sx={{
                  mt: -1,
                  mb: 3,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   // transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  💰 Financial Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* valueInCrWithoutGST */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="valueInCrWithoutGST"
                      control={control}
                      rules={{
                        required: "Value without GST is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]+)?$/,
                          message: "Please enter a valid number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Value in CR without GST"
                          type="number"
                          fullWidth
                          required
                          error={!!errors.valueInCrWithoutGST}
                          helperText={errors.valueInCrWithoutGST?.message}
                          InputProps={{
                            startAdornment: (
                              <Typography sx={{ mr: 1 }}>₹</Typography>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* valueInCrWithGST */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="valueInCrWithGST"
                      control={control}
                      rules={{
                        required: "Value with GST is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]+)?$/,
                          message: "Please enter a valid number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Value in CR with GST"
                          type="number"
                          fullWidth
                          required
                          error={!!errors.valueInCrWithGST}
                          helperText={errors.valueInCrWithGST?.message}
                          InputProps={{
                            startAdornment: (
                              <Typography sx={{ mr: 1 }}>₹</Typography>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* ---------------- SECTION: LOSS & COMPETITORS ---------------- */}
              <Card
                sx={{
                  mt: -1,
                  mb: 3,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   // transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📝 Loss Details & Competitors
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* reasonForLossing */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="reasonForLossing"
                      control={control}
                      rules={{ required: "Reason for Lossing is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Reason for Losing"
                          fullWidth
                          required
                          error={!!errors.reasonForLossing}
                          helperText={errors.reasonForLossing?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* yearWeLost */}
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="yearWeLost"
                      control={control}
                      rules={{ required: "Year we Lost is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Year we Lost"
                          fullWidth
                          required
                          error={!!errors.yearWeLost}
                          helperText={errors.yearWeLost?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* partners */}
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="partners"
                      control={control}
                      rules={{ required: "Partners is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Partners"
                          fullWidth
                          required
                          error={!!errors.partners}
                          helperText={errors.partners?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* competitors */}
                  <Grid item xs={12}>
                    <Controller
                      name="competitors"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Competitors (Optional)"
                          multiline
                          rows={3}
                          fullWidth
                          variant="outlined"
                          placeholder="Enter competitor names separated by commas (e.g., Company A, Company B)"
                          helperText="List all competing companies for this tender"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* ---------------- SECTION: SCORES ---------------- */}
              <Card
                sx={{
                  mt: -1,
                  mb: 3,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   // transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📊 Technical & Commercial
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* technicalScore */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="technicalScore"
                      control={control}
                      rules={{ required: "Technical Score is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Technical Score"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.technicalScore}
                          helperText={errors.technicalScore?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* quotedPrice */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="quotedPrice"
                      control={control}
                      rules={{ required: "Quoted Price is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Quoted Price"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.quotedPrice}
                          helperText={errors.quotedPrice?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* ---------------- BUTTONS ---------------- */}
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
                      // transform: "scale(1.05)",
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
                    fontWeight: 700,
                    maxWidth: 180,
                    borderWidth: 2,
                    textTransform: "none",
                    "&:hover": {
                      // transform: "scale(1.03)",
                      background: "#f4f6fb",
                    },
                  }}
                >
                  Reset
                </Button>
              </Box>
            </form>

            {/* ---------------- SUCCESS SNACKBAR ---------------- */}
            <Snackbar
              open={submitSuccess}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="success" sx={{ fontSize: "1rem" }}>
                🎉 Lost form submitted successfully!
              </Alert>
            </Snackbar>

            {/* ---------------- JSON OUTPUT ---------------- */}
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

      {/* ------------------------ VIEW DATA ------------------------ */}
      {value === 1 && orderData && (
        <ViewLostData ViewData={orderData} ServerIp={ServerIp} />
      )}

      {/* ------------------------ BULK UPLOAD ------------------------ */}
      {value === 2 && (
        <ExcelUploadAndValidate user={user} ServerIp={ServerIp} />
      )}
    </Container>
  );
};

function ViewLostData(props) {
  console.log("props ViewLostData", props.ViewData);

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

  // ---------------- STATES ----------------
  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [openClosedFilter, setOpenClosedFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  // for Dialog

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [dialogOpenedFrom, setDialogOpenedFrom] = useState("rowClick"); // "rowClick" or "editIcon"

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [idDeleteOpen, setIdDeleteOpen] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [tempEditingRow, setTempEditingRow] = useState(null);

  // COLUMN VISIBILITY STATE
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const columnMenuOpen = Boolean(columnMenuAnchor);

  const [visibleColumns, setVisibleColumns] = useState({
    tenderName: true,
    tenderReferenceNo: true,
    customerName: true,
    customerAddress: true,
    tenderType: true,
    documentType: true,
    valueInCrWithoutGST: true,
    valueWithGST: true,
    reasonLosing: true,
    year: true,
    partner: true,
    competitors: true,
    technicalScores: true,
    quotedPrices: true,
    dateCreated: true,
    actions: true,
  });

  // COLUMN DEFINITIONS
  const leadColumns = [
    { id: "actions", label: "Actions" },
    { id: "tenderName", label: "Tender Name" },
    { id: "tenderReferenceNo", label: "Tender Reference No" },
    { id: "customerName", label: "Customer Name" },
    { id: "customerAddress", label: "Customer Address" },
    { id: "tenderType", label: "Tender Type" },
    { id: "documentType", label: "Document Type" },
    { id: "valueInCrWithoutGST", label: "Value in CR w/o GST" },
    { id: "valueWithGST", label: "Value in CR with GST" },
    { id: "reasonLosing", label: "Reason for Losing" },
    { id: "year", label: "Year we Lost" },
    { id: "partner", label: "Partners" },
    { id: "competitors", label: "Competitors" },
    { id: "technicalScores", label: "Technical Score" },
    { id: "quotedPrices", label: "Quoted Price" },
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

  const tenderTypes = ["single tender", "EOI", "RFI", "RFP", "BQ"];

  // ---------------- HANDLERS ----------------
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleTenderTypeFilterChange = (e) =>
    setTenderTypeFilter(e.target.value);
  const handleYearFilterChange = (e) => setYearFilter(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);
  const toggleSortDirection = () =>
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleResetFilters = () => {
    setSearchTerm("");
    setTenderTypeFilter("all");
    setYearFilter("all");
    setSortBy("dateCreated");
    setSortDirection("desc");
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
      `${ServerIp}/getLostForms`
    );
    // TODO: delete logic here
    try {
      await axios.delete(`${ServerIp}/getLostForms`, {
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

  // const handleRowSelect = (row) => setSelectedRow(row);

  // OPEN DIALOG FROM ROW CLICK (VIEW MODE ONLY)
  const handleRowClick = (row) => {
    setTempEditingRow({ ...row }); // Store original data
    setEditingRow({ ...row }); // Set for viewing
    setIsEditMode(false); // Start in VIEW mode
    setDialogOpenedFrom("rowClick"); // Mark as opened from row click
    setEditDialogOpen(true);
  };

  // OPEN DIALOG FROM EDIT ICON (READY TO EDIT)
  const handleEditClick = (row) => {
    setTempEditingRow({ ...row }); // Store original data
    setEditingRow({ ...row }); // Set for editing
    setIsEditMode(false); // Start in VIEW mode but with edit option
    setDialogOpenedFrom("editIcon"); // Mark as opened from edit icon
    setEditDialogOpen(true);
  };

  const handleEditFieldChange = (field, value) => {
    setEditingRow((prev) => ({ ...prev, [field]: value }));
  };

  // CANCEL / CLOSE DIALOG
  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingRow(null);
    setTempEditingRow(null);
    setIsEditMode(false);
    setDialogOpenedFrom("rowClick");
  };

  // ENTER EDIT MODE
  const handleEnterEditMode = () => {
    setIsEditMode(true);
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
        `${ServerIp}/getLostForms`,
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

  const handleEditSave = () => {
    // setTempEditingRow({ ...editingRow });
    setConfirmSaveOpen(true);
    console.log("Saving updated row:", editingRow);
  };

  // Delete VALUES - SHOW CONFIRMATION DIALOG
  const handleDeleteClick = (id) => {
    console.log("Saving updated row:", editingRow);
    setIdDeleteOpen(id);
    setConfirmDeleteOpen(true); // Open confirmation dialog
  };

  //  // DOUBLE CLICK → OPEN READ-ONLY VIEW
  //  const handleRowDoubleClick = (row) => {
  //   setViewRow(row);
  //   setViewDialogOpen(true);
  // };

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

  const yearsList = ["all", "2021", "2022", "2023", "2024", "2025"];

  // {props.ViewData.data &&
  //   props.ViewData.data.length > 0 &&
  //   props.ViewData.data
  //     .filter((row) => {
  //       const q = searchTerm.toLowerCase();
  //       const matchesSearch =
  //         !q ||
  //         row.tenderName?.toLowerCase().includes(q) ||
  //         row.customerName?.toLowerCase().includes(q) ||
  //         row.tenderReferenceNo?.toLowerCase().includes(q) ||
  //         row.customerAddress?.toLowerCase().includes(q);

  //       const matchesTenderType =
  //         tenderTypeFilter === "all" ||
  //         row.tenderType === tenderTypeFilter;

  //       const matchesYear =
  //         yearFilter === "all" ||
  //         String(row.year || row.yearWeLost || "").includes(
  //           yearFilter
  //         );

  //       return matchesSearch && matchesTenderType && matchesYear;
  //     })
  //     .sort((a, b) => {
  //       let aVal;
  //       let bVal;

  //       switch (sortBy) {
  //         case "year":
  //           aVal = a.year || a.yearWeLost || "";
  //           bVal = b.year || b.yearWeLost || "";
  //           break;
  //         case "valueInCrWithoutGST":
  //           aVal = parseFloat(a.valueInCrWithoutGST) || 0;
  //           bVal = parseFloat(b.valueInCrWithoutGST) || 0;
  //           break;
  //         case "valueWithGST":
  //           aVal = parseFloat(a.valueWithGST) || 0;
  //           bVal = parseFloat(b.valueWithGST) || 0;
  //           break;
  //         case "dateCreated":
  //         default:
  //           aVal = a.dateCreated || "";
  //           bVal = b.dateCreated || "";
  //           break;
  //       }

  //       if (typeof aVal === "string") aVal = aVal.toLowerCase();
  //       if (typeof bVal === "string") bVal = bVal.toLowerCase();

  //       if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
  //       if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
  //       return 0;
  //     })filteredSortedData
  //     .map((row) => (

  // Filter + sort logic
  const filteredSortedData =
    tableData &&
    tableData
      .filter((row) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          row.tenderName?.toLowerCase().includes(q) ||
          row.customerName?.toLowerCase().includes(q) ||
          row.tenderReferenceNo?.toLowerCase().includes(q) ||
          row.leadOwner?.toLowerCase().includes(q) ||
          row.customerAddress?.toLowerCase().includes(q);

        const matchesTenderType =
          tenderTypeFilter === "all" ||
          row.tenderType?.toLowerCase() === tenderTypeFilter.toLowerCase();

        const matchesResult =
          resultFilter === "all" ||
          row.wonLostParticipated?.toLowerCase() === resultFilter.toLowerCase();

        const matchesOpenClosed =
          openClosedFilter === "all" ||
          row.openClosed?.toLowerCase() === openClosedFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesTenderType &&
          matchesResult &&
          matchesOpenClosed
        );
      })
      .sort((a, b) => {
        let aVal;
        let bVal;

        switch (sortBy) {
          case "tenderDated":
            aVal = a.tenderDated || "";
            bVal = b.tenderDated || "";
            break;
          case "lastDateOfSub":
            aVal = a.lastDateOfSub || "";
            bVal = b.lastDateOfSub || "";
            break;
          case "estimatedValueInCrWithoutGST":
            aVal = parseFloat(a.estimatedValueInCrWithoutGST) || 0;
            bVal = parseFloat(b.estimatedValueInCrWithoutGST) || 0;
            break;
          case "submittedValueInCrWithoutGST":
            aVal = parseFloat(a.submittedValueInCrWithoutGST) || 0;
            bVal = parseFloat(b.submittedValueInCrWithoutGST) || 0;
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
                Lost Leads Data View
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
              {tenderTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            {/* YEAR FILTER */}
            <TextField
              select
              size="small"
              label="Year We Lost"
              value={yearFilter}
              onChange={handleYearFilterChange}
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
              {yearsList.map((y) => (
                <MenuItem key={y} value={y}>
                  {y === "all" ? "All" : y}
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
              <MenuItem value="year">Year Lost</MenuItem>
              <MenuItem value="valueInCrWithoutGST">
                Value (w/o GST, CR)
              </MenuItem>
              <MenuItem value="valueWithGST">Value (with GST, CR)</MenuItem>
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
            maxHeight: "75vh",
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
                {leadColumns.map(
                  (col) =>
                    visibleColumns[col.id] && (
                      <TableCell
                        key={col.id}
                        align={col.id === "actions" ? "center" : "left"}
                        sx={{
                          ...headerCellStyle,
                          fontWeight: 800,
                          fontSize: 13,
                          color: "#f9fafb",
                          // background:
                          //   "linear-gradient(90deg,#0ea5e9 0%,#2563eb 50%,#4f46e5 100%)",
                          borderBottom: "none",
                          whiteSpace: "nowrap",
                          ...(col.id === "customerAddress"
                            ? { minWidth: 200 }
                            : {}),
                        }}
                      >
                        {col.label}
                      </TableCell>
                    )
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
                    {leadColumns.map((col) => {
                      if (!visibleColumns[col.id]) return null;

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
                                  onClick={(e) => handleEditClick(row, e)}
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
                                  onClick={(e) => handleDeleteClick(row.id, e)}
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

                      // RENDER TENDER NAME AS HEADER
                      if (col.id === "tenderName") {
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
                            {row.tenderName}
                          </TableCell>
                        );
                      }

                      // RENDER CUSTOMER ADDRESS WITH MIN WIDTH
                      if (col.id === "customerAddress") {
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
                            {row.customerAddress}
                          </TableCell>
                        );
                      }

                      // RENDER TENDER TYPE & DOCUMENT TYPE AS CHIPS
                      if (col.id === "tenderType") {
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{ fontSize: 13 }}
                          >
                            <Chip
                              size="small"
                              label={row.tenderType || "-"}
                              sx={{
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 600,
                                backgroundColor: "rgba(59,130,246,0.12)",
                                color: "#1d4ed8",
                              }}
                            />
                          </TableCell>
                        );
                      }

                      if (col.id === "documentType") {
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{ fontSize: 13 }}
                          >
                            <Chip
                              size="small"
                              label={row.documentType || "-"}
                              sx={{
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 600,
                                backgroundColor: "rgba(129,140,248,0.18)",
                                color: "#4338ca",
                              }}
                            />
                          </TableCell>
                        );
                      }

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
                      No lost tenders found.
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
                {"Lost Lead Details"}
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

        {/* defaultValues: {
      tenderName: "",
      tenderReferenceNo: "",
      customerName: "",
      customerAddress: "",
      tenderType: "",
      documentType: "",
      valueInCrWithoutGST: "",
      valueInCrWithGST: "",
      reasonForLossing: "",
      yearWeLost: "",
      partners: "",
      competitors: "",
      technicalScore: "",
      quotedPrice: "",
    }, */}

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
                Tender Information
              </Typography> */}
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
                  { label: "Tender Name", key: "tenderName" },
                  { label: "Tender Reference No", key: "tenderReferenceNo" },
                  { label: "Document Type", key: "documentType" },
                  { label: "Tender Type", key: "tenderType", isDate: true },
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
                        disabled={field.key === "tenderReferenceNo"}
                        InputLabelProps={
                          field.isDate ? { shrink: true } : undefined
                        }
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,

                            /* Grey background when disabled */
                            background:
                              field.key === "tenderReferenceNo"
                                ? "#f1f5f9"
                                : "#ffffff",

                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            fontWeight: 600,

                            /* Muted text when disabled */
                            color:
                              field.key === "tenderReferenceNo"
                                ? "#64748b"
                                : "#1e293b",
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
                Customer Information
              </Typography> */}
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
                  // { label: "Lead Owner", key: "leadOwner" },
                  // { label: "Civil / Defence", key: "civilOrDefence" },
                  // { label: "Business Domain", key: "businessDomain" },
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
                Financial Details
              </Typography> */}
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
                    label: "Value in Crore without GST",
                    key: "valueInCrWithoutGST",
                  },
                  {
                    label: "Value in Crore with GST",
                    key: "valueInCrWithGST",
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
                Timeline
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
                    label: "Year We Lost",
                    key: "yearWeLost",
                    isDate: true,
                  },
                  // { label: "Sole / Consortium", key: "soleOrConsortium" },
                  // {
                  //   label: "Pre-Bid Meeting Date & Time",
                  //   key: "prebidMeetingDateTime",
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
                    label: "Competitor",
                    key: "competitors",
                  },
                  {
                    label: "Partners",
                    key: "partners",
                  },
                  { label: "Remarks", key: "reasonForLossing" },
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

            {/* ADDITIONAL INFORMATION SECTION */}
            {/* <Box sx={{ mb: 2 }}>
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
                <Box sx={{ width: 4, height: 20, background: "#1e40af", borderRadius: 1 }} />
                Additional Information
              </Typography>
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
                  { label: "Competitors Info", key: "competitorsInfo" },
                  {
                    label: "Reason for Losing/Participating",
                    key: "reasonForLossingOpp",
                  },
                  {
                    label: "Corrigendums Date / File",
                    key: "corrigendumsDateFile",
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
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
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
                  background: "linear-gradient(135deg, #999999 0%, #777777 100%)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  maxWidth:160,
                  "&:hover": {
                    background: "linear-gradient(135deg, #555555 0%, #333333 100%)",
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
                  maxWidth: 200,
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
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
              maxWidth:160,
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
              maxWidth:220,
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
              maxWidth:160,
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
              maxWidth:160,
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
    const fileUrl = "/sample/Lost_Lead_Sample.xlsx"; // fixed public path
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "Lost_Lead_Sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const DB_COLUMNS = [
    "tenderName",
    "tenderReferenceNo",
    "customerName",
    "customerAddress",
    "tenderType",
    "documentType",
    "valueInCrWithoutGST",
    "valueInCrWithGST",
    "reasonForLossing",
    "yearWeLost",
    "partners",
    "competitors",
    "technicalScore",
    "quotedPrice",
    // user info
    "OperatorId",
    "OperatorName",
    "OperatorRole",
    "OperatorSBU",
  ];

  const DB_COLUMNS_MATCH = [
    "tenderName",
    "tenderReferenceNo",
    "customerName",
    "customerAddress",
    "documentType",
    "tenderType",
    "valueInCrWithoutGST",
    "valueInCrWithGST",
    "reasonForLossing",
    "yearWeLost",
    "partners",
    "competitors",
    "technicalScore",
    "quotedPrice",
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
      .post(ServerIp + "/lostFormBulkUpload", { excelData })
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

export default LostForm;
