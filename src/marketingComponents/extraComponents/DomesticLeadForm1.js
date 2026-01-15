import React from 'react'

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
  CardContent
} from "@mui/material";

import {useForm, Controller} from 'react-hook-form';

const DomesticLeadForm = () => {
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState(null);

  const { 
    control, 
    handleSubmit, 
    reset, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      tenderName: '',
      customer: '',
      location: '',
      tenderType: '',
      documentType: '',
      leadOwner: '',
      civilDefence: '',
      businessDomain: '',
      valueEMDCrore: '',
      estimatedValueWithoutGSTCrore: '',
      submittedValueWithGSTCrore: '',
      tenderDated: '',
      lastDateSubmission: '',
      soleConsortium: '',
      preBidMeetingDateTime: '',
      competitorsInfo: '',
      participationStatus: '',
      openClosed: '',
      orderWonValueWithoutGSTCrore: '',
      presentStatus: '',
      reasonNote: '',
      corrigendumInfo: ''
    }
  });

  const civilDefenceOptions = ['Civil', 'Defence'];
  const soleConsortiumOptions = ['Sole', 'Consortium'];
  const participationStatusOptions = ['Won', 'Lost', 'Participated', 'Not-Participated'];
  const openClosedOptions = ['Open', 'Closed'];
  const presentStatusOptions = ['Draft', 'Submitted', 'In Progress', 'Under Review', 'Won', 'Lost', 'On Hold'];

  const onSubmit = (data) => {
    // Format data with proper number conversions and timestamp
    const formattedData = {
      serialNumber: data.serialNumber,
      tenderName: data.tenderName,
      customer: data.customer,
      location: data.location,
      tenderType: data.tenderType,
      documentType: data.documentType,
      leadOwner: data.leadOwner,
      civilDefence: data.civilDefence,
      businessDomain: data.businessDomain,
      valueEMDCrore: parseFloat(parseFloat(data.valueEMDCrore).toFixed(2)),
      estimatedValueWithoutGSTCrore: parseFloat(parseFloat(data.estimatedValueWithoutGSTCrore).toFixed(2)),
      submittedValueWithGSTCrore: parseFloat(parseFloat(data.submittedValueWithGSTCrore).toFixed(2)),
      tenderDated: data.tenderDated,
      lastDateSubmission: data.lastDateSubmission,
      soleConsortium: data.soleConsortium,
      preBidMeetingDateTime: data.preBidMeetingDateTime,
      competitorsInfo: data.competitorsInfo,
      participationStatus: data.participationStatus,
      openClosed: data.openClosed,
      orderWonValueWithoutGSTCrore: data.orderWonValueWithoutGSTCrore ? parseFloat(parseFloat(data.orderWonValueWithoutGSTCrore).toFixed(2)) : null,
      presentStatus: data.presentStatus,
      reasonNote: data.reasonNote,
      corrigendumInfo: data.corrigendumInfo,
      submittedAt: new Date().toISOString()
    };

    console.log('Domestic Leads V2 Data:', JSON.stringify(formattedData, null, 2));
    setSubmittedData(formattedData);
    setSubmitSuccess(true);
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
            Domestic Leads V2 Form
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete tender lifecycle tracking with participation outcomes - Desktop optimized
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Section 1: Tender Details - Blue */}
          <Card sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#1565c0' }}>
                📋 Tender Details
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
                        helperText={errors.serialNumber?.message || 'e.g., DL-V2-001'}
                        variant="outlined"
                        placeholder="DL-V2-001"
                      />
                    )}
                  />
                </Grid>

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
                    name="customer"
                    control={control}
                    rules={{ required: 'Customer is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Customer"
                        fullWidth
                        required
                        error={!!errors.customer}
                        helperText={errors.customer?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="location"
                    control={control}
                    rules={{ required: 'Location is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Location"
                        fullWidth
                        required
                        error={!!errors.location}
                        helperText={errors.location?.message}
                        variant="outlined"
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
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 2: Ownership & Classification - Green */}
          <Card sx={{ mb: 3, backgroundColor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
                👤 Ownership &amp; Classification
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="leadOwner"
                    control={control}
                    rules={{ required: 'Lead Owner is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Lead Owner"
                        fullWidth
                        required
                        error={!!errors.leadOwner}
                        helperText={errors.leadOwner?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="civilDefence"
                    control={control}
                    rules={{ required: 'Civil/Defence is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Civil/Defence"
                        fullWidth
                        required
                        error={!!errors.civilDefence}
                        helperText={errors.civilDefence?.message}
                        variant="outlined"
                      >
                        {civilDefenceOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="businessDomain"
                    control={control}
                    rules={{ required: 'Business Domain is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Business Domain"
                        fullWidth
                        required
                        error={!!errors.businessDomain}
                        helperText={errors.businessDomain?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 3: Financial Information - Yellow */}
          <Card sx={{ mb: 3, backgroundColor: '#fffde7' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#f57f17' }}>
                💰 Financial Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="valueEMDCrore"
                    control={control}
                    rules={{ 
                      required: 'Value of EMD is required',
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
                        label="Value of EMD"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.valueEMDCrore}
                        helperText={errors.valueEMDCrore?.message || 'In Crore (2 decimals)'}
                        variant="outlined"
                        inputProps={{
                          step: '0.01',
                          min: '0'
                        }}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1 }}>Cr</Typography>
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="estimatedValueWithoutGSTCrore"
                    control={control}
                    rules={{ 
                      required: 'Estimated Value without GST is required',
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
                        label="Estimated Value (without GST)"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.estimatedValueWithoutGSTCrore}
                        helperText={errors.estimatedValueWithoutGSTCrore?.message || 'In Crore (2 decimals)'}
                        variant="outlined"
                        inputProps={{
                          step: '0.01',
                          min: '0'
                        }}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1 }}>Cr</Typography>
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="submittedValueWithGSTCrore"
                    control={control}
                    rules={{ 
                      required: 'Submitted Value with GST is required',
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
                        label="Submitted Value (with GST)"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.submittedValueWithGSTCrore}
                        helperText={errors.submittedValueWithGSTCrore?.message || 'In Crore (2 decimals)'}
                        variant="outlined"
                        inputProps={{
                          step: '0.01',
                          min: '0'
                        }}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1 }}>Cr</Typography>
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="orderWonValueWithoutGSTCrore"
                    control={control}
                    rules={{ 
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
                        label="Order Won Value (without GST)"
                        type="number"
                        fullWidth
                        error={!!errors.orderWonValueWithoutGSTCrore}
                        helperText={errors.orderWonValueWithoutGSTCrore?.message || 'Optional - In Crore (2 decimals)'}
                        variant="outlined"
                        inputProps={{
                          step: '0.01',
                          min: '0'
                        }}
                        InputProps={{
                          endAdornment: <Typography sx={{ ml: 1 }}>Cr</Typography>
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 4: Submission & Dates - Orange */}
          <Card sx={{ mb: 3, backgroundColor: '#fff3e0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#e65100' }}>
                📅 Submission &amp; Dates
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="tenderDated"
                    control={control}
                    rules={{ required: 'Tender Dated is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Dated"
                        type="date"
                        fullWidth
                        required
                        error={!!errors.tenderDated}
                        helperText={errors.tenderDated?.message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
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

                <Grid item xs={12} md={4}>
                  <Controller
                    name="preBidMeetingDateTime"
                    control={control}
                    rules={{ required: 'Pre-bid Meeting Date & Time is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pre-bid Meeting Date & Time"
                        type="datetime-local"
                        fullWidth
                        required
                        error={!!errors.preBidMeetingDateTime}
                        helperText={errors.preBidMeetingDateTime?.message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="soleConsortium"
                    control={control}
                    rules={{ required: 'Sole/Consortium is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Sole/Consortium"
                        fullWidth
                        required
                        error={!!errors.soleConsortium}
                        helperText={errors.soleConsortium?.message}
                        variant="outlined"
                      >
                        {soleConsortiumOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 5: Competition & Participation - Purple */}
          <Card sx={{ mb: 3, backgroundColor: '#f3e5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#6a1b9a' }}>
                🏆 Competition &amp; Participation
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="competitorsInfo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Competitors Info"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter competitor names and information (optional)"
                        helperText="Optional - List competing companies"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="participationStatus"
                    control={control}
                    rules={{ required: 'Participation Status is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Won/Lost/Participated/Not-Participated"
                        fullWidth
                        required
                        error={!!errors.participationStatus}
                        helperText={errors.participationStatus?.message}
                        variant="outlined"
                      >
                        {participationStatusOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="openClosed"
                    control={control}
                    rules={{ required: 'Open/Closed is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Open/Closed"
                        fullWidth
                        required
                        error={!!errors.openClosed}
                        helperText={errors.openClosed?.message}
                        variant="outlined"
                      >
                        {openClosedOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 6: Outcomes & Status - Indigo */}
          <Card sx={{ mb: 3, backgroundColor: '#e8eaf6' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#283593' }}>
                📊 Outcomes &amp; Status
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="presentStatus"
                    control={control}
                    rules={{ required: 'Present Status is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Present Status"
                        fullWidth
                        required
                        error={!!errors.presentStatus}
                        helperText={errors.presentStatus?.message}
                        variant="outlined"
                      >
                        {presentStatusOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <Controller
                    name="reasonNote"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Reason for losing/Participated/Not-participating"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        placeholder="Optional - Provide detailed reason for outcome"
                        helperText="Optional - Explain the reason for the outcome"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="corrigendumInfo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Corrigendums - Date & File"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        placeholder="Optional - Enter corrigendum date and file details"
                        helperText="Optional - List any corrigendums with dates and file references"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: 180, px: 4, py: 1.5, fontWeight: 600 }}
            >
              Submit Lead
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              size="large"
              onClick={handleReset}
              sx={{ minWidth: 180, px: 4, py: 1.5, fontWeight: 500 }}
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
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Form submitted successfully! Submission timestamp: {submittedData?.submittedAt && new Date(submittedData.submittedAt).toLocaleString()}
          </Alert>
        </Snackbar>

        {/* Submitted Data Display */}
        {submittedData && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              📊 Submitted Data (JSON Format)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                maxHeight: 600, 
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                borderRadius: 2
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DomesticLeadForm;