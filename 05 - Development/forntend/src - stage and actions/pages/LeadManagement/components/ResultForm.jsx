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

function ResultForm({ bidId, onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    lPosition: 'L1',
    ourBidPriceCr: '',
    l1BidderName: '',
    l1PriceCr: '',
    priceDiffCr: '',
    priceDiffPct: '',
    resultAnnouncedDate: '',
    negotiationDone: false,
    negotiationPriceCr: '',
    negotiationNotes: '',
    negotiationDate: '',
    finalOutcome: 'Pending',
    lossReasonCategory: '',
    lossReasonDetails: '',
    orderValueCr: '',
  });

  const [showNegotiation, setShowNegotiation] = useState(initialData?.negotiationDone || false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };

    // Auto-calculate price differences
    if (name === 'ourBidPriceCr' || name === 'l1PriceCr') {
      if (updated.ourBidPriceCr && updated.l1PriceCr) {
        const diff = parseFloat(updated.ourBidPriceCr) - parseFloat(updated.l1PriceCr);
        updated.priceDiffCr = diff.toFixed(2);
        updated.priceDiffPct = (
          (diff / parseFloat(updated.l1PriceCr)) * 100
        ).toFixed(2);
      }
    }

    // Handle negotiation visibility
    if (name === 'negotiationDone') {
      setShowNegotiation(checked);
    }

    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <DialogTitle>Tender Result</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Track tender result announcement, L-position, and final outcome
          </Alert>

          <Grid container spacing={2}>
            {/* Result Announcement */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Result Announcement
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Result Announced Date"
                name="resultAnnouncedDate"
                type="date"
                value={formData.resultAnnouncedDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Our L-Position</InputLabel>
                <Select
                  name="lPosition"
                  value={formData.lPosition}
                  onChange={handleChange}
                  label="Our L-Position"
                >
                  <MenuItem value="L1">L1 (Winner)</MenuItem>
                  <MenuItem value="L2">L2</MenuItem>
                  <MenuItem value="L3">L3</MenuItem>
                  <MenuItem value="L4">L4</MenuItem>
                  <MenuItem value="Not Listed">Not Listed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Pricing Comparison */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Pricing Comparison
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Our Bid Price (Cr)"
                name="ourBidPriceCr"
                type="number"
                value={formData.ourBidPriceCr}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="L1 Bidder Name"
                name="l1BidderName"
                value={formData.l1BidderName}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="L1 Price (Cr)"
                name="l1PriceCr"
                type="number"
                value={formData.l1PriceCr}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price Difference (Cr)"
                name="priceDiffCr"
                type="number"
                value={formData.priceDiffCr}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price Difference %"
                name="priceDiffPct"
                type="number"
                value={formData.priceDiffPct}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            {/* Negotiation */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Negotiation
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="negotiationDone"
                    checked={formData.negotiationDone}
                    onChange={handleChange}
                  />
                }
                label="Negotiation Done"
              />
            </Grid>

            {showNegotiation && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Negotiated Price (Cr)"
                    name="negotiationPriceCr"
                    type="number"
                    value={formData.negotiationPriceCr}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Negotiation Date"
                    name="negotiationDate"
                    type="date"
                    value={formData.negotiationDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Negotiation Notes"
                    name="negotiationNotes"
                    multiline
                    rows={2}
                    value={formData.negotiationNotes}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
              </>
            )}

            {/* Final Outcome */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Final Outcome
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Final Outcome</InputLabel>
                <Select
                  name="finalOutcome"
                  value={formData.finalOutcome}
                  onChange={handleChange}
                  label="Final Outcome"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Won">Won</MenuItem>
                  <MenuItem value="Lost-L2">Lost (L2)</MenuItem>
                  <MenuItem value="Lost-L3">Lost (L3)</MenuItem>
                  <MenuItem value="Lost-Technical">Lost (Technical Non-Compliance)</MenuItem>
                  <MenuItem value="Lost-Financial">Lost (Financial)</MenuItem>
                  <MenuItem value="Withdrawn">Withdrawn</MenuItem>
                  <MenuItem value="Cancelled-by-Customer">Cancelled by Customer</MenuItem>
                  <MenuItem value="Not-Participated">Not Participated</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* If Won - Order Value */}
            {formData.finalOutcome === 'Won' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Order Value (Cr)"
                  name="orderValueCr"
                  type="number"
                  value={formData.orderValueCr}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            )}

            {/* If Lost - Loss Reason */}
            {['Lost-L2', 'Lost-L3', 'Lost-Technical', 'Lost-Financial'].includes(formData.finalOutcome) && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Loss Reason Category</InputLabel>
                    <Select
                      name="lossReasonCategory"
                      value={formData.lossReasonCategory}
                      onChange={handleChange}
                      label="Loss Reason Category"
                    >
                      <MenuItem value="Price Too High">Price Too High</MenuItem>
                      <MenuItem value="Technical Non-Compliance">Technical Non-Compliance</MenuItem>
                      <MenuItem value="Insufficient Experience">Insufficient Experience</MenuItem>
                      <MenuItem value="Blacklisted">Blacklisted</MenuItem>
                      <MenuItem value="Consortium Issue">Consortium Issue</MenuItem>
                      <MenuItem value="Late Submission">Late Submission</MenuItem>
                      <MenuItem value="Strategic Decision">Strategic Decision</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Detailed Loss Reason"
                    name="lossReasonDetails"
                    multiline
                    rows={2}
                    value={formData.lossReasonDetails}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit Result
        </Button>
      </DialogActions>
    </>
  );
}

export default ResultForm;
