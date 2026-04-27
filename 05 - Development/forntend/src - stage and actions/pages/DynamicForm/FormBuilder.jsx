// src/components/FormBuilder/FormBuilder.jsx
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box, Grid, Paper, Typography, TextField, Button, IconButton,
  Select, MenuItem, FormControl, InputLabel, Chip, Divider,
  Switch, FormControlLabel, Tooltip, Alert, Snackbar,
  Accordion, AccordionSummary, AccordionDetails, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tab, Tabs, Badge,
} from '@mui/material';
import {
  Add, Delete, DragIndicator, ContentCopy, ExpandMore,
  Visibility, Save, ArrowUpward, ArrowDownward, Settings,
  TextFields, Numbers, Email, Phone, CalendarToday,
  List, RadioButtonChecked, CheckBox, AttachFile, Notes,
} from '@mui/icons-material';
import axios from 'axios';

// ── Constants ─────────────────────────────────────────────────────────────────
const FIELD_TYPES = [
  { value: 'text',     label: 'Text',      icon: <TextFields fontSize="small" /> },
  { value: 'textarea', label: 'Textarea',  icon: <Notes fontSize="small" /> },
  { value: 'number',   label: 'Number',    icon: <Numbers fontSize="small" /> },
  { value: 'email',    label: 'Email',     icon: <Email fontSize="small" /> },
  { value: 'phone',    label: 'Phone',     icon: <Phone fontSize="small" /> },
  { value: 'date',     label: 'Date',      icon: <CalendarToday fontSize="small" /> },
  { value: 'select',   label: 'Dropdown',  icon: <List fontSize="small" /> },
  { value: 'radio',    label: 'Radio',     icon: <RadioButtonChecked fontSize="small" /> },
  { value: 'checkbox', label: 'Checkbox',  icon: <CheckBox fontSize="small" /> },
  { value: 'file',     label: 'File Upload', icon: <AttachFile fontSize="small" /> },
];

const FORM_TYPES = [
  'Enquiry', 'Feedback', 'Complaint', 'Registration', 'Survey',
  'Vendor Registration', 'Quote Request', 'Lead Capture', 'Support Request',
];

const createField = () => ({
  id: uuidv4(),
  name: '',
  label: '',
  type: 'text',
  placeholder: '',
  helpText: '',
  required: false,
  width: 'full',
  order: 0,
  validation: { minLength: '', maxLength: '', min: '', max: '', pattern: '' },
  options: [],
});

// ── Field Type Icon ───────────────────────────────────────────────────────────
const FieldTypeIcon = ({ type }) => {
  const t = FIELD_TYPES.find(f => f.value === type);
  return t ? t.icon : <TextFields fontSize="small" />;
};

