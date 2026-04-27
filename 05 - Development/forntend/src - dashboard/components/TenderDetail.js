// frontend/src/pages/TenderLifecycle/TenderDetail.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, Button, Chip, Tabs, Tab,
  Alert, CircularProgress, Divider, Tooltip, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  LinearProgress, Paper,
} from '@mui/material';
import {
  ArrowBackOutlined, CheckCircleOutlined, RadioButtonUncheckedOutlined,
  AddOutlined, EditOutlined, WarningAmberOutlined,
  ArrowForwardOutlined, PictureAsPdfOutlined, GroupsOutlined,
  HistoryOutlined,
} from '@mui/icons-material';
import PageShell        from '../../components/Layout/PageShell';
import { lifecycleAPI } from '../../api/lifecycle.api';

const STAGES = [
  'Identified','Qualifying','Document Study',
  'Pre-Bid Meeting','Bid Submission','Evaluation','Result','Closed',
];

const STAGE_COLORS = {
  'Identified':      '#525868', 'Qualifying':      '#2563eb',
  'Document Study':  '#7c3aed', 'Pre-Bid Meeting': '#c2410c',
  'Bid Submission':  '#b45309', 'Evaluation':      '#0d9488',
  'Result':          '#16a34a', 'Closed':          '#6b7280',
};

const HEALTH_COLORS = { Green:'#16a34a', Amber:'#d97706', Red:'#dc2626' };

function HealthBadge({ status }) {
  const color = HEALTH_COLORS[status] || '#8892a4';
  return (
    <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
      <Box sx={{ width:8, height:8, borderRadius:'50%', backgroundColor:color,
        ...(status==='Red' && { animation:'pulse 1.5s infinite',
          '@keyframes pulse':{ '0%,100%':{ opacity:1 }, '50%':{ opacity:0.4 } } }) }} />
      <Typography sx={{ fontSize:11, fontWeight:500, color }}>{status}</Typography>
    </Box>
  );
}

