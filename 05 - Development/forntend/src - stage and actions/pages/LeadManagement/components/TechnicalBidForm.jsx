import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';

function TechnicalBidForm({ bidId, onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    submissionDate: '',
    submissionMode: 'Online',
    submissionReceiptNo: '',
    documentPath: '',
    techOpeningDate: '',
    attendedOpening: false,
    compliant: false,
    complianceScore: '',
    complianceRemarks: '',
    deviationsNoted: '',
    customerTechQueries: '',
    ourTechResponse: '',
    responseSubmittedDate: '',
    technicalEvalResult: 'Awaiting',
    evalResultDate: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (fieldName, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file.name,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <DialogTitle>Technical Bid Submission</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Document compliance, deviations, and evaluation tracking
          </Alert>

          <Grid container spacing={2}>
            {/* Submission Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Submission Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Submission Date"
                name="submissionDate"
                type="date"
                value={formData.submissionDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Submission Mode</InputLabel>
                <Select
                  name="submissionMode"
                  value={formData.submissionMode}
                  onChange={handleChange}
                  label="Submission Mode"
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Physical">Physical</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Submission Receipt No"
                name="submissionReceiptNo"
                value={formData.submissionReceiptNo}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Technical Bid Document"
                value={formData.documentPath}
                onClick={(e) => e.currentTarget.nextElementSibling.click()}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange('documentPath', e)}
                accept=".pdf"
              />
            </Grid>

            {/* Opening Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Technical Opening
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tech Opening Date"
                name="techOpeningDate"
                type="date"
                value={formData.techOpeningDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="attendedOpening"
                    checked={formData.attendedOpening}
                    onChange={handleChange}
                  />
                }
                label="Attended Opening"
              />
            </Grid>

            {/* Compliance */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Compliance Evaluation
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="compliant"
                    checked={formData.compliant}
                    onChange={handleChange}
                  />
                }
                label="Technically Compliant"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Compliance Score"
                name="complianceScore"
                type="number"
                value={formData.complianceScore}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Compliance Remarks"
                name="complianceRemarks"
                multiline
                rows={2}
                value={formData.complianceRemarks}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deviations Noted"
                name="deviationsNoted"
                multiline
                rows={2}
                value={formData.deviationsNoted}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            {/* Queries & Response */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Clarifications
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Technical Queries"
                name="customerTechQueries"
                multiline
                rows={2}
                value={formData.customerTechQueries}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Our Technical Response"
                name="ourTechResponse"
                multiline
                rows={2}
                value={formData.ourTechResponse}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Response Submitted Date"
                name="responseSubmittedDate"
                type="date"
                value={formData.responseSubmittedDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            {/* Final Result */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Evaluation Result
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Technical Eval Result</InputLabel>
                <Select
                  name="technicalEvalResult"
                  value={formData.technicalEvalResult}
                  onChange={handleChange}
                  label="Technical Eval Result"
                >
                  <MenuItem value="Awaiting">Awaiting</MenuItem>
                  <MenuItem value="Qualified">Qualified</MenuItem>
                  <MenuItem value="Conditionally Qualified">Conditionally Qualified</MenuItem>
                  <MenuItem value="Not Qualified">Not Qualified</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Evaluation Result Date"
                name="evalResultDate"
                type="date"
                value={formData.evalResultDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </>
  );
}

export default TechnicalBidForm;
