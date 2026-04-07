// src/pages/RnD/RnDList.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, IconButton, Tooltip, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Divider, Chip, CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AddOutlined, EditOutlined, DeleteOutlined, CloseOutlined, UploadFileOutlined } from '@mui/icons-material';
import PageShell       from '../../components/Layout/PageShell';
import { DeleteModal, StatusChip } from '../../components/Common/Modals';
import { rndAPI }      from '../../api';
import { useAuth }     from '../../context/AuthContext';

const EMPTY = { project_title:'', description:'', business_domain:'', start_date:'', target_date:'', status:'Active', team_members:'' };

function RnDFormModal({ open, record, onClose }) {
  const isEdit = Boolean(record);
  const [form,   setForm]   = useState(EMPTY);
  const [file,   setFile]   = useState(null);
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({}); setApiErr(''); setFile(null);
      setForm(record ? {
        project_title:   record.project_title   || '',
        description:     record.description     || '',
        business_domain: record.business_domain || '',
        start_date:      record.start_date      || '',
        target_date:     record.target_date     || '',
        status:          record.status          || 'Active',
        team_members:    record.team_members    || '',
      } : EMPTY);
    }
  }, [open, record]);

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]:'' })); };

  const handleSubmit = async () => {
    const e = {};
    if (!form.project_title.trim()) e.project_title = 'Required';
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true); setApiErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (file) fd.append('document', file);
      if (isEdit) await rndAPI.update(record.id, fd);
      else        await rndAPI.create(fd);
      onClose(true);
    } catch (err) { setApiErr(err.response?.data?.error || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const TF = ({ label, field, half, type='text', multiline, rows }) => (
    <Grid item xs={half?6:12}>
      <TextField label={label} value={form[field]} onChange={e => set(field, e.target.value)}
        fullWidth size="small" type={type} multiline={multiline} rows={rows||1}
        error={Boolean(errors[field])} helperText={errors[field]||''}
        InputLabelProps={type==='date'?{shrink:true}:undefined} />
    </Grid>
  );

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', pb:1 }}>
        <Typography sx={{ fontSize:15, fontWeight:600 }}>{isEdit ? 'Edit R&D Entry' : 'New R&D Entry'}</Typography>
        <IconButton size="small" onClick={() => onClose(false)}><CloseOutlined sx={{ fontSize:18 }} /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt:2.5 }}>
        {apiErr && <Alert severity="error" sx={{ mb:2, borderRadius:2, fontSize:13 }} onClose={() => setApiErr('')}>{apiErr}</Alert>}
        <Grid container spacing={2}>
          <TF label="Project Title *" field="project_title" />
          <TF label="Business Domain" field="business_domain" half />
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={form.status} label="Status" onChange={e => set('status', e.target.value)}>
                {['Active','On Hold','Completed','Cancelled'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <TF label="Start Date"     field="start_date"   half type="date" />
          <TF label="Target Date"    field="target_date"  half type="date" />
          <TF label="Team Members"   field="team_members" multiline rows={2} />
          <TF label="Description"    field="description"  multiline rows={3} />
          <Grid item xs={12}>
            <Typography sx={{ fontSize:12, fontWeight:500, color:'#525868', mb:0.75 }}>Attach Document (PDF, max 20MB)</Typography>
            <Button component="label" variant="outlined" size="small" startIcon={<UploadFileOutlined sx={{ fontSize:14 }} />} sx={{ fontSize:12 }}>
              {file ? file.name : 'Choose File'}
              <input type="file" hidden accept="application/pdf" onChange={e => setFile(e.target.files?.[0])} />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px:3, py:2, gap:1 }}>
        <Button onClick={() => onClose(false)} variant="outlined" size="small" disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" size="small" disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null} sx={{ px:3 }}>
          {saving ? 'Saving...' : isEdit ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function RnDList() {
  const { user }   = useAuth();
  const canDelete  = ['manager','head','admin'].includes(user?.role);
  const [rows,     setRows]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [formOpen,   setFormOpen]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRec,  setDeleteRec]  = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await rndAPI.list({ page: page+1, limit: pageSize });
      setRows(res.data.data); setTotal(res.data.pagination?.total || res.data.data.length);
    } catch { setError('Failed to load R&D records.'); }
    finally  { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEdit = async (id) => {
    try { const r = await rndAPI.getOne(id); setEditRecord(r.data.data); setFormOpen(true); }
    catch { setError('Could not load record.'); }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try { await rndAPI.remove(deleteRec.id); setDeleteOpen(false); setDeleteRec(null); fetchData(); }
    catch { setError('Delete failed.'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { field:'project_title',   headerName:'Project Title',    flex:1.4, minWidth:200,
      renderCell: p => <Typography sx={{ fontSize:13, fontWeight:500, color:'#0f1117' }}>{p.value}</Typography> },
    { field:'business_domain', headerName:'Domain',           flex:0.8, minWidth:120 },
    { field:'start_date',      headerName:'Start Date',       width:110,
      renderCell: p => <Typography sx={{ fontFamily:'"DM Mono",monospace', fontSize:12, color:'#525868' }}>
        {p.value ? new Date(p.value).toLocaleDateString('en-IN') : '—'}</Typography> },
    { field:'target_date',     headerName:'Target Date',      width:110,
      renderCell: p => <Typography sx={{ fontFamily:'"DM Mono",monospace', fontSize:12, color:'#525868' }}>
        {p.value ? new Date(p.value).toLocaleDateString('en-IN') : '—'}</Typography> },
    { field:'status',          headerName:'Status',           width:110,
      renderCell: p => <StatusChip status={p.value} /> },
    { field:'team_members',    headerName:'Team',             flex:1,   minWidth:120,
      renderCell: p => <Typography sx={{ fontSize:12, color:'#525868' }}>{p.value || '—'}</Typography> },
    { field:'actions', headerName:'Actions', width:100, sortable:false,
      renderCell: p => (
        <Box sx={{ display:'flex', gap:0.5 }}>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(p.row.id)} sx={{ color:'#525868' }}>
            <EditOutlined sx={{ fontSize:16 }} /></IconButton></Tooltip>
          {canDelete && <Tooltip title="Delete"><IconButton size="small" onClick={() => { setDeleteRec(p.row); setDeleteOpen(true); }} sx={{ color:'#dc2626' }}>
            <DeleteOutlined sx={{ fontSize:16 }} /></IconButton></Tooltip>}
        </Box>
      ) },
  ];

  return (
    <PageShell title="In-House R&D">
      <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
        <Box sx={{ display:'flex', justifyContent:'flex-end' }}>
          <Button variant="contained" startIcon={<AddOutlined sx={{ fontSize:16 }} />}
            onClick={() => { setEditRecord(null); setFormOpen(true); }} size="small" sx={{ px:2 }}>
            New R&D Entry
          </Button>
        </Box>
        <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden',
          '& .MuiDataGrid-root':{ border:'none' },
          '& .MuiDataGrid-columnHeaders':{ backgroundColor:'#f1f3f7', borderBottom:'1px solid #e4e8ef', fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', color:'#8892a4' },
          '& .MuiDataGrid-cell':{ borderBottom:'1px solid #e4e8ef', fontSize:13, color:'#525868' },
          '& .MuiDataGrid-row:hover':{ backgroundColor:'#f7f8fa' },
          '& .MuiDataGrid-footerContainer':{ borderTop:'1px solid #e4e8ef', backgroundColor:'#f7f8fa' },
        }}>
          <DataGrid rows={rows} columns={columns} loading={loading} rowCount={total}
            pageSizeOptions={[10,20,50]} paginationModel={{ page, pageSize }} paginationMode="server"
            onPaginationModelChange={m => { setPage(m.page); setPageSize(m.pageSize); }}
            disableRowSelectionOnClick disableColumnMenu autoHeight sx={{ fontSize:13 }} />
        </Box>
      </Box>
      <RnDFormModal open={formOpen} record={editRecord} onClose={(r) => { setFormOpen(false); setEditRecord(null); if(r) fetchData(); }} />
      <DeleteModal open={deleteOpen} onClose={() => { setDeleteOpen(false); setDeleteRec(null); }}
        onConfirm={confirmDelete} recordName={deleteRec?.project_title} loading={deleting} />
    </PageShell>
  );
}
