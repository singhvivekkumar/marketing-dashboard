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

function CommercialBidForm({ bidId, onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    estimatedCostCr: '',
    bidPriceCr: '',
    bidPriceInclGstCr: '',
    gstPct: '18.00',
    bidMarginPct: '',
    submissionDate: '',
    submissionMode: 'Online',
    submissionReceiptNo: '',
    documentPath: '',
    emdAmount: '',
    emdPaidDate: '',
    emdPaymentMode: 'DD',
    emdReceiptNo: '',
    emdBank: '',
    pbgRequired: false,
    pbgAmount: '',
    pbgBank: '',
    pbgIssuedDate: '',
    pbgExpiryDate: '',
    financialOpeningDate: '',
    attendedFinancialOpening: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      // Auto-calculate margin and GST-included price
      if (name === 'bidPriceCr' || name === 'estimatedCostCr' || name === 'gstPct') {
        if (updated.estimatedCostCr && updated.bidPriceCr) {
          updated.bidMarginPct = (
            ((parseFloat(updated.bidPriceCr) - parseFloat(updated.estimatedCostCr)) / 
             parseFloat(updated.estimatedCostCr)) * 100
          ).toFixed(2);
        }
        if (updated.bidPriceCr && updated.gstPct) {
          updated.bidPriceInclGstCr = (
            parseFloat(updated.bidPriceCr) + 
            (parseFloat(updated.bidPriceCr) * parseFloat(updated.gstPct) / 100)
          ).toFixed(2);
        }
      }
      return updated;
    });
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
      <DialogTitle>Commercial Bid (Financial Bid)</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Financial proposal, EMD details, and pricing information
          </Alert>

          <Grid container spacing={2}>
            {/* Pricing */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Internal Cost & Pricing
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Cost (Cr)"
                name="estimatedCostCr"
                type="number"
                value={formData.estimatedCostCr}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bid Price (Cr) - Excl GST"
                name="bidPriceCr"
                type="number"
                value={formData.bidPriceCr}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GST %"
                name="gstPct"
                type="number"
                value={formData.gstPct}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bid Price Incl GST (Cr)"
                name="bidPriceInclGstCr"
                type="number"
                value={formData.bidPriceInclGstCr}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bid Margin %"
                name="bidMarginPct"
                type="number"
                value={formData.bidMarginPct}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            {/* EMD */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Earnest Money Deposit (EMD)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="EMD Amount (Cr)"
                name="emdAmount"
                type="number"
                value={formData.emdAmount}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="EMD Paid Date"
                name="emdPaidDate"
                type="date"
                value={formData.emdPaidDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>EMD Payment Mode</InputLabel>
                <Select
                  name="emdPaymentMode"
                  value={formData.emdPaymentMode}
                  onChange={handleChange}
                  label="EMD Payment Mode"
                >
                  <MenuItem value="DD">DD</MenuItem>
                  <MenuItem value="BG">BG</MenuItem>
                  <MenuItem value="Online/NEFT">Online/NEFT</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="EMD Receipt No"
                name="emdReceiptNo"
                value={formData.emdReceiptNo}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="EMD Bank"
                name="emdBank"
                value={formData.emdBank}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            {/* PBG */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Performance Bank Guarantee (PBG)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="pbgRequired"
                    checked={formData.pbgRequired}
                    onChange={handleChange}
                  />
                }
                label="PBG Required"
              />
            </Grid>

            {formData.pbgRequired && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PBG Amount (Cr)"
                    name="pbgAmount"
                    type="number"
                    value={formData.pbgAmount}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PBG Bank"
                    name="pbgBank"
                    value={formData.pbgBank}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PBG Issued Date"
                    name="pbgIssuedDate"
                    type="date"
                    value={formData.pbgIssuedDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PBG Expiry Date"
                    name="pbgExpiryDate"
                    type="date"
                    value={formData.pbgExpiryDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </>
            )}

            {/* Submission */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Commercial Bid Submission
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
                label="Commercial Bid Document"
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

            {/* Financial Opening */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Financial Opening
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Financial Opening Date"
                name="financialOpeningDate"
                type="date"
                value={formData.financialOpeningDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="attendedFinancialOpening"
                    checked={formData.attendedFinancialOpening}
                    onChange={handleChange}
                  />
                }
                label="Attended Opening"
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

export default CommercialBidForm;