// ── Stage Progress Bar ─────────────────────────────────────────────────────────
function StageProgress({ currentStage }) {
  const idx = STAGES.indexOf(currentStage);
  return (
    <Box sx={{ display:'flex', alignItems:'center', gap:0 }}>
      {STAGES.map((s, i) => {
        const done    = i < idx;
        const active  = i === idx;
        const pending = i > idx;
        const color   = STAGE_COLORS[s] || '#8892a4';
        return (
          <Box key={s} sx={{ display:'flex', alignItems:'center', flex:1 }}>
            <Tooltip title={s}>
              <Box sx={{
                display:'flex', alignItems:'center', justifyContent:'center',
                width:28, height:28, borderRadius:'50%', flexShrink:0,
                backgroundColor: done ? '#16a34a' : active ? color : '#e4e8ef',
                border: active ? `2px solid ${color}` : 'none',
                cursor:'default',
              }}>
                {done ? (
                  <CheckCircleOutlined sx={{ fontSize:14, color:'#fff' }} />
                ) : (
                  <Typography sx={{ fontSize:9, fontWeight:600,
                    color: active ? '#fff' : '#8892a4' }}>{i+1}</Typography>
                )}
              </Box>
            </Tooltip>
            {i < STAGES.length - 1 && (
              <Box sx={{ flex:1, height:2, backgroundColor: done ? '#16a34a' : '#e4e8ef', mx:0.25 }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// ── Action Checklist Item ──────────────────────────────────────────────────────
function ActionItem({ action, onComplete }) {
  const [completing, setCompleting] = useState(false);
  const [notes,      setNotes]      = useState('');
  const [open,       setOpen]       = useState(false);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const fd = new FormData();
      if (notes) fd.append('notes', notes);
      await lifecycleAPI.completeAction(action.lifecycle_id, action.id, fd);
      onComplete();
      setOpen(false);
    } catch { alert('Failed to complete action.'); }
    finally { setCompleting(false); }
  };

  const typeIcon = { Task:'T', Document:'D', Approval:'A', Alert:'!' }[action.action_type] || 'T';
  const typeColor= { Task:'#2563eb', Document:'#7c3aed', Approval:'#16a34a', Alert:'#dc2626' }[action.action_type];

  return (
    <>
      <Box sx={{ display:'flex', alignItems:'center', gap:1.25, py:1, px:1.25,
        borderRadius:'8px', backgroundColor: action.is_completed ? '#f9fafb' : '#fff',
        border:'1px solid #e4e8ef', mb:0.75,
        opacity: action.is_completed ? 0.7 : 1 }}>
        <Box sx={{ width:20, height:20, borderRadius:'50%', backgroundColor: typeColor+'20',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Typography sx={{ fontSize:9, fontWeight:700, color:typeColor }}>{typeIcon}</Typography>
        </Box>
        <Box sx={{ flex:1 }}>
          <Typography sx={{ fontSize:12, fontWeight: action.is_mandatory ? 500 : 400,
            color: action.is_completed ? '#8892a4' : '#0f1117',
            textDecoration: action.is_completed ? 'line-through' : 'none' }}>
            {action.action_title}
            {action.is_mandatory && !action.is_completed &&
              <Typography component="span" sx={{ fontSize:10, color:'#dc2626', ml:0.5 }}>*</Typography>}
          </Typography>
          {action.completed_by_name && (
            <Typography sx={{ fontSize:10, color:'#8892a4' }}>
              Done by {action.completed_by_name} · {action.completed_at ? new Date(action.completed_at).toLocaleDateString('en-IN') : ''}
            </Typography>
          )}
          {action.notes && <Typography sx={{ fontSize:10, color:'#525868', mt:0.25 }}>{action.notes}</Typography>}
        </Box>
        {!action.is_completed ? (
          <Button size="small" variant="outlined" onClick={() => setOpen(true)}
            sx={{ fontSize:11, py:0.25, px:1, minWidth:0 }}>
            Done
          </Button>
        ) : (
          <CheckCircleOutlined sx={{ fontSize:16, color:'#16a34a' }} />
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize:14, fontWeight:600, pb:1 }}>Complete Action</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize:13, mb:1.5 }}>{action.action_title}</Typography>
          <TextField label="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)}
            fullWidth size="small" multiline rows={2} />
        </DialogContent>
        <DialogActions sx={{ px:2.5, pb:2 }}>
          <Button onClick={()=>setOpen(false)} size="small" variant="outlined">Cancel</Button>
          <Button onClick={handleComplete} size="small" variant="contained" disabled={completing}>
            {completing ? 'Saving...' : 'Mark Complete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ── Move Stage Dialog ──────────────────────────────────────────────────────────
function MoveStageDialog({ open, lifecycle, onClose, onMoved }) {
  const currentIdx = STAGES.indexOf(lifecycle?.current_stage);
  const nextStage  = STAGES[currentIdx + 1];
  const [toStage,      setToStage]      = useState(nextStage || '');
  const [notes,        setNotes]        = useState('');
  const [dueDate,      setDueDate]      = useState('');
  const [finalOutcome, setFinalOutcome] = useState('');
  const [moving,       setMoving]       = useState(false);

  const handleMove = async () => {
    setMoving(true);
    try {
      await lifecycleAPI.moveStage(lifecycle.id, {
        to_stage: toStage, notes, stage_due_date: dueDate,
        ...(toStage === 'Closed' && { final_outcome: finalOutcome }),
      });
      onMoved();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to move stage.');
    } finally { setMoving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize:14, fontWeight:600, pb:1 }}>Move to Next Stage</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt:2 }}>
        <FormControl fullWidth size="small" sx={{ mb:2 }}>
          <InputLabel>Move to Stage</InputLabel>
          <Select value={toStage} label="Move to Stage" onChange={e=>setToStage(e.target.value)}>
            {STAGES.slice(currentIdx + 1).map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {toStage === 'Closed' && (
          <FormControl fullWidth size="small" sx={{ mb:2 }}>
            <InputLabel>Final Outcome *</InputLabel>
            <Select value={finalOutcome} label="Final Outcome *" onChange={e=>setFinalOutcome(e.target.value)}>
              {['Won','Lost-L2','Lost-L3','Lost-Technical','Lost-Price',
                'Withdrawn','Cancelled-by-Customer','Not-Participated','Disqualified'].map(o=>(
                <MenuItem key={o} value={o}>{o}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField label="Stage Due Date" type="date" value={dueDate}
          onChange={e=>setDueDate(e.target.value)} fullWidth size="small" sx={{ mb:2 }}
          InputLabelProps={{ shrink:true }} />
        <TextField label="Transition Notes" value={notes} onChange={e=>setNotes(e.target.value)}
          fullWidth size="small" multiline rows={3} />
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px:2.5, pb:2, gap:1 }}>
        <Button onClick={onClose} variant="outlined" size="small">Cancel</Button>
        <Button onClick={handleMove} variant="contained" size="small" disabled={moving || !toStage}
          endIcon={<ArrowForwardOutlined sx={{ fontSize:14 }} />}>
          {moving ? 'Moving...' : `Move to ${toStage || '...'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── MAIN DETAIL PAGE ──────────────────────────────────────────────────────────
export default function TenderDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [lc,      setLc]      = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [tab,     setTab]     = useState(0);
  const [moveOpen,setMoveOpen]= useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await lifecycleAPI.getOne(id);
      setLc(res.data.data);
    } catch { setError('Failed to load tender lifecycle.'); }
    finally   { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <PageShell title="Tender Lifecycle"><Box sx={{display:'flex',justifyContent:'center',pt:8}}><CircularProgress size={32}/></Box></PageShell>;
  if (error)   return <PageShell title="Tender Lifecycle"><Alert severity="error">{error}</Alert></PageShell>;
  if (!lc)     return null;

  // Compute action stats for current stage
  const currentActions = (lc.actions || []).filter(a => a.stage === lc.current_stage);
  const mandatoryDone  = currentActions.filter(a => a.is_mandatory && a.is_completed).length;
  const mandatoryTotal = currentActions.filter(a => a.is_mandatory).length;
  const progress       = mandatoryTotal > 0 ? Math.round((mandatoryDone / mandatoryTotal) * 100) : 100;
  const canMove        = progress === 100;
  const isClosed       = lc.current_stage === 'Closed';

  const topBarActions = (
    <Box sx={{ display:'flex', alignItems:'center', gap:1.5, flex:1, justifyContent:'flex-end' }}>
      {!isClosed && (
        <>
          {lc.go_no_go_decision === 'Pending' && lc.current_stage === 'Qualifying' && (
            <Button size="small" variant="outlined" color="error"
              onClick={async () => {
                if (window.confirm('Record No-Go? This will close the tender.')) {
                  await lifecycleAPI.goNoGo(id, { decision:'No-Go', reason:'Decided not to bid.' });
                  fetchData();
                }
              }}>
              No-Go
            </Button>
          )}
          {lc.go_no_go_decision !== 'No-Go' && (
            <Button size="small" variant="contained" endIcon={<ArrowForwardOutlined sx={{ fontSize:14 }} />}
              onClick={() => setMoveOpen(true)} disabled={!canMove}
              sx={{ px:2 }}>
              Next Stage
            </Button>
          )}
        </>
      )}
    </Box>
  );

  return (
    <PageShell title="Tender Lifecycle" actions={topBarActions}>
      <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
        {/* Back button */}
        <Button startIcon={<ArrowBackOutlined sx={{ fontSize:16 }} />} size="small"
          onClick={() => navigate('/lifecycle')} sx={{ width:'fit-content', color:'#525868', fontSize:12 }}>
          All Tenders
        </Button>

        {/* Header card */}
        <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', p:'18px 20px' }}>
          <Box sx={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', mb:1.5 }}>
            <Box sx={{ flex:1 }}>
              <Typography sx={{ fontSize:16, fontWeight:600, color:'#0f1117' }}>{lc.tender_name}</Typography>
              <Typography sx={{ fontSize:13, color:'#525868', mt:0.25 }}>
                {lc.customer_name} · {lc.civil_defence} · {lc.business_domain}
              </Typography>
            </Box>
            <Box sx={{ display:'flex', alignItems:'center', gap:2, flexShrink:0 }}>
              <HealthBadge status={lc.health_status} />
              <Chip label={lc.priority} size="small" sx={{ fontSize:10,height:20,
                backgroundColor:({Critical:'#fef2f2',High:'#fff7ed',Normal:'#eff4ff',Low:'#f9fafb'}[lc.priority]),
                color:({Critical:'#dc2626',High:'#c2410c',Normal:'#2563eb',Low:'#525868'}[lc.priority]) }} />
            </Box>
          </Box>

          {/* Stage progress */}
          <StageProgress currentStage={lc.current_stage} />
          <Box sx={{ display:'flex', justifyContent:'center', mt:0.75 }}>
            <Typography sx={{ fontSize:11, fontWeight:600, color:STAGE_COLORS[lc.current_stage]||'#525868' }}>
              Current Stage: {lc.current_stage}
            </Typography>
          </Box>

          {/* Action progress */}
          {!isClosed && (
            <Box sx={{ mt:1.5, backgroundColor:'#f7f8fa', borderRadius:'8px', p:1.25 }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.5 }}>
                <Typography sx={{ fontSize:11, color:'#525868' }}>
                  Stage checklist: {mandatoryDone}/{mandatoryTotal} mandatory actions complete
                </Typography>
                <Typography sx={{ fontSize:11, fontWeight:500, color: canMove ? '#16a34a' : '#d97706' }}>
                  {canMove ? 'Ready to advance' : `${mandatoryTotal - mandatoryDone} remaining`}
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress}
                sx={{ height:5, borderRadius:3,
                  '& .MuiLinearProgress-bar':{ backgroundColor: canMove ? '#16a34a' : '#d97706' } }} />
            </Box>
          )}

          {/* Key fields row */}
          <Grid container spacing={2} sx={{ mt:0.5 }}>
            {[
              { label:'Estimated Value', value: lc.estimated_value_cr ? `₹${parseFloat(lc.estimated_value_cr).toFixed(2)} Cr` : '—' },
              { label:'Bid Price',       value: lc.bid_price_cr ? `₹${parseFloat(lc.bid_price_cr).toFixed(2)} Cr` : '—' },
              { label:'EMD',             value: lc.emd_amount ? `₹${parseFloat(lc.emd_amount).toLocaleString('en-IN')}` : '—' },
              { label:'Submission Date', value: lc.last_submission_date ? new Date(lc.last_submission_date).toLocaleDateString('en-IN') : '—' },
              { label:'Go/No-Go',        value: lc.go_no_go_decision },
              { label:'L-Position',      value: lc.result_l_position || '—' },
            ].map((f,i)=>(
              <Grid item xs={2} key={i}>
                <Typography sx={{ fontSize:10, color:'#8892a4', textTransform:'uppercase', letterSpacing:'0.05em' }}>{f.label}</Typography>
                <Typography sx={{ fontSize:13, fontWeight:500, fontFamily:'"DM Mono",monospace', mt:0.25 }}>{f.value}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ backgroundColor:'#f1f3f7', borderRadius:2, p:'3px', display:'inline-flex' }}>
          <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{
            minHeight:34,
            '& .MuiTabs-indicator':{ height:'100%', borderRadius:'6px', backgroundColor:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', zIndex:0 },
            '& .MuiTab-root':{ minHeight:28, py:0, px:1.75, fontSize:12, fontWeight:400, color:'#525868', zIndex:1, minWidth:'auto',
              '&.Mui-selected':{ fontWeight:500, color:'#0f1117' } },
          }}>
            {['Checklist','Stage History','Corrigendums','Competitors','Consortium','Alerts','Details'].map(t=>(
              <Tab key={t} label={t} disableRipple />
            ))}
          </Tabs>
        </Box>

        {/* ── TAB 0: CHECKLIST ──────────────────────────────────────── */}
        {tab === 0 && (
          <Box>
            {STAGES.filter(s => s !== 'Closed').map(stage => {
              const acts = (lc.actions || []).filter(a => a.stage === stage);
              if (acts.length === 0) return null;
              const sc = STAGE_COLORS[stage];
              const done = acts.filter(a=>a.is_completed).length;
              return (
                <Box key={stage} sx={{ mb:2 }}>
                  <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:1 }}>
                    <Box sx={{ width:8, height:8, borderRadius:'50%',
                      backgroundColor: stage===lc.current_stage ? sc : done===acts.length ? '#16a34a' : '#d1d5db' }} />
                    <Typography sx={{ fontSize:12, fontWeight:600, color: stage===lc.current_stage ? sc : '#525868' }}>
                      {stage}
                    </Typography>
                    <Typography sx={{ fontSize:11, color:'#8892a4' }}>({done}/{acts.length} done)</Typography>
                  </Box>
                  {acts.map(a => (
                    <ActionItem key={a.id} action={a} onComplete={fetchData} />
                  ))}
                </Box>
              );
            })}
          </Box>
        )}

        {/* ── TAB 1: STAGE HISTORY ──────────────────────────────────── */}
        {tab === 1 && (
          <Box>
            {(lc.history || []).map((h, i) => (
              <Box key={i} sx={{ display:'flex', gap:2, mb:1.5 }}>
                <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                  <Box sx={{ width:10, height:10, borderRadius:'50%',
                    backgroundColor: STAGE_COLORS[h.to_stage] || '#8892a4', flexShrink:0 }} />
                  {i < (lc.history.length - 1) && (
                    <Box sx={{ width:1, flex:1, backgroundColor:'#e4e8ef', my:0.5 }} />
                  )}
                </Box>
                <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'10px',
                  p:'12px 14px', flex:1, mb:0.5 }}>
                  <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.5 }}>
                    <Typography sx={{ fontSize:13, fontWeight:500 }}>
                      {h.from_stage ? `${h.from_stage} → ${h.to_stage}` : `Started: ${h.to_stage}`}
                    </Typography>
                    <Typography sx={{ fontSize:11, color:'#8892a4', fontFamily:'"DM Mono",monospace' }}>
                      {new Date(h.transitioned_at).toLocaleDateString('en-IN')}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize:11, color:'#8892a4' }}>
                    By {h.transitioned_by_name || 'System'} · {h.days_spent} day(s) in stage
                    {h.was_overdue && <Typography component="span" sx={{ color:'#dc2626', ml:1 }}>· Was overdue</Typography>}
                  </Typography>
                  {h.notes && <Typography sx={{ fontSize:12, color:'#525868', mt:0.5 }}>{h.notes}</Typography>}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* ── TAB 2: CORRIGENDUMS ───────────────────────────────────── */}
        {tab === 2 && (
          <Box>
            <Box sx={{ display:'flex', justifyContent:'flex-end', mb:1.5 }}>
              <Button size="small" variant="outlined" startIcon={<AddOutlined sx={{ fontSize:14 }} />}
                onClick={() => { /* open corrigendum modal */ }}>
                Add Corrigendum
              </Button>
            </Box>
            {(lc.corrigendums || []).length === 0 ? (
              <Box sx={{ p:3, textAlign:'center' }}>
                <Typography sx={{ color:'#8892a4', fontSize:13 }}>No corrigendums recorded.</Typography>
              </Box>
            ) : (lc.corrigendums || []).map((c, i) => (
              <Box key={i} sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef',
                borderLeft:`3px solid ${c.impact==='Deadline Extended'?'#d97706':'#2563eb'}`,
                borderRadius:'10px', p:'12px 16px', mb:1 }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.5 }}>
                  <Typography sx={{ fontSize:13, fontWeight:500 }}>Corrigendum #{c.corrigendum_no}</Typography>
                  <Box sx={{ display:'flex', gap:1 }}>
                    <Chip label={c.impact || 'Other'} size="small" sx={{ fontSize:10, height:18 }} />
                    <Typography sx={{ fontSize:11, color:'#8892a4', fontFamily:'"DM Mono",monospace' }}>
                      {new Date(c.issued_date).toLocaleDateString('en-IN')}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize:12, color:'#525868' }}>{c.description}</Typography>
                {c.new_deadline && (
                  <Typography sx={{ fontSize:11, color:'#d97706', mt:0.5 }}>
                    New deadline: {new Date(c.new_deadline).toLocaleDateString('en-IN')}
                    {c.extension_days && ` (+${c.extension_days} days)`}
                  </Typography>
                )}
                {c.file_name && (
                  <Box sx={{ display:'flex', alignItems:'center', gap:0.5, mt:0.75 }}>
                    <PictureAsPdfOutlined sx={{ fontSize:14, color:'#dc2626' }} />
                    <Typography sx={{ fontSize:11, color:'#2563eb', cursor:'pointer' }}>{c.file_name}</Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* ── TAB 3: COMPETITORS ───────────────────────────────────── */}
        {tab === 3 && (
          <Box>
            <Box sx={{ display:'flex', justifyContent:'flex-end', mb:1.5 }}>
              <Button size="small" variant="outlined" startIcon={<AddOutlined sx={{ fontSize:14 }} />}>
                Add Competitor
              </Button>
            </Box>
            {(lc.competitors || []).length === 0 ? (
              <Box sx={{ p:3, textAlign:'center' }}>
                <Typography sx={{ color:'#8892a4', fontSize:13 }}>No competitor intelligence recorded.</Typography>
              </Box>
            ) : (lc.competitors || []).map((c, i) => (
              <Box key={i} sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef',
                borderLeft:`3px solid ${c.won_this_tender?'#dc2626':'#e4e8ef'}`,
                borderRadius:'10px', p:'12px 16px', mb:1 }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.75 }}>
                  <Typography sx={{ fontSize:13, fontWeight:500 }}>{c.competitor_name}</Typography>
                  <Box sx={{ display:'flex', gap:1 }}>
                    {c.l_position && <Chip label={c.l_position} size="small" sx={{ fontSize:10, height:18, backgroundColor:'#eff4ff', color:'#2563eb' }} />}
                    {c.won_this_tender && <Chip label="Won" size="small" sx={{ fontSize:10, height:18, backgroundColor:'#fef2f2', color:'#dc2626' }} />}
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  {c.prev_bid_price_cr && <Grid item xs={3}><Typography sx={{ fontSize:10, color:'#8892a4' }}>Previous Bid</Typography><Typography sx={{ fontSize:12, fontFamily:'"DM Mono",monospace' }}>₹{c.prev_bid_price_cr} Cr</Typography></Grid>}
                  {c.bid_price_at_result && <Grid item xs={3}><Typography sx={{ fontSize:10, color:'#8892a4' }}>Result Bid</Typography><Typography sx={{ fontSize:12, fontFamily:'"DM Mono",monospace' }}>₹{c.bid_price_at_result} Cr</Typography></Grid>}
                  {c.known_strength && <Grid item xs={6}><Typography sx={{ fontSize:10, color:'#8892a4' }}>Strength</Typography><Typography sx={{ fontSize:12 }}>{c.known_strength}</Typography></Grid>}
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        {/* ── TAB 4: CONSORTIUM ────────────────────────────────────── */}
        {tab === 4 && (
          <Box>
            <Box sx={{ display:'flex', justifyContent:'flex-end', mb:1.5 }}>
              <Button size="small" variant="outlined" startIcon={<AddOutlined sx={{ fontSize:14 }} />}>
                Add Partner
              </Button>
            </Box>
            {(lc.consortium || []).length === 0 ? (
              <Box sx={{ p:3, textAlign:'center' }}>
                <Typography sx={{ color:'#8892a4', fontSize:13 }}>
                  {lc.sole_consortium === 'Sole' ? 'This is a sole bid (no consortium).' : 'No consortium partners added.'}
                </Typography>
              </Box>
            ) : (lc.consortium || []).map((m, i) => (
              <Box key={i} sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'10px', p:'12px 16px', mb:1 }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.75 }}>
                  <Typography sx={{ fontSize:13, fontWeight:500 }}>{m.partner_name}</Typography>
                  <Box sx={{ display:'flex', gap:1 }}>
                    <Chip label={m.role || 'Partner'} size="small" sx={{ fontSize:10, height:18 }} />
                    {m.mou_signed && <Chip label="MOU Signed" size="small" sx={{ fontSize:10, height:18, backgroundColor:'#f0fdf4', color:'#16a34a' }} />}
                  </Box>
                </Box>
                {m.scope_of_work && <Typography sx={{ fontSize:12, color:'#525868', mb:0.5 }}>{m.scope_of_work}</Typography>}
                <Box sx={{ display:'flex', gap:3 }}>
                  {m.value_share_cr && <Typography sx={{ fontSize:11, color:'#8892a4' }}>Share: <strong>₹{m.value_share_cr} Cr</strong></Typography>}
                  {m.contact_person  && <Typography sx={{ fontSize:11, color:'#8892a4' }}>Contact: <strong>{m.contact_person}</strong></Typography>}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* ── TAB 5: ALERTS ────────────────────────────────────────── */}
        {tab === 5 && (
          <Box>
            {(lc.alerts || []).length === 0 ? (
              <Box sx={{ p:3, textAlign:'center' }}>
                <Typography sx={{ color:'#8892a4', fontSize:13 }}>No active alerts.</Typography>
              </Box>
            ) : (lc.alerts || []).map((a, i) => {
              const sColor = { Critical:'#dc2626', Warning:'#d97706', Normal:'#2563eb', Info:'#8892a4' }[a.severity];
              return (
                <Box key={i} sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef',
                  borderLeft:`3px solid ${sColor}`, borderRadius:'10px',
                  p:'10px 14px', mb:0.75, display:'flex', alignItems:'center', gap:1.5 }}>
                  <WarningAmberOutlined sx={{ fontSize:16, color:sColor, flexShrink:0 }} />
                  <Box sx={{ flex:1 }}>
                    <Typography sx={{ fontSize:12, fontWeight:500 }}>{a.title}</Typography>
                    {a.message && <Typography sx={{ fontSize:11, color:'#8892a4' }}>{a.message}</Typography>}
                  </Box>
                  <Typography sx={{ fontSize:11, fontFamily:'"DM Mono",monospace', color:sColor, flexShrink:0 }}>
                    {new Date(a.due_date).toLocaleDateString('en-IN')}
                  </Typography>
                  <Button size="small" sx={{ fontSize:10, py:0.25, px:0.75, color:'#8892a4', minWidth:0 }}
                    onClick={async () => { await lifecycleAPI.dismiss(a.id); fetchData(); }}>
                    Dismiss
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}

        {/* ── TAB 6: FULL DETAILS ──────────────────────────────────── */}
        {tab === 6 && (
          <Grid container spacing={2}>
            {[
              { title:'Tender Details',
                fields:[
                  ['Tender Reference No', lc.tender_reference_no],
                  ['Portal Name', lc.portal_name],
                  ['Portal Tender ID', lc.portal_tender_id],
                  ['Tender Type', lc.tender_type],
                  ['Document Type', lc.document_type],
                  ['Submission Mode', lc.submission_mode],
                  ['Bid Validity (days)', lc.bid_validity_days],
                  ['Sole / Consortium', lc.sole_consortium],
                ] },
              { title:'Financial',
                fields:[
                  ['Estimated Value (Cr)', lc.estimated_value_cr ? `₹${lc.estimated_value_cr}` : '—'],
                  ['Bid Price (Cr)', lc.bid_price_cr ? `₹${lc.bid_price_cr}` : '—'],
                  ['Bid Price incl. GST (Cr)', lc.bid_price_incl_gst_cr ? `₹${lc.bid_price_incl_gst_cr}` : '—'],
                  ['Our Cost Estimate (Cr)', lc.estimated_cost_cr ? `₹${lc.estimated_cost_cr}` : '—'],
                  ['EMD Amount', lc.emd_amount ? `₹${parseFloat(lc.emd_amount).toLocaleString('en-IN')}` : '—'],
                  ['EMD Mode', lc.emd_mode],
                  ['EMD Receipt No.', lc.emd_receipt_no],
                  ['PBG Amount', lc.pbg_amount ? `₹${lc.pbg_amount}` : '—'],
                  ['PBG Expiry', lc.pbg_expiry_date],
                ] },
              { title:'Result',
                fields:[
                  ['L-Position', lc.result_l_position],
                  ['L1 Price (Cr)', lc.result_l1_price_cr ? `₹${lc.result_l1_price_cr}` : '—'],
                  ['Price Difference (Cr)', lc.result_price_diff_cr ? `₹${lc.result_price_diff_cr}` : '—'],
                  ['Result Announced', lc.result_announced_date],
                  ['Negotiation Done', lc.negotiation_done ? 'Yes' : 'No'],
                  ['Negotiation Price (Cr)', lc.negotiation_price_cr ? `₹${lc.negotiation_price_cr}` : '—'],
                  ['Final Outcome', lc.final_outcome],
                  ['Order Value (Cr)', lc.order_value_cr ? `₹${lc.order_value_cr}` : '—'],
                ] },
            ].map(section => (
              <Grid item xs={4} key={section.title}>
                <Box sx={{ backgroundColor:'#fff', border:'1px solid #e4e8ef', borderRadius:'14px', p:'16px 18px' }}>
                  <Typography sx={{ fontSize:12, fontWeight:600, color:'#525868', mb:1.5, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    {section.title}
                  </Typography>
                  {section.fields.map(([label, value]) => (
                    <Box key={label} sx={{ display:'flex', justifyContent:'space-between', py:0.625, borderBottom:'1px solid #f1f3f7' }}>
                      <Typography sx={{ fontSize:11, color:'#8892a4' }}>{label}</Typography>
                      <Typography sx={{ fontSize:11, fontWeight:500, color:'#0f1117', fontFamily:'"DM Mono",monospace', maxWidth:160, textAlign:'right' }}>
                        {value || '—'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Move Stage Dialog */}
      <MoveStageDialog
        open={moveOpen}
        lifecycle={lc}
        onClose={() => setMoveOpen(false)}
        onMoved={fetchData}
      />
    </PageShell>
  );
}
