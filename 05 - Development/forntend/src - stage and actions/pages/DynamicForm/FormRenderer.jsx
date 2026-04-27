// src/components/FormRenderer/FormRenderer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Paper, Typography, TextField, Button, CircularProgress,
  Select, MenuItem, FormControl, InputLabel, FormHelperText,
  RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup,
  Alert, Stack, Chip, Divider, LinearProgress,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Send } from '@mui/icons-material';
import axios from 'axios';

// ── Field Renderer ─────────────────────────────────────────────────────────────
const FieldRenderer = ({ field, value, error, onChange }) => {
  const commonProps = {
    fullWidth: true,
    label: field.label,
    placeholder: field.placeholder || '',
    helperText: error || field.helpText,
    error: !!error,
    required: field.required,
  };

  switch (field.type) {
    case 'textarea':
      return (
        <TextField
          {...commonProps}
          multiline rows={4}
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
        />
      );

    case 'number':
      return (
        <TextField
          {...commonProps}
          type="number"
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
          inputProps={{
            min: field.validation?.min || undefined,
            max: field.validation?.max || undefined,
          }}
        />
      );

    case 'email':
      return (
        <TextField
          {...commonProps}
          type="email"
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
        />
      );

    case 'phone':
      return (
        <TextField
          {...commonProps}
          type="tel"
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
          inputProps={{ maxLength: 15 }}
        />
      );

    case 'date':
      return (
        <TextField
          {...commonProps}
          type="date"
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      );

    case 'select':
      return (
        <FormControl fullWidth required={field.required} error={!!error}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || ''}
            label={field.label}
            onChange={e => onChange(field.name, e.target.value)}
          >
            <MenuItem value=""><em>Select...</em></MenuItem>
            {(field.options || []).map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
          {(error || field.helpText) && (
            <FormHelperText>{error || field.helpText}</FormHelperText>
          )}
        </FormControl>
      );

    case 'radio':
      return (
        <FormControl required={field.required} error={!!error} component="fieldset" fullWidth>
          <Typography variant="body2" color={error ? 'error' : 'text.secondary'} sx={{ mb: 1 }}>
            {field.label}{field.required && ' *'}
          </Typography>
          <RadioGroup value={value || ''} onChange={e => onChange(field.name, e.target.value)}>
            {(field.options || []).map(opt => (
              <FormControlLabel key={opt.value} value={opt.value} control={<Radio size="small" />} label={opt.label} />
            ))}
          </RadioGroup>
          {(error || field.helpText) && (
            <FormHelperText>{error || field.helpText}</FormHelperText>
          )}
        </FormControl>
      );

    case 'checkbox':
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <FormControl required={field.required} error={!!error} component="fieldset" fullWidth>
          <Typography variant="body2" color={error ? 'error' : 'text.secondary'} sx={{ mb: 1 }}>
            {field.label}{field.required && ' *'}
          </Typography>
          <FormGroup>
            {(field.options || []).map(opt => (
              <FormControlLabel
                key={opt.value}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedValues.includes(opt.value)}
                    onChange={e => {
                      const updated = e.target.checked
                        ? [...selectedValues, opt.value]
                        : selectedValues.filter(v => v !== opt.value);
                      onChange(field.name, updated);
                    }}
                  />
                }
                label={opt.label}
              />
            ))}
          </FormGroup>
          {(error || field.helpText) && (
            <FormHelperText>{error || field.helpText}</FormHelperText>
          )}
        </FormControl>
      );

    case 'file':
      return (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {field.label}{field.required && ' *'}
          </Typography>
          <Button variant="outlined" component="label" fullWidth>
            Choose File
            <input
              type="file" hidden
              onChange={e => onChange(field.name, e.target.files[0]?.name || '')}
            />
          </Button>
          {value && <Typography variant="caption" color="success.main">Selected: {value}</Typography>}
          {(error || field.helpText) && (
            <FormHelperText error={!!error}>{error || field.helpText}</FormHelperText>
          )}
        </Box>
      );

    default:
      return (
        <TextField
          {...commonProps}
          value={value || ''}
          onChange={e => onChange(field.name, e.target.value)}
          inputProps={{
            maxLength: field.validation?.maxLength || undefined,
          }}
        />
      );
  }
};

