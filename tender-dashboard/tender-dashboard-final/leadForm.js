const {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Box,
  Snackbar,
  Alert,
  Tooltip
} = MaterialUI;
const { useForm, Controller } = ReactHookForm;

const STATUS_OPTIONS = [
  "Draft",
  "Submitted",
  "In Progress",
  "Under Review",
  "Won",
  "Lost",
  "On Hold"
];

// Section colors (Material UI color tokens)
const SECTION_COLORS = {
  tender: '#e3f2fd', // blue-50
  rfp: '#e8f5e9',   // green-50
  bid: '#fffde7',   // yellow-50
  approval: '#f3e5f5', // purple-50
  status: '#e8eaf6' // indigo-50
};

function formatEMD(value) {
  if (value === '' || value == null) return '';
  let val = value.toString();
  if (/\.$/.test(val)) return val; // Prevent stripping trailing decimal
  const num = parseFloat(val);
  if (Number.isNaN(num)) return '';
  return num.toFixed(2);
}

function getTodayISOString() {
  return new Date().toISOString().slice(0,10);
}

const fieldGrid = { xs: 12, sm: 6, md: 4 };

function SectionCard({color, title, children, description}) {
  return (
    <Card elevation={2} sx={{ mb: 4, backgroundColor: color, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#28427b', fontWeight: 600, mb: 1 }}>{title}</Typography>
        {description && <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>{description}</Typography>}
        <Divider sx={{ mb: 2 }}/>
        {children}
      </CardContent>
    </Card>
  );
}

function JSONDisplay({ data }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>📊 Submitted Data (JSON)</Typography>
      <Paper elevation={1} sx={{ p: 3, background: '#1e1e1e', color: '#d4d4d4', borderRadius: 2, fontFamily: 'monospace', fontSize: '1rem', maxHeight: 500, overflow: 'auto' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(data, null, 2)}</pre>
      </Paper>
    </Box>
  );
}

function SuccessSnackbar({ open, onClose }) {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
      <Alert onClose={onClose} severity="success" variant="filled" sx={{ width: '100%' }}>
        Form submitted successfully!
      </Alert>
    </Snackbar>
  );
}

function FormDescription() {
  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1FB8CD' }}>Lead Submitted Form</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>Track the full lifecycle of a tender lead. Please complete all required fields before submitting.</Typography>
    </Box>
  );
}

