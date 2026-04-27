import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Button, Grid, Alert, Paper, Chip, Divider, Stack,
  InputAdornment, CircularProgress,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LinkIcon from '@mui/icons-material/Link'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AppShell from '../../components/Layout/AppShell'
import { mockLeads } from '../../data/mockLeads'

const CURRENCIES = ['INR', 'USD', 'GBP', 'EUR']
const OWNERS     = ['Ravi Kumar', 'Sunita Menon', 'Amit Shah', 'Priya Nair', 'Deepak Verma']

const INITIAL_FORM = {
  rfqDate: '',
  customerType: 'Internal',
  contactPerson: '',
  contactEmail: '',
  estimatedValueExGST: '',
  gstPercent: '18',
  currency: 'INR',
  submissionDate: '',
  extendedDate: '',
  letterDate: '',
  owner: '',
  scopeSummary: '',
  remarks: '',
}

function LeadInfoRow({ label, value, mono, accent }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid #eaeff6' }}>
      <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.07em', mt: 0.2 }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: '0.82rem', fontFamily: mono ? "'JetBrains Mono'" : 'inherit',
        color: accent ? '#1a56a0' : '#1a2236', fontWeight: mono ? 500 : 400,
        textAlign: 'right', maxWidth: '60%',
      }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

export default function BQCreatePage() {
  const navigate     = useNavigate()
  const [searchParams] = useSearchParams()

  const [leadInput, setLeadInput] = useState(searchParams.get('leadRef') || '')
  const [fetching, setFetching]   = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [lead, setLead]           = useState(null)
  const [form, setForm]           = useState(INITIAL_FORM)
  const [errors, setErrors]       = useState({})
  const [submitted, setSubmitted] = useState(false)

  // Auto-fetch if leadRef passed via query param
  React.useEffect(() => {
    if (searchParams.get('leadRef')) handleFetch(searchParams.get('leadRef'))
  // eslint-disable-next-line
  }, [])

  const handleFetch = (ref) => {
    const refToUse = (ref || leadInput).trim().toUpperCase()
    if (!refToUse) return
    setFetching(true)
    setFetchError('')
    setLead(null)
    setTimeout(() => {
      const found = mockLeads.find((l) => l.id === refToUse)
      setFetching(false)
      if (!found) {
        setFetchError(`No lead found for reference "${refToUse}". Check the ID and try again.`)
      } else if (found.status === 'No-Go') {
        setFetchError(`Lead ${refToUse} is marked No-Go and cannot be linked to a BQ.`)
      } else {
        setLead(found)
        // Pre-fill BQ owner from lead owner
        setForm((f) => ({
          ...f,
          owner: found.owner,
          contactPerson: found.contactPerson,
          contactEmail: found.contactEmail,
          // Export leads — zero-rate GST
          gstPercent: found.market === 'Export' ? '0' : '18',
          currency: found.market === 'Export' ? 'USD' : 'INR',
        }))
      }
    }, 600)
  }

  const set = (k) => (e) => {
    const val = e.target.value
    setForm((f) => {
      const next = { ...f, [k]: val }
      // Auto-calculate inc-GST when Ex-GST or GST% changes
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
    if (!lead)                            e.lead           = 'Please fetch a lead first'
    if (!form.estimatedValueExGST)        e.valueExGST     = 'Required'
    if (!form.submissionDate)             e.submissionDate = 'Required'
    if (!form.owner)                      e.owner          = 'Required'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitted(true)
    setTimeout(() => navigate('/bq'), 1500)
  }

  const incGST = form._incGST || (
    form.estimatedValueExGST
      ? (parseFloat(form.estimatedValueExGST) * (1 + (parseFloat(form.gstPercent) || 0) / 100)).toFixed(2)
      : ''
  )

  const crumbs = [
    { label: 'Budgetary Quotation', onClick: () => navigate('/bq') },
    { label: 'New BQ' },
  ]

  if (submitted) {
    return (
      <AppShell topbarProps={{ crumbs }}>
        <Box sx={{ p: 4 }}>
          <Alert severity="success" sx={{ maxWidth: 500 }}>BQ created successfully. Redirecting…</Alert>
        </Box>
      </AppShell>
    )
  }

  return (
    <AppShell topbarProps={{ crumbs }}>
      <Box sx={{ p: 3, maxWidth: 960 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236' }}>Create Budgetary Quotation</Typography>
          <Chip label="Unsaved" size="small" sx={{ backgroundColor: '#fef8e8', color: '#c07000', fontFamily: "'JetBrains Mono'" }} />
        </Box>

        {/* ── STEP 1: FETCH LEAD ── */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 26, height: 26, borderRadius: 1.5, backgroundColor: '#e8f0fb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem', fontWeight: 700, color: '#1a56a0' }}>01</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a2236' }}>
                Fetch Lead Data
              </Typography>
              <Typography variant="body2" sx={{ color: '#97a3b5', ml: 0.5 }}>
                — enter the Lead Reference ID to pull all project details
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <TextField
                size="small" label="Lead Reference #" placeholder="e.g. L-2526-001"
                value={leadInput} onChange={(e) => setLeadInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                error={!!errors.lead}
                helperText={errors.lead}
                sx={{ width: 240 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 15, color: '#97a3b5' }} /></InputAdornment> }}
              />
              <Button
                variant="contained" startIcon={fetching ? <CircularProgress size={14} color="inherit" /> : <SearchIcon />}
                onClick={() => handleFetch()} disabled={fetching}
              >
                {fetching ? 'Fetching…' : 'Fetch Lead'}
              </Button>
            </Stack>

            {fetchError && <Alert severity="error" sx={{ mt: 2, maxWidth: 520 }}>{fetchError}</Alert>}

            {/* Lead preview card */}
            {lead && (
              <Paper
                variant="outlined"
                sx={{ mt: 2.5, p: 2.5, borderRadius: 2, borderColor: '#b7d9c4', backgroundColor: '#f6fdf9' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <CheckCircleIcon sx={{ color: '#1b8a5a', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ color: '#1b8a5a', fontWeight: 700 }}>
                    Lead found — {lead.id}
                  </Typography>
                  <Chip label={lead.status} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#d4f0e5', color: '#1b8a5a', ml: 'auto' }} />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <LeadInfoRow label="Project" value={lead.projectName} />
                    <LeadInfoRow label="Customer" value={lead.customer} />
                    <LeadInfoRow label="Contact" value={lead.contactPerson} />
                    <LeadInfoRow label="Enquiry Ref" value={lead.enquiryRef} mono />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LeadInfoRow label="Lead Ref" value={lead.id} mono accent />
                    <LeadInfoRow label="Sector" value={lead.sector} />
                    <LeadInfoRow label="Market" value={lead.market} />
                    <LeadInfoRow label="Domain" value={lead.domain} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      {[lead.leadType, lead.tenderType + ' Tender', lead.domain].map((t) => (
                        <Chip key={t} label={t} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#e8f0fb', color: '#1a56a0', fontSize: '0.65rem' }} />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </CardContent>
        </Card>

        {/* ── STEP 2: BQ DETAILS ── */}
        <Card sx={{ mb: 2, opacity: lead ? 1 : 0.45, pointerEvents: lead ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box sx={{ width: 26, height: 26, borderRadius: 1.5, backgroundColor: '#f3eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem', fontWeight: 700, color: '#7c3aed' }}>02</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a2236' }}>BQ Details</Typography>
            </Box>

            <Grid container spacing={2.5}>
              {/* Customer details */}
              <Grid item xs={12}>
                <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
                  Customer Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Customer Type" value={form.customerType} onChange={set('customerType')}>
                  {['Internal', 'External'].map((t) => <MenuItem key={t} value={t} sx={{ fontSize: '0.82rem' }}>{t}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Contact Person" value={form.contactPerson} onChange={set('contactPerson')} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Contact Email" type="email" value={form.contactEmail} onChange={set('contactEmail')} />
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Financial details */}
              <Grid item xs={12}>
                <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
                  Financial Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField select fullWidth label="Currency" value={form.currency} onChange={set('currency')}>
                  {CURRENCIES.map((c) => <MenuItem key={c} value={c} sx={{ fontSize: '0.82rem' }}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth required label="Estimated Value (Ex-GST)"
                  type="number" value={form.estimatedValueExGST} onChange={set('estimatedValueExGST')}
                  error={!!errors.valueExGST} helperText={errors.valueExGST}
                  InputProps={{ startAdornment: <InputAdornment position="start">{form.currency === 'INR' ? '₹' : form.currency === 'GBP' ? '£' : '$'}</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  select fullWidth label="GST %" value={form.gstPercent} onChange={set('gstPercent')}
                >
                  {['0', '5', '12', '18', '28'].map((g) => (
                    <MenuItem key={g} value={g} sx={{ fontSize: '0.82rem' }}>{g}%{g === '0' ? ' (Export / Zero-rated)' : ''}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="Estimated Value (Inc-GST)"
                  value={incGST ? `${incGST} Cr` : ''}
                  InputProps={{ readOnly: true, sx: { backgroundColor: '#f8fafd', fontFamily: "'JetBrains Mono'", fontSize: '0.85rem', fontWeight: 600, color: '#1a56a0' } }}
                />
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Dates */}
              <Grid item xs={12}>
                <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
                  Key Dates
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="RFQ Received Date" type="date" value={form.rfqDate} onChange={set('rfqDate')} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth required label="Submission Due Date" type="date"
                  value={form.submissionDate} onChange={set('submissionDate')}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.submissionDate} helperText={errors.submissionDate}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Extended Date" type="date" value={form.extendedDate} onChange={set('extendedDate')} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Date of Letter Submission" type="date" value={form.letterDate} onChange={set('letterDate')} InputLabelProps={{ shrink: true }} />
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Assignment */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select fullWidth required label="BQ Owner"
                  value={form.owner} onChange={set('owner')}
                  error={!!errors.owner} helperText={errors.owner}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.82rem', color: '#97a3b5' }}>Assign to…</MenuItem>
                  {OWNERS.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ── STEP 3: SCOPE & REMARKS ── */}
        <Card sx={{ mb: 3, opacity: lead ? 1 : 0.45, pointerEvents: lead ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box sx={{ width: 26, height: 26, borderRadius: 1.5, backgroundColor: '#e6f6f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem', fontWeight: 700, color: '#0e7c61' }}>03</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a2236' }}>Scope &amp; Remarks</Typography>
            </Box>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth multiline rows={4} label="Scope of Work Summary"
                  value={form.scopeSummary} onChange={set('scopeSummary')}
                  placeholder="Describe the scope: supply, integration, testing, documentation, warranty terms…"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth multiline rows={3} label="Remarks / Notes"
                  value={form.remarks} onChange={set('remarks')}
                  placeholder="BQ validity, special conditions, pricing assumptions…"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button variant="contained" size="large" startIcon={<SaveOutlinedIcon />} onClick={handleSave} disabled={!lead}>
            Save BQ
          </Button>
          <Button variant="outlined" size="large" onClick={handleSave} disabled={!lead}>
            Save &amp; Add Another
          </Button>
          <Button variant="text" size="large" startIcon={<ArrowBackIcon />} onClick={() => navigate('/bq')} sx={{ ml: 'auto' }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </AppShell>
  )
}
