import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Button, Grid, Alert, Paper, Chip, Divider, Stack,
  InputAdornment, CircularProgress, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LinkIcon from '@mui/icons-material/Link'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AppShell from '../../components/Layout/AppShell'
import { mockLeads } from '../../data/mockLeads'
import { mockBQs } from '../../data/mockBQ'
import { TENDER_TYPES } from '../../data/mockTenders'

const OWNERS     = ['Ravi Kumar', 'Sunita Menon', 'Amit Shah', 'Priya Nair', 'Deepak Verma']
const EMD_MODES  = ['Bank Guarantee', 'Demand Draft', 'Online Payment', 'FDR', 'N/A (Export)']
const CURRENCIES = ['INR', 'USD', 'GBP', 'EUR']

const INIT = {
  tenderRefNo: '', tenderType: 'Closed / Limited', customerType: 'Internal',
  contactPerson: '', contactEmail: '',
  emdValue: '', emdMode: 'Bank Guarantee',
  estimatedValueExGST: '', gstPercent: '18', currency: 'INR',
  rfpReceivedDate: '', preBidMeetingDate: '', queryDeadlineDate: '',
  submissionDate: '', extendedDate: '', technicalOpeningDate: '', commercialOpeningDate: '',
  participated: 'Yes', notParticipationReason: '',
  owner: '', scopeSummary: '', tenderSummary: '', remarks: '',
}

function QuickRow({ label, value, mono, accent }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.7, borderBottom: '1px solid #eaeff6' }}>
      <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.07em', mt: 0.2 }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.8rem', fontFamily: mono ? "'JetBrains Mono'" : 'inherit', color: accent ? '#1a56a0' : '#1a2236', textAlign: 'right', maxWidth: '60%' }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

function SecHeader({ num, color, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
      <Box sx={{ width: 26, height: 26, borderRadius: 1.5, backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem', fontWeight: 700, color }}>{num}</Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a2236' }}>{label}</Typography>
    </Box>
  )
}

