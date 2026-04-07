// src/pages/Orders/OrderFormModal.jsx
import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, Typography, Alert, Divider, IconButton, CircularProgress,
} from '@mui/material';
import { CloseOutlined, UploadFileOutlined, InsertDriveFileOutlined, DeleteOutlined } from '@mui/icons-material';
import { ordersAPI } from '../../api';

const EMPTY = {
  tender_name:'', customer_name:'', customer_address:'',
  order_received_date:'', po_wo_number:'', tender_type:'',
  value_excl_gst_cr:'', value_incl_gst_cr:'', competitors:'', remarks:'',
};

function FileField({ label, existingName, file, onFile, onClear, error }) {
  return (
    <Box>
      <Typography sx={{ fontSize:12, fontWeight:500, color:'#525868', mb:0.75 }}>{label}</Typography>
      {existingName && !file && (
        <Box sx={{ display:'flex', alignItems:'center', gap:1, p:1.25, mb:0.75, backgroundColor:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:2 }}>
          <InsertDriveFileOutlined sx={{ fontSize:14, color:'#16a34a' }} />
          <Typography sx={{ fontSize:12, color:'#15803d', flex:1 }}>{existingName}</Typography>
          <Typography sx={{ fontSize:11, color:'#8892a4' }}>Existing</Typography>
        </Box>
      )}
      {file && (
        <Box sx={{ display:'flex', alignItems:'center', gap:1, p:1.25, mb:0.75, backgroundColor:'#eff4ff', border:'1px solid #bfdbfe', borderRadius:2 }}>
          <InsertDriveFileOutlined sx={{ fontSize:14, color:'#2563eb' }} />
          <Typography sx={{ fontSize:12, color:'#1d4ed8', flex:1 }}>{file.name}</Typography>
          <IconButton size="small" onClick={onClear}><DeleteOutlined sx={{ fontSize:14, color:'#dc2626' }} /></IconButton>
        </Box>
      )}
      <Button component="label" variant="outlined" size="small"
        startIcon={<UploadFileOutlined sx={{ fontSize:14 }} />} sx={{ fontSize:12 }}>
        {existingName ? 'Replace' : 'Choose PDF'}
        <input type="file" hidden accept="application/pdf"
          onChange={e => onFile(e.target.files?.[0])} />
      </Button>
      {error && <Typography sx={{ fontSize:11, color:'#dc2626', mt:0.5 }}>{error}</Typography>}
    </Box>
  );
}

