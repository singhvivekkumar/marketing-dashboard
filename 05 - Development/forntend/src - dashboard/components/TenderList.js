// frontend/src/pages/TenderLifecycle/TenderList.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Button, Chip, Tooltip, IconButton,
  TextField, Select, MenuItem, FormControl, InputLabel,
  InputAdornment, Alert, CircularProgress, Tabs, Tab, Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  AddOutlined, SearchOutlined, ViewKanbanOutlined,
  TableRowsOutlined, ArrowForwardOutlined, WarningAmberOutlined,
} from '@mui/icons-material';
import PageShell       from '../../components/Layout/PageShell';
import { lifecycleAPI } from '../../api/lifecycle.api';
import { useNavigate } from 'react-router-dom';

const STAGES = [
  'Identified','Qualifying','Document Study',
  'Pre-Bid Meeting','Bid Submission','Evaluation','Result','Closed',
];

const STAGE_COLORS = {
  'Identified':      { bg:'#f1f3f7', color:'#525868' },
  'Qualifying':      { bg:'#eff4ff', color:'#2563eb' },
  'Document Study':  { bg:'#f5f3ff', color:'#7c3aed' },
  'Pre-Bid Meeting': { bg:'#fff7ed', color:'#c2410c' },
  'Bid Submission':  { bg:'#fef3c7', color:'#b45309' },
  'Evaluation':      { bg:'#f0fdfa', color:'#0d9488' },
  'Result':          { bg:'#f0fdf4', color:'#16a34a' },
  'Closed':          { bg:'#f9fafb', color:'#6b7280' },
};

const HEALTH_COLORS = { Green:'#16a34a', Amber:'#d97706', Red:'#dc2626' };
const PRIORITY_COLORS = { Critical:'#dc2626', High:'#d97706', Normal:'#2563eb', Low:'#8892a4' };

