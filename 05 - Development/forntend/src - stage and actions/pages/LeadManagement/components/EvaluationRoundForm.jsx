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
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';

function EvaluationRoundForm({ bidId, onSubmit, onCancel, initialData, roundNumber }) {
  const [formData, setFormData] = useState(initialData || {
    roundNumber: roundNumber || 1,
    roundType: 'Technical Clarification',
    evalDate: '',
    customerQueries: '',
    queryDocumentPath: '',
    ourResponse: '',
    responseSubmittedDate: '',
    responseDocumentPath: '',
    clarificationPoints: '',
    status: 'Pending',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
      <DialogTitle>Evaluation Round {roundNumber || 1}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Track customer queries, clarifications, and responses during evaluation
          </Alert>

          <Grid container spacing={2}>
            {/* Round Type */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Round Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Round Type</InputLabel>
                <Select
                  name="roundType"
                  value={formData.roundType}
                  onChange={handleChange}
                  label="Round Type"
                >
                  <MenuItem value="Technical Clarification">Technical Clarification</MenuItem>
                  <MenuItem value="Financial Clarification">Financial Clarification</MenuItem>
                  <MenuItem value="Technical + Financial">Technical + Financial</MenuItem>
                  <MenuItem value="Reverse Auction">Reverse Auction</MenuItem>
                  <MenuItem value="Negotiation">Negotiation</MenuItem>
                  <MenuItem value="Presentation / Demo">Presentation / Demo</MenuItem>
                  <MenuItem value="Site Visit">Site Visit</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Round Date"
                name="evalDate"
                type="date"
                value={formData.evalDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            {/* Customer Queries */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Customer Queries
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="What did the customer ask?"
                name="customerQueries"
                multiline
                rows={3}
                value={formData.customerQueries}
                onChange={handleChange}
                placeholder="Describe the queries raised by customer..."
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Query Document/Letter"
                value={formData.queryDocumentPath}
                onClick={(e) => e.currentTarget.nextElementSibling.click()}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange('queryDocumentPath', e)}
                accept=".pdf"
              />
            </Grid>

            {/* Our Response */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Our Response
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Our Response"
                name="ourResponse"
                multiline
                rows={3}
                value={formData.ourResponse}
                onChange={handleChange}
                placeholder="Describe our response to customer queries..."
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Response Document"
                value={formData.responseDocumentPath}
                onClick={(e) => e.currentTarget.nextElementSibling.click()}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange('responseDocumentPath', e)}
                accept=".pdf"
              />
            </Grid>

            {/* Additional Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Clarification Points / Internal Notes"
                name="clarificationPoints"
                multiline
                rows={2}
                value={formData.clarificationPoints}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Response Submitted">Response Submitted</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Pending Follow-Up">Pending Follow-Up</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit Round
        </Button>
      </DialogActions>
    </>
  );
}

export default EvaluationRoundForm;
