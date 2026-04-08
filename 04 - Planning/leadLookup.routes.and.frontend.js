// ─────────────────────────────────────────────────────────────────────────────
// backend/src/routes/leadLookup.routes.js
// ─────────────────────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth.middleware');
const ctrl    = require('../controllers/leadLookup.controller');

// ORDER MATTERS — specific routes before :param routes
router.get('/generate-number',     auth, ctrl.previewNumber);
router.get('/validate/:lead_no',   auth, ctrl.validate);
router.get('/:lead_no',            auth, ctrl.getByLeadNo);
router.get('/',                    auth, ctrl.search);

module.exports = router;

// In server.js, register as:
// app.use('/api/leads/lookup', require('./routes/leadLookup.routes'));
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/api/leadLookup.api.js
// ─────────────────────────────────────────────────────────────────────────────
// import api from './axios.config';
//
// export const leadLookupAPI = {
//   search:        (q)         => api.get('/leads/lookup', { params: { q } }),
//   getByLeadNo:   (lead_no)   => api.get(`/leads/lookup/${lead_no}`),
//   validate:      (lead_no)   => api.get(`/leads/lookup/validate/${lead_no}`),
//   previewNumber: (params)    => api.get('/leads/lookup/generate-number', { params }),
// };
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/hooks/useLeadLookup.js
//
// Custom hook — handles debounced search, selection state, and auto-fill.
// Use this in ANY form that needs a lead lookup input.
// ─────────────────────────────────────────────────────────────────────────────
// import { useState, useCallback, useRef } from 'react';
// import { leadLookupAPI } from '../api/leadLookup.api';
//
// export function useLeadLookup() {
//   const [query,       setQuery]       = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [selected,    setSelected]    = useState(null);  // full lead object
//   const [loading,     setLoading]     = useState(false);
//   const [error,       setError]       = useState('');
//   const debounceRef   = useRef(null);
//
//   // Called on every keystroke in the lookup input
//   const onQueryChange = useCallback((value) => {
//     setQuery(value);
//     setError('');
//
//     // If user clears the field, clear everything
//     if (!value.trim()) {
//       setSuggestions([]);
//       setSelected(null);
//       return;
//     }
//
//     // Debounce: wait 300ms after last keystroke before calling API
//     clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(async () => {
//       if (value.trim().length < 2) return;
//       try {
//         const res = await leadLookupAPI.search(value.trim());
//         setSuggestions(res.data.data);
//       } catch {
//         setSuggestions([]);
//       }
//     }, 300);
//   }, []);
//
//   // Called when user clicks a suggestion OR presses Enter
//   const selectLead = useCallback(async (lead_no) => {
//     setSuggestions([]);
//     setQuery(lead_no);
//     setLoading(true);
//     setError('');
//     try {
//       const res = await leadLookupAPI.getByLeadNo(lead_no);
//       setSelected(res.data.data);
//     } catch {
//       setError(`Lead not found: ${lead_no}`);
//       setSelected(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   // Called when user clicks "Change lead"
//   const clearSelection = useCallback(() => {
//     setQuery('');
//     setSuggestions([]);
//     setSelected(null);
//     setError('');
//   }, []);
//
//   return {
//     query, onQueryChange,
//     suggestions,
//     selected, selectLead, clearSelection,
//     loading, error,
//   };
// }
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/components/Common/LeadLookupInput.jsx
//
// Reusable component — drop into ANY form.
//
// Usage:
//   import LeadLookupInput from '../../components/Common/LeadLookupInput';
//
//   // In your form:
//   const lookup = useLeadLookup();
//
//   // When lead is selected, auto-fill your form:
//   useEffect(() => {
//     if (lookup.selected) {
//       setValue('customer_name',   lookup.selected.customer_name);
//       setValue('civil_defence',   lookup.selected.civil_defence);
//       setValue('business_domain', lookup.selected.business_domain);
//       setValue('estimated_value_cr', lookup.selected.estimated_value_cr);
//       // ... etc
//     }
//   }, [lookup.selected]);
//
//   <LeadLookupInput {...lookup} label="Link to lead" required />
// ─────────────────────────────────────────────────────────────────────────────
// import {
//   Box, TextField, CircularProgress, Alert, Typography,
//   Paper, List, ListItemButton, Chip,
// } from '@mui/material';
// import { CheckCircleOutlined, SearchOutlined } from '@mui/icons-material';
// import { useLeadLookup } from '../../hooks/useLeadLookup';
//
// const STAGE_COLORS = {
//   'BQ Preparation':    { bg:'#FAEEDA', color:'#854F0B' },
//   'Pre-Qualification': { bg:'#FAEEDA', color:'#BA7517' },
//   'Technical Bid':     { bg:'#FAEEDA', color:'#BA7517' },
//   'Commercial Bid':    { bg:'#FAEEDA', color:'#BA7517' },
//   'Bid Submitted':     { bg:'#E1F5EE', color:'#0F6E56' },
//   'Evaluation':        { bg:'#E1F5EE', color:'#0F6E56' },
//   'Result Awaited':    { bg:'#EAF3DE', color:'#3B6D11' },
//   'Won':               { bg:'#EAF3DE', color:'#3B6D11' },
//   'Lost':              { bg:'#FCEBEB', color:'#A32D2D' },
// };
//
// export default function LeadLookupInput({
//   query, onQueryChange, suggestions, selected, selectLead,
//   clearSelection, loading, error, label = 'Lead reference', required,
// }) {
//   if (selected) {
//     // Show the lead card after selection
//     const sc = STAGE_COLORS[selected.current_stage] || { bg:'#F1EFE8', color:'#5F5E5A' };
//     return (
//       <Box sx={{ border:'1.5px solid', borderColor:'success.main', borderRadius:2, overflow:'hidden' }}>
//         <Box sx={{ p:1.25, backgroundColor:'success.50', display:'flex', alignItems:'center', gap:1.5 }}>
//           <CheckCircleOutlined sx={{ color:'success.main', fontSize:18 }} />
//           <Box sx={{ flex:1, minWidth:0 }}>
//             <Typography sx={{ fontSize:10, fontFamily:'DM Mono', color:'success.main', mb:0.25 }}>
//               {selected.lead_no}
//             </Typography>
//             <Typography sx={{ fontSize:13, fontWeight:500, lineHeight:1.2 }}>
//               {selected.lead_title}
//             </Typography>
//             <Typography sx={{ fontSize:11, color:'text.secondary' }}>
//               {selected.customer_name}
//             </Typography>
//           </Box>
//           <Box sx={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:0.5 }}>
//             <Chip label={selected.current_stage} size="small"
//               sx={{ fontSize:10, height:20, backgroundColor:sc.bg, color:sc.color }} />
//             <Typography sx={{ fontSize:11, color:'text.secondary', cursor:'pointer',
//               textDecoration:'underline', '&:hover':{ color:'text.primary' } }}
//               onClick={clearSelection}>
//               Change lead
//             </Typography>
//           </Box>
//         </Box>
//         <Box sx={{ px:1.5, py:1, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1 }}>
//           {[
//             { label:'Sector', value:selected.civil_defence },
//             { label:'Domain', value:selected.business_domain },
//             { label:'Est. value', value:selected.estimated_value_cr ? `₹${selected.estimated_value_cr} Cr` : '—' },
//             { label:'Owner', value:selected.lead_owner_name || '—' },
//             { label:'Deadline', value:selected.submission_deadline || '—' },
//             { label:'Win prob.', value:selected.win_probability_pct ? `${selected.win_probability_pct}%` : '—' },
//           ].map((f,i) => (
//             <Box key={i}>
//               <Typography sx={{ fontSize:10, color:'text.disabled', textTransform:'uppercase', letterSpacing:'.04em' }}>{f.label}</Typography>
//               <Typography sx={{ fontSize:12, fontWeight:500 }}>{f.value}</Typography>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//     );
//   }
//
//   return (
//     <Box sx={{ position:'relative' }}>
//       <TextField
//         label={required ? `${label} *` : label}
//         value={query}
//         onChange={e => onQueryChange(e.target.value)}
//         onKeyDown={e => {
//           if (e.key === 'Enter' && suggestions.length > 0) selectLead(suggestions[0].lead_no);
//           if (e.key === 'Enter' && query.match(/^LEAD-\d{4}-[A-Z]{2,5}-\d{4}$/i)) selectLead(query.trim());
//         }}
//         placeholder="LEAD-2026-DEF-0047  or  type customer / tender name…"
//         fullWidth
//         size="small"
//         error={Boolean(error)}
//         helperText={error || 'Enter lead number or search by name'}
//         InputProps={{
//           startAdornment: loading
//             ? <CircularProgress size={14} sx={{ mr:1, color:'text.disabled' }} />
//             : <SearchOutlined sx={{ mr:1, fontSize:16, color:'text.disabled' }} />,
//           sx: { fontFamily:'"DM Mono", monospace', fontSize:13 },
//         }}
//       />
//       {suggestions.length > 0 && (
//         <Paper elevation={0} sx={{ position:'absolute', top:'100%', left:0, right:0, zIndex:1200,
//           border:'0.5px solid', borderColor:'divider', mt:0.5, borderRadius:1.5, overflow:'hidden' }}>
//           <List dense disablePadding>
//             {suggestions.map((l, i) => (
//               <ListItemButton key={i} onClick={() => selectLead(l.lead_no)}
//                 sx={{ borderBottom:'0.5px solid', borderColor:'divider',
//                   '&:last-child':{ borderBottom:'none' } }}>
//                 <Box sx={{ minWidth:0, width:'100%' }}>
//                   <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
//                     <Typography sx={{ fontFamily:'"DM Mono",monospace', fontSize:12, fontWeight:500, flexShrink:0 }}>
//                       {l.lead_no}
//                     </Typography>
//                     <Chip label={l.current_stage} size="small"
//                       sx={{ fontSize:9, height:18, ml:'auto',
//                         backgroundColor:(STAGE_COLORS[l.current_stage]||{}).bg||'#F1EFE8',
//                         color:(STAGE_COLORS[l.current_stage]||{}).color||'#5F5E5A' }} />
//                   </Box>
//                   <Typography sx={{ fontSize:12, color:'text.primary', mt:0.25, overflow:'hidden',
//                     textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//                     {l.lead_title}
//                   </Typography>
//                   <Typography sx={{ fontSize:11, color:'text.secondary' }}>
//                     {l.customer_name} · {l.business_domain}
//                   </Typography>
//                 </Box>
//               </ListItemButton>
//             ))}
//           </List>
//         </Paper>
//       )}
//     </Box>
//   );
// }
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE IN BQFormModal.jsx (example)
// ─────────────────────────────────────────────────────────────────────────────
// import LeadLookupInput from '../../components/Common/LeadLookupInput';
// import { useLeadLookup } from '../../hooks/useLeadLookup';
//
// export default function BQFormModal({ open, record, onClose }) {
//   const lookup = useLeadLookup();
//   const [form, setForm] = useState(EMPTY);
//
//   // When a lead is selected → auto-fill linked fields
//   useEffect(() => {
//     if (!lookup.selected) return;
//     const l = lookup.selected;
//     setForm(prev => ({
//       ...prev,
//       lead_id:          l.id,
//       customer_id:      l.customer_id,
//       customer_name:    l.customer_name,    // display only, not submitted
//       civil_defence:    l.civil_defence,    // locked after auto-fill
//       business_domain:  l.business_domain,  // locked after auto-fill
//       estimated_value_cr: l.estimated_value_cr || '',
//       lead_owner_id:    l.lead_owner_id || '',
//     }));
//   }, [lookup.selected]);
//
//   return (
//     <Dialog open={open} ...>
//       ...
//       <Grid item xs={12}>
//         <LeadLookupInput
//           {...lookup}
//           label="Linked lead"
//           required
//         />
//       </Grid>
//
//       {/* These fields are auto-filled and locked after lookup */}
//       <Grid item xs={6}>
//         <TextField label="Customer" value={form.customer_name}
//           disabled={Boolean(lookup.selected)}
//           InputProps={{ sx: lookup.selected ? { backgroundColor:'success.50' } : {} }} />
//       </Grid>
//       <Grid item xs={6}>
//         <TextField label="Civil / Defence" value={form.civil_defence}
//           disabled={Boolean(lookup.selected)} />
//       </Grid>
//       ...
//     </Dialog>
//   );
// }
// ─────────────────────────────────────────────────────────────────────────────