export default function OrderFormModal({ open, record, onClose }) {
  const isEdit = Boolean(record);
  const [form,       setForm]       = useState(EMPTY);
  const [contractFile, setContractFile] = useState(null);
  const [woFile,     setWoFile]     = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState({});
  const [apiErr,     setApiErr]     = useState('');

  useEffect(() => {
    if (open) {
      setErrors({}); setApiErr('');
      setContractFile(null); setWoFile(null);
      setForm(record ? {
        tender_name:         record.tender_name         || '',
        customer_name:       record.customer_name       || '',
        customer_address:    record.customer_address    || '',
        order_received_date: record.order_received_date || '',
        po_wo_number:        record.po_wo_number        || '',
        tender_type:         record.tender_type         || '',
        value_excl_gst_cr:   record.value_excl_gst_cr   || '',
        value_incl_gst_cr:   record.value_incl_gst_cr   || '',
        competitors:         record.competitors         || '',
        remarks:             record.remarks             || '',
      } : EMPTY);
    }
  }, [open, record]);

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]:'' })); };

  const validate = () => {
    const e = {};
    if (!form.tender_name.trim())         e.tender_name         = 'Required';
    if (!form.customer_name.trim())       e.customer_name       = 'Required';
    if (!form.customer_address.trim())    e.customer_address    = 'Required';
    if (!form.order_received_date)        e.order_received_date = 'Required';
    if (!form.po_wo_number.trim())        e.po_wo_number        = 'Required';
    if (!form.tender_type)                e.tender_type         = 'Required';
    if (!form.value_excl_gst_cr || isNaN(form.value_excl_gst_cr))
      e.value_excl_gst_cr = 'Enter a valid number.';
    if (!form.value_incl_gst_cr || isNaN(form.value_incl_gst_cr))
      e.value_incl_gst_cr = 'Enter a valid number.';
    if (parseFloat(form.value_incl_gst_cr) < parseFloat(form.value_excl_gst_cr))
      e.value_incl_gst_cr = 'Incl. GST must be ≥ excl. GST.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true); setApiErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (contractFile) fd.append('contract_doc', contractFile);
      if (woFile)       fd.append('work_order',   woFile);

      if (isEdit) await ordersAPI.update(record.id, fd);
      else        await ordersAPI.create(fd);
      onClose(true);
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Save failed.');
    } finally { setSaving(false); }
  };

  const TF = ({ label, field, half, type='text', multiline, rows, required }) => (
    <Grid item xs={half?6:12}>
      <TextField label={`${label}${required?' *':''}`} value={form[field]}
        onChange={e => set(field, e.target.value)} fullWidth size="small"
        type={type} multiline={multiline} rows={rows||1}
        error={Boolean(errors[field])} helperText={errors[field]||''}
        InputLabelProps={type==='date'?{shrink:true}:undefined} />
    </Grid>
  );

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', pb:1 }}>
        <Typography sx={{ fontSize:15, fontWeight:600 }}>
          {isEdit ? 'Edit Order' : 'New Order Received'}
        </Typography>
        <IconButton size="small" onClick={() => onClose(false)}>
          <CloseOutlined sx={{ fontSize:18 }} />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ pt:2.5 }}>
        {apiErr && <Alert severity="error" sx={{ mb:2, borderRadius:2, fontSize:13 }} onClose={() => setApiErr('')}>{apiErr}</Alert>}

        <Grid container spacing={2}>
          {/* Tender Name — linked to existing lead via autocomplete ideally */}
          <TF label="Tender Name"           field="tender_name"         required />
          <TF label="Customer Name"         field="customer_name"       half required />
          <Grid item xs={6}>
            <FormControl fullWidth size="small" error={Boolean(errors.tender_type)}>
              <InputLabel>Tender Type *</InputLabel>
              <Select value={form.tender_type} label="Tender Type *" onChange={e => set('tender_type', e.target.value)}>
                {['Open','Limited','Single Source','Nomination','Rate Contract'].map(t =>
                  <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
              {errors.tender_type && <Typography sx={{fontSize:11,color:'#dc2626',mt:0.5,ml:1.75}}>{errors.tender_type}</Typography>}
            </FormControl>
          </Grid>
          <TF label="Customer Address"      field="customer_address"    multiline rows={2} required />
          <TF label="Order Received Date"   field="order_received_date" half type="date" required />
          <TF label="PO / WO Number"        field="po_wo_number"        half required />
          <TF label="Value (Cr) excl. GST"  field="value_excl_gst_cr"   half type="number" required />
          <TF label="Value (Cr) incl. GST"  field="value_incl_gst_cr"   half type="number" required />
          <TF label="Competitors"           field="competitors"         multiline rows={2} />
          <TF label="Remarks"               field="remarks"             multiline rows={2} />

          {/* PDF uploads */}
          <Grid item xs={6}>
            <FileField
              label="Contract Copy / Work Order / LOI (PDF, max 20MB)"
              existingName={isEdit ? record?.contract_doc_name : null}
              file={contractFile}
              onFile={setContractFile}
              onClear={() => setContractFile(null)}
            />
          </Grid>
          <Grid item xs={6}>
            <FileField
              label="Work Order Document (PDF, max 20MB)"
              existingName={isEdit ? record?.work_order_name : null}
              file={woFile}
              onFile={setWoFile}
              onClear={() => setWoFile(null)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px:3, py:2, gap:1 }}>
        <Button onClick={() => onClose(false)} variant="outlined" size="small" disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" size="small" disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null} sx={{ px:3 }}>
          {saving ? 'Saving...' : isEdit ? 'Update Order' : 'Save Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
