// src/pages/BQ/BQFormModal.jsx
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, Typography, Alert, Divider,
  IconButton, CircularProgress,
} from '@mui/material';
import {
  CloseOutlined, UploadFileOutlined,
  InsertDriveFileOutlined, DeleteOutlined,
} from '@mui/icons-material';
import { bqAPI }   from '../../api';
import { usersAPI } from '../../api';

const EMPTY = {
  bq_title: '', customer_name: '', customer_address: '',
  lead_owner_id: '', defence_type: '', estimated_value_cr: '',
  submitted_value_cr: '', submission_date: '', reference_no: '',
  competitors: '', present_status: '',
};

const STATUS_OPTIONS = ['Active', 'Converted to Tender', 'Dropped', 'Won'];

export default function BQFormModal({ open, record, onClose }) {
  const isEdit = Boolean(record);

  const [form,    setForm]    = useState(EMPTY);
  const [file,    setFile]    = useState(null);      // new file selected
  const [users,   setUsers]   = useState([]);
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [apiErr,  setApiErr]  = useState('');

  // Populate form when editing
  useEffect(() => {
    if (open) {
      setForm(record ? {
        bq_title:            record.bq_title            || '',
        customer_name:       record.customer_name       || '',
        customer_address:    record.customer_address    || '',
        lead_owner_id:       record.lead_owner_id       || '',
        defence_type:        record.defence_type        || '',
        estimated_value_cr:  record.estimated_value_cr  || '',
        submitted_value_cr:  record.submitted_value_cr  || '',
        submission_date:     record.submission_date     || '',
        reference_no:        record.reference_no        || '',
        competitors:         record.competitors         || '',
        present_status:      record.present_status      || '',
      } : EMPTY);
      setFile(null);
      setErrors({});
      setApiErr('');
    }
  }, [open, record]);

  // Load users for Lead Owner dropdown
  useEffect(() => {
    usersAPI.list().then(r => setUsers(r.data.data)).catch(() => {});
  }, []);

  const set = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  // ── Validation ────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.bq_title.trim())          e.bq_title          = 'BQ Title is required.';
    if (!form.customer_name.trim())     e.customer_name     = 'Customer Name is required.';
    if (!form.customer_address.trim())  e.customer_address  = 'Customer Address is required.';
    if (!form.defence_type)             e.defence_type      = 'Please select Defence or Non-Defence.';
    if (!form.estimated_value_cr || isNaN(form.estimated_value_cr) || form.estimated_value_cr < 0)
      e.estimated_value_cr = 'Enter a valid positive number.';
    if (!form.submitted_value_cr || isNaN(form.submitted_value_cr) || form.submitted_value_cr < 0)
      e.submitted_value_cr = 'Enter a valid positive number.';
    if (!form.submission_date)          e.submission_date   = 'Submission Date is required.';
    if (!form.present_status)           e.present_status    = 'Present Status is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    setApiErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (file) fd.append('bq_document', file);

      if (isEdit) {
        await bqAPI.update(record.id, fd);
      } else {
        await bqAPI.create(fd);
      }
      onClose(true); // true = refresh list
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setErrors(p => ({ ...p, file: 'Only PDF files are allowed.' }));
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrors(p => ({ ...p, file: 'File size must not exceed 20MB.' }));
      return;
    }
    setFile(f);
    setErrors(p => ({ ...p, file: '' }));
  };

  const F = ({ label, field, multiline, rows, type = 'text', half }) => (
    <Grid item xs={half ? 6 : 12}>
      <TextField
        label={label}
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        fullWidth
        multiline={multiline}
        rows={rows || 1}
        type={type}
        error={Boolean(errors[field])}
        helperText={errors[field] || ''}
        InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      />
    </Grid>
  );

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
          {isEdit ? 'Edit Budgetary Quotation' : 'New Budgetary Quotation'}
        </Typography>
        <IconButton size="small" onClick={() => onClose(false)}>
          <CloseOutlined sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        {apiErr && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: 13 }} onClose={() => setApiErr('')}>
            {apiErr}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* 1. BQ Title */}
          <F label="BQ Title *"          field="bq_title"         />
          {/* 2. Customer Name */}
          <F label="Customer Name *"     field="customer_name"    half />
          {/* 3. Lead Owner */}
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Lead Owner</InputLabel>
              <Select value={form.lead_owner_id} label="Lead Owner" onChange={e => set('lead_owner_id', e.target.value)}>
                <MenuItem value="">— None —</MenuItem>
                {users.map(u => <MenuItem key={u.id} value={u.id}>{u.full_name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          {/* 4. Customer Address */}
          <F label="Customer Address *"  field="customer_address" multiline rows={2} />
          {/* 5. Defence / Non-Defence */}
          <Grid item xs={6}>
            <FormControl fullWidth size="small" error={Boolean(errors.defence_type)}>
              <InputLabel>Defence / Non-Defence *</InputLabel>
              <Select value={form.defence_type} label="Defence / Non-Defence *" onChange={e => set('defence_type', e.target.value)}>
                <MenuItem value="Defence">Defence</MenuItem>
                <MenuItem value="Non-Defence">Non-Defence</MenuItem>
              </Select>
              {errors.defence_type && (
                <Typography sx={{ fontSize: 11, color: '#dc2626', mt: 0.5, ml: 1.75 }}>{errors.defence_type}</Typography>
              )}
            </FormControl>
          </Grid>
          {/* 6. Reference No */}
          <F label="Reference No."        field="reference_no"     half />
          {/* 7 & 8. Values */}
          <F label="Estimated Value (Cr) excl. GST *" field="estimated_value_cr" type="number" half />
          <F label="Submitted Value (Cr) excl. GST *" field="submitted_value_cr" type="number" half />
          {/* 9. Submission Date */}
          <F label="Date of Letter Submission *" field="submission_date" type="date" half />
          {/* 10. Present Status */}
          <Grid item xs={6}>
            <FormControl fullWidth size="small" error={Boolean(errors.present_status)}>
              <InputLabel>Present Status *</InputLabel>
              <Select value={form.present_status} label="Present Status *" onChange={e => set('present_status', e.target.value)}>
                {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
              {errors.present_status && (
                <Typography sx={{ fontSize: 11, color: '#dc2626', mt: 0.5, ml: 1.75 }}>{errors.present_status}</Typography>
              )}
            </FormControl>
          </Grid>
          {/* 11. Competitors */}
          <F label="Competitors"         field="competitors"      multiline rows={2} />

          {/* 12. Document upload */}
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#525868', mb: 1 }}>
              BQ Document (PDF only, max 20MB)
            </Typography>

            {/* Show existing file if editing */}
            {isEdit && record?.document_name && !file && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, mb: 1 }}>
                <InsertDriveFileOutlined sx={{ fontSize: 16, color: '#16a34a' }} />
                <Typography sx={{ fontSize: 12, color: '#15803d', flex: 1 }}>{record.document_name}</Typography>
                <Typography sx={{ fontSize: 11, color: '#8892a4' }}>Existing file</Typography>
              </Box>
            )}

            {/* New file selected */}
            {file && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25, backgroundColor: '#eff4ff', border: '1px solid #bfdbfe', borderRadius: 2, mb: 1 }}>
                <InsertDriveFileOutlined sx={{ fontSize: 16, color: '#2563eb' }} />
                <Typography sx={{ fontSize: 12, color: '#1d4ed8', flex: 1 }}>{file.name}</Typography>
                <IconButton size="small" onClick={() => setFile(null)}>
                  <DeleteOutlined sx={{ fontSize: 14, color: '#dc2626' }} />
                </IconButton>
              </Box>
            )}

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileOutlined sx={{ fontSize: 16 }} />}
              size="small"
              sx={{ fontSize: 12 }}
            >
              {isEdit ? 'Replace Document' : 'Choose File'}
              <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
            </Button>

            {errors.file && (
              <Typography sx={{ fontSize: 11, color: '#dc2626', mt: 0.5 }}>{errors.file}</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={() => onClose(false)} variant="outlined" size="small" disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="small"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ px: 3 }}
        >
          {saving ? 'Saving...' : isEdit ? 'Update BQ' : 'Save BQ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
