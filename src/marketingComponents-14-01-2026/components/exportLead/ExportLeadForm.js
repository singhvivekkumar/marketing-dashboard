import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
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
import axios from "axios";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { CheckRounded, CloseRounded, DeleteRounded, EditRounded, NorthRounded, RestartAltRounded, SearchRounded, SouthRounded } from "@mui/icons-material";
import dummyData from "./dummyData.json";

const multilineProps = { multiline: true, rows: 2 };

const tenderTypeOptions = ["ST", "MT", "LT"];
const civilDefenceOptions = ["Civil", "Defence"];
const businessDomainOptions = [
  "IT",
  "Electronics",
  "Telecom",
  "Construction",
  "Other",
];
const documentTypeOptions = [
  "RFP",
  "RFI",
  "RFE",
  "EoI",
  "BQ",
  "ST",
  "NIT",
  "RFQ",
];

const resultStatusOptions = [
  "Won",
  "Lost",
  "Participated",
  "Participated-Won",
  "Participated-Pursuing",
  "Participated-Lost",
  "Not Participated",
];

const openClosedOptions = ["Open", "Closed"];

const presentStatusOptions = [
  "BQ Submitted",
  "Commercial Bid Submitted",
  "EOI was submitted",
  "Not participated",
  " ",
];

// NEW CHANGE FOR TABLE
const TENDER_TYPE_OPTIONS = [
  "Open",
  "Limited",
  "Single Bid",
  "Two Bid",
  "EOI",
  "Others",
];
const STATUS_OPTIONS = [
  "Draft",
  "Submitted",
  "In Progress",
  "Under Review",
  "Won",
  "Lost",
  "On Hold",
];



const ExportLeadForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const API = "/getExportLead";

  let user = JSON.parse(localStorage.getItem("user"));
  console.log(" user object ", user);

  useEffect(() => {
    axios
      .get(`/config.json`)
      .then(function (response) {
        // WE SETTING THE API
        console.log(
          "we are looking for server IP : ",
          response.data.project[0].ServerIP[0].NodeServerIP
        );
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
      leadOwner: "",
      civilOrDefence: "",
      businessDomain: "",
      valueOfEMD: "",
      estimatedValueInCrWithoutGST: "",
      submittedValueInCrWithoutGST: "",
      tenderDated: "",
      lastDateOfSub: "",
      soleOrConsortium: "",
      prebidMeetingDateTime: "",
      competitorsInfo: "",
      wonLostParticipated: "",
      openClosed: "",
      orderWonValueInCrWithoutGST: "",
      presentStatus: "",
      reasonForLossingOpp: "",
      corrigendumsDateFile: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Raw Form Data:", data);
    // Convert string numbers to actual numbers with 2 decimal precision
    const formattedData = {
      tenderName: data.tenderName,
      tenderReferenceNo: data.tenderReferenceNo,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      //classification: data.classification,
      tenderType: data.tenderType,
      documentType: data.documentType,
      leadOwner: data.leadOwner,
      civilOrDefence: data.civilOrDefence,
      businessDomain: data.businessDomain,
      valueOfEMD: data.valueOfEMD,
      estimatedValueInCrWithoutGST:
        data.estimatedValueInCrWithoutGST !== ""
          ? parseFloat(parseFloat(data.estimatedValueInCrWithoutGST).toFixed(5))
          : null,
      submittedValueInCrWithoutGST:
        data.submittedValueInCrWithoutGST !== ""
          ? parseFloat(parseFloat(data.submittedValueInCrWithoutGST).toFixed(5))
          : null,
      // estimatedValueInCrWithoutGST: parseFloat(
      //   parseFloat(data.estimatedValueInCrWithoutGST).toFixed(2)
      // ),
      // submittedValueInCrWithoutGST: parseFloat(
      //   parseFloat(data.submittedValueInCrWithoutGST).toFixed(2)
      // ),
      tenderDated: data.tenderDated,
      lastDateOfSub: data.lastDateOfSub,
      soleOrConsortium: data.soleOrConsortium,
      prebidMeetingDateTime: data.prebidMeetingDateTime,
      competitorsInfo: data.competitorsInfo,
      wonLostParticipated: data.wonLostParticipated,
      openClosed: data.openClosed,
      orderWonValueInCrWithoutGST: data.orderWonValueInCrWithoutGST,
      presentStatus: data.presentStatus,
      reasonForLossingOpp: data.reasonForLossingOpp,
      corrigendumsDateFile: data.corrigendumsDateFile,
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
      .post(ServerIp, formattedData)
      .then((response) => {
        // console.log("formattedData after ")
        console.log("Server Response:", response.data);
        // setOrderData(response.data);
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

  return (
    <Container
      maxWidth="xl"
      // disableGutters
      sx={{
        py: 2,
        mb: 4,
        minHeight: "85vh",
        background: "linear-gradient(135deg, #e3eeff 0%, #f8fbff 100%)",
        borderRadius: 4,
      }}
    >
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
        <Tab label="Create Data" />
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
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  background:
                    "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Export Leads Form
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ opacity: 0.7, mt: 1, fontWeight: 500 }}
              >
                Fill all details below to submit the tender form
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* SECTION 1 */}
              <Card
                sx={{
                  mb: 4,
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
                  📌 Export Leads Form
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {[
                    ["tenderName", "Tender Name"],
                    ["tenderReferenceNo", "Tender Reference No"],
                    ["customerName", "Customer Name"],
                    ["customerAddress", "Customer Address"],
                  ].map(([name, label]) => (
                    <Grid item xs={12} md={4} key={name}>
                      <Controller
                        name={name}
                        control={control}
                        rules={{ required: `${label} is required` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={label}
                            className="text-field-style"
                            {...multilineProps}
                            error={!!errors[name]}
                            helperText={errors[name]?.message}
                          />
                        )}
                      />
                    </Grid>
                  ))}

                  {/* Tender Type */}
                  <Grid item xs={12} md={4}>
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
                          className="text-field-style"
                          {...multilineProps}
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
                </Grid>
              </Card>

              {/* SECTION 2 */}
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
                  🏷️ Classification & Financial Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* Document Type */}
                  <Grid item xs={12} md={4}>
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
                          className="text-field-style"
                          {...multilineProps}
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

                  {/* Lead Owner (Multi-select) */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="leadOwner"
                      control={control}
                      rules={{ required: "Lead Owner is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Lead Owner"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.soleConsortium}
                          helperText={errors.soleConsortium?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Civil / Defence */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="civilOrDefence"
                      control={control}
                      rules={{
                        required: "Civil / Defence selection is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Civil / Defence"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.civilDefence}
                          helperText={errors.civilDefence?.message}
                        >
                          {civilDefenceOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Business Domain */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="businessDomain"
                      control={control}
                      rules={{ required: "Business Domain is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Business Domain"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.businessDomain}
                          helperText={errors.businessDomain?.message}
                        >
                          {businessDomainOptions.map((item) => (
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

              {/* SECTION 2 */}
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
                  📊 Values
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Competitors dynamic fields */}
                <Grid container spacing={3}>
                  {/* EMD Value */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="valueOfEMD"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          //  type="number"
                          label="value of EMD"
                          className="text-field-style"
                          sx={{ width: "100%" }}
                          {...multilineProps}
                        />
                      )}
                    />
                  </Grid>

                  {/* Estimate Value in Cr without GST */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="estimatedValueInCrWithoutGST"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          //  type="number"
                          label="Estimate Value in Cr without GST"
                          className="text-field-style"
                          sx={{ width: "100%" }}
                          {...multilineProps}
                        />
                      )}
                    />
                  </Grid>

                  {/* Submitted Value in Cr without GST */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="submittedValueInCrWithoutGST"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          //  type="number"
                          label="Submitted Value in Cr without GST"
                          className="text-field-style"
                          sx={{ width: "100%" }}
                          {...multilineProps}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* SECTION 3 */}
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
                  🗓️ Submission Timeline
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {[
                    ["tenderDated", "Tender Dated"],
                    ["lastDateOfSub", "Last Date of Submission"],
                  ].map(([name, label]) => (
                    <Grid item xs={12} md={4} key={name}>
                      <Controller
                        name={name}
                        control={control}
                        rules={{ required: `${label} is required` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="date"
                            fullWidth
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

                  {/* Sole / Consortium */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="soleOrConsortium"
                      control={control}
                      rules={{ required: "Sole / Consortium is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Sole / Consortium"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.soleConsortium}
                          helperText={errors.soleConsortium?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Pre-bid Date */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="prebidMeetingDateTime"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="datetime-local"
                          fullWidth
                          label="Pre-Bid Meeting Date & Time"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* SECTION 4 */}
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
                  📊 Competitors & Results
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Competitors dynamic fields */}
                <Grid item xs={12} md={10}>
                  <Controller
                    name="competitorsInfo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        //  type="number"
                        label="Competitors Info"
                        className="text-field-style"
                        sx={{ width: "100%" }}
                        {...multilineProps}
                      />
                    )}
                  />
                </Grid>

                {/* Result-related fields */}
                <Grid container spacing={3} sx={{ mt: 3 }}>
                  {/* Result Status */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="wonLostParticipated"
                      control={control}
                      rules={{ required: "Result Status is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Won / Lost / Participated / Not Participated"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.resultStatus}
                          helperText={errors.resultStatus?.message}
                        >
                          {resultStatusOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Open / Closed */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="openClosed"
                      control={control}
                      rules={{ required: "Open / Closed is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Open / Closed"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.openClosed}
                          helperText={errors.openClosed?.message}
                        >
                          {openClosedOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Order Won */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="orderWonValueInCrWithoutGST"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          // type="number"
                          label="Order Won Value in Crore (without GST)"
                          className="text-field-style"
                          sx={{ width: "100%" }}
                          {...multilineProps}
                        />
                      )}
                    />
                  </Grid>

                  {/* Present Status */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="presentStatus"
                      control={control}
                      rules={{ required: "Present Status is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Present Status"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.presentStatus}
                          helperText={errors.presentStatus?.message}
                        >
                          {presentStatusOptions.map((item) => (
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

              {/* SECTION 2 */}
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
                  📊 Reason & Info
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Competitors dynamic fields */}
                <Grid container spacing={3}>
                  {/* Reason  */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="reasonForLossingOpp"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          //  type="number"
                          label="Reason for Lossing/Participated/Not Participating in this opportunity"
                          className="text-field-style"
                          sx={{ width: "100%" }}
                          {...multilineProps}
                        />
                      )}
                    />
                  </Grid>

                  {/* Estimate Value in Cr without GST */}
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="corrigendumsDateFile"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          //  type="number"
                          label="Corrigendum Info"
                          className="text-field-style"
                          sx={{ width: "100%" }}
                          {...multilineProps}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
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

      {/* ------------------------ VIEW TABLE ------------------------ */}
      {value === 1 && orderData !== undefined && (
        <ViewExportLeadData ViewData={orderData} />
      )}

      {/* ------------------------ BULK UPLOAD ------------------------ */}
      {value === 2 && (
        <ExcelUploadAndValidate user={user} ServerIp={ServerIp} />
      )}
    </Container>
  );
};

// ------------------------------------------------------------------------
// VIEW COMPONENT WITH SEARCH + FILTERS + SORT + EDIT / DELETE
// ------------------------------------------------------------------------

function ViewExportLeadData(props) {
  console.log("ViewExportLeadData for view the table : ", props)
  const data = props.ViewData?.data || dummyData?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [tempEditingRow, setTempEditingRow] = useState(null);

  // READ-ONLY VIEW DIALOG STATE
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  // COLUMN VISIBILITY STATE
  const [visibleColumns, setVisibleColumns] = useState({
    tenderName: true,
    customerName: true,
    customerAddress: true,
    documentType: true,
    leadOwner: true,
    civilOrDefence: true,
    businessDomain: true,
    valueOfEMD: true,
    estimatedValueInCrWithoutGST: true,
    submittedValueInCrWithoutGST: true,
    tenderDated: true,
    lastDateOfSub: true,
    soleOrConsortium: true,
    prebidMeetingDateTime: true,
    competitorsInfo: true,
    wonLostParticipated: true,
    openClosed: true,
    orderWonValueInCrWithoutGST: true,
    presentStatus: true,
    reasonForLossingOpp: true,
    corrigendumsDateFile: true,
    actions: true,
  });

  // DEFINE ALL AVAILABLE COLUMNS
  const leadColumns = [
    { id: "tenderName", label: "Tender Name" },
    { id: "customerName", label: "Customer Name" },
    { id: "customerAddress", label: "Customer Address" },
    { id: "documentType", label: "Document Type" },
    { id: "leadOwner", label: "Lead Owner" },
    { id: "civilOrDefence", label: "Defence / Non Defence" },
    { id: "businessDomain", label: "Business Domain" },
    { id: "valueOfEMD", label: "Value of EMD" },
    { id: "estimatedValueInCrWithoutGST", label: "Estimate (CR, w/o GST)" },
    { id: "submittedValueInCrWithoutGST", label: "Submitted (CR, w/o GST)" },
    { id: "tenderDated", label: "Tender Dated" },
    { id: "lastDateOfSub", label: "Letter Submission Date" },
    { id: "soleOrConsortium", label: "Sole Consortium" },
    { id: "prebidMeetingDateTime", label: "Pre Bid Meeting Date Time" },
    { id: "competitorsInfo", label: "Competitors" },
    { id: "wonLostParticipated", label: "Won/Lost Participated" },
    { id: "openClosed", label: "Open Closed" },
    { id: "orderWonValueInCrWithoutGST", label: "Order Won Value In Cr Without GST" },
    { id: "presentStatus", label: "Present Status" },
    { id: "reasonForLossingOpp", label: "Reason For Lossing Opp" },
    { id: "corrigendumsDateFile", label: "Corrigendums Date File" },
    { id: "actions", label: "Actions" },
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

  // SAVE EDITED VALUES (Show Confirmation)
  const handleEditSave = () => {
    setTempEditingRow({ ...editingRow });
    setConfirmSaveOpen(true);
  };

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
            data: editingRow
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
  const filteredSortedData = useMemo(() => {
    if (!data) return [];
    
    return data
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
  }, [data, searchTerm, tenderTypeFilter, statusFilter, sortBy, sortDirection]);

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
          {/* Heading & Search Box*/}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Heading & Subheading */}
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

            {/* select columns to view in table */}
            <Box>
              <Tooltip title="Select Columns">
                <IconButton 
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    borderRadius: 2.5,
                    border: "1px solid rgba(148,163,184,0.7)",
                    backgroundColor: "rgba(240,248,255,0.9)",
                    color: "#0f172a",
                    "&:hover": {
                      backgroundColor: "rgba(224,242,254,1)",
                    },
                  }}
                >
                  <ViewColumnIcon />
                </IconButton>
              </Tooltip>
              
              <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  }
                }}
              >
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 2, py: 1, color: "#0f172a" }}>
                    Show/Hide Columns
                  </Typography>
                </Box>
                {leadColumns.map((col) => (
                  <MenuItem 
                    key={col.id}
                    onClick={() => handleColumnToggle(col.id)}
                    sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
                  >
                    <Checkbox
                      checked={visibleColumns[col.id]}
                      onChange={() => handleColumnToggle(col.id)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">{col.label}</Typography>
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
          <Table stickyHeader aria-label="lead submitted table" size="small">
            <TableHead>
              <TableRow>
                {leadColumns.map((col) =>
                  visibleColumns[col.id] ? (
                    <TableCell
                      key={col.id}
                      sx={
                        col.id === "actions"
                          ? actionHeaderStyle
                          : col.id === "customerAddress"
                          ? { ...headerCellStyle, minWidth: 200 }
                          : headerCellStyle
                      }
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
                    onClick={() => handleRowSelect(row)}
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
                        );
                      }

                      // RENDER PRESENT STATUS WITH CHIP
                      if (col.id === "presentStatus") {
                        return (
                          <TableCell key={col.id} align="left" sx={{ fontSize: 13 }}>
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

                      // RENDER CUSTOMER ADDRESS WITH MORE WIDTH
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

                      // RENDER LONG TEXT COLUMNS WITH ELLIPSIS
                      if (
                        col.id === "prebidMeetingDateTime" ||
                        col.id === "competitorsInfo" ||
                        col.id === "reasonForLossingOpp"
                      ) {
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
                  <TableCell colSpan={leadColumns.filter(c => visibleColumns[c.id]).length} align="center" sx={{ py: 4 }}>
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

      {/* EDIT DIALOG - PROFESSIONAL BLUE TABULAR MATRIX */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: "90vh",
            maxHeight: "90vh",
            borderRadius: 2,
            overflow: "hidden",
            background: "#ffffff",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15), 0 10px 30px rgba(30,64,95,0.2)",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        {/* HEADER - PROFESSIONAL GRADIENT */}
        <DialogTitle
          sx={{
            px: { xs: 2, md: 4 },
            py: 2.5,
            background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1e88e5 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            flexShrink: 0,
          }}
        >
          📋 {isEditMode ? "✏️ Edit Export Lead Details" : "📋 Export Lead Details"}
        </DialogTitle>

        {/* CONTENT - TABULAR MATRIX FORMAT WITH 7 SECTIONS */}
        <DialogContent
          sx={{
            px: { xs: 1.5, md: 2 },
            py: 2,
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            background: "#f5f8fc",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#e8eef7",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#1565c0",
              borderRadius: "4px",
              "&:hover": {
                background: "#0d47a1",
              },
            },
          }}
        >
          {editingRow && (
            <TableContainer sx={{ background: "#f5f8fc" }}>
              <Table
                sx={{
                  width: "100%",
                  borderCollapse: "collapse",
                  "& .MuiTableCell-root": {
                    border: "none",
                  },
                }}
              >
                <TableBody>
                  {/* TENDER DETAILS SECTION */}
                  <TableRow
                    sx={{
                      background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      },
                    }}
                  >
                    <TableCell
                      colSpan={2}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, md: 2.5 },
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        borderBottom: "2px solid #1565c0",
                      }}
                    >
                      📋 Tender Details
                    </TableCell>
                  </TableRow>

                  {[
                    ["Tender Name", "tenderName", "text"],
                    ["Tender Reference No", "tenderReferenceNo", "text"],
                    ["Tender Dated", "tenderDated", "date"],
                    ["Document Type", "documentType", "text"],
                    ["Last Date of Submission", "lastDateOfSub", "date"],
                  ].map(([label, field, type], idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                        borderBottom: "1px solid #e8eef7",
                        "&:hover": {
                          background: isEditMode ? "#eff6ff" : (idx % 2 === 0 ? "#ffffff" : "#f9fafb"),
                          transition: "background 0.2s ease",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          fontWeight: 700,
                          color: "#0d47a1",
                          width: "35%",
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        {label}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          width: "65%",
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        <TextField
                          type={type === "date" ? "date" : "text"}
                          value={editingRow?.[field] || ""}
                          onChange={(e) => handleEditFieldChange(field, e.target.value)}
                          fullWidth
                          size="small"
                          InputLabelProps={type === "date" ? { shrink: true } : undefined}
                          InputProps={{
                            readOnly: !isEditMode,
                            style: {
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              backgroundColor: isEditMode ? "#ffffff" : "#f9fafb",
                              color: "#0f172a",
                              fontSize: { xs: "0.85rem", md: "0.9rem" },
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: isEditMode ? "#1e88e5" : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: isEditMode ? "#1565c0" : "#ccc",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                                boxShadow: "0 0 0 3px rgba(13, 71, 161, 0.1)",
                              },
                              "& input": {
                                cursor: isEditMode ? "auto" : "default",
                              },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* CUSTOMER INFORMATION SECTION */}
                  <TableRow
                    sx={{
                      background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      },
                    }}
                  >
                    <TableCell
                      colSpan={2}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, md: 2.5 },
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        borderBottom: "2px solid #1565c0",
                      }}
                    >
                      👤 Customer Information
                    </TableCell>
                  </TableRow>

                  {[
                    ["Customer Name", "customerName", "text"],
                    ["Customer Address", "customerAddress", "text"],
                  ].map(([label, field, type], idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                        borderBottom: "1px solid #e8eef7",
                        "&:hover": {
                          background: isEditMode ? "#eff6ff" : (idx % 2 === 0 ? "#ffffff" : "#f9fafb"),
                          transition: "background 0.2s ease",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          fontWeight: 700,
                          color: "#0d47a1",
                          width: "35%",
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          borderBottom: "1px solid #e8eef7",
                          verticalAlign: "top",
                        }}
                      >
                        {label}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          width: "65%",
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        <TextField
                          type={type}
                          value={editingRow?.[field] || ""}
                          onChange={(e) => handleEditFieldChange(field, e.target.value)}
                          fullWidth
                          size="small"
                          multiline={field === "customerAddress"}
                          minRows={field === "customerAddress" ? 2 : 1}
                          InputProps={{
                            readOnly: !isEditMode,
                            style: {
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              backgroundColor: isEditMode ? "#ffffff" : "#f9fafb",
                              color: "#0f172a",
                              fontSize: { xs: "0.85rem", md: "0.9rem" },
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: isEditMode ? "#1e88e5" : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: isEditMode ? "#1565c0" : "#ccc",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                                boxShadow: "0 0 0 3px rgba(13, 71, 161, 0.1)",
                              },
                              "& textarea": {
                                cursor: isEditMode ? "auto" : "default",
                              },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* LEAD OWNER & CLASSIFICATION SECTION */}
                  <TableRow
                    sx={{
                      background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      },
                    }}
                  >
                    <TableCell
                      colSpan={2}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, md: 2.5 },
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        borderBottom: "2px solid #1565c0",
                      }}
                    >
                      👤 Lead Owner & Classification
                    </TableCell>
                  </TableRow>

                  {[
                    ["Lead Owner", "leadOwner", "text"],
                    ["Civil/Defence", "civilOrDefence", "text"],
                    ["Business Domain", "businessDomain", "text"],
                  ].map(([label, field, type], idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                        borderBottom: "1px solid #e8eef7",
                        "&:hover": {
                          background: isEditMode ? "#eff6ff" : (idx % 2 === 0 ? "#ffffff" : "#f9fafb"),
                          transition: "background 0.2s ease",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          fontWeight: 700,
                          color: "#0d47a1",
                          width: "35%",
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        {label}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          width: "65%",
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        <TextField
                          type={type}
                          value={editingRow?.[field] || ""}
                          onChange={(e) => handleEditFieldChange(field, e.target.value)}
                          fullWidth
                          size="small"
                          InputProps={{
                            readOnly: !isEditMode,
                            style: {
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              backgroundColor: isEditMode ? "#ffffff" : "#f9fafb",
                              color: "#0f172a",
                              fontSize: { xs: "0.85rem", md: "0.9rem" },
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: isEditMode ? "#1e88e5" : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: isEditMode ? "#1565c0" : "#ccc",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                                boxShadow: "0 0 0 3px rgba(13, 71, 161, 0.1)",
                              },
                              "& input": {
                                cursor: isEditMode ? "auto" : "default",
                              },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* FINANCIAL INFORMATION SECTION */}
                  <TableRow
                    sx={{
                      background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      },
                    }}
                  >
                    <TableCell
                      colSpan={2}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, md: 2.5 },
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        borderBottom: "2px solid #1565c0",
                      }}
                    >
                      💰 Financial Information
                    </TableCell>
                  </TableRow>

                  {[
                    ["EMD Value (Crore)", "valueOfEMD", "number"],
                    ["Estimated Value without GST (Crore)", "estimatedValueInCrWithoutGST", "number"],
                    ["Submitted Value without GST (Crore)", "submittedValueInCrWithoutGST", "number"],
                    ["Order Won Value without GST (Crore)", "orderWonValueInCrWithoutGST", "number"],
                  ].map(([label, field, type], idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                        borderBottom: "1px solid #e8eef7",
                        "&:hover": {
                          background: isEditMode ? "#eff6ff" : (idx % 2 === 0 ? "#ffffff" : "#f9fafb"),
                          transition: "background 0.2s ease",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          fontWeight: 700,
                          color: "#0d47a1",
                          width: "35%",
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        {label}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          width: "65%",
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        <TextField
                          type={type}
                          value={editingRow?.[field] || ""}
                          onChange={(e) => handleEditFieldChange(field, e.target.value)}
                          fullWidth
                          size="small"
                          InputProps={{
                            readOnly: !isEditMode,
                            style: {
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              backgroundColor: isEditMode ? "#ffffff" : "#f9fafb",
                              color: "#0f172a",
                              fontSize: { xs: "0.85rem", md: "0.9rem" },
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: isEditMode ? "#1e88e5" : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: isEditMode ? "#1565c0" : "#ccc",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                                boxShadow: "0 0 0 3px rgba(13, 71, 161, 0.1)",
                              },
                              "& input": {
                                cursor: isEditMode ? "auto" : "default",
                              },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* SUBMISSION & DATES SECTION */}
                  <TableRow
                    sx={{
                      background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      },
                    }}
                  >
                    <TableCell
                      colSpan={2}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, md: 2.5 },
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        borderBottom: "2px solid #1565c0",
                      }}
                    >
                      📅 Submission & Dates
                    </TableCell>
                  </TableRow>

                  {[
                    ["Pre-bid Meeting Date & Time", "prebidMeetingDateTime", "datetime-local"],
                    ["Sole/Consortium", "soleOrConsortium", "text"],
                  ].map(([label, field, type], idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                        borderBottom: "1px solid #e8eef7",
                        "&:hover": {
                          background: isEditMode ? "#eff6ff" : (idx % 2 === 0 ? "#ffffff" : "#f9fafb"),
                          transition: "background 0.2s ease",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          fontWeight: 700,
                          color: "#0d47a1",
                          width: "35%",
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        {label}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          width: "65%",
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        <TextField
                          type={type}
                          value={editingRow?.[field] || ""}
                          onChange={(e) => handleEditFieldChange(field, e.target.value)}
                          fullWidth
                          size="small"
                          InputLabelProps={type === "date" || type === "datetime-local" ? { shrink: true } : undefined}
                          InputProps={{
                            readOnly: !isEditMode,
                            style: {
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              backgroundColor: isEditMode ? "#ffffff" : "#f9fafb",
                              color: "#0f172a",
                              fontSize: { xs: "0.85rem", md: "0.9rem" },
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: isEditMode ? "#1e88e5" : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: isEditMode ? "#1565c0" : "#ccc",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                                boxShadow: "0 0 0 3px rgba(13, 71, 161, 0.1)",
                              },
                              "& input": {
                                cursor: isEditMode ? "auto" : "default",
                              },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* COMPETITION & PARTICIPATION SECTION */}
                  <TableRow
                    sx={{
                      background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      },
                    }}
                  >
                    <TableCell
                      colSpan={2}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, md: 2.5 },
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        borderBottom: "2px solid #1565c0",
                      }}
                    >
                      🏆 Competition & Participation
                    </TableCell>
                  </TableRow>

                  {[
                    ["Competitors Info", "competitorsInfo", "text"],
                    ["Won/Lost/Participated", "wonLostParticipated", "text"],
                    ["Open/Closed", "openClosed", "text"],
                  ].map(([label, field, type], idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                        borderBottom: "1px solid #e8eef7",
                        "&:hover": {
                          background: isEditMode ? "#eff6ff" : (idx % 2 === 0 ? "#ffffff" : "#f9fafb"),
                          transition: "background 0.2s ease",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          fontWeight: 700,
                          color: "#0d47a1",
                          width: "35%",
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        {label}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          width: "65%",
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        <TextField
                          type={type}
                          value={editingRow?.[field] || ""}
                          onChange={(e) => handleEditFieldChange(field, e.target.value)}
                          fullWidth
                          size="small"
                          multiline={field === "competitorsInfo"}
                          minRows={field === "competitorsInfo" ? 2 : 1}
                          InputProps={{
                            readOnly: !isEditMode,
                            style: {
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              backgroundColor: isEditMode ? "#ffffff" : "#f9fafb",
                              color: "#0f172a",
                              fontSize: { xs: "0.85rem", md: "0.9rem" },
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: isEditMode ? "#1e88e5" : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: isEditMode ? "#1565c0" : "#ccc",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                                boxShadow: "0 0 0 3px rgba(13, 71, 161, 0.1)",
                              },
                              "& textarea": {
                                cursor: isEditMode ? "auto" : "default",
                              },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* STATUS & NOTES SECTION */}
                  <TableRow
                    sx={{
                      background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0d47a1 0%, #1565c0 100%)",
                      },
                    }}
                  >
                    <TableCell
                      colSpan={2}
                      sx={{
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, md: 2.5 },
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        borderBottom: "2px solid #1565c0",
                      }}
                    >
                      📊 Status & Notes
                    </TableCell>
                  </TableRow>

                  {[
                    ["Present Status", "presentStatus", "text"],
                    ["Reason for Losing Opportunity", "reasonForLossingOpp", "text"],
                    ["Corrigendums - Date & File", "corrigendumsDateFile", "text"],
                  ].map(([label, field, type], idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                        borderBottom: "1px solid #e8eef7",
                        "&:hover": {
                          background: isEditMode ? "#eff6ff" : (idx % 2 === 0 ? "#ffffff" : "#f9fafb"),
                          transition: "background 0.2s ease",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          fontWeight: 700,
                          color: "#0d47a1",
                          width: "35%",
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        {label}
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 1.5, md: 2 },
                          px: { xs: 1.5, md: 2.5 },
                          width: "65%",
                          borderBottom: "1px solid #e8eef7",
                        }}
                      >
                        <TextField
                          type={type}
                          value={editingRow?.[field] || ""}
                          onChange={(e) => handleEditFieldChange(field, e.target.value)}
                          fullWidth
                          size="small"
                          multiline={(field === "reasonForLossingOpp" || field === "corrigendumsDateFile")}
                          minRows={(field === "reasonForLossingOpp" || field === "corrigendumsDateFile") ? 2 : 1}
                          InputProps={{
                            readOnly: !isEditMode,
                            style: {
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              backgroundColor: isEditMode ? "#ffffff" : "#f9fafb",
                              color: "#0f172a",
                              fontSize: { xs: "0.85rem", md: "0.9rem" },
                              transition: "all 0.2s ease",
                              "& fieldset": {
                                borderColor: isEditMode ? "#1e88e5" : "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: isEditMode ? "#1565c0" : "#ccc",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0d47a1",
                                boxShadow: "0 0 0 3px rgba(13, 71, 161, 0.1)",
                              },
                              "& textarea": {
                                cursor: isEditMode ? "auto" : "default",
                              },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        {/* DIALOG ACTIONS - CONDITIONAL BUTTONS */}
        <DialogActions
          sx={{
            px: { xs: 1.5, md: 3 },
            py: 2,
            background: "#ffffff",
            borderTop: "2px solid #e8eef7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Button
            onClick={handleEditCancel}
            sx={{
              borderRadius: 1,
              textTransform: "none",
              px: { xs: 2, md: 3 },
              fontWeight: 600,
              fontSize: { xs: "0.85rem", md: "0.95rem" },
              color: "#1565c0",
              "&:hover": {
                backgroundColor: "rgba(21, 101, 192, 0.08)",
              },
            }}
          >
            Close
          </Button>

          {!isEditMode ? (
            <Button
              variant="contained"
              onClick={handleEnterEditMode}
              startIcon={<EditRounded />}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                px: { xs: 2.5, md: 4 },
                fontWeight: 700,
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)",
                boxShadow: "0 8px 20px rgba(13, 71, 161, 0.3)",
                color: "#ffffff",
                "&:hover": {
                  background: "linear-gradient(135deg, #0a3a81 0%, #0d47a1 100%)",
                  boxShadow: "0 10px 25px rgba(13, 71, 161, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Edit Details
            </Button>
          ) : (
            <>
              <Button
                onClick={handleEditCancel}
                sx={{
                  borderRadius: 1,
                  textTransform: "none",
                  px: { xs: 2, md: 3 },
                  fontWeight: 600,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  color: "#d97706",
                  border: "1.5px solid #fcd34d",
                  backgroundColor: "#fef3c7",
                  "&:hover": {
                    backgroundColor: "#fce7a8",
                    borderColor: "#f59e0b",
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleEditSave}
                startIcon={<CheckRounded />}
                sx={{
                  borderRadius: 1,
                  textTransform: "none",
                  px: { xs: 2.5, md: 4 },
                  fontWeight: 700,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  boxShadow: "0 8px 20px rgba(5, 150, 105, 0.3)",
                  color: "#ffffff",
                  "&:hover": {
                    background: "linear-gradient(135deg, #047857 0%, #059669 100%)",
                    boxShadow: "0 10px 25px rgba(5, 150, 105, 0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Save Changes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* SAVE CONFIRMATION DIALOG */}
      <Dialog
        open={confirmSaveOpen}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          ✅ Confirm Changes
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography sx={{ color: "#475569", lineHeight: 1.6 }}>
            Are you sure you want to save these changes? This action will update the record in the database.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1, p: 2 }}>
          <Button
            onClick={handleCancelEdit}
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            No, Keep Editing
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmSave}
            sx={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            Yes, Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* READ-ONLY VIEW DIALOG */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Budgetary Quotation – View Only
        </DialogTitle>

        <DialogContent dividers>
          {viewRow && (
            <Grid container spacing={2}>
              {Object.entries(viewRow).map(([key, value]) => (
                <Grid item xs={6} key={key}>
                  <TextField
                    label={key}
                    value={value ?? ""}
                    fullWidth
                    size="small"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={() => setViewDialogOpen(false)}>
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
    "tenderReferenceNo",
    "customerName",
    "customerAddress",
    "tenderType",
    "documentType",
    "leadOwner",
    "civilOrDefence",
    "businessDomain",
    "valueOfEMD",
    "estimatedValueInCrWithoutGST",
    "submittedValueInCrWithoutGST",
    "tenderDated",
    "lastDateOfSub",
    "soleOrConsortium",
    "prebidMeetingDateTime",
    "competitorsInfo",
    "wonLostParticipated",
    "openClosed",
    "orderWonValueInCrWithoutGST",
    "presentStatus",
    "reasonForLossingOpp",
    "corrigendumsDateFile",
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
    "tenderType",
    "documentType",
    "leadOwner",
    "civilOrDefence",
    "businessDomain",
    "valueOfEMD",
    "estimatedValueInCrWithoutGST",
    "submittedValueInCrWithoutGST",
    "tenderDated",
    "lastDateOfSub",
    "soleOrConsortium",
    "prebidMeetingDateTime",
    "competitorsInfo",
    "wonLostParticipated",
    "openClosed",
    "orderWonValueInCrWithoutGST",
    "presentStatus",
    "reasonForLossingOpp",
    "corrigendumsDateFile",
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
      .post(ServerIp + "/exportLeadsBulkUpload", { excelData })
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
          Upload Budgetary Quotation Data
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
                fontSize: 58,
                color: "#3b82f6",
                mb: 1,
                transition: "transform 0.25s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              ☁️
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

export default ExportLeadForm;