// ── Field Options Editor (for select/radio/checkbox) ──────────────────────────
const OptionsEditor = ({ options, onChange }) => {
  const addOption = () => onChange([...options, { label: '', value: '' }]);
  const updateOption = (i, key, val) => {
    const updated = options.map((o, idx) => idx === i ? { ...o, [key]: val } : o);
    onChange(updated);
  };
  const removeOption = (i) => onChange(options.filter((_, idx) => idx !== i));

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Options
      </Typography>
      <Stack spacing={1}>
        {options.map((opt, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <TextField
              size="small" label="Label" value={opt.label} fullWidth
              onChange={e => updateOption(i, 'label', e.target.value)}
            />
            <TextField
              size="small" label="Value" value={opt.value} fullWidth
              onChange={e => updateOption(i, 'value', e.target.value)}
            />
            <IconButton size="small" color="error" onClick={() => removeOption(i)}>
              <Delete fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Button size="small" startIcon={<Add />} onClick={addOption} variant="outlined">
          Add Option
        </Button>
      </Stack>
    </Box>
  );
};

// ── Single Field Editor Card ───────────────────────────────────────────────────
const FieldCard = ({ field, index, total, onUpdate, onDelete, onMove, onDuplicate }) => {
  const hasOptions = ['select', 'radio', 'checkbox'].includes(field.type);
  const hasValidation = ['text', 'textarea', 'number', 'email', 'phone'].includes(field.type);

  const update = (key, val) => onUpdate({ ...field, [key]: val });
  const updateValidation = (key, val) => onUpdate({ ...field, validation: { ...field.validation, [key]: val } });

  // Auto-generate field name from label
  const handleLabelChange = (val) => {
    const name = val.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    onUpdate({ ...field, label: val, name: field.name || name });
  };

  return (
    <Accordion defaultExpanded={!field.label} sx={{ mb: 1, border: '1px solid', borderColor: 'divider' }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%', pr: 1 }}>
          <DragIndicator sx={{ color: 'text.disabled', cursor: 'grab' }} />
          <FieldTypeIcon type={field.type} />
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            {field.label || <em style={{ color: '#aaa' }}>Unnamed Field</em>}
          </Typography>
          <Chip label={field.type} size="small" variant="outlined" sx={{ mr: 1 }} />
          {field.required && <Chip label="Required" size="small" color="error" variant="outlined" sx={{ mr: 1 }} />}
          <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
            <Tooltip title="Move Up">
              <span><IconButton size="small" disabled={index === 0} onClick={() => onMove(index, -1)}><ArrowUpward fontSize="small" /></IconButton></span>
            </Tooltip>
            <Tooltip title="Move Down">
              <span><IconButton size="small" disabled={index === total - 1} onClick={() => onMove(index, 1)}><ArrowDownward fontSize="small" /></IconButton></span>
            </Tooltip>
            <Tooltip title="Duplicate">
              <IconButton size="small" onClick={() => onDuplicate(index)}><ContentCopy fontSize="small" /></IconButton>
            </Tooltip>
            <Tooltip title="Delete Field">
              <IconButton size="small" color="error" onClick={() => onDelete(field.id)}><Delete fontSize="small" /></IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Label */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Field Label *" value={field.label}
              onChange={e => handleLabelChange(e.target.value)} />
          </Grid>
          {/* Field Name (key) */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Field Name (key) *" value={field.name}
              onChange={e => update('name', e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''))}
              helperText="Used as JSON key in submitted data" />
          </Grid>
          {/* Type */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Field Type</InputLabel>
              <Select value={field.type} label="Field Type" onChange={e => update('type', e.target.value)}>
                {FIELD_TYPES.map(t => (
                  <MenuItem key={t.value} value={t.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {t.icon} <span>{t.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Width */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Width</InputLabel>
              <Select value={field.width} label="Width" onChange={e => update('width', e.target.value)}>
                <MenuItem value="full">Full Width</MenuItem>
                <MenuItem value="half">Half Width</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Required */}
          <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={<Switch checked={field.required} onChange={e => update('required', e.target.checked)} />}
              label="Required"
            />
          </Grid>
          {/* Placeholder */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Placeholder" value={field.placeholder}
              onChange={e => update('placeholder', e.target.value)} />
          </Grid>
          {/* Help Text */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Help Text" value={field.helpText}
              onChange={e => update('helpText', e.target.value)} />
          </Grid>

          {/* Validation Section */}
          {hasValidation && (
            <>
              <Grid item xs={12}>
                <Divider><Chip label="Validation" size="small" icon={<Settings />} /></Divider>
              </Grid>
              {['text', 'textarea', 'email', 'phone'].includes(field.type) && (
                <>
                  <Grid item xs={6} sm={3}>
                    <TextField fullWidth size="small" type="number" label="Min Length"
                      value={field.validation.minLength}
                      onChange={e => updateValidation('minLength', e.target.value)} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField fullWidth size="small" type="number" label="Max Length"
                      value={field.validation.maxLength}
                      onChange={e => updateValidation('maxLength', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Regex Pattern (optional)"
                      value={field.validation.pattern}
                      onChange={e => updateValidation('pattern', e.target.value)}
                      helperText="e.g. ^[A-Z] for uppercase start" />
                  </Grid>
                </>
              )}
              {field.type === 'number' && (
                <>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" type="number" label="Min Value"
                      value={field.validation.min}
                      onChange={e => updateValidation('min', e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" type="number" label="Max Value"
                      value={field.validation.max}
                      onChange={e => updateValidation('max', e.target.value)} />
                  </Grid>
                </>
              )}
            </>
          )}

          {/* Options for select/radio/checkbox */}
          {hasOptions && (
            <>
              <Grid item xs={12}>
                <Divider><Chip label="Options" size="small" /></Divider>
              </Grid>
              <Grid item xs={12}>
                <OptionsEditor options={field.options} onChange={opts => update('options', opts)} />
              </Grid>
            </>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

// ── Live Preview Panel ────────────────────────────────────────────────────────
const LivePreview = ({ formMeta, fields }) => {
  if (!fields.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
        <TextFields sx={{ fontSize: 48, mb: 2 }} />
        <Typography>Add fields to see a preview</Typography>
      </Box>
    );
  }

  const renderPreviewField = (field) => {
    const commonProps = {
      fullWidth: true, size: 'small', label: field.label,
      placeholder: field.placeholder, helperText: field.helpText,
      required: field.required, disabled: true,
    };
    switch (field.type) {
      case 'textarea':   return <TextField {...commonProps} multiline rows={3} />;
      case 'number':     return <TextField {...commonProps} type="number" />;
      case 'email':      return <TextField {...commonProps} type="email" />;
      case 'phone':      return <TextField {...commonProps} type="tel" />;
      case 'date':       return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />;
      case 'select':
        return (
          <FormControl fullWidth size="small" required={field.required} disabled>
            <InputLabel>{field.label}</InputLabel>
            <Select label={field.label} value="">
              {field.options.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>
        );
      default: return <TextField {...commonProps} />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>{formMeta.name || 'Untitled Form'}</Typography>
      {formMeta.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{formMeta.description}</Typography>
      )}
      <Grid container spacing={2}>
        {fields.map(field => (
          <Grid item xs={12} sm={field.width === 'half' ? 6 : 12} key={field.id}>
            {renderPreviewField(field)}
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" disabled>Submit</Button>
      </Box>
    </Box>
  );
};

// ── Main FormBuilder ──────────────────────────────────────────────────────────
const FormBuilder = ({ editForm = null, onSaved }) => {
  const [tab, setTab] = useState(0);
  const [formMeta, setFormMeta] = useState({
    name: editForm?.name || '',
    type: editForm?.type || '',
    description: editForm?.description || '',
  });
  const [settings, setSettings] = useState(
    editForm?.schema?.settings || {
      submitLabel: 'Submit',
      successMessage: 'Your response has been submitted successfully.',
      allowMultipleSubmissions: false,
    }
  );
  const [fields, setFields] = useState(
    (editForm?.schema?.fields || []).map(f => ({ ...f }))
  );
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});

  const updateMeta = (key, val) => setFormMeta(m => ({ ...m, [key]: val }));

  const addField = () => {
    const field = createField();
    field.order = fields.length;
    setFields(f => [...f, field]);
    setTab(0); // stay on builder tab
  };

  const updateField = useCallback((updated) => {
    setFields(f => f.map(field => field.id === updated.id ? updated : field));
  }, []);

  const deleteField = useCallback((id) => {
    setFields(f => f.filter(field => field.id !== id));
  }, []);

  const moveField = useCallback((index, direction) => {
    setFields(f => {
      const arr = [...f];
      const newIdx = index + direction;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
      return arr.map((field, i) => ({ ...field, order: i }));
    });
  }, []);

  const duplicateField = useCallback((index) => {
    setFields(f => {
      const arr = [...f];
      const copy = { ...arr[index], id: uuidv4(), name: arr[index].name + '_copy' };
      arr.splice(index + 1, 0, copy);
      return arr.map((field, i) => ({ ...field, order: i }));
    });
  }, []);

  const validate = () => {
    const errs = {};
    if (!formMeta.name.trim()) errs.name = 'Form name is required.';
    if (!formMeta.type) errs.type = 'Form type is required.';
    if (!fields.length) errs.fields = 'Add at least one field.';
    fields.forEach((field, i) => {
      if (!field.label.trim()) errs[`field_${i}_label`] = `Field #${i + 1}: Label is required.`;
      if (!field.name.trim()) errs[`field_${i}_name`] = `Field #${i + 1}: Field name (key) is required.`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setSnack({ open: true, message: 'Please fix the errors before saving.', severity: 'error' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formMeta,
        schema: {
          fields: fields.map((f, i) => ({ ...f, order: i })),
          settings,
        },
      };
      let response;
      if (editForm?.id) {
        response = await axios.put(`/api/forms/${editForm.id}`, payload);
      } else {
        response = await axios.post('/api/forms', payload);
      }
      setSnack({ open: true, message: 'Form saved successfully!', severity: 'success' });
      onSaved?.(response.data.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save form.';
      setSnack({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {editForm ? 'Edit Form' : 'Create New Form'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build your form schema — fields will be stored as JSONB in PostgreSQL
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<Visibility />} variant="outlined" onClick={() => setTab(1)}>
            Preview
          </Button>
          <Button startIcon={<Save />} variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editForm ? 'Update Form' : 'Save Form'}
          </Button>
        </Stack>
      </Stack>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {Object.values(errors).join(' • ')}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* LEFT: Builder */}
        <Grid item xs={12} md={7}>
          {/* Form Meta */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Form Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth label="Form Name *" value={formMeta.name}
                  onChange={e => updateMeta('name', e.target.value)}
                  error={!!errors.name} helperText={errors.name} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Form Type *</InputLabel>
                  <Select value={formMeta.type} label="Form Type *"
                    onChange={e => updateMeta('type', e.target.value)}>
                    {FORM_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" multiline rows={2}
                  value={formMeta.description}
                  onChange={e => updateMeta('description', e.target.value)} />
              </Grid>
            </Grid>
          </Paper>

          {/* Fields */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Form Fields
                <Badge badgeContent={fields.length} color="primary" sx={{ ml: 2 }} />
              </Typography>
              <Button startIcon={<Add />} variant="contained" size="small" onClick={addField}>
                Add Field
              </Button>
            </Stack>

            {errors.fields && <Alert severity="warning" sx={{ mb: 2 }}>{errors.fields}</Alert>}

            {fields.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5, border: '2px dashed', borderColor: 'divider', borderRadius: 2 }}>
                <Typography color="text.secondary" gutterBottom>No fields yet</Typography>
                <Button startIcon={<Add />} onClick={addField}>Add your first field</Button>
              </Box>
            ) : (
              fields.map((field, index) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  index={index}
                  total={fields.length}
                  onUpdate={updateField}
                  onDelete={deleteField}
                  onMove={moveField}
                  onDuplicate={duplicateField}
                />
              ))
            )}
          </Paper>

          {/* Form Settings */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Form Settings</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Submit Button Label"
                  value={settings.submitLabel}
                  onChange={e => setSettings(s => ({ ...s, submitLabel: e.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Success Message" multiline rows={2}
                  value={settings.successMessage}
                  onChange={e => setSettings(s => ({ ...s, successMessage: e.target.value }))} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch checked={settings.allowMultipleSubmissions}
                      onChange={e => setSettings(s => ({ ...s, allowMultipleSubmissions: e.target.checked }))} />
                  }
                  label="Allow multiple submissions from same user"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* RIGHT: Preview */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, position: 'sticky', top: 16 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="Live Preview" />
              <Tab label="JSON Schema" />
            </Tabs>
            {tab === 0 && <LivePreview formMeta={formMeta} fields={fields} />}
            {tab === 1 && (
              <Box component="pre" sx={{
                backgroundColor: 'grey.900', color: 'grey.100',
                p: 2, borderRadius: 1, overflow: 'auto', fontSize: 11,
                maxHeight: 600,
              }}>
                {JSON.stringify({ fields: fields.map((f, i) => ({ ...f, order: i })), settings }, null, 2)}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormBuilder;