// ── Kanban Card ──────────────────────────────────────────────────────────────
function KanbanCard({ row, onClick }) {
  const hc = HEALTH_COLORS[row.health_status] || '#8892a4';
  const daysLeft = row.stage_due_date
    ? Math.floor((new Date(row.stage_due_date) - new Date()) / (1000*60*60*24))
    : null;

  return (
    <Box onClick={() => onClick(row.id)} sx={{
      backgroundColor:'#fff', border:`1px solid #e4e8ef`,
      borderLeft:`3px solid ${hc}`, borderRadius:'10px',
      p:1.5, mb:1.25, cursor:'pointer',
      '&:hover':{ boxShadow:'0 2px 8px rgba(0,0,0,0.08)', transform:'translateY(-1px)' },
      transition:'all .15s',
    }}>
      <Box sx={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', mb:0.75 }}>
        <Typography sx={{ fontSize:12, fontWeight:500, color:'#0f1117', lineHeight:1.4, flex:1 }}>
          {row.tender_name}
        </Typography>
        {row.priority !== 'Normal' && (
          <Box sx={{ ml:0.5, fontSize:9, fontWeight:600, px:0.75, py:0.2, borderRadius:'3px',
            backgroundColor: PRIORITY_COLORS[row.priority] + '20',
            color: PRIORITY_COLORS[row.priority], flexShrink:0 }}>
            {row.priority}
          </Box>
        )}
      </Box>
      <Typography sx={{ fontSize:11, color:'#8892a4', mb:0.75 }}>{row.customer_name}</Typography>
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Typography sx={{ fontSize:11, fontFamily:'"DM Mono",monospace', fontWeight:500, color:'#0f1117' }}>
          {row.estimated_value_cr ? `₹${parseFloat(row.estimated_value_cr).toFixed(1)} Cr` : '—'}
        </Typography>
        {daysLeft !== null && (
          <Box sx={{ fontSize:10, fontFamily:'"DM Mono",monospace',
            color: daysLeft < 0 ? '#dc2626' : daysLeft <= 3 ? '#d97706' : '#8892a4' }}>
            {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
          </Box>
        )}
      </Box>
      {(row.pending_actions > 0) && (
        <Box sx={{ mt:0.75, display:'flex', alignItems:'center', gap:0.5 }}>
          <WarningAmberOutlined sx={{ fontSize:11, color:'#d97706' }} />
          <Typography sx={{ fontSize:10, color:'#d97706' }}>{row.pending_actions} action(s) pending</Typography>
        </Box>
      )}
      {row.go_no_go_decision === 'No-Go' && (
        <Chip label="No-Go" size="small" sx={{ mt:0.5, height:16, fontSize:9, backgroundColor:'#fef2f2', color:'#dc2626' }} />
      )}
    </Box>
  );
}

// ── Kanban Board ──────────────────────────────────────────────────────────────
function KanbanView({ rows, onCardClick }) {
  const byStage = {};
  STAGES.forEach(s => { byStage[s] = []; });
  rows.forEach(r => { if (byStage[r.current_stage]) byStage[r.current_stage].push(r); });

  return (
    <Box sx={{ display:'flex', gap:1.5, overflowX:'auto', pb:2, minHeight:500 }}>
      {STAGES.map(stage => {
        const sc = STAGE_COLORS[stage] || {};
        const cards = byStage[stage] || [];
        return (
          <Box key={stage} sx={{ minWidth:220, maxWidth:220, flexShrink:0 }}>
            <Box sx={{ px:1.25, py:0.875, borderRadius:'8px 8px 0 0', mb:0.5,
              backgroundColor: sc.bg, border:`1px solid ${sc.color}30`,
              display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <Typography sx={{ fontSize:11, fontWeight:600, color:sc.color, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                {stage}
              </Typography>
              <Box sx={{ fontSize:10, fontWeight:600, px:0.75, py:0.2, borderRadius:'4px',
                backgroundColor: sc.color + '20', color:sc.color }}>
                {cards.length}
              </Box>
            </Box>
            <Box sx={{ maxHeight:620, overflowY:'auto', pr:0.5 }}>
              {cards.length === 0 ? (
                <Box sx={{ p:2, textAlign:'center' }}>
                  <Typography sx={{ fontSize:11, color:'#8892a4' }}>No tenders</Typography>
                </Box>
              ) : cards.map(r => <KanbanCard key={r.id} row={r} onClick={onCardClick} />)}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TenderList() {
  const navigate  = useNavigate();
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [total,   setTotal]   = useState(0);
  const [view,    setView]    = useState('kanban');   // kanban | table
  const [page,    setPage]    = useState(0);
  const [pageSize,setPageSize]= useState(20);
  const [search,  setSearch]  = useState('');
  const [stageF,  setStageF]  = useState('');
  const [healthF, setHealthF] = useState('');
  const [priorF,  setPriorF]  = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await lifecycleAPI.list({
        page:page+1, limit:view==='kanban'?200:pageSize,
        ...(search  && { search }),
        ...(stageF  && { stage:stageF }),
        ...(healthF && { health:healthF }),
        ...(priorF  && { priority:priorF }),
      });
      setRows(res.data.data);
      setTotal(res.data.pagination.total);
    } catch { setError('Failed to load tenders.'); }
    finally  { setLoading(false); }
  }, [page, pageSize, search, stageF, healthF, priorF, view]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { field:'tender_name', headerName:'Tender Name', flex:1.4, minWidth:200,
      renderCell:p=><Typography sx={{fontSize:13,fontWeight:500,color:'#0f1117'}}>{p.value}</Typography> },
    { field:'customer_name', headerName:'Customer', flex:1, minWidth:130 },
    { field:'current_stage', headerName:'Stage', width:150,
      renderCell:p => {
        const sc = STAGE_COLORS[p.value] || {};
        return <Chip label={p.value} size="small" sx={{fontSize:10,height:20,backgroundColor:sc.bg,color:sc.color}} />;
      }},
    { field:'health_status', headerName:'Health', width:90,
      renderCell:p => (
        <Box sx={{width:10,height:10,borderRadius:'50%',backgroundColor:HEALTH_COLORS[p.value],mx:'auto'}} />
      )},
    { field:'priority', headerName:'Priority', width:100,
      renderCell:p=><Typography sx={{fontSize:12,color:PRIORITY_COLORS[p.value]||'#8892a4'}}>{p.value}</Typography> },
    { field:'estimated_value_cr', headerName:'Value (Cr)', width:120,
      renderCell:p=><Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:12,fontWeight:500}}>
        {p.value?`₹${parseFloat(p.value).toFixed(2)}`:'—'}</Typography> },
    { field:'stage_due_date', headerName:'Due Date', width:110,
      renderCell:p => {
        if (!p.value) return <Typography sx={{color:'#8892a4',fontSize:12}}>—</Typography>;
        const d = Math.floor((new Date(p.value)-new Date())/(1000*60*60*24));
        return <Typography sx={{fontFamily:'"DM Mono",monospace',fontSize:12,
          color:d<0?'#dc2626':d<=3?'#d97706':'#525868'}}>
          {new Date(p.value).toLocaleDateString('en-IN')}</Typography>;
      }},
    { field:'go_no_go_decision', headerName:'Go/No-Go', width:100,
      renderCell:p=><Chip label={p.value} size="small" sx={{fontSize:10,height:18,
        backgroundColor:p.value==='Go'?'#f0fdf4':p.value==='No-Go'?'#fef2f2':'#f1f3f7',
        color:p.value==='Go'?'#16a34a':p.value==='No-Go'?'#dc2626':'#8892a4'}} /> },
    { field:'stage_owner_name', headerName:'Owner', width:120,
      renderCell:p=><Typography sx={{fontSize:12,color:'#525868'}}>{p.value||'—'}</Typography> },
    { field:'actions', headerName:'', width:60, sortable:false,
      renderCell:p=>(
        <Tooltip title="View lifecycle">
          <IconButton size="small" onClick={()=>navigate(`/lifecycle/${p.row.id}`)}>
            <ArrowForwardOutlined sx={{fontSize:16,color:'#2563eb'}} />
          </IconButton>
        </Tooltip>
      )},
  ];

  const topBarActions = (
    <Box sx={{display:'flex',alignItems:'center',gap:1.5,flex:1,justifyContent:'flex-end'}}>
      {/* View toggle */}
      <Box sx={{display:'flex',backgroundColor:'#f1f3f7',borderRadius:2,p:'3px',gap:'3px'}}>
        {[{v:'kanban',icon:<ViewKanbanOutlined sx={{fontSize:16}}/>},
          {v:'table', icon:<TableRowsOutlined  sx={{fontSize:16}}/>}].map(({v,icon})=>(
          <Box key={v} onClick={()=>setView(v)} sx={{
            p:'5px 10px',borderRadius:'6px',cursor:'pointer',display:'flex',alignItems:'center',
            backgroundColor:view===v?'#fff':'transparent',
            color:view===v?'#0f1117':'#8892a4',
            boxShadow:view===v?'0 1px 3px rgba(0,0,0,0.08)':'none',
          }}>{icon}</Box>
        ))}
      </Box>
      <Button variant="contained" size="small" startIcon={<AddOutlined sx={{fontSize:16}}/>}
        onClick={()=>navigate('/lifecycle/new')} sx={{px:2}}>
        Start Lifecycle
      </Button>
    </Box>
  );

  return (
    <PageShell title="Tender Lifecycle Engine" actions={topBarActions}>
      <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
        {error && <Alert severity="error" onClose={()=>setError('')}>{error}</Alert>}

        {/* Filters */}
        <Box sx={{display:'flex',alignItems:'center',gap:1.5,flexWrap:'wrap'}}>
          <TextField placeholder="Search tender, customer..." value={search}
            onChange={e=>{setSearch(e.target.value);setPage(0);}} size="small" sx={{width:260}}
            InputProps={{startAdornment:<InputAdornment position="start"><SearchOutlined sx={{fontSize:16,color:'#8892a4'}}/></InputAdornment>}} />
          <FormControl size="small" sx={{minWidth:160}}>
            <InputLabel>Stage</InputLabel>
            <Select value={stageF} label="Stage" onChange={e=>{setStageF(e.target.value);setPage(0);}}>
              <MenuItem value="">All Stages</MenuItem>
              {STAGES.map(s=><MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{minWidth:120}}>
            <InputLabel>Health</InputLabel>
            <Select value={healthF} label="Health" onChange={e=>{setHealthF(e.target.value);setPage(0);}}>
              <MenuItem value="">All</MenuItem>
              {['Green','Amber','Red'].map(h=>(
                <MenuItem key={h} value={h}>
                  <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                    <Box sx={{width:8,height:8,borderRadius:'50%',backgroundColor:HEALTH_COLORS[h]}}/>
                    {h}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{minWidth:120}}>
            <InputLabel>Priority</InputLabel>
            <Select value={priorF} label="Priority" onChange={e=>{setPriorF(e.target.value);setPage(0);}}>
              <MenuItem value="">All</MenuItem>
              {['Critical','High','Normal','Low'].map(p=><MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{flex:1}}/>
          <Typography sx={{fontSize:12,color:'#8892a4'}}>{total} tenders</Typography>
        </Box>

        {/* Health summary pills */}
        <Box sx={{display:'flex',gap:1}}>
          {loading ? null : ['Green','Amber','Red'].map(h => {
            const cnt = rows.filter(r=>r.health_status===h).length;
            return (
              <Box key={h} sx={{display:'flex',alignItems:'center',gap:0.75,px:1.5,py:0.625,
                borderRadius:'20px',border:`1px solid ${HEALTH_COLORS[h]}40`,
                backgroundColor:HEALTH_COLORS[h]+'10',cursor:'pointer',
                outline:healthF===h?`2px solid ${HEALTH_COLORS[h]}`:'none'}}
                onClick={()=>setHealthF(healthF===h?'':h)}>
                <Box sx={{width:7,height:7,borderRadius:'50%',backgroundColor:HEALTH_COLORS[h]}}/>
                <Typography sx={{fontSize:11,fontWeight:500,color:HEALTH_COLORS[h]}}>{h}</Typography>
                <Typography sx={{fontSize:11,fontFamily:'"DM Mono",monospace',color:HEALTH_COLORS[h]}}>{cnt}</Typography>
              </Box>
            );
          })}
          {rows.filter(r=>r.is_overdue).length > 0 && (
            <Box sx={{display:'flex',alignItems:'center',gap:0.75,px:1.5,py:0.625,
              borderRadius:'20px',border:'1px solid #dc262640',backgroundColor:'#fef2f2'}}>
              <WarningAmberOutlined sx={{fontSize:12,color:'#dc2626'}}/>
              <Typography sx={{fontSize:11,fontWeight:500,color:'#dc2626'}}>
                {rows.filter(r=>r.is_overdue).length} overdue
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{display:'flex',justifyContent:'center',py:8}}><CircularProgress size={32}/></Box>
        ) : view === 'kanban' ? (
          <KanbanView rows={rows} onCardClick={id=>navigate(`/lifecycle/${id}`)} />
        ) : (
          <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', overflow:'hidden',
            '& .MuiDataGrid-root':{border:'none'},
            '& .MuiDataGrid-columnHeaders':{backgroundColor:'#f1f3f7',borderBottom:'1px solid #e4e8ef',fontSize:10,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em',color:'#8892a4'},
            '& .MuiDataGrid-cell':{borderBottom:'1px solid #e4e8ef',fontSize:13,color:'#525868'},
            '& .MuiDataGrid-row:hover':{backgroundColor:'#f7f8fa'},
            '& .MuiDataGrid-footerContainer':{borderTop:'1px solid #e4e8ef',backgroundColor:'#f7f8fa'},
          }}>
            <DataGrid rows={rows} columns={columns} loading={loading} rowCount={total}
              pageSizeOptions={[10,20,50]} paginationModel={{page,pageSize}} paginationMode="server"
              onPaginationModelChange={m=>{setPage(m.page);setPageSize(m.pageSize);}}
              onRowClick={p=>navigate(`/lifecycle/${p.row.id}`)}
              disableRowSelectionOnClick disableColumnMenu autoHeight sx={{fontSize:13}} />
          </Box>
        )}
      </Box>
    </PageShell>
  );
}
