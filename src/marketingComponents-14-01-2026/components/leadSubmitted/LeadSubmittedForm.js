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
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox,
  Menu,
} from "@mui/material";
import * as XLSX from "xlsx";
import {
  SearchRounded,
  NorthRounded,
  SouthRounded,
  RestartAltRounded,
  EditRounded,
  DeleteRounded,
  CloseRounded,
  CheckRounded,
  CheckCircleRounded,
} from "@mui/icons-material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import * as FileSaver from "file-saver";

import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
// import dummyData from "./dummyLeadSubmittedData.json";

const STATUS_OPTIONS = [
  "Draft",
  "PQ qualified",
  "Submitted",
  "In Progress",
  "Under Review",
  "Won",
  "Lost",
  "On Hold",
];

const TENDER_TYPE_OPTIONS = [

  "ST",
  "MT",
  "LT"
];

const today = new Date().toLocaleDateString("en-CA");

const LeadSubmittedForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const API = "/getLeadSubmitted";
  let user = JSON.parse(localStorage.getItem("user")) || {};

  // ---------------------- FETCH CONFIG + DATA ----------------------
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

  // ---------------------- FORM HOOK ----------------------
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tenderName: "",
      customerName: "",
      customerAddress: "",
      tenderDate: "",
      bidOwner: "",
      rfpReceivedOn: "",
      valueEMDInCrore: "",
      rfpDueDate: "",
      dmktgInPrincipalApprovalRxdOn: "",
      sellingPriceApprovalInitiatedOn: "",
      bidSubmittedOn: "",
      approvalSBUFinanceOn: "",
      approvalGMOn: "",
      sentToFinanceGMDmktgApprovalRxdOn: "",
      dmktgApprovalRxdOn: "",
      tenderReferenceNo: "",
      tenderType: "",
      website: "",
      presentStatus: "",
    },
  });

  // ---------------------- SUBMIT HANDLER ----------------------
  const onSubmit = (data) => {
    const formattedData = {
      tenderName: data.tenderName,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      tenderDate: data.tenderDate,
      bidOwner: data.bidOwner,
      rfpReceivedOn: data.rfpReceivedOn,
      valueEMDInCrore: data.valueEMDInCrore
        ? Number(parseFloat(data.valueEMDInCrore).toFixed(2))
        : 0,
      rfpDueDate: data.rfpDueDate,
      dmktgInPrincipalApprovalRxdOn: data.dmktgInPrincipalApprovalRxdOn,
      sellingPriceApprovalInitiatedOn: data.sellingPriceApprovalInitiatedOn,
      bidSubmittedOn: data.bidSubmittedOn,
      approvalSBUFinanceOn: data.approvalSBUFinanceOn,
      approvalGMOn: data.approvalGMOn,
      sentToFinanceGMDmktgApprovalRxdOn: data.sentToFinanceGMDmktgApprovalRxdOn,
      dmktgApprovalRxdOn: data.dmktgApprovalRxdOn,
      tenderReferenceNo: data.tenderReferenceNo,
      tenderType: data.tenderType,
      website: data.website,
      presentStatus: data.presentStatus,
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
      submittedAt: new Date().toISOString(),
    };

    console.log("LeadSubmittedData:", JSON.stringify(formattedData, null, 2));

    axios
      .post(ServerIp + API, formattedData)
      .then((response) => {
        console.log(response.data);
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
      link.download = `lead-submitted-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt:-7,
        py: 1,
        // mb: 6,
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
        Lead Submitted
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
          md:4,
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
              mt:-1,
              p: { xs: 2, md: 5 },
              borderRadius: 2,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              // transition: "0.3s",
              boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
              // "&:hover": { transform: "scale(1.01)" },
            }}
          >
            

            {/* ------------------- FORM START ------------------- */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* ---------------- SECTION: TENDER DETAILS ---------------- */}
              <Card
                sx={{
                  mt:-5,
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
                  📋 Tender Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* tenderName */}
                  <Grid item xs={12} sm={6} md={4}>
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

                  {/* customerName */}
                  <Grid item xs={12} sm={6} md={4}>
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
                  <Grid item xs={12} sm={6} md={4}>
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

                  {/* tenderDate */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="tenderDate"
                      control={control}
                      rules={{ required: "Tender Date is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Tender Date"
                          type="date"
                          fullWidth
                          required
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.tenderDate}
                          helperText={errors.tenderDate?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* tenderReferenceNo */}
                  <Grid item xs={12} sm={6} md={4}>
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
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* tenderType */}
                  <Grid item xs={12} sm={6} md={4}>
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
                              minWidth: 220,
                            },
                          }}
                        >
                          {TENDER_TYPE_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* website */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="website"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Website (Optional)"
                          fullWidth
                          placeholder="https://..."
                          helperText={
                            errors.website?.message ||
                            "URL of tender site, if any"
                          }
                          error={!!errors.website}
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

              {/* ---------------- SECTION: BID OWNER & EMD ---------------- */}
              <Card
                sx={{
                  mt:-1,
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
                  👤 Bid Owner & EMD Value
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* bidOwner */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="bidOwner"
                      control={control}
                      rules={{ required: "Bid Owner is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Bid Owner"
                          fullWidth
                          required
                          error={!!errors.bidOwner}
                          helperText={errors.bidOwner?.message}
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

                  {/* valueEMDInCrore */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="valueEMDInCrore"
                      control={control}
                      rules={{
                        required: "Value of EMD in Crore is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Enter a valid amount (max 2 decimals)",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Value of EMD (Crore)"
                          fullWidth
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                          required
                          error={!!errors.valueEMDInCrore}
                          helperText={errors.valueEMDInCrore?.message}
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

              {/* ---------------- SECTION: RFP INFORMATION ---------------- */}
              <Card
                sx={{
                  mt:-1,
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
                  📄 RFP Timeline
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* rfpReceivedOn */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="rfpReceivedOn"
                      control={control}
                      rules={{ required: "RFP Received On is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="RFP Received On"
                          type="date"
                          fullWidth
                          required
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            max: today, // ✅ past + today allowed
                          }}
                          error={!!errors.rfpReceivedOn}
                          helperText={errors.rfpReceivedOn?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 3 },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* rfpDueDate */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="rfpDueDate"
                      control={control}
                      rules={{
                        required: "RFP Due Date is required",
                        // validate: (value) =>
                        //   !rfpReceivedOn || value >= rfpReceivedOn
                        //     ? true
                        //     : "RFP Due Date cannot be before RFP Received Date",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="RFP Due Date"
                          type="date"
                          fullWidth
                          required
                          InputLabelProps={{ shrink: true }}
                          // inputProps={{
                          //   min: rfpReceivedOn || today, // ✅ dynamic min
                          // }}
                          error={!!errors.rfpDueDate}
                          helperText={errors.rfpDueDate?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 3 },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* ---------------- SECTION: APPROVAL WORKFLOW ---------------- */}
              <Card
                sx={{
                  mt:-1,
                  mb: 3,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  ✅ Approval Workflow
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {[
                    [
                      "dmktgInPrincipalApprovalRxdOn",
                      "Dmktg In-Principal Approval Rxd On",
                      "Dmktg In-Principal Approval date is required",
                    ],
                    [
                      "sellingPriceApprovalInitiatedOn",
                      "Selling Price Approval Initiated On",
                      "Selling Price Approval Initiated date is required",
                    ],
                    [
                      "bidSubmittedOn",
                      "Bid Submitted On",
                      "Bid Submitted On is required",
                    ],
                    [
                      "approvalSBUFinanceOn",
                      "Approval from SBU Finance On",
                      "Approval from SBU Finance date is required",
                    ],
                    [
                      "approvalGMOn",
                      "Approval from GM On",
                      "Approval from GM date is required",
                    ],
                    [
                      "sentToFinanceGMDmktgApprovalRxdOn",
                      "Sent to Finance GM on Dmktg Approval Rxd On",
                      "Sent to Finance GM on Dmktg Approval Rxd On is required",
                    ],
                    [
                      "dmktgApprovalRxdOn",
                      "Dmktg Approval Rxd On",
                      "Dmktg Approval Rxd On is required",
                    ],
                  ].map(([name, label, message]) => (
                    <Grid item xs={12} sm={6} md={4} key={name}>
                      <Controller
                        name={name}
                        control={control}
                        rules={{ required: message }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={label}
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: today }} // ⬅️ FUTURE DATES DISABLED
                            error={!!errors[name]}
                            helperText={errors[name]?.message}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Card>

              {/* ---------------- SECTION: STATUS & TRACKING ---------------- */}
              <Card
                sx={{
                  mt:-1,
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
                  📊 Status & Tracking
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* presentStatus */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name="presentStatus"
                      control={control}
                      rules={{ required: "Present Status is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Present Status"
                          fullWidth
                          required
                          error={!!errors.presentStatus}
                          helperText={
                            errors.presentStatus?.message ||
                            "Select current tracking status"
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </TextField>
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
                    background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                    textTransform: "none",
                    maxWidth: 180,
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

            {/* ---------------- SUCCESS SNACKBAR ---------------- */}
            <Snackbar
              open={submitSuccess}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="success" sx={{ fontSize: "1rem" }}>
                🎉 Lead submitted successfully!
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
        <ViewLeadSubmittedData ViewData={orderData} />
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

// ---------------------------------------------------------------------------
// VIEW COMPONENT WITH SEARCH + FILTERS + SORT + EDIT / DELETE
// ---------------------------------------------------------------------------

function ViewLeadSubmittedData(props) {
  console.log("data for view the table : ", props);
  const data = props.ViewData?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [tempEditingRow, setTempEditingRow] = useState(null);


  // READ-ONLY VIEW DIALOG STATE
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  // EDIT MODE STATE
  const [isEditMode, setIsEditMode] = useState(false);

  // SAVE CONFIRMATION DIALOG STATE
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState(false);

  // COLUMN SELECTION STATE
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const columnMenuOpen = Boolean(columnMenuAnchor);

  const leadColumns = [
    { id: "tenderName", label: "Tender Name" },
    { id: "customerName", label: "Customer Name" },
    { id: "customerAddress", label: "Customer Address" },
    { id: "tenderDate", label: "Tender Date" },
    { id: "bidOwner", label: "Bid Owner" },
    { id: "rfpReceivedOn", label: "RFP Received On" },
    { id: "valueEMDInCrore", label: "Value of EMD in CR" },
    { id: "rfpDueDate", label: "RFP Due Date" },
    {
      id: "dmktgInPrincipalApprovalRxdOn",
      label: "DmktgIn-principal approval Rxd On",
    },
    {
      id: "sellingPriceApprovalInitiatedOn",
      label: "Selling price approval Initiated on",
    },
    { id: "bidSubmittedOn", label: "Bid Submitted on" },
    { id: "approvalSBUFinanceOn", label: "Approval from SBU Finance on" },
    { id: "approvalGMOn", label: "Approval from GM" },
    {
      id: "sentToFinanceGMDmktgApprovalRxdOn",
      label: "Sent to Finance GM on Dmktg approval rxd on",
    },
    { id: "dmktgApprovalRxdOn", label: "Dmktg approval rxd on" },
    { id: "tenderReferenceNo", label: "Tender reference No" },
    { id: "tenderType", label: "Tender Type" },
    { id: "website", label: "Website" },
    { id: "presentStatus", label: "Present status" },
    { id: "dateCreated", label: "Created Date" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    leadColumns.reduce((acc, col) => {
      acc[col.id] = true;
      return acc;
    }, {})
  );

  // ---------------- HANDLERS ----------------

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleTenderTypeFilterChange = (e) =>
    setTenderTypeFilter(e.target.value);

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);

  const handleSortByChange = (e) => setSortBy(e.target.value);

  // COLUMN SELECTION HANDLERS
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
    setIsEditMode(false);
    setConfirmSaveOpen(false);
  };

  // ENTER EDIT MODE
  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  // SWITCH TO EDIT MODE
  const handleSwitchToEditMode = () => {
    setIsEditMode(true);
  };

  // OPEN SAVE CONFIRMATION DIALOG
  const handleSaveClick = () => {
    setSaveConfirmationOpen(true);
  };

  // CANCEL SAVE CONFIRMATION
  const handleSaveCancel = () => {
    setSaveConfirmationOpen(false);
  };

  // SAVE EDITED VALUES - MOCK API CALL
  const handleEditSave = () => {
    setSaveConfirmationOpen(false);
    console.log("Saving updated row:", editingRow);

     // CONFIRM AND SAVE TO BACKEND
  const handleConfirmSave = async () => {
    try {
      console.log("Saving updated row:", editingRow);

      // Mock API call - Replace with real API endpoint
      const mockApiResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Record updated successfully",
            data: editingRow,
          });
        }, 800);
      });

      if (mockApiResponse.success) {
        console.log("Backend Response:", mockApiResponse);
        alert("Changes saved successfully!");
        setConfirmSaveOpen(false);
        setEditDialogOpen(false);
        setIsEditMode(false);
        setEditingRow(null);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };


  // CANCEL EDIT MODE
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingRow({ ...tempEditingRow });
  };

    // MOCK API CALL
    // In production, replace this with actual API call
    const mockApiCall = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        console.log("Mock API Response: Row updated successfully");
        console.log("Updated data:", editingRow);

        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/updateLeadSubmitted', {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(editingRow),
        // });
        // const result = await response.json();

        setEditDialogOpen(false);
        setEditingRow(null);
        setIsEditMode(false);

        // Optional: Show success notification
        alert("✅ Lead details updated successfully!");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("❌ Failed to save changes. Please try again.");
      }
    };

    mockApiCall();
  };


  // CANCEL EDIT MODE
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingRow({ ...tempEditingRow });
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
    maxWidth: 150
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
                Lead Submitted List
              </Typography>
              {/* <Typography
                variant="body2"
                sx={{ opacity: 0.85, mt: 0.5, maxWidth: 520 }}
              >
                View, search, filter and manage all submitted tender leads in a
                single, elegant dashboard.
              </Typography> */}
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

            {/* Column Selection Menu */}
            <Tooltip title="Select columns to view in table">
              <IconButton
                onClick={handleColumnMenuOpen}
                sx={{
                  border: "2px solid #1e40af",
                  borderRadius: 1.5,
                  backgroundColor: "rgba(30, 64, 175, 0.06)",
                  color: "#1e40af",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(30, 64, 175, 0.12)",
                    transform: "scale(1.05)",
                  },
                  maxWidth: 50
                }}
              >
                <ViewColumnIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={columnMenuAnchor}
              open={columnMenuOpen}
              onClose={handleColumnMenuClose}
              PaperProps={{
                sx: {
                  minWidth: 280,
                  maxHeight: 400,
                },
              }}
            >
              {leadColumns.map((col) => (
                <MenuItem
                  key={col.id}
                  onClick={() => handleColumnToggle(col.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Checkbox
                    checked={visibleColumns[col.id]}
                    // onChange={() => handleColumnToggle(col.id)}
                    size="small"
                  />
                  <span>{col.label}</span>
                </MenuItem>
              ))}
            </Menu>
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
                  maxWidth: 50
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
                maxWidth: 130
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
              <TableCell sx={actionHeaderStyle}>Actions</TableCell>
                {leadColumns.map((col) =>
                  visibleColumns[col.id] ? (
                    <TableCell
                      key={col.id}
                      sx={{
                        ...headerCellStyle,
                        ...(col.id === "customerAddress" && { minWidth: 200 }),
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ) : null
                )}
                
              </TableRow>
            </TableHead>

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
                    {/* ACTIONS COLUMN */}
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
                              },maxWidth: 40,
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

                    {/* Rest of all */}
                    {leadColumns.map((col) => {
                      if (!visibleColumns[col.id]) return null;

                      let cellContent = row[col.id];

                      // Special rendering for specific columns
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
                            {cellContent}
                          </TableCell>
                        );
                      }

                      if (col.id === "customerName") {
                        return (
                          <TableCell
                            key={col.id}
                            sx={{
                              fontSize: 14,
                              maxWidth: 180,
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {cellContent}
                          </TableCell>
                        );
                      }

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
                            {cellContent}
                          </TableCell>
                        );
                      }

                      if (col.id === "tenderReferenceNo") {
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
                            {cellContent}
                          </TableCell>
                        );
                      }

                      if (col.id === "presentStatus") {
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{ fontSize: 13 }}
                          >
                            <Chip
                              size="small"
                              label={cellContent || "-"}
                              sx={{
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 700,
                                backgroundColor:
                                  cellContent === "Lost"
                                    ? "rgba(248,113,113,0.18)"
                                    : cellContent === "In Progress" ||
                                      cellContent === "Under Review"
                                    ? "rgba(234,179,8,0.18)"
                                    : cellContent === "Won"
                                    ? "rgba(52,211,153,0.18)"
                                    : "rgba(148,163,184,0.25)",
                                color:
                                  cellContent === "Lost"
                                    ? "#b91c1c"
                                    : cellContent === "In Progress" ||
                                      cellContent === "Under Review"
                                    ? "#92400e"
                                    : cellContent === "Won"
                                    ? "#15803d"
                                    : "#111827",
                              }}
                            />
                          </TableCell>
                        );
                      }

                      // Default rendering for other columns
                      return (
                        <TableCell
                          key={col.id}
                          align="left"
                          sx={{ fontSize: 13 }}
                        >
                          {cellContent}
                        </TableCell>
                      );
                    })}

                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      leadColumns.filter((c) => visibleColumns[c.id]).length + 1
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
            ? "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)" // ORANGE (Edit)
            : "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)", // BLUE (View)
            color: "#ffffff",
            borderBottom: isEditMode
            ? "3px solid #fb923c"
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
                background: isEditMode ? "#fbbf24" : "#60a5fa",
                color: isEditMode ? "#1f2937" : "#ffffff",
                mr: 8,
              }}
            />
            {/* This is for close the dialog box "x" */}
            {/* <IconButton
              onClick={handleEditCancel}
              sx={{
                color: "#ffffff",
                mr: 8,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <CloseRounded />
            </IconButton> */}
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
      tenderName: "",
      customerName: "",
      customerAddress: "",
      tenderDate: "",
      bidOwner: "",
      rfpReceivedOn: "",
      valueEMDInCrore: "",
      rfpDueDate: "",
      dmktgInPrincipalApprovalRxdOn: "",
      sellingPriceApprovalInitiatedOn: "",
      bidSubmittedOn: "",
      approvalSBUFinanceOn: "",
      approvalGMOn: "",
      sentToFinanceGMDmktgApprovalRxdOn: "",
      dmktgApprovalRxdOn: "",
      tenderReferenceNo: "",
      tenderType: "",
      website: "",
      presentStatus: "", */}



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
                  { label: "Customer Name", key: "customerName" },
                  { label: "Customer Address", key: "customerAddress" },
                  { label: "Lead Owner", key: "bidOwner" },
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

            {/* FINANCIAL DETAILS SECTION
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
                <Box sx={{ width: 4, height: 20, background: "#1e40af", borderRadius: 1 }} />
                Financial Details
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
                  // { label: "Value of EMD", key: "valueOfEMD" },
                  // {
                  //   label: "Estimated Value (Cr, w/o GST)",
                  //   key: "estimatedValueInCrWithoutGST",
                  // },
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
            </Box> */}

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
                    label: "Tender Dated",
                    key: "tenderDate",
                    isDate: true,
                  },
                  { label: "RFP Received On", key: "rfpReceivedOn" },
                  { label: "Value EMD In Crore", key: "valueEMDInCrore" },
                  { label: "RFP Due Date", key: "rfpDueDate" },
                  { label: "Dmktg In Principal Approval Rxd On", key: "dmktgInPrincipalApprovalRxdOn" },
                  { label: "Selling In Principal Approval Rxd On", key: "sellingPriceApprovalInitiatedOn" },
                  { label: "Bid Submitted On", key: "bidSubmittedOn" },
                  { label: "Approval SBU  Finance On", key: "approvalSBUFinanceOn" },
                  { label: "Approval GM On", key: "approvalGMOn" },
                  { label: "Sent to Finance GM Dmktg Approval Rxd On", key: "sentToFinanceGMDmktgApprovalRxdOn" },
                  { label: "Dmktg Approval Rxd On", key: "dmktgApprovalRxdOn" },

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
                    label: "Website",
                    key: "website",
                  },
                  // { label: "Open / Closed", key: "openClosed" },
                  { label: "Present Status", key: "presentStatus" },
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
              <Button
                onClick={handleEditCancel}
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  maxWidth: 180,
                  letterSpacing: "0.5px",
                  backgroundColor: "#e2e8ff",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleEnterEditMode}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #1e40af 0%, #1e3a5f 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  maxWidth: 180,
                  fontSize: "0.85rem",
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
            </>
          ) : (
            <>
              <Button
                onClick={handleCancelEdit}
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  maxWidth: 180,
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
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
                  maxWidth: 220,
                  textTransform: "uppercase",
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
            onClick={ () => console.log("hello")}
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
    "tenderName",
    "customerName",
    "customerAddress",
    "tenderDate",
    "bidOwner",
    "rfpReceivedOn",
    "valueEMDInCrore",
    "rfpDueDate",
    "dmktgInPrincipalApprovalRxdOn",
    "sellingPriceApprovalInitiatedOn",
    "bidSubmittedOn",
    "approvalSBUFinanceOn",
    "approvalGMOn",
    "sentToFinanceGMDmktgApprovalRxdOn",
    "dmktgApprovalRxdOn",
    "tenderReferenceNo",
    "tenderType",
    "website",
    "presentStatus",
    // user info
    "OperatorId",
    "OperatorName",
    "OperatorRole",
    "OperatorSBU",
  ];

  const DB_COLUMNS_MATCH = [
    "tenderName",
    "customerName",
    "customerAddress",
    "tenderDate",
    "bidOwner",
    "rfpReceivedOn",
    "valueEMDInCrore",
    "rfpDueDate",
    "dmktgInPrincipalApprovalRxdOn",
    "sellingPriceApprovalInitiatedOn",
    "bidSubmittedOn",
    "approvalSBUFinanceOn",
    "approvalGMOn",
    "sentToFinanceGMDmktgApprovalRxdOn",
    "dmktgApprovalRxdOn",
    "tenderReferenceNo",
    "tenderType",
    "website",
    "presentStatus",
  ];

  // ----------------------------
  // HANDLE FILE UPLOAD
  // ----------------------------
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setSuccess("");

    //your columns to check space

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
      .post(ServerIp + "/leadSubmittedBulkUpload", { excelData })
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
        mb:8,
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
        Upload Export Leads Data
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
            mb:5,
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

export default LeadSubmittedForm;