export default function TenderCreatePage() {
  const navigate = useNavigate()
  const [sp]     = useSearchParams()

  const [leadInput, setLeadInput]   = useState(sp.get('leadRef') || '')
  const [bqInput, setBqInput]       = useState(sp.get('bqRef')   || '')
  const [fetching, setFetching]     = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [lead, setLead]             = useState(null)
  const [bq, setBq]                 = useState(null)
  const [form, setForm]             = useState(INIT)
  const [errors, setErrors]         = useState({})
  const [submitted, setSubmitted]   = useState(false)

  const handleFetch = () => {
    const lr = leadInput.trim().toUpperCase()
    const br = bqInput.trim().toUpperCase()
    if (!lr) { setFetchError('Please enter at least a Lead Reference.'); return }
    setFetching(true); setFetchError(''); setLead(null); setBq(null)
    setTimeout(() => {
      const foundLead = mockLeads.find((l) => l.id === lr)
      if (!foundLead) { setFetching(false); setFetchError(`No lead found for "${lr}".`); return }
      if (foundLead.status === 'No-Go') { setFetching(false); setFetchError(`Lead ${lr} is No-Go — cannot create a tender.`); return }
      const foundBQ = br ? mockBQs.find((b) => b.id === br && b.leadRef === lr) : mockBQs.find((b) => b.leadRef === lr)
      setLead(foundLead); setBq(foundBQ || null); setFetching(false)
      setForm((f) => ({
        ...f,
        owner: foundLead.owner,
        contactPerson: foundLead.contactPerson,
        contactEmail: foundLead.contactEmail,
        customerType: foundLead.sector === 'Defence' && foundLead.market === 'Domestic' ? 'Internal' : 'External',
        gstPercent: foundLead.market === 'Export' ? '0' : '18',
        currency: foundLead.market === 'Export' ? 'GBP' : 'INR',
        emdMode: foundLead.market === 'Export' ? 'N/A (Export)' : 'Bank Guarantee',
        estimatedValueExGST: foundBQ ? String(foundBQ.estimatedValueExGST) : '',
      }))
    }, 700)
  }

  const set = (k) => (e) => {
    const val = e.target.value
    setForm((f) => {
      const next = { ...f, [k]: val }
      if (k === 'estimatedValueExGST' || k === 'gstPercent') {
        const ex  = parseFloat(k === 'estimatedValueExGST' ? val : next.estimatedValueExGST) || 0
        const gst = parseFloat(k === 'gstPercent'          ? val : next.gstPercent)          || 0
        next._incGST = (ex * (1 + gst / 100)).toFixed(2)
      }
      return next
    })
  }

  const validate = () => {
    const e = {}
    if (!lead)                e.lead = 'Please fetch a lead'
    if (!form.submissionDate) e.submissionDate = 'Required'
    if (!form.owner)          e.owner = 'Required'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitted(true)
    setTimeout(() => navigate('/tender'), 1500)
  }

  const incGST   = form._incGST || (form.estimatedValueExGST ? (parseFloat(form.estimatedValueExGST) * (1 + (parseFloat(form.gstPercent) || 0) / 100)).toFixed(2) : '')
  const currSym  = form.currency === 'INR' ? '₹' : form.currency === 'GBP' ? '£' : '$'
  const isLocked = !lead

  const crumbs = [
    { label: 'Tender Management', onClick: () => navigate('/tender') },
    { label: 'New Tender' },
  ]

  if (submitted) return (
    <AppShell topbarProps={{ crumbs }}>
      <Box sx={{ p: 4 }}><Alert severity="success" sx={{ maxWidth: 500 }}>Tender created successfully. Redirecting…</Alert></Box>
    </AppShell>
  )

  const teal = '#0e7c7b'
  const tealHover = { backgroundColor: teal, '&:hover': { backgroundColor: '#0b6665' } }

  return (
    <AppShell topbarProps={{ crumbs }}>
      <Box sx={{ p: 3, maxWidth: 980 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236' }}>Create New Tender</Typography>
          <Chip label="Unsaved" size="small" sx={{ backgroundColor: '#fef8e8', color: '#c07000', fontFamily: "'JetBrains Mono'" }} />
        </Box>

        {/* 01 FETCH */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SecHeader num="01" color={teal} label="Fetch from Lead / BQ Module" />
            <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="flex-start" useFlexGap>
              <TextField size="small" label="Lead Reference *" placeholder="L-2526-001"
                value={leadInput} onChange={(e) => setLeadInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                error={!!errors.lead} helperText={errors.lead} sx={{ width: 200 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 14, color: '#97a3b5' }} /></InputAdornment> }}
              />
              <TextField size="small" label="BQ Reference (optional)" placeholder="BQ-2526-009"
                value={bqInput} onChange={(e) => setBqInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()} sx={{ width: 210 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 14, color: '#97a3b5' }} /></InputAdornment> }}
              />
              <Button variant="contained" startIcon={fetching ? <CircularProgress size={14} color="inherit" /> : <SearchIcon />}
                onClick={handleFetch} disabled={fetching} sx={tealHover}>
                {fetching ? 'Fetching…' : 'Fetch Data'}
              </Button>
            </Stack>
            {fetchError && <Alert severity="error" sx={{ mt: 2, maxWidth: 520 }}>{fetchError}</Alert>}

            {lead && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={bq ? 6 : 12}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#a8d5ea', backgroundColor: '#f0f9ff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <CheckCircleIcon sx={{ color: '#1a56a0', fontSize: 16 }} />
                      <Typography variant="subtitle2" sx={{ color: '#1a56a0', fontWeight: 700 }}>Lead — {lead.id}</Typography>
                      <OpenInNewIcon sx={{ fontSize: 13, color: '#97a3b5', cursor: 'pointer', ml: 'auto' }} onClick={() => navigate(`/leads/${lead.id}`)} />
                    </Box>
                    <QuickRow label="Project"     value={lead.projectName} />
                    <QuickRow label="Customer"    value={lead.customerShort} />
                    <QuickRow label="Sector"      value={lead.sector} />
                    <QuickRow label="Market"      value={lead.market} />
                    <QuickRow label="Domain"      value={lead.domain} />
                    <QuickRow label="Lead Status" value={lead.status} />
                  </Paper>
                </Grid>
                {bq && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#c4b5fd', backgroundColor: '#faf5ff' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#7c3aed', fontSize: 16 }} />
                        <Typography variant="subtitle2" sx={{ color: '#7c3aed', fontWeight: 700 }}>BQ — {bq.id}</Typography>
                        <OpenInNewIcon sx={{ fontSize: 13, color: '#97a3b5', cursor: 'pointer', ml: 'auto' }} onClick={() => navigate(`/bq/${bq.id}`)} />
                      </Box>
                      <QuickRow label="BQ Status"    value={bq.status} />
                      <QuickRow label="Value Ex-GST" value={`₹ ${bq.estimatedValueExGST} Cr`} mono />
                      <QuickRow label="GST %"        value={`${bq.gstPercent}%`} />
                      <QuickRow label="Value Inc-GST" value={`₹ ${bq.estimatedValueIncGST} Cr`} mono accent />
                    </Paper>
                  </Grid>
                )}
                {!bq && <Grid item xs={12}><Alert severity="info" sx={{ fontSize: '0.8rem' }}>No BQ found for this lead — you can still create the tender.</Alert></Grid>}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* 02 IDENTITY */}
        <Card sx={{ mb: 2, opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SecHeader num="02" color={teal} label="Tender Identity" />
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Tender / RFP Reference Number" value={form.tenderRefNo} onChange={set('tenderRefNo')} placeholder="Customer-issued RFP ref" />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField select fullWidth label="Tender Type" value={form.tenderType} onChange={set('tenderType')}>
                  {TENDER_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ fontSize: '0.82rem' }}>{t}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField select fullWidth label="Customer Type" value={form.customerType} onChange={set('customerType')}>
                  {['Internal', 'External'].map((t) => <MenuItem key={t} value={t} sx={{ fontSize: '0.82rem' }}>{t}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Contact Person" value={form.contactPerson} onChange={set('contactPerson')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Contact Email" type="email" value={form.contactEmail} onChange={set('contactEmail')} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 03 FINANCIALS */}
        <Card sx={{ mb: 2, opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SecHeader num="03" color={teal} label="Financial Details" />
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="EMD Value (₹ Cr)" type="number" value={form.emdValue} onChange={set('emdValue')} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField select fullWidth label="EMD Mode" value={form.emdMode} onChange={set('emdMode')}>
                  {EMD_MODES.map((m) => <MenuItem key={m} value={m} sx={{ fontSize: '0.82rem' }}>{m}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField select fullWidth label="Currency" value={form.currency} onChange={set('currency')}>
                  {CURRENCIES.map((c) => <MenuItem key={c} value={c} sx={{ fontSize: '0.82rem' }}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Estimated Value (Ex-GST)" type="number" value={form.estimatedValueExGST} onChange={set('estimatedValueExGST')}
                  InputProps={{ startAdornment: <InputAdornment position="start">{currSym}</InputAdornment> }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField select fullWidth label="GST %" value={form.gstPercent} onChange={set('gstPercent')}>
                  {['0', '5', '12', '18', '28'].map((g) => (
                    <MenuItem key={g} value={g} sx={{ fontSize: '0.82rem' }}>{g}%{g === '0' ? ' (Export)' : ''}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Estimated Value (Inc-GST)"
                  value={incGST ? `${currSym} ${incGST} Cr` : ''}
                  InputProps={{ readOnly: true, sx: { backgroundColor: '#f8fafd', fontFamily: "'JetBrains Mono'", fontSize: '0.85rem', fontWeight: 700, color: teal } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 04 DATES */}
        <Card sx={{ mb: 2, opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SecHeader num="04" color={teal} label="Key Dates" />
            <Grid container spacing={2.5}>
              {[
                { key: 'rfpReceivedDate',       label: 'RFP Received Date' },
                { key: 'preBidMeetingDate',     label: 'Pre-Bid Meeting Date' },
                { key: 'queryDeadlineDate',     label: 'Pre-Bid Query Deadline' },
                { key: 'submissionDate',        label: 'Submission Due Date *', req: true },
                { key: 'extendedDate',          label: 'Extended Submission Date' },
                { key: 'technicalOpeningDate',  label: 'Technical Opening Date' },
                { key: 'commercialOpeningDate', label: 'Commercial Opening Date' },
              ].map(({ key, label, req }) => (
                <Grid item xs={12} sm={3} key={key}>
                  <TextField fullWidth label={label} type="date" value={form[key]} onChange={set(key)}
                    InputLabelProps={{ shrink: true }}
                    error={req && !!errors.submissionDate} helperText={req && errors.submissionDate}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* 05 PARTICIPATION */}
        <Card sx={{ mb: 2, opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SecHeader num="05" color={teal} label="Participation Decision" />
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#5a6880', display: 'block', mb: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.68rem' }}>
                  Participating *
                </Typography>
                <ToggleButtonGroup exclusive value={form.participated}
                  onChange={(_, v) => v && set('participated')({ target: { value: v } })} size="small"
                  sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontSize: '0.78rem', fontFamily: "'DM Sans'", border: '1px solid #c3ccd9 !important', borderRadius: '6px !important', px: 2, py: 0.7,
                    '&.Mui-selected': { backgroundColor: '#e6f6f6', color: teal, borderColor: `${teal} !important`, fontWeight: 600 } } }}>
                  <ToggleButton value="Yes">Yes — Participating</ToggleButton>
                  <ToggleButton value="No">No — Not Participating</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {form.participated === 'No' && (
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Reason for Non-Participation *"
                    value={form.notParticipationReason} onChange={set('notParticipationReason')}
                    placeholder="Certification gap, capacity constraint, strategic decision…" />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* 06 SCOPE */}
        <Card sx={{ mb: 3, opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SecHeader num="06" color={teal} label="Scope, Summary & Assignment" />
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth required label="Tender Owner" value={form.owner} onChange={set('owner')}
                  error={!!errors.owner} helperText={errors.owner}>
                  <MenuItem value="" disabled sx={{ fontSize: '0.82rem', color: '#97a3b5' }}>Assign to…</MenuItem>
                  {OWNERS.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Scope of Work Summary" value={form.scopeSummary} onChange={set('scopeSummary')}
                  placeholder="Supply, integration, testing, documentation, warranty terms…" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Tender Summary (for Core Committee)" value={form.tenderSummary} onChange={set('tenderSummary')}
                  placeholder="Executive summary — eligibility, key parameters, our positioning…" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Remarks" value={form.remarks} onChange={set('remarks')}
                  placeholder="Additional notes, conditions, risk factors…" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" size="large" startIcon={<SaveOutlinedIcon />} onClick={handleSave} disabled={!lead} sx={tealHover}>Save Tender</Button>
          <Button variant="outlined" size="large" onClick={handleSave} disabled={!lead}>Save &amp; Add Another</Button>
          <Button variant="text" size="large" startIcon={<ArrowBackIcon />} onClick={() => navigate('/tender')} sx={{ ml: 'auto' }}>Cancel</Button>
        </Box>
      </Box>
    </AppShell>
  )
}