function App() {
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(null);
  
  const { 
    control, 
    handleSubmit, 
    reset, 
    watch, 
    setValue, 
    formState: { errors }
  } = useForm({
    defaultValues: {
      serialNumber: '',
      tenderName: '',
      customer: '',
      tenderDate: '',
      bidOwner: '',
      rfpReceivedOn: '',
      valueEMDCrore: '',
      rfpDueDate: '',
      dmktgInPrincipalApprovalRxdOn: '',
      sellingPriceApprovalInitiatedOn: '',
      bidSubmittedOn: '',
      approvalSBUFinanceOn: '',
      approvalGMOn: '',
      sentToFinanceGMDmktgApprovalRxdOn: '',
      dmktgApprovalRxdOn: '',
      tenderReferenceNo: '',
      tenderType: '',
      website: '',
      presentStatus: ''
    }
  });

  // EMD Auto-format
  const valueEMD = watch('valueEMDCrore');
  React.useEffect(() => {
    if(valueEMD !== '' && valueEMD != null) {
      const formatted = formatEMD(valueEMD);
      if(formatted !== valueEMD) setValue('valueEMDCrore', formatted);
    }
  }, [valueEMD]);

  const onSubmit = (data) => {
    // Format output JSON as per spec
    const output = {
      serialNumber: data.serialNumber,
      tenderName: data.tenderName,
      customer: data.customer,
      tenderDate: data.tenderDate,
      bidOwner: data.bidOwner,
      rfpReceivedOn: data.rfpReceivedOn,
      valueEMDCrore: Number(parseFloat(data.valueEMDCrore).toFixed(2)),
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
      submittedAt: new Date().toISOString()
    };
    setSubmitted(output);
    setSubmitSuccess(true);
    console.log('LeadSubmittedData:', JSON.stringify(output, null, 2));
  };

  const handleReset = () => {
    reset();
    setSubmitted(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <FormDescription />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* Tender Details */}
          <Grid item xs={12}>
            <SectionCard color={SECTION_COLORS.tender} title="Tender Details">
              <Grid container spacing={2}>
                <Grid item {...fieldGrid}>
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
                        helperText={errors.serialNumber?.message || 'e.g., LEAD-001'}
                        placeholder="LEAD-001"
                        autoComplete="off"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
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
                        autoComplete="off"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
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
                        autoComplete="off"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="tenderDate"
                    control={control}
                    rules={{ required: 'Tender Date is required' }}
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
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="tenderReferenceNo"
                    control={control}
                    rules={{ required: 'Tender Reference No is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Reference No"
                        required
                        fullWidth
                        error={!!errors.tenderReferenceNo}
                        helperText={errors.tenderReferenceNo?.message}
                        autoComplete="off"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="tenderType"
                    control={control}
                    rules={{ required: 'Tender Type is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Type"
                        required
                        fullWidth
                        error={!!errors.tenderType}
                        helperText={errors.tenderType?.message}
                        autoComplete="off"
                        variant="outlined"
                        placeholder="e.g., Open, Limited, Single Bid"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Website (optional)"
                        fullWidth
                        error={!!errors.website}
                        helperText={errors.website?.message || 'URL of tender site, if any'}
                        placeholder="https://..."
                        autoComplete="off"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* RFP Information */}
          <Grid item xs={12}>
            <SectionCard color={SECTION_COLORS.rfp} title="RFP Information">
              <Grid container spacing={2}>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="rfpReceivedOn"
                    control={control}
                    rules={{ required: 'RFP Received on is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="RFP Received On"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.rfpReceivedOn}
                        helperText={errors.rfpReceivedOn?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="rfpDueDate"
                    control={control}
                    rules={{ required: 'RFP Due Date is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="RFP Due Date"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.rfpDueDate}
                        helperText={errors.rfpDueDate?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* Bid Owner & EMD */}
          <Grid item xs={12}>
            <SectionCard color={SECTION_COLORS.bid} title="Bid Owner & EMD Value">
              <Grid container spacing={2}>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="bidOwner"
                    control={control}
                    rules={{ required: 'Bid Owner is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Bid Owner"
                        fullWidth
                        required
                        error={!!errors.bidOwner}
                        helperText={errors.bidOwner?.message}
                        autoComplete="off"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="valueEMDCrore"
                    control={control}
                    rules={{
                      required: 'Value of EMD in Crore is required',
                      min: { value: 0, message: 'EMD must be positive' },
                      validate: val => {
                        if (val === '' || val == null) return 'Enter a valid amount';
                        const fl = parseFloat(val);
                        if (isNaN(fl)) return 'Enter a valid number';
                        if (fl < 0) return 'Must be positive';
                        if (!/^\d+(\.\d{1,2})?$/.test(val+'')) return 'Max 2 decimals';
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Value of EMD (Crore)"
                        fullWidth
                        required
                        error={!!errors.valueEMDCrore}
                        helperText={errors.valueEMDCrore?.message || 'Enter up to 2 decimal places'}
                        InputProps={{ step: '0.01', min: '0', endAdornment: <Typography sx={{ ml: 1 }}>Cr</Typography> }}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* Approval Workflow */}
          <Grid item xs={12}>
            <SectionCard color={SECTION_COLORS.approval} title="Approval Workflow" description="Key milestone approval & submission dates">
              <Grid container spacing={2}>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="dmktgInPrincipalApprovalRxdOn"
                    control={control}
                    rules={{ required: 'Dmktg In-Principal Approval is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Dmktg In-Principal Approval Rxd On"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dmktgInPrincipalApprovalRxdOn}
                        helperText={errors.dmktgInPrincipalApprovalRxdOn?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="sellingPriceApprovalInitiatedOn"
                    control={control}
                    rules={{ required: 'Selling Price Approval Initiated is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Selling Price Approval Initiated On"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.sellingPriceApprovalInitiatedOn}
                        helperText={errors.sellingPriceApprovalInitiatedOn?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="bidSubmittedOn"
                    control={control}
                    rules={{ required: 'Bid Submitted On is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Bid Submitted On"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.bidSubmittedOn}
                        helperText={errors.bidSubmittedOn?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="approvalSBUFinanceOn"
                    control={control}
                    rules={{ required: 'Approval from SBU Finance is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Approval from SBU Finance On"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.approvalSBUFinanceOn}
                        helperText={errors.approvalSBUFinanceOn?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="approvalGMOn"
                    control={control}
                    rules={{ required: 'Approval from GM is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Approval from GM"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.approvalGMOn}
                        helperText={errors.approvalGMOn?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="sentToFinanceGMDmktgApprovalRxdOn"
                    control={control}
                    rules={{ required: 'Sent to Finance GM on Dmktg Approval Rxd On is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Sent to Finance GM on Dmktg Approval Rxd On"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.sentToFinanceGMDmktgApprovalRxdOn}
                        helperText={errors.sentToFinanceGMDmktgApprovalRxdOn?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item {...fieldGrid}>
                  <Controller
                    name="dmktgApprovalRxdOn"
                    control={control}
                    rules={{ required: 'Dmktg Approval Rxd On is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Dmktg Approval Rxd On"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dmktgApprovalRxdOn}
                        helperText={errors.dmktgApprovalRxdOn?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* Status & Tracking */}
          <Grid item xs={12}>
            <SectionCard color={SECTION_COLORS.status} title="Status & Tracking">
              <Grid container spacing={2}>
                <Grid item {...fieldGrid}>
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
                        helperText={errors.presentStatus?.message || 'Select current tracking status'}
                        variant="outlined"
                      >
                        {STATUS_OPTIONS.map(status => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', my: 3 }}>
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ px:4, py:1.25, fontWeight: 600 }}>
                Submit
              </Button>
              <Button type="button" onClick={handleReset} variant="outlined" color="secondary" size="large" sx={{ px:4, py:1.25, fontWeight: 500 }}>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <SuccessSnackbar open={submitSuccess} onClose={() => setSubmitSuccess(false)} />
      {submitted && <JSONDisplay data={submitted} />}
    </Container>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
