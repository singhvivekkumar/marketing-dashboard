// src/pages/BQ/BQList.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, IconButton,
  Chip, Tooltip, CircularProgress, Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  AddOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, FileDownloadOutlined, ClearOutlined,
} from '@mui/icons-material';
import PageShell         from '../../components/Layout/PageShell';
import { DeleteModal, StatusChip } from '../../components/Common/Modals';
import BQFormModal       from './BQFormModal';
import { bqAPI }         from '../../api';
import { useAuth }       from '../../context/AuthContext';
import { downloadFile }  from '../../utils/fileHelpers';

export default function BQList() {
  const { user } = useAuth();
  const canDelete = ['manager', 'head', 'admin'].includes(user?.role);

  const [rows,     setRows]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);      // MUI DataGrid is 0-indexed
  const [pageSize, setPageSize] = useState(20);

  // Filters
  const [search,      setSearch]      = useState('');
  const [defenceType, setDefenceType] = useState('');
  const [status,      setStatus]      = useState('');

  // Modals
  const [formOpen,   setFormOpen]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);   // null = new, object = edit
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRec,  setDeleteRec]  = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page:    page + 1,
        limit:   pageSize,
        ...(search      && { search }),
        ...(defenceType && { defence_type: defenceType }),
        ...(status      && { status }),
      };
      const res = await bqAPI.list(params);
      setRows(res.data.data);
      setTotal(res.data.pagination.total);
    } catch {
      setError('Failed to load BQ records. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, defenceType, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleEdit = async (id) => {
    try {
      const res = await bqAPI.getOne(id);
      setEditRecord(res.data.data);
      setFormOpen(true);
    } catch {
      setError('Could not load record for editing.');
    }
  };

  const handleDelete = (row) => { setDeleteRec(row); setDeleteOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await bqAPI.remove(deleteRec.id);
      setDeleteOpen(false);
      setDeleteRec(null);
      fetchData();
    } catch {
      setError('Delete failed. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async (row) => {
    try {
      const res = await bqAPI.download(row.id);
      downloadFile(res.data, row.document_name || `BQ_${row.bq_title}.pdf`);
    } catch {
      setError('File download failed.');
    }
  };

  const handleFormClose = (refreshed) => {
    setFormOpen(false);
    setEditRecord(null);
    if (refreshed) fetchData();
  };

  const clearFilters = () => { setSearch(''); setDefenceType(''); setStatus(''); setPage(0); };

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns = [
    {
      field: 'bq_title', headerName: 'BQ Title', flex: 1.4, minWidth: 180,
      renderCell: p => (
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#0f1117' }}>{p.value}</Typography>
      ),
    },
    { field: 'customer_name', headerName: 'Customer', flex: 1, minWidth: 130 },
    {
      field: 'defence_type', headerName: 'D / ND', width: 100,
      renderCell: p => (
        <Chip
          label={p.value}
          size="small"
          sx={{
            fontSize: 10, height: 20,
            backgroundColor: p.value === 'Defence' ? '#eff4ff' : '#f1f3f7',
            color:            p.value === 'Defence' ? '#2563eb' : '#525868',
          }}
        />
      ),
    },
    {
      field: 'submitted_value_cr', headerName: 'Sub. Value (Cr)', width: 140,
      renderCell: p => (
        <Typography sx={{ fontFamily: '"DM Mono",monospace', fontSize: 13, fontWeight: 500 }}>
          ₹{parseFloat(p.value || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'submission_date', headerName: 'Sub. Date', width: 110,
      renderCell: p => (
        <Typography sx={{ fontFamily: '"DM Mono",monospace', fontSize: 12, color: '#525868' }}>
          {p.value ? new Date(p.value).toLocaleDateString('en-IN') : '—'}
        </Typography>
      ),
    },
    {
      field: 'present_status', headerName: 'Status', width: 130,
      renderCell: p => <StatusChip status={p.value} />,
    },
    {
      field: 'document_name', headerName: 'Document', width: 100,
      renderCell: p => p.value ? (
        <Tooltip title={p.value}>
          <IconButton
            size="small"
            onClick={() => handleDownload(p.row)}
            sx={{ color: '#2563eb' }}
          >
            <FileDownloadOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Typography sx={{ fontSize: 12, color: '#8892a4' }}>—</Typography>
      ),
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
              <IconButton size="small" onClick={() => handleDelete(p.row)} sx={{ color: '#dc2626' }}>
                <DeleteOutlined sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageShell title="BQ Management">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

        {/* ── Toolbar ────────────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Search */}
          <TextField
            placeholder="Search BQ title, customer..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            size="small"
            sx={{ width: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ fontSize: 16, color: '#8892a4' }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setSearch(''); setPage(0); }}>
                    <ClearOutlined sx={{ fontSize: 14 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />

          {/* Defence filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Defence / Non-Defence</InputLabel>
            <Select
              value={defenceType}
              label="Defence / Non-Defence"
              onChange={e => { setDefenceType(e.target.value); setPage(0); }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Defence">Defence</MenuItem>
              <MenuItem value="Non-Defence">Non-Defence</MenuItem>
            </Select>
          </FormControl>

          {/* Status filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={e => { setStatus(e.target.value); setPage(0); }}
            >
              <MenuItem value="">All</MenuItem>
              {['Active','Converted to Tender','Dropped','Won'].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {(search || defenceType || status) && (
            <Button variant="text" size="small" onClick={clearFilters} sx={{ color: '#8892a4', fontSize: 12 }}>
              Clear filters
            </Button>
          )}

          <Box sx={{ flex: 1 }} />

          {/* Record count */}
          <Typography sx={{ fontSize: 12, color: '#8892a4' }}>{total} records</Typography>

          {/* New BQ button */}
          <Button
            variant="contained"
            startIcon={<AddOutlined sx={{ fontSize: 16 }} />}
            onClick={() => { setEditRecord(null); setFormOpen(true); }}
            size="small"
            sx={{ px: 2 }}
          >
            New BQ
          </Button>
        </Box>

        {/* ── DataGrid ───────────────────────────────────────────────────── */}
        <Box
          sx={{
            backgroundColor: '#fff',
            border: '1px solid #e4e8ef',
            borderRadius: '14px',
            overflow: 'hidden',
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f1f3f7',
              borderBottom: '1px solid #e4e8ef',
              fontSize: 10,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#8892a4',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e4e8ef',
              fontSize: 13,
              color: '#525868',
            },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f7f8fa' },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e4e8ef',
              backgroundColor: '#f7f8fa',
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            rowCount={total}
            pageSizeOptions={[10, 20, 50]}
            paginationModel={{ page, pageSize }}
            paginationMode="server"
            onPaginationModelChange={m => { setPage(m.page); setPageSize(m.pageSize); }}
            disableRowSelectionOnClick
            disableColumnMenu
            autoHeight
            sx={{ fontSize: 13 }}
            slots={{
              noRowsOverlay: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                  <Typography sx={{ color: '#8892a4', fontSize: 13 }}>No BQ records found.</Typography>
                </Box>
              ),
            }}
          />
        </Box>
      </Box>

      {/* ── Form Modal (New / Edit) ─────────────────────────────────────── */}
      <BQFormModal
        open={formOpen}
        record={editRecord}
        onClose={handleFormClose}
      />

      {/* ── Delete Confirmation ────────────────────────────────────────── */}
      <DeleteModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteRec(null); }}
        onConfirm={confirmDelete}
        recordName={deleteRec?.bq_title}
        loading={deleting}
      />
    </PageShell>
  );
}
