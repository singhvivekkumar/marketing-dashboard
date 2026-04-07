// src/pages/Orders/OrderList.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, IconButton,
  Tooltip, Alert, Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  AddOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, ClearOutlined,
} from '@mui/icons-material';
import PageShell       from '../../components/Layout/PageShell';
import { DeleteModal } from '../../components/Common/Modals';
import OrderFormModal  from './OrderFormModal';
import { ordersAPI }   from '../../api';
import { useAuth }     from '../../context/AuthContext';

export default function OrderList() {
  const { user }   = useAuth();
  const canDelete  = ['manager','head','admin'].includes(user?.role);

  const [rows,     setRows]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [total,    setTotal]    = useState(0);
  const [totals,   setTotals]   = useState({ excl: 0, incl: 0 });
  const [page,     setPage]     = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search,   setSearch]   = useState('');
  const [tType,    setTType]    = useState('');

  const [formOpen,   setFormOpen]   = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRec,  setDeleteRec]  = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = { page: page+1, limit: pageSize,
        ...(search && { search }),
        ...(tType  && { tender_type: tType }) };
      const res = await ordersAPI.list(params);
      setRows(res.data.data);
      setTotal(res.data.pagination.total);
      // Sum totals from all rows returned (server should ideally return aggregate)
      const allRows = res.data.data;
      setTotals({
        excl: allRows.reduce((s, r) => s + parseFloat(r.value_excl_gst_cr || 0), 0),
        incl: allRows.reduce((s, r) => s + parseFloat(r.value_incl_gst_cr || 0), 0),
      });
    } catch { setError('Failed to load orders.'); }
    finally  { setLoading(false); }
  }, [page, pageSize, search, tType]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEdit = async (id) => {
    try { const r = await ordersAPI.getOne(id); setEditRecord(r.data.data); setFormOpen(true); }
    catch { setError('Could not load record.'); }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try { await ordersAPI.remove(deleteRec.id); setDeleteOpen(false); setDeleteRec(null); fetchData(); }
    catch { setError('Delete failed.'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { field:'tender_name',       headerName:'Tender Name',      flex:1.4, minWidth:180,
      renderCell: p => <Typography sx={{ fontSize:13, fontWeight:500, color:'#0f1117' }}>{p.value}</Typography> },
    { field:'customer_name',     headerName:'Customer',          flex:1,  minWidth:120 },
    { field:'po_wo_number',      headerName:'PO / WO No.',       width:130,
      renderCell: p => <Typography sx={{ fontFamily:'"DM Mono",monospace', fontSize:12 }}>{p.value}</Typography> },
    { field:'order_received_date',headerName:'Order Date',       width:110,
      renderCell: p => <Typography sx={{ fontFamily:'"DM Mono",monospace', fontSize:12, color:'#525868' }}>
        {p.value ? new Date(p.value).toLocaleDateString('en-IN') : '—'}
      </Typography> },
    { field:'value_excl_gst_cr', headerName:'Value excl. GST (Cr)', width:160,
      renderCell: p => <Typography sx={{ fontFamily:'"DM Mono",monospace', fontSize:13, fontWeight:500 }}>
        ₹{parseFloat(p.value||0).toFixed(2)}
      </Typography> },
    { field:'value_incl_gst_cr', headerName:'Value incl. GST (Cr)', width:160,
      renderCell: p => <Typography sx={{ fontFamily:'"DM Mono",monospace', fontSize:13, color:'#525868' }}>
        ₹{parseFloat(p.value||0).toFixed(2)}
      </Typography> },
    { field:'tender_type',       headerName:'Type',              width:120,
      renderCell: p => <Chip label={p.value} size="small" sx={{ fontSize:10, height:20, backgroundColor:'#f1f3f7', color:'#525868' }} /> },
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
    <PageShell title="Orders Received">
      <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

        {/* Toolbar */}
        <Box sx={{ display:'flex', alignItems:'center', gap:1.5, flexWrap:'wrap' }}>
          <TextField placeholder="Search tender, customer..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} size="small" sx={{ width:260 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ fontSize:16, color:'#8892a4' }} /></InputAdornment>,
              endAdornment: search ? <InputAdornment position="end"><IconButton size="small" onClick={() => { setSearch(''); setPage(0); }}><ClearOutlined sx={{ fontSize:14 }} /></IconButton></InputAdornment> : null }} />
          <FormControl size="small" sx={{ minWidth:160 }}>
            <InputLabel>Tender Type</InputLabel>
            <Select value={tType} label="Tender Type" onChange={e => { setTType(e.target.value); setPage(0); }}>
              <MenuItem value="">All</MenuItem>
              {['Open','Limited','Single Source','Nomination','Rate Contract'].map(t =>
                <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ flex:1 }} />
          <Typography sx={{ fontSize:12, color:'#8892a4' }}>{total} records</Typography>
          <Button variant="contained" startIcon={<AddOutlined sx={{ fontSize:16 }} />}
            onClick={() => { setEditRecord(null); setFormOpen(true); }} size="small" sx={{ px:2 }}>
            New Order
          </Button>
        </Box>

        {/* Grid */}
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
            disableRowSelectionOnClick disableColumnMenu autoHeight sx={{ fontSize:13 }}
            slots={{ noRowsOverlay: () => (
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:200 }}>
                <Typography sx={{ color:'#8892a4', fontSize:13 }}>No orders found.</Typography>
              </Box>
            )}} />
        </Box>

        {/* Totals footer */}
        <Box sx={{ display:'flex', gap:3, px:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <Typography sx={{ fontSize:12, color:'#8892a4' }}>Total excl. GST:</Typography>
            <Typography sx={{ fontSize:13, fontWeight:600, fontFamily:'"DM Mono",monospace', color:'#0f1117' }}>
              ₹{totals.excl.toFixed(2)} Cr
            </Typography>
          </Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <Typography sx={{ fontSize:12, color:'#8892a4' }}>Total incl. GST:</Typography>
            <Typography sx={{ fontSize:13, fontWeight:600, fontFamily:'"DM Mono",monospace', color:'#0f1117' }}>
              ₹{totals.incl.toFixed(2)} Cr
            </Typography>
          </Box>
        </Box>
      </Box>

      <OrderFormModal open={formOpen} record={editRecord} onClose={(r) => { setFormOpen(false); setEditRecord(null); if(r) fetchData(); }} />
      <DeleteModal open={deleteOpen} onClose={() => { setDeleteOpen(false); setDeleteRec(null); }}
        onConfirm={confirmDelete} recordName={deleteRec?.tender_name} loading={deleting} />
    </PageShell>
  );
}
