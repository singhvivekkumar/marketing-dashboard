// src/pages/Leads/LeadFormModal.jsx
// 22-field lead form organized into 4 tabs: Basic Info | Financial | Tender Details | Outcome
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, Typography, Alert, Divider, IconButton,
  Tabs, Tab, CircularProgress, Chip,
} from '@mui/material';
import {
  CloseOutlined, AddOutlined, DeleteOutlined,
  UploadFileOutlined, InsertDriveFileOutlined,
} from '@mui/icons-material';
import { leadsAPI, usersAPI } from '../../api';

const EMPTY = {
  lead_subtype:'', tender_name:'', customer_name:'', customer_location:'',
  tender_type:'', document_type:'', lead_owner_id:'', civil_defence:'',
  business_domain:'', emd_value:'', estimated_value_cr:'', submitted_value_cr:'',
  tender_dated:'', last_submission_date:'', sole_consortium:'',
  prebid_date:'', prebid_time:'', competitors_info:'',
  outcome:'', open_closed:'', order_won_value_cr:'',
  present_status:'', reason_for_losing:'',
};

const TENDER_TYPES    = ['Open','Limited','Single Source','Nomination','Rate Contract'];
const DOCUMENT_TYPES  = ['EOI','RFQ','RFP','NIT','Corrigendum'];
const DOMAINS         = ['Radar','Telecom','CCTV','Surveillance','Communications','Power','IT/Software','Other'];
const SUBTYPES        = ['Submitted','Domestic','Export','CRM','Lost'];
const OUTCOMES        = ['Won','Lost','Participated','Not-Participated'];

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function LeadFormModal({ open, record, onClose }) {
  const isEdit = Boolean(record);
  const [tab,    setTab]    = useState(0);
  const [form,   setForm]   = useState(EMPTY);
  const [corr,   setCorr]   = useState([]);   // corrigendums: [{date, file, existing}]
  const [users,  setUsers]  = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState('');

  useEffect(() => {
    if (open) {
      setTab(0);
      setErrors({});
      setApiErr('');
      if (record) {
        setForm({
          lead_subtype:       record.lead_subtype       || '',
          tender_name:        record.tender_name        || '',
          customer_name:      record.customer_name      || '',
          customer_location:  record.customer_location  || '',
          tender_type:        record.tender_type        || '',
          document_type:      record.document_type      || '',
          lead_owner_id:      record.lead_owner_id      || '',
          civil_defence:      record.civil_defence      || '',
          business_domain:    record.business_domain    || '',
          emd_value:          record.emd_value          || '',
          estimated_value_cr: record.estimated_value_cr || '',
          submitted_value_cr: record.submitted_value_cr || '',
          tender_dated:       record.tender_dated       || '',
          last_submission_date: record.last_submission_date || '',
          sole_consortium:    record.sole_consortium    || '',
          prebid_date:        record.prebid_datetime ? record.prebid_datetime.slice(0,10) : '',
          prebid_time:        record.prebid_datetime ? record.prebid_datetime.slice(11,16) : '',
          competitors_info:   record.competitors_info   || '',
          outcome:            record.outcome            || '',
          open_closed:        record.open_closed        || '',
          order_won_value_cr: record.order_won_value_cr || '',
          present_status:     record.present_status     || '',
          reason_for_losing:  record.reason_for_losing  || '',
        });
        setCorr((record.corrigendums || []).map(c => ({ id: c.id, date: c.corrigendum_date, file: null, name: c.file_name, existing: true })));
      } else {
        setForm(EMPTY);
        setCorr([]);
      }
    }
  }, [open, record]);

  useEffect(() => {
    usersAPI.list().then(r => setUsers(r.data.data)).catch(() => {});
  }, []);

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  const validate = () => {
    const e = {};
    // Tab 0 — Basic
    if (!form.lead_subtype)               e.lead_subtype         = 'Required';
    if (!form.tender_name.trim())         e.tender_name          = 'Required';
    if (!form.customer_name.trim())       e.customer_name        = 'Required';
    if (!form.customer_location.trim())   e.customer_location    = 'Required';
    if (!form.lead_owner_id)              e.lead_owner_id        = 'Required';
    if (!form.civil_defence)              e.civil_defence        = 'Required';
    if (!form.business_domain.trim())     e.business_domain      = 'Required';
    if (!form.sole_consortium)            e.sole_consortium      = 'Required';
    // Tab 1 — Financial
    if (!form.estimated_value_cr)         e.estimated_value_cr   = 'Required';
    // Tab 2 — Tender
    if (!form.tender_type)                e.tender_type          = 'Required';
    if (!form.document_type)              e.document_type        = 'Required';
    if (!form.tender_dated)               e.tender_dated         = 'Required';
    if (!form.last_submission_date)       e.last_submission_date = 'Required';
    if (form.last_submission_date && form.tender_dated && form.last_submission_date < form.tender_dated)
      e.last_submission_date = 'Must be on or after Tender Dated.';
    // Tab 3 — Outcome
    if (!form.outcome)                    e.outcome              = 'Required';
    if (!form.open_closed)                e.open_closed          = 'Required';
    if (!form.present_status.trim())      e.present_status       = 'Required';
    if (form.outcome === 'Won' && !form.order_won_value_cr)
      e.order_won_value_cr = 'Required when outcome is Won.';
    if (['Lost','Not-Participated'].includes(form.outcome) && !form.reason_for_losing?.trim())
      e.reason_for_losing = 'Required when outcome is Lost or Not-Participated.';
    setErrors(e);
    // Jump to first tab with an error
    const t0 = ['lead_subtype','tender_name','customer_name','customer_location','lead_owner_id','civil_defence','business_domain','sole_consortium'];
    const t1 = ['estimated_value_cr'];
    const t2 = ['tender_type','document_type','tender_dated','last_submission_date'];
    if (Object.keys(e).some(k => t0.includes(k))) { setTab(0); return false; }
    if (Object.keys(e).some(k => t1.includes(k))) { setTab(1); return false; }
    if (Object.keys(e).some(k => t2.includes(k))) { setTab(2); return false; }
    if (Object.keys(e).length > 0)                { setTab(3); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true); setApiErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'prebid_date' || k === 'prebid_time') return;
        if (v !== '') fd.append(k, v);
      });
      if (form.prebid_date && form.prebid_time)
        fd.append('prebid_datetime', `${form.prebid_date}T${form.prebid_time}`);

      let leadId = record?.id;
      if (isEdit) {
        await leadsAPI.update(leadId, fd);
      } else {
        const res = await leadsAPI.create(fd);
        leadId = res.data.data.id;
      }

      // Upload new corrigendums
      for (const c of corr) {
        if (!c.existing && c.file && c.date) {
          const cfd = new FormData();
          cfd.append('corrigendum_date', c.date);
          cfd.append('file', c.file);
          await leadsAPI.addCorrigendum(leadId, cfd);
        }
      }

      onClose(true);
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addCorr = () => setCorr(p => [...p, { date:'', file:null, name:'', existing:false }]);
  const removeCorr = async (i) => {
    const c = corr[i];
    if (c.existing && record?.id) {
      try { await leadsAPI.removeCorrigendum(record.id, c.id); } catch {}
    }
    setCorr(p => p.filter((_, j) => j !== i));
  };
  const setCorrDate = (i, v) => setCorr(p => p.map((c, j) => j===i ? {...c,date:v} : c));
  const setCorrFile = (i, f) => setCorr(p => p.map((c, j) => j===i ? {...c,file:f,name:f?.name||''} : c));

  // ── Reusable field components ─────────────────────────────────────────
  const TF = ({ label, field, half, type='text', multiline, rows, required }) => (
    <Grid item xs={half?6:12}>
      <TextField label={`${label}${required?' *':''}`} value={form[field]}
        onChange={e => set(field, e.target.value)} fullWidth size="small"
        type={type} multiline={multiline} rows={rows||1}
        error={Boolean(errors[field])} helperText={errors[field]||''}
        InputLabelProps={type==='date'?{shrink:true}:undefined} />
    </Grid>
  );

  const DD = ({ label, field, options, half, required }) => (
    <Grid item xs={half?6:12}>
      <FormControl fullWidth size="small" error={Boolean(errors[field])}>
        <InputLabel>{label}{required?' *':''}</InputLabel>
        <Select value={form[field]} label={`${label}${required?' *':''}`} onChange={e => set(field, e.target.value)}>
          {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
        </Select>
        {errors[field] && <Typography sx={{fontSize:11,color:'#dc2626',mt:0.5,ml:1.75}}>{errors[field]}</Typography>}
      </FormControl>
    </Grid>
  );

  const tabHasError = (fields) => Object.keys(errors).some(k => fields.includes(k));
  const tabLabel = (label, fields) => (
    <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
      {label}
      {tabHasError(fields) && <Box sx={{ width:6, height:6, borderRadius:'50%', backgroundColor:'#dc2626' }} />}
    </Box>
  );

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth
      PaperProps={{ sx: { height: '90vh', display:'flex', flexDirection:'column' } }}>
      <DialogTitle sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', pb:1 }}>
        <Typography sx={{ fontSize:15, fontWeight:600 }}>
          {isEdit ? 'Edit Lead' : 'New Lead'}
        </Typography>
        <IconButton size="small" onClick={() => onClose(false)}>
          <CloseOutlined sx={{ fontSize:18 }} />
        </IconButton>
      </DialogTitle>
      <Divider />

      {/* Tab bar */}
      <Box sx={{ px:3, pt:1.5, backgroundColor:'#f7f8fa' }}>
        <Tabs value={tab} onChange={(_,v) => setTab(v)}
          sx={{ minHeight:36, backgroundColor:'#f1f3f7', borderRadius:2, p:'3px', display:'inline-flex',
            '& .MuiTabs-indicator':{ height:'100%', borderRadius:'6px', backgroundColor:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', zIndex:0 },
            '& .MuiTab-root':{ minHeight:28, py:0, px:1.75, fontSize:12, fontWeight:400, color:'#525868', zIndex:1, minWidth:'auto',
              '&.Mui-selected':{ fontWeight:500, color:'#0f1117' } },
          }}>
          <Tab label={tabLabel('Basic Info', ['lead_subtype','tender_name','customer_name','customer_location','lead_owner_id','civil_defence','business_domain','sole_consortium'])} disableRipple />
          <Tab label={tabLabel('Financial',  ['estimated_value_cr'])} disableRipple />
          <Tab label={tabLabel('Tender Details', ['tender_type','document_type','tender_dated','last_submission_date'])} disableRipple />
          <Tab label={tabLabel('Outcome & Status', ['outcome','open_closed','present_status','order_won_value_cr','reason_for_losing'])} disableRipple />
        </Tabs>
      </Box>

      <DialogContent sx={{ flex:1, overflowY:'auto', px:3, pt:0 }}>
        {apiErr && <Alert severity="error" sx={{ mt:2, mb:1, borderRadius:2, fontSize:13 }} onClose={() => setApiErr('')}>{apiErr}</Alert>}

        {/* ── TAB 0: BASIC INFO ──────────────────────────────────────── */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={2}>
            <DD label="Lead Sub-Type" field="lead_subtype" options={SUBTYPES} half required />
            <Grid item xs={6}>
              <FormControl fullWidth size="small" error={Boolean(errors.lead_owner_id)}>
                <InputLabel>Lead Owner *</InputLabel>
                <Select value={form.lead_owner_id} label="Lead Owner *" onChange={e => set('lead_owner_id', e.target.value)}>
                  {users.map(u => <MenuItem key={u.id} value={u.id}>{u.full_name}</MenuItem>)}
                </Select>
                {errors.lead_owner_id && <Typography sx={{fontSize:11,color:'#dc2626',mt:0.5,ml:1.75}}>{errors.lead_owner_id}</Typography>}
              </FormControl>
            </Grid>
            <TF label="Tender Name"       field="tender_name"       required />
            <TF label="Customer Name"     field="customer_name"     half required />
            <TF label="Customer Location" field="customer_location" half required />
            <DD label="Civil / Defence"   field="civil_defence"     options={['Civil','Defence']} half required />
            <TF label="Business Domain"   field="business_domain"   half required />
            <DD label="Sole / Consortium" field="sole_consortium"   options={['Sole','Consortium']} half required />
          </Grid>
        </TabPanel>

        {/* ── TAB 1: FINANCIAL ───────────────────────────────────────── */}
        <TabPanel value={tab} index={1}>
          <Grid container spacing={2}>
            <TF label="EMD Value (Rs.)"                  field="emd_value"           half type="number" />
            <TF label="Estimated Value (Cr) excl. GST"   field="estimated_value_cr"  half type="number" required />
            <TF label="Submitted Value (Cr) excl. GST"   field="submitted_value_cr"  half type="number" />
            {form.outcome === 'Won' && (
              <TF label="Order Won Value (Cr) excl. GST" field="order_won_value_cr"  half type="number" required />
            )}
          </Grid>
        </TabPanel>

        {/* ── TAB 2: TENDER DETAILS ──────────────────────────────────── */}
        <TabPanel value={tab} index={2}>
          <Grid container spacing={2}>
            <DD label="Tender Type"    field="tender_type"   options={TENDER_TYPES}   half required />
            <DD label="Document Type"  field="document_type" options={DOCUMENT_TYPES} half required />
            <TF label="Tender Dated"   field="tender_dated"  half type="date" required />
            <TF label="Last Date of Submission" field="last_submission_date" half type="date" required />
            <Grid item xs={6}>
              <TextField label="Pre-Bid Meeting Date" value={form.prebid_date}
                onChange={e => set('prebid_date', e.target.value)} fullWidth size="small"
                type="date" InputLabelProps={{ shrink:true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Pre-Bid Meeting Time" value={form.prebid_time}
                onChange={e => set('prebid_time', e.target.value)} fullWidth size="small"
                type="time" InputLabelProps={{ shrink:true }} />
            </Grid>
            <TF label="Competitors Info" field="competitors_info" multiline rows={3} />

            {/* Corrigendums */}
            <Grid item xs={12}>
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:1 }}>
                <Typography sx={{ fontSize:12, fontWeight:500, color:'#525868' }}>
                  Corrigendums
                </Typography>
                <Button size="small" startIcon={<AddOutlined sx={{ fontSize:14 }} />}
                  onClick={addCorr} sx={{ fontSize:12 }}>
                  Add Corrigendum
                </Button>
              </Box>
              {corr.length === 0 && (
                <Typography sx={{ fontSize:12, color:'#8892a4' }}>No corrigendums added.</Typography>
              )}
              {corr.map((c, i) => (
                <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1.5, mb:1, p:1.25, backgroundColor:'#f7f8fa', borderRadius:2, border:'1px solid #e4e8ef' }}>
                  <TextField label="Date" value={c.date} onChange={e => setCorrDate(i, e.target.value)}
                    size="small" type="date" InputLabelProps={{ shrink:true }} sx={{ width:160 }} disabled={c.existing} />
                  {c.existing ? (
                    <Box sx={{ display:'flex', alignItems:'center', gap:0.5, flex:1 }}>
                      <InsertDriveFileOutlined sx={{ fontSize:14, color:'#16a34a' }} />
                      <Typography sx={{ fontSize:12, color:'#525868' }}>{c.name}</Typography>
                      <Chip label="Saved" size="small" sx={{ height:18, fontSize:10, backgroundColor:'#f0fdf4', color:'#16a34a' }} />
                    </Box>
                  ) : (
                    <Button component="label" variant="outlined" size="small"
                      startIcon={<UploadFileOutlined sx={{ fontSize:14 }} />} sx={{ fontSize:11, flex:1 }}>
                      {c.name || 'Choose File'}
                      <input type="file" hidden accept="application/pdf,.doc,.docx"
                        onChange={e => setCorrFile(i, e.target.files?.[0])} />
                    </Button>
                  )}
                  <IconButton size="small" onClick={() => removeCorr(i)} sx={{ color:'#dc2626' }}>
                    <DeleteOutlined sx={{ fontSize:16 }} />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          </Grid>
        </TabPanel>

        {/* ── TAB 3: OUTCOME & STATUS ────────────────────────────────── */}
        <TabPanel value={tab} index={3}>
          <Grid container spacing={2}>
            <DD label="Outcome"      field="outcome"      options={OUTCOMES}             half required />
            <DD label="Open / Closed" field="open_closed" options={['Open','Closed']}    half required />
            {form.outcome === 'Won' && (
              <TF label="Order Won Value (Cr) excl. GST" field="order_won_value_cr" half type="number" required />
            )}
            <TF label="Present Status" field="present_status" multiline rows={3} required />
            {['Lost','Not-Participated'].includes(form.outcome) && (
              <TF label="Reason for Losing / Not-Participating" field="reason_for_losing" multiline rows={3} required />
            )}
          </Grid>
        </TabPanel>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px:3, py:2, gap:1 }}>
        {tab > 0 && (
          <Button onClick={() => setTab(t => t-1)} variant="outlined" size="small" disabled={saving}>
            ← Back
          </Button>
        )}
        {tab < 3 && (
          <Button onClick={() => setTab(t => t+1)} variant="outlined" size="small">
            Next →
          </Button>
        )}
        <Box sx={{ flex:1 }} />
        <Button onClick={() => onClose(false)} variant="outlined" size="small" disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" size="small" disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null} sx={{ px:3 }}>
          {saving ? 'Saving...' : isEdit ? 'Update Lead' : 'Save Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
