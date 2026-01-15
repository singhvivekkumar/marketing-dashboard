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
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";

const tenderTypeOptions = ["ST", "MT"];
const civilDefenceOptions = ["Civil", "Defence"];
const businessDomainOptions = ["IT", "Electronics", "Telecom", "Construction", "Other"];
const documentTypeOptions = ["RFP", "RFI", "RFE", "EoI", "BQ", "ST", "NIT", "RFQ"];

const leadOwnerOption = [
  "Umesha A", "Solomon", "Jamuna", "Asharani", "Chinta",
  "Sravanthy", "Praveen", "Sandeep", "Puneet", "Raju", "Sivaprasath"
];

const resultStatusOptions = [
  "Won",
  "Lost",
  "Participated",
  "Participated-Won",
  "Participated-Pursuing",
  "Participated-Lost",
  "Not Participated"
];

const openClosedOptions = ["Open", "Closed"];

const presentStatusOptions = [
  "BQ Submitted",
  "Commercial Bid Submitted",
  "EOI was submitted",
  "Not participated",
  " "
];

export default function TenderForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [competitorsList, setCompetitorsList] = useState([""]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { leadOwner: [] }
  });

  const multilineProps = { multiline: true, rows: 2 };

  const addCompetitorField = () =>
    setCompetitorsList([...competitorsList, ""]);

  const removeCompetitorField = (index) =>
    setCompetitorsList(competitorsList.filter((_, i) => i !== index));

  const updateCompetitorValue = (value, index) => {
    const updated = [...competitorsList];
    updated[index] = value;
    setCompetitorsList(updated);
  };

  const onSubmit = (data) => {
    const competitorsArray = competitorsList
      .filter((v) => v.trim() !== "")
      .map((name, index) => ({ [`${index + 1}`]: name }));

    setSubmittedData({
      ...data,
      competitors: competitorsArray,
      submittedAt: new Date().toISOString(),
    });

    setSubmitSuccess(true);
  };

  const handleReset = () => {
    reset();
    setCompetitorsList([""]);
    setSubmittedData(null);
  };

  const handleDownloadJSON = () => {
    if (!submittedData) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(submittedData, null, 2)], {
        type: "application/json",
      })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `tender-${Date.now()}.json`;
    a.click();
  };

  const handleCloseSnackbar = () => setSubmitSuccess(false);

  return (
    <Container maxWidth="xl" className="tender-container">
      <Paper elevation={4} className="tender-paper">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h4" className="section-title">Domestic Leads Form</Typography>
          <Typography variant="body2" color="text.secondary">
            Fill all details below to submit the tender form
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* SECTION 1 */}
          <Card className="tender-card">
            <CardContent>
              <Typography variant="h6" className="section-title">📌 Domestic Leads Form</Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {[
                  ["tenderName", "Tender Name"],
                  ["customer", "Customer"],
                  ["location", "Location"],
                ].map(([name, label]) => (
                  <Grid item xs={12} key={name}>
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
                <Grid item xs={12}>
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
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* SECTION 2 */}
          <Card className="tender-card">
            <CardContent>
              <Typography variant="h6" className="section-title">🏷️ Classification & Financial Details</Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
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
                        className="text-field-style"
                        {...multilineProps}
                        error={!!errors.documentType}
                        helperText={errors.documentType?.message}
                      >
                        {documentTypeOptions.map((item) => (
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Lead Owner (Multi-select) */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth className="text-field-style">
                    <InputLabel>Lead Owner</InputLabel>
                    <Controller
                      name="leadOwner"
                      control={control}
                      rules={{ required: "Lead Owner is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          multiple
                          input={<OutlinedInput label="Lead Owner" />}
                          renderValue={(selected) => selected.join(", ")}
                        >
                          {leadOwnerOption.map((name) => (
                            <MenuItem key={name} value={name}>
                              <Checkbox checked={field.value.includes(name)} />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.leadOwner && (
                      <Typography variant="caption" color="error">Lead Owner is required</Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Civil / Defence */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="civilDefence"
                    control={control}
                    rules={{ required: "Civil / Defence selection is required" }}
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
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Business Domain */}
                <Grid item xs={12} md={6}>
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
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* SECTION 3 */}
          <Card className="tender-card">
            <CardContent>
              <Typography variant="h6" className="section-title">🗓️ Submission Timeline</Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Dates — not multiline */}
                {[
                  ["tenderDated", "Tender Dated"],
                  ["lastDateSubmission", "Last Date of Submission"],
                ].map(([name, label]) => (
                  <Grid item xs={12} md={6} key={name}>
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

                {/* Sole / Consortium Textfield */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="soleConsortium"
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

                {/* Prebid datetime */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="preBidDate"
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
            </CardContent>
          </Card>

          {/* SECTION 4 */}
          <Card className="tender-card">
            <CardContent>
              <Typography variant="h6" className="section-title">📊 Competitors & Results</Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Competitors dynamic fields */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Competitors
                </Typography>

                {competitorsList.map((value, index) => (
                  <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                    <Grid item xs={11}>
                      <TextField
                        fullWidth
                        label={`Competitor ${index + 1}`}
                        value={value}
                        onChange={(e) => updateCompetitorValue(e.target.value, index)}
                        className="text-field-style"
                      />
                    </Grid>
                    <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton color="error" onClick={() => removeCompetitorField(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}

                <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={addCompetitorField}>
                  + Add Competitor
                </Button>
              </Grid>

              {/* Other Result-related fields */}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* Result Status */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="resultStatus"
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
                      >
                        {resultStatusOptions.map((item) => (
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Open / Closed */}
                <Grid item xs={12} md={6}>
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
                      >
                        {openClosedOptions.map((item) => (
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Order Won */}
                <Grid item xs={12} md={10}>
                  <Controller
                    name="orderWonValue"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Order Won Value in Crore (without GST)"
                        className="text-field-style"
                        sx={{ width: "100%" }}
                        {...multilineProps}
                      />
                    )}
                  />
                </Grid>

                {/* Present Status */}
                <Grid item xs={12} md={6}>
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
                      >
                        {presentStatusOptions.map((item) => (
                          <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* BUTTONS */}
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button type="submit" variant="contained" size="large" className="btn-submit">
              Submit
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="button" variant="outlined" size="large" className="btn-reset" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </form>

        {/* Snackbar */}
        <Snackbar open={submitSuccess} autoHideDuration={4500} onClose={handleCloseSnackbar}>
          <Alert severity="success" onClose={handleCloseSnackbar}>
            Tender submitted successfully!
          </Alert>
        </Snackbar>

        {/* JSON OUTPUT */}
        {submittedData && (
          <Box sx={{ mt: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">📌 Submitted Data (JSON)</Typography>
              <Button variant="contained" color="success" size="small" onClick={handleDownloadJSON}>
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
                borderRadius: 2,
              }}
            >
              <pre>{JSON.stringify(submittedData, null, 2)}</pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