// ── Client-side Validation ─────────────────────────────────────────────────────
const validateField = (field, value) => {
  const isEmpty = value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty) return `${field.label} is required.`;
  if (isEmpty) return null;

  const v = field.validation || {};
  if (['text', 'textarea', 'email', 'phone'].includes(field.type)) {
    const str = String(value);
    if (v.minLength && str.length < Number(v.minLength))
      return `Must be at least ${v.minLength} characters.`;
    if (v.maxLength && str.length > Number(v.maxLength))
      return `Must be at most ${v.maxLength} characters.`;
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str))
      return 'Enter a valid email address.';
    if (field.type === 'phone' && !/^[0-9+\-\s()]{7,15}$/.test(str))
      return 'Enter a valid phone number.';
  }
  if (field.type === 'number') {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a valid number.';
    if (v.min !== '' && v.min !== null && num < Number(v.min)) return `Must be at least ${v.min}.`;
    if (v.max !== '' && v.max !== null && num > Number(v.max)) return `Must be at most ${v.max}.`;
  }
  return null;
};

// ── Form Renderer ─────────────────────────────────────────────────────────────
const FormRenderer = ({ formId, formData: propFormData = null }) => {
  const [formData, setFormData] = useState(propFormData); // full form object with schema
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!propFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [completionPct, setCompletionPct] = useState(0);

  // Fetch form schema if not provided
  useEffect(() => {
    if (propFormData || !formId) return;
    const fetchForm = async () => {
      try {
        const res = await axios.get(`/api/forms/${formId}/schema`);
        setFormData(res.data.data);
      } catch (err) {
        setSubmitError(err.response?.data?.message || 'Failed to load form.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId, propFormData]);

  // Track completion progress
  useEffect(() => {
    if (!formData) return;
    const fields = formData.schema?.fields || [];
    const required = fields.filter(f => f.required);
    if (!required.length) { setCompletionPct(100); return; }
    const filled = required.filter(f => {
      const v = values[f.name];
      return v !== undefined && v !== null && v !== '' &&
        !(Array.isArray(v) && v.length === 0);
    });
    setCompletionPct(Math.round((filled.length / required.length) * 100));
  }, [values, formData]);

  const handleChange = useCallback((name, value) => {
    setValues(v => ({ ...v, [name]: value }));
    setErrors(e => ({ ...e, [name]: null })); // clear error on change
  }, []);

  const handleSubmit = async () => {
    const fields = formData?.schema?.fields || [];
    const newErrors = {};
    fields.forEach(field => {
      const err = validateField(field, values[field.name]);
      if (err) newErrors[field.name] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstError = document.querySelector('[data-field-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await axios.post(`/api/forms/${formData.id}/submit`, { data: values });
      setSubmitted(true);
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        setSubmitError(err.response?.data?.message || 'Submission failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── States ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!formData && submitError) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
        <Typography color="error">{submitError}</Typography>
      </Paper>
    );
  }

  if (submitted) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 500, mx: 'auto' }}>
        <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>Thank You!</Typography>
        <Typography color="text.secondary">
          {formData?.schema?.settings?.successMessage || 'Your response has been submitted successfully.'}
        </Typography>
        <Button sx={{ mt: 3 }} variant="outlined"
          onClick={() => { setSubmitted(false); setValues({}); setErrors({}); }}>
          Submit Another Response
        </Button>
      </Paper>
    );
  }

  if (!formData) return null;

  const fields = formData.schema?.fields || [];
  const settings = formData.schema?.settings || {};

  return (
    <Paper sx={{ maxWidth: 800, mx: 'auto', overflow: 'hidden' }}>
      {/* Form Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h5" fontWeight={700}>{formData.name}</Typography>
            {formData.description && (
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>{formData.description}</Typography>
            )}
          </Box>
          <Chip label={formData.type} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
        </Stack>
        {/* Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Form Completion</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>{completionPct}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={completionPct}
            sx={{ bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
          />
        </Box>
      </Box>

      {/* Fields */}
      <Box sx={{ p: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
        )}

        <Grid container spacing={2}>
          {fields.sort((a, b) => a.order - b.order).map(field => (
            <Grid
              item
              xs={12}
              sm={field.width === 'half' ? 6 : 12}
              key={field.id}
              data-field-error={!!errors[field.name] || undefined}
            >
              <FieldRenderer
                field={field}
                value={values[field.name]}
                error={errors[field.name]}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Typography variant="caption" color="text.secondary">
            Fields marked * are required
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <Send />}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : settings.submitLabel || 'Submit'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default FormRenderer;
