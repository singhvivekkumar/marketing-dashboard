import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';

function LeadForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    tenderName: '',
    tenderReferenceNo: '',
    tenderType: '',
    documentType: '',
    portalName: '',
    civilDefence: 'Civil',
    businessDomain: '',
    leadSubtype: 'Domestic',
    soleConsortium: 'Sole',
    estimatedValueCr: '',
    lastSubmissionDate: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tenderName) newErrors.tenderName = 'Tender name is required';
    if (!formData.tenderType) newErrors.tenderType = 'Tender type is required';
    if (!formData.documentType) newErrors.documentType = 'Document type is required';
    if (!formData.lastSubmissionDate) newErrors.lastSubmissionDate = 'Submission date is required';
    if (!formData.estimatedValueCr) newErrors.estimatedValueCr = 'Estimated value is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <DialogTitle>Create New Lead</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Tender Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tender Name"
                name="tenderName"
                value={formData.tenderName}
                onChange={handleChange}
                error={!!errors.tenderName}
                helperText={errors.tenderName}
              />
            </Grid>

            {/* Tender Reference No */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tender Reference No"
                name="tenderReferenceNo"
                value={formData.tenderReferenceNo}
                onChange={handleChange}
              />
            </Grid>

            {/* Tender Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.tenderType}>
                <InputLabel>Tender Type</InputLabel>
                <Select
                  name="tenderType"
                  value={formData.tenderType}
                  onChange={handleChange}
                  label="Tender Type"
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Limited">Limited</MenuItem>
                  <MenuItem value="Single Source">Single Source</MenuItem>
                  <MenuItem value="Nomination">Nomination</MenuItem>
                  <MenuItem value="Rate Contract">Rate Contract</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Document Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.documentType}>
                <InputLabel>Document Type</InputLabel>
                <Select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  label="Document Type"
                >
                  <MenuItem value="RFP">RFP</MenuItem>
                  <MenuItem value="RFQ">RFQ</MenuItem>
                  <MenuItem value="NIT">NIT</MenuItem>
                  <MenuItem value="EOI">EOI</MenuItem>
                  <MenuItem value="GeM Bid">GeM Bid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Portal Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Portal Name</InputLabel>
                <Select
                  name="portalName"
                  value={formData.portalName}
                  onChange={handleChange}
                  label="Portal Name"
                >
                  <MenuItem value="GeM">GeM</MenuItem>
                  <MenuItem value="CPPP">CPPP</MenuItem>
                  <MenuItem value="eProcurement">eProcurement</MenuItem>
                  <MenuItem value="Defence Portal">Defence Portal</MenuItem>
                  <MenuItem value="Direct">Direct</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Civil/Defence */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sector</InputLabel>
                <Select
                  name="civilDefence"
                  value={formData.civilDefence}
                  onChange={handleChange}
                  label="Sector"
                >
                  <MenuItem value="Civil">Civil</MenuItem>
                  <MenuItem value="Defence">Defence</MenuItem>
                  <MenuItem value="Both">Both</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Business Domain */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Domain"
                name="businessDomain"
                value={formData.businessDomain}
                onChange={handleChange}
              />
            </Grid>

            {/* Lead Subtype */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Lead Subtype</InputLabel>
                <Select
                  name="leadSubtype"
                  value={formData.leadSubtype}
                  onChange={handleChange}
                  label="Lead Subtype"
                >
                  <MenuItem value="Domestic">Domestic</MenuItem>
                  <MenuItem value="Export">Export</MenuItem>
                  <MenuItem value="CRM">CRM</MenuItem>
                  <MenuItem value="Government">Government</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Sole/Consortium */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Participation Type</InputLabel>
                <Select
                  name="soleConsortium"
                  value={formData.soleConsortium}
                  onChange={handleChange}
                  label="Participation Type"
                >
                  <MenuItem value="Sole">Sole</MenuItem>
                  <MenuItem value="Consortium">Consortium</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Estimated Value */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Value (Cr)"
                name="estimatedValueCr"
                type="number"
                value={formData.estimatedValueCr}
                onChange={handleChange}
                error={!!errors.estimatedValueCr}
                helperText={errors.estimatedValueCr}
              />
            </Grid>

            {/* Last Submission Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Submission Date"
                name="lastSubmissionDate"
                type="date"
                value={formData.lastSubmissionDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.lastSubmissionDate}
                helperText={errors.lastSubmissionDate}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Create Lead
        </Button>
      </DialogActions>
    </>
  );
}

export default LeadForm;
