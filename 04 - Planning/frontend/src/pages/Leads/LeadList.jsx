// src/pages/Leads/LeadList.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, IconButton,
  Tabs, Tab, Chip, Tooltip, Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  AddOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, ClearOutlined,
} from '@mui/icons-material';
import PageShell      from '../../components/Layout/PageShell';
import { DeleteModal, StatusChip } from '../../components/Common/Modals';
import LeadFormModal  from './LeadFormModal';
import { leadsAPI }   from '../../api';
import { useAuth }    from '../../context/AuthContext';

const SUBTYPES = ['All','Submitted','Domestic','Export','CRM','Lost'];

export default function LeadList() {
  const { user }  = useAuth();
  const canDelete = ['manager','head','admin'].includes(user?.role);

  const [rows,     setRows]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [subtype,  setSubtype]  = useState(0);   // tab index

  const [search,      setSearch]      = useState('');
  const [outcome,     setOutcome]     = useState('');
  const [civilDef,    setCivilDef]    = useState('');
  const [openClosed,  setOpenClosed]  = useState('');

  const [formOpen,   setFormOpen]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRec,  setDeleteRec]  = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const activeSubtype = SUBTYPES[subtype];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: page + 1, limit: pageSize,
        ...(activeSubtype !== 'All' && { subtype: activeSubtype }),
        ...(search     && { search }),
        ...(outcome    && { outcome }),
        ...(civilDef   && { civil_defence: civilDef }),
        ...(openClosed && { open_closed: openClosed }),
      };
      const res = await leadsAPI.list(params);
      setRows(res.data.data);
      setTotal(res.data.pagination.total);
    } catch {
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, activeSubtype, search, outcome, civilDef, openClosed]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEdit = async (id) => {
    try {
      const res = await leadsAPI.getOne(id);
      setEditRecord(res.data.data);
      setFormOpen(true);
    } catch { setError('Could not load record for editing.'); }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await leadsAPI.remove(deleteRec.id);
      setDeleteOpen(false);
      setDeleteRec(null);
      fetchData();
    } catch { setError('Delete failed.'); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      field: 'tender_name', headerName: 'Tender Name', flex: 1.6, minWidth: 200,
      renderCell: p => <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#0f1117' }}>{p.value}</Typography>,
    },
    { field: 'customer_name',   headerName: 'Customer',     flex: 1,   minWidth: 120 },
    { field: 'lead_subtype',    headerName: 'Type',         width: 110,
      renderCell: p => (
        <Chip label={p.value} size="small" sx={{ fontSize: 10, height: 20,
          backgroundColor: '#eff4ff', color: '#2563eb' }} />
      ),
    },
    { field: 'civil_defence',   headerName: 'Sector',       width: 90,
      renderCell: p => (
        <Chip label={p.value} size="small" sx={{ fontSize: 10, height: 20,
          backgroundColor: p.value === 'Defence' ? '#eff4ff' : '#f0fdfa',
          color: p.value === 'Defence' ? '#2563eb' : '#0d9488' }} />
      ),
    },
    {
      field: 'submitted_value_cr', headerName: 'Sub. Value (Cr)', width: 140,
      renderCell: p => (
        <Typography sx={{ fontFamily: '"DM Mono",monospace', fontSize: 13, fontWeight: 500 }}>
          {p.value ? `₹${parseFloat(p.value).toFixed(2)}` : '—'}
        </Typography>
      ),
    },
    {
      field: 'last_submission_date', headerName: 'Last Sub. Date', width: 130,
      renderCell: p => (
        <Typography sx={{ fontFamily: '"DM Mono",monospace', fontSize: 12, color: '#525868' }}>
          {p.value ? new Date(p.value).toLocaleDateString('en-IN') : '—'}
        </Typography>
      ),
    },
    {
      field: 'outcome', headerName: 'Outcome', width: 140,
      renderCell: p => <StatusChip status={p.value} />,
    },
    {
      field: 'open_closed', headerName: 'Status', width: 90,
      renderCell: p => <StatusChip status={p.value} />,
    },
    {
      field: 'actions', headerName: 'Actions', width: 100, sortable: false,
      renderCell: p => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(p.row.id)} sx={{ color: '#525868' }}>
              <EditOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          {canDelete && (
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => { setDeleteRec(p.row); setDeleteOpen(true); }} sx={{ color: '#dc2626' }}>
                <DeleteOutlined sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageShell title="Lead Management">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

        {/* Sub-type tabs */}
        <Box sx={{ backgroundColor: '#f1f3f7', borderRadius: 2, p: '3px', display: 'inline-flex' }}>
          <Tabs
            value={subtype}
            onChange={(_, v) => { setSubtype(v); setPage(0); }}
            sx={{
              minHeight: 34,
              '& .MuiTabs-indicator': { height: '100%', borderRadius: '6px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', zIndex: 0 },
              '& .MuiTab-root': { minHeight: 28, py: 0, px: 1.5, fontSize: 12, fontWeight: 400, color: '#525868', zIndex: 1, minWidth: 'auto',
                '&.Mui-selected': { fontWeight: 500, color: '#0f1117' } },
            }}
          >
            {SUBTYPES.map(s => <Tab key={s} label={s} disableRipple />)}
          </Tabs>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search tender name, customer..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            size="small" sx={{ width: 260 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ fontSize: 16, color: '#8892a4' }} /></InputAdornment>,
              endAdornment: search ? <InputAdornment position="end"><IconButton size="small" onClick={() => { setSearch(''); setPage(0); }}><ClearOutlined sx={{ fontSize: 14 }} /></IconButton></InputAdornment> : null,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Outcome</InputLabel>
            <Select value={outcome} label="Outcome" onChange={e => { setOutcome(e.target.value); setPage(0); }}>
              <MenuItem value="">All</MenuItem>
              {['Won','Lost','Participated','Not-Participated'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Civil / Defence</InputLabel>
            <Select value={civilDef} label="Civil / Defence" onChange={e => { setCivilDef(e.target.value); setPage(0); }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Civil">Civil</MenuItem>
              <MenuItem value="Defence">Defence</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Open / Closed</InputLabel>
            <Select value={openClosed} label="Open / Closed" onChange={e => { setOpenClosed(e.target.value); setPage(0); }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 12, color: '#8892a4' }}>{total} records</Typography>
          <Button variant="contained" startIcon={<AddOutlined sx={{ fontSize: 16 }} />}
            onClick={() => { setEditRecord(null); setFormOpen(true); }} size="small" sx={{ px: 2 }}>
            New Lead
          </Button>
        </Box>

        {/* Grid */}
        <Box sx={{ backgroundColor: '#fff', border: '1px solid #e4e8ef', borderRadius: '14px', overflow: 'hidden',
          '& .MuiDataGrid-root': { border: 'none' },
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f1f3f7', borderBottom: '1px solid #e4e8ef', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8892a4' },
          '& .MuiDataGrid-cell': { borderBottom: '1px solid #e4e8ef', fontSize: 13, color: '#525868' },
          '& .MuiDataGrid-row:hover': { backgroundColor: '#f7f8fa' },
          '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #e4e8ef', backgroundColor: '#f7f8fa' },
        }}>
          <DataGrid
            rows={rows} columns={columns} loading={loading}
            rowCount={total} pageSizeOptions={[10,20,50]}
            paginationModel={{ page, pageSize }} paginationMode="server"
            onPaginationModelChange={m => { setPage(m.page); setPageSize(m.pageSize); }}
            disableRowSelectionOnClick disableColumnMenu autoHeight sx={{ fontSize: 13 }}
            slots={{ noRowsOverlay: () => (
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:200 }}>
                <Typography sx={{ color:'#8892a4', fontSize:13 }}>No leads found.</Typography>
              </Box>
            )}}
          />
        </Box>
      </Box>

      <LeadFormModal open={formOpen} record={editRecord} onClose={(r) => { setFormOpen(false); setEditRecord(null); if(r) fetchData(); }} />
      <DeleteModal open={deleteOpen} onClose={() => { setDeleteOpen(false); setDeleteRec(null); }}
        onConfirm={confirmDelete} recordName={deleteRec?.tender_name} loading={deleting} />
    </PageShell>
  );
}
