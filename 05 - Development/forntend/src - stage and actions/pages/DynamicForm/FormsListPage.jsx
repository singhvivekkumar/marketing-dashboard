// src/pages/FormsListPage.jsx
// Admin page: view all forms, open builder, view submissions
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, Button, IconButton, Chip, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Stack, FormControl, InputLabel, Select, MenuItem,
  Alert, Snackbar, CircularProgress,
} from '@mui/material';
import {
  Add, Edit, Delete, Visibility, ContentCopy, Link as LinkIcon,
  OpenInNew, FilterList,
} from '@mui/icons-material';
import axios from 'axios';
import FormBuilder from './FormBuilder';
import FormRenderer from './FormRenderer';

const FORM_TYPES = [
  'All', 'Enquiry', 'Feedback', 'Complaint', 'Registration', 'Survey',
  'Vendor Registration', 'Quote Request', 'Lead Capture', 'Support Request',
];

const FormsListPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [previewForm, setPreviewForm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const fetchForms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter !== 'All') params.type = typeFilter;
      if (search) params.search = search;
      const res = await axios.get('/api/forms', { params });
      setForms(res.data.data);
    } catch (err) {
      setSnack({ open: true, message: 'Failed to load forms.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchForms(); }, [typeFilter]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchForms();
  };

  const handleOpenBuilder = (form = null) => {
    setEditForm(form);
    setBuilderOpen(true);
  };

  const handleSaved = (savedForm) => {
    setBuilderOpen(false);
    setEditForm(null);
    fetchForms();
    setSnack({ open: true, message: 'Form saved successfully!', severity: 'success' });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/forms/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      fetchForms();
      setSnack({ open: true, message: 'Form deleted.', severity: 'info' });
    } catch {
      setSnack({ open: true, message: 'Failed to delete form.', severity: 'error' });
    }
  };

  const copyLink = (formId) => {
    const link = `${window.location.origin}/forms/${formId}`;
    navigator.clipboard.writeText(link);
    setSnack({ open: true, message: 'Form link copied to clipboard!', severity: 'success' });
  };

  const filtered = forms.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Forms Manager</Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage dynamic forms — schemas stored as JSONB
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenBuilder()}>
          Create New Form
        </Button>
      </Stack>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterList color="action" />
          <TextField
            size="small" label="Search by name" value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch} sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Form Type</InputLabel>
            <Select value={typeFilter} label="Form Type"
              onChange={e => setTypeFilter(e.target.value)}>
              {FORM_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={fetchForms}>Search</Button>
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell><strong>Form Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Fields</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No forms found. Create your first form!</Typography>
                </TableCell>
              </TableRow>
            ) : filtered.map(form => (
              <TableRow key={form.id} hover>
                <TableCell>
                  <Typography fontWeight={500}>{form.name}</Typography>
                  {form.description && (
                    <Typography variant="caption" color="text.secondary">
                      {form.description.slice(0, 60)}{form.description.length > 60 ? '...' : ''}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip label={form.type} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  {/* We don't load schema in list view, so show N/A or fetch on demand */}
                  <Typography variant="body2">—</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={form.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    color={form.is_active ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(form.created_at).toLocaleDateString('en-IN')}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Preview Form">
                      <IconButton size="small" onClick={() => setPreviewForm(form)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Form Link">
                      <IconButton size="small" onClick={() => copyLink(form.id)}>
                        <LinkIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Form">
                      <IconButton size="small" color="primary" onClick={() => handleOpenBuilder(form)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Form">
                      <IconButton size="small" color="error" onClick={() => setDeleteConfirm(form)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Builder Dialog */}
      <Dialog open={builderOpen} onClose={() => setBuilderOpen(false)} maxWidth="xl" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          <FormBuilder editForm={editForm} onSaved={handleSaved} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuilderOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewForm} onClose={() => setPreviewForm(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Form Preview — <em>{previewForm?.name}</em>
          <Tooltip title="Open in new tab">
            <IconButton size="small" href={`/forms/${previewForm?.id}`} target="_blank" sx={{ ml: 1 }}>
              <OpenInNew fontSize="small" />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent>
          {previewForm && <FormRenderer formId={previewForm.id} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewForm(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Are you sure you want to delete <strong>"{deleteConfirm?.name}"</strong>?
            All submissions will also be deleted. This cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormsListPage;
