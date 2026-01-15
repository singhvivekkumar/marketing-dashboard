import React, { useState } from "react";
import "./TenderForm.css";

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
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm, Controller } from "react-hook-form";

const tenderTypeOptions = ["ST", "MT"];
const statusOptions = [
  "BQ Submitted",
  "Commercial Bid Submitted",
  "EOI was submitted",
  "Not participated",
  " ",
];

const leadOwnerOption = [
  "Umesha A", "Solomon", "Jamuna", "Asharani", "Chinta",
  "Sravanthy", "Praveen", "Sandeep", "Puneet", "Raju", "Sivaprasath"
];

export default function TenderForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bidOwner: [],
    },
  });

  const onSubmit = (data) => {
    setSubmittedData({ ...data, submittedAt: new Date().toISOString() });
    setSubmitSuccess(true);
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  const handleCloseSnackbar = () => setSubmitSuccess(false);

  const handleDownloadJSON = () => {
    if (!submittedData) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(submittedData, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `tender-${submittedData.tenderReferenceNo}-${Date.now()}.json`;
    a.click();
  };

  const hyperlinkPattern = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

  return (
    <Container maxWidth="xl" className="tender-container">
      <Paper elevation={4} className="tender-paper">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h4" className="section-title">
            Lead Submitted Form
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill tender details below to submit the form
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Section 1 – Tender Details */}
          <Card className="tender-card">
            <CardContent>
              <Typography variant="h6" className="section-title">📋 Tender Details</Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {[
                  ["leadSubmitted", "Lead Submitted"],
                  ["tenderName", "Tender Name"],
                  ["customer", "Customer Name"],
                ].map(([name, label]) => (
                  <Grid item xs={12} key={name}>
                    <Controller
                      name={name}
                      control={control}
                      rules={{ required: `${label} is required` }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={label}
                          multiline
                          rows={2}
                          fullWidth
                          className="text-field-style"
                          error={!!errors[name]}
                          helperText={errors[name]?.message}
                        />
                      )}
                    />
                  </Grid>
                ))}

                {/* Tender Date (Not multiline) */}
                <Grid item xs={12}>
                  <Controller
                    name="tenderDate"
                    control={control}
                    rules={{ required: "Tender Date is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        label="Tender Date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        className="text-field-style"
                        error={!!errors.tenderDate}
                        helperText={errors.tenderDate?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Bid Owner — Autocomplete Multi-select */}
                <Grid item xs={12}>
                  <Controller
                    name="bidOwner"
                    control={control}
                    rules={{ required: "Bid Owner is required" }}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={leadOwnerOption}
                        value={field.value || []}
                        onChange={(e, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Bid Owner (Multi-select)"
                            fullWidth
                            error={!!errors.bidOwner}
                            helperText={errors.bidOwner?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 2 – Timeline & Approvals */}
          <Card className="tender-card">
            <CardContent>
              <Typography variant="h6" className="section-title">📅 Timeline & Approvals</Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {[
                  ["rfpReceivedOn", "RFP Received On"],
                  ["rfpDueDate", "RFP Due Date"],
                  ["approvalDmktg", "Dmktg Approval Received On"],
                  ["sellingPriceApproval", "Selling Price Approval Initiated On"],
                  ["bidSubmittedOn", "Bid Submitted On"],
                  ["approvalSbuFinance", "Approval from SBU Finance On"],
                  ["approvalGM", "Approval from GM On"],
                  ["sentToFinanceGM", "Sent to Finance GM On"],
                  ["dmktgApprovalReceived", "Dmktg Approval Received On"],
                ].map(([name, label]) => (
                  <Grid item xs={12} sm={6} key={name}>
                    <Controller
                      name={name}
                      control={control}
                      rules={{ required: `${label} is required` }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          label={label}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors[name]}
                          helperText={errors[name]?.message}
                        />
                      )}
                    />
                  </Grid>
                ))}

                {/* Value of EMD (multiline numeric) */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="valueEMD"
                    control={control}
                    rules={{ required: "Value of EMD is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Value of EMD (in Crore)"
                        fullWidth
                        multiline
                        rows={2}
                        className="text-field-style"
                        error={!!errors.valueEMD}
                        helperText={errors.valueEMD?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 3 – Reference & Classification */}
          <Card className="tender-card">
            <CardContent>
              <Typography variant="h6" className="section-title">🏷️ Reference & Classification</Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Tender Reference No */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="tenderReferenceNo"
                    control={control}
                    rules={{ required: "Tender Reference No is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Reference Number"
                        fullWidth
                        multiline
                        rows={2}
                        className="text-field-style"
                        error={!!errors.tenderReferenceNo}
                        helperText={errors.tenderReferenceNo?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Tender Type Dropdown */}
                <Grid item xs={12} md={6}>
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
                        multiline
                        rows={2}
                        className="text-field-style"
                        error={!!errors.tenderType}
                        helperText={errors.tenderType?.message}
                      >
                        {tenderTypeOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Website — Only hyperlink allowed */}
                <Grid item xs={12}>
                  <Controller
                    name="website"
                    control={control}
                    rules={{
                      required: "Website / Portal Name is required",
                      pattern: {
                        value: hyperlinkPattern,
                        message: "Enter a valid hyperlink including http:// or https://",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Website / Portal Name"
                        fullWidth
                        multiline
                        rows={2}
                        className="text-field-style"
                        error={!!errors.website}
                        helperText={errors.website?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Present Status */}
                <Grid item xs={12}>
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
                        multiline
                        rows={2}
                        className="text-field-style"
                        error={!!errors.presentStatus}
                        helperText={errors.presentStatus?.message}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button type="submit" variant="contained" size="large" className="btn-submit">
              Submit Tender
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="button" variant="outlined" size="large" className="btn-reset" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </form>

        {/* Snackbar */}
        <Snackbar open={submitSuccess} autoHideDuration={5000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            Tender form submitted successfully!
          </Alert>
        </Snackbar>

        {/* JSON Output */}
        {submittedData && (
          <Box sx={{ mt: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">📊 Submitted Data (JSON)</Typography>
              <Button variant="contained" color="success" size="small" onClick={handleDownloadJSON}>
                Download JSON
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Paper elevation={2} sx={{
              p: 3,
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              maxHeight: 480,
              overflow: "auto",
              borderRadius: 2,
            }}>
              <pre>{JSON.stringify(submittedData, null, 2)}</pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
