import React from 'react'

import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Box,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Chip
}from "@mui/material";

import {useForm, Controller} from 'react-hook-form';

const CRMLeadForm = () => {
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState(null);
  const [submissionCount, setSubmissionCount] = React.useState(0);

  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      serialNumber: '',
      leadID: '',
      issueDate: '',
      tenderName: '',
      organisation: '',
      documentType: '',
      tenderType: '',
      emdCrore: '',
      approxTenderValueCrore: '',
      lastDateSubmission: '',
      preBidDate: '',
      teamAssigned: '',
      remarks: '',
      corrigendumInfo: ''
    }
  });

  const onSubmit = (data) => {
    // Format data with proper number conversions and timestamp
    const formattedData = {
      serialNumber: data.serialNumber,
      leadID: data.leadID,
      issueDate: data.issueDate,
      tenderName: data.tenderName,
      organisation: data.organisation,
      documentType: data.documentType,
      tenderType: data.tenderType,
      emdCrore: parseFloat(parseFloat(data.emdCrore).toFixed(2)),
      approxTenderValueCrore: parseFloat(parseFloat(data.approxTenderValueCrore).toFixed(2)),
      lastDateSubmission: data.lastDateSubmission,
      preBidDate: data.preBidDate,
      teamAssigned: data.teamAssigned,
      remarks: data.remarks || '',
      corrigendumInfo: data.corrigendumInfo || '',
      submittedAt: new Date().toISOString()
    };

    console.log('CRM Lead Data:', JSON.stringify(formattedData, null, 2));
    setSubmittedData(formattedData);
    setSubmitSuccess(true);
    setSubmissionCount(prev => prev + 1);
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#ffffff' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
            CRM Leads Data Collection Form
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Streamlined tender lead entry optimized for desktop - Quick CRM workflow
          </Typography>
          {submissionCount > 0 && (
            <Chip 
              label={`Total Leads Submitted: ${submissionCount}`} 
              color="primary" 
              sx={{ fontWeight: 600, fontSize: '0.95rem' }}
            />
          )}
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Section 1: Lead Identification - Light Blue */}
          <Card sx={{ mb: 3, backgroundColor: '#e3f2fd', border: '1px solid #90caf9' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#1565c0' }}>
                🆔 Lead Identification
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="serialNumber"
                    control={control}
                    rules={{ required: 'Serial Number is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Serial Number"
                        fullWidth
                        required
                        error={!!errors.serialNumber}
                        helperText={errors.serialNumber?.message || 'e.g., CRM-001'}
                        variant="outlined"
                        placeholder="CRM-001"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="leadID"
                    control={control}
                    rules={{ required: 'Lead ID is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Lead ID"
                        fullWidth
                        required
                        error={!!errors.leadID}
                        helperText={errors.leadID?.message || 'Unique identifier'}
                        variant="outlined"
                        placeholder="LEAD-2025-001"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="issueDate"
                    control={control}
                    rules={{ required: 'Issue Date is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Issue Date"
                        type="date"
                        fullWidth
                        required
                        error={!!errors.issueDate}
                        helperText={errors.issueDate?.message}
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

          {/* Section 2: Tender Details - Light Green */}
          <Card sx={{ mb: 3, backgroundColor: '#e8f5e9', border: '1px solid #81c784' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
                📋 Tender Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="tenderName"
                    control={control}
                    rules={{ required: 'Tender Name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Name"
                        fullWidth
                        required
                        error={!!errors.tenderName}
                        helperText={errors.tenderName?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="organisation"
                    control={control}
                    rules={{ required: 'Organisation is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Organisation"
                        fullWidth
                        required
                        error={!!errors.organisation}
                        helperText={errors.organisation?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="documentType"
                    control={control}
                    rules={{ required: 'Document Type is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Document Type"
                        fullWidth
                        required
                        error={!!errors.documentType}
                        helperText={errors.documentType?.message}
                        variant="outlined"
                        placeholder="e.g., RFP, RFQ, EOI"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="tenderType"
                    control={control}
                    rules={{ required: 'Tender Type is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Type"
                        fullWidth
                        required
                        error={!!errors.tenderType}
                        helperText={errors.tenderType?.message}
                        variant="outlined"
                        placeholder="e.g., Open, Limited"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 3: Financial Information - Light Yellow */}
          <Card sx={{ mb: 3, backgroundColor: '#fffde7', border: '1px solid #fff176' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#f57f17' }}>
                💰 Financial Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="emdCrore"
                    control={control}
                    rules={{ 
                      required: 'EMD in Crore is required',
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                        message: 'Please enter a valid number with max 2 decimals'
                      },
                      min: {
                        value: 0,
                        message: 'Value must be 0 or greater'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="EMD in Crore"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.emdCrore}
                        helperText={errors.emdCrore?.message || 'Earnest Money Deposit (2 decimals)'}
                        variant="outlined"
                        inputProps={{
                          step: '0.01',
                          min: '0'
                        }}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1, color: 'text.secondary' }}>Cr</Typography>
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="approxTenderValueCrore"
                    control={control}
                    rules={{ 
                      required: 'Approx Tender Value in Crore is required',
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                        message: 'Please enter a valid number with max 2 decimals'
                      },
                      min: {
                        value: 0.01,
                        message: 'Value must be greater than 0'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Approx Tender Value in Crore"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.approxTenderValueCrore}
                        helperText={errors.approxTenderValueCrore?.message || 'Approximate tender value (2 decimals)'}
                        variant="outlined"
                        inputProps={{
                          step: '0.01',
                          min: '0'
                        }}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1, color: 'text.secondary' }}>Cr</Typography>
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 4: Key Dates - Light Orange */}
          <Card sx={{ mb: 3, backgroundColor: '#fff3e0', border: '1px solid #ffb74d' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#e65100' }}>
                📅 Key Dates
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="lastDateSubmission"
                    control={control}
                    rules={{ required: 'Last Date of Submission is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Last Date of Submission"
                        type="date"
                        fullWidth
                        required
                        error={!!errors.lastDateSubmission}
                        helperText={errors.lastDateSubmission?.message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="preBidDate"
                    control={control}
                    rules={{ required: 'Pre-bid Date is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pre-bid Date"
                        type="date"
                        fullWidth
                        required
                        error={!!errors.preBidDate}
                        helperText={errors.preBidDate?.message}
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

          {/* Section 5: Team & Notes - Light Purple */}
          <Card sx={{ mb: 3, backgroundColor: '#f3e5f5', border: '1px solid #ce93d8' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#6a1b9a' }}>
                👥 Team &amp; Notes
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="teamAssigned"
                    control={control}
                    rules={{ required: 'Team Assigned is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Team Assigned"
                        fullWidth
                        required
                        error={!!errors.teamAssigned}
                        helperText={errors.teamAssigned?.message}
                        variant="outlined"
                        placeholder="e.g., Team Alpha, Sales Team 1"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
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
                        placeholder="Additional notes or comments"
                        helperText="Optional field for additional information"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="corrigendumInfo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Corrigendums - Date &amp; File (Optional)"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., Corr-1: 2025-01-15, File_v2.pdf"
                        helperText="Optional - List any corrigendums with dates"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: 200, px: 5, py: 1.5, fontWeight: 600, fontSize: '1rem' }}
            >
              Submit Lead
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              size="large"
              onClick={handleReset}
              sx={{ minWidth: 200, px: 5, py: 1.5, fontWeight: 500, fontSize: '1rem' }}
            >
              Reset Form
            </Button>
          </Box>
        </form>

        {/* Success Snackbar */}
        <Snackbar
          open={submitSuccess}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%', fontSize: '1rem' }}>
            ✅ Lead submitted successfully! Timestamp: {submittedData?.submittedAt && new Date(submittedData.submittedAt).toLocaleString()}
          </Alert>
        </Snackbar>

        {/* Submitted Data Display */}
        {submittedData && (
          <Box sx={{ mt: 5 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
              📊 Submitted Lead Data (JSON Format)
            </Typography>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                maxHeight: 600, 
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                borderRadius: 2,
                border: '2px solid #424242'
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </Paper>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                💡 Tip: Check the browser console for the full JSON output
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CRMLeadForm;