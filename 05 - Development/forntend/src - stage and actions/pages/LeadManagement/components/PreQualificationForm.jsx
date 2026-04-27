import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function PreQualificationForm({ bidId, onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    turnoverMet: false,
    turnoverEvidenceDoc: '',
    experienceMet: false,
    experienceEvidenceDoc: '',
    msmeStatus: '',
    msmeStatus: '',
    msmeStatus: '',
    startupStatus: false,
    manpowerCriteriaMet: false,
    technicalCriteriaPlain: '',
    submittedOn: '',
    documentPath: '',
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
      <DialogTitle>Pre-Qualification</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Track eligibility criteria compliance and document submission
          </Alert>

          <Grid container spacing={2}>
            {/* Turnover */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Turnover Requirements
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="turnoverMet"
                    checked={formData.turnoverMet}
                    onChange={handleChange}
                  />
                }
                label="Turnover Criteria Met"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Turnover Evidence (File)"
                value={formData.turnoverEvidenceDoc}
                onClick={(e) => e.currentTarget.nextElementSibling.click()}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange('turnoverEvidenceDoc', e)}
                accept=".pdf,.doc,.docx"
              />
            </Grid>

            {/* Experience */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Experience Requirements
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="experienceMet"
                    checked={formData.experienceMet}
                    onChange={handleChange}
                  />
                }
                label="Experience Criteria Met"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience Evidence (File)"
                value={formData.experienceEvidenceDoc}
                onClick={(e) => e.currentTarget.nextElementSibling.click()}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange('experienceEvidenceDoc', e)}
                accept=".pdf,.doc,.docx"
              />
            </Grid>

            {/* MSME Status */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Eligible Categories
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>MSME Status</InputLabel>
                <Select
                  name="msmeStatus"
                  value={formData.msmeStatus}
                  onChange={handleChange}
                  label="MSME Status"
                >
                  <MenuItem value="">Not Applicable</MenuItem>
                  <MenuItem value="Micro">Micro</MenuItem>
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="startupStatus"
                    checked={formData.startupStatus}
                    onChange={handleChange}
                  />
                }
                label="Startup"
              />
            </Grid>

            {/* Other Criteria */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="manpowerCriteriaMet"
                    checked={formData.manpowerCriteriaMet}
                    onChange={handleChange}
                  />
                }
                label="Manpower Criteria Met"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Technical Criteria Notes"
                name="technicalCriteriaPlain"
                multiline
                rows={3}
                value={formData.technicalCriteriaPlain}
                onChange={handleChange}
                size="small"
              />
            </Grid>

            {/* Submission Date */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Submission Date"
                name="submittedOn"
                type="date"
                value={formData.submittedOn}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            {/* Document */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="PQ Submission Package (File)"
                value={formData.documentPath}
                onClick={(e) => e.currentTarget.nextElementSibling.click()}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <input
                type="file"
                hidden
                onChange={(e) => handleFileChange('documentPath', e)}
                accept=".pdf,.zip"
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

export default PreQualificationForm;
