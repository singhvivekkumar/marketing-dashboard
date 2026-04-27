import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, TextField, MenuItem,
  Button, Divider, ToggleButton, ToggleButtonGroup, Alert, Stack, Chip,
} from '@mui/material'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AppShell from '../../components/Layout/AppShell'
import { DOMAINS, OWNERS } from '../../data/mockLeads'

const SECTIONS = [
  { num: '01', label: 'Basic Information' },
  { num: '02', label: 'Classification' },
  { num: '03', label: 'Status & Financials' },
]

const INITIAL = {
  projectName: '',
  customer: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  enquiryRef: '',
  enquiryDate: '',
  leadType: 'EOI',
  sector: 'Defence',
  market: 'Domestic',
  tenderType: 'Single',
  domain: '',
  owner: '',
  status: 'New',
  estimatedValue: '',
  responseDeadline: '',
  remarks: '',
}

function SectionHeader({ num, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
      <Box sx={{
        width: 26, height: 26, borderRadius: 1.5,
        backgroundColor: '#e8f0fb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem', fontWeight: 700, color: '#1a56a0' }}>
          {num}
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a2236' }}>{label}</Typography>
    </Box>
  )
}

function ToggleField({ label, value, onChange, options }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: '#5a6880', display: 'block', mb: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.68rem' }}>
        {label} *
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(_, v) => v && onChange(v)}
        size="small"
        sx={{
          flexWrap: 'wrap', gap: 0.5,
          '& .MuiToggleButton-root': {
            textTransform: 'none', fontSize: '0.78rem', fontWeight: 500,
            fontFamily: "'DM Sans'", border: '1px solid #c3ccd9 !important',
            borderRadius: '6px !important', px: 1.5, py: 0.6,
            color: '#5a6880',
            '&.Mui-selected': {
              backgroundColor: '#e8f0fb', color: '#1a56a0',
              borderColor: '#1a56a0 !important', fontWeight: 600,
            },
          },
        }}
      >
        {options.map((o) => (
          <ToggleButton key={o} value={o}>{o}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}

export default function LeadCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setDirect = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.projectName.trim()) e.projectName = 'Project name is required'
    if (!form.customer.trim())     e.customer    = 'Customer is required'
    if (!form.domain)              e.domain      = 'Business domain is required'
    if (!form.owner)               e.owner       = 'Lead owner is required'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitted(true)
    setTimeout(() => navigate('/leads'), 1500)
  }

  const crumbs = [
    { label: 'Leads', onClick: () => navigate('/leads') },
    { label: 'New Lead' },
  ]

  if (submitted) {
    return (
      <AppShell topbarProps={{ crumbs }}>
        <Box sx={{ p: 4 }}>
          <Alert severity="success" sx={{ maxWidth: 500 }}>
            Lead created successfully. Redirecting to Leads list…
          </Alert>
        </Box>
      </AppShell>
    )
  }

  return (
    <AppShell topbarProps={{ crumbs }}>
      <Box sx={{ p: 3, maxWidth: 900 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236' }}>Create New Lead</Typography>
          <Chip label="Unsaved" size="small" sx={{ backgroundColor: '#fef8e8', color: '#c07000', fontFamily: "'JetBrains Mono'" }} />
        </Box>

        {/* SECTION 1 */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SectionHeader num="01" label="Basic Information" />
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth required label="Project / Programme Name"
                  value={form.projectName} onChange={set('projectName')}
                  error={!!errors.projectName} helperText={errors.projectName}
                  placeholder="e.g. AESA Radar Integration System"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth required label="Customer / Organisation"
                  value={form.customer} onChange={set('customer')}
                  error={!!errors.customer} helperText={errors.customer}
                  placeholder="e.g. Bharat Electronics Limited"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Contact Person"
                  value={form.contactPerson} onChange={set('contactPerson')}
                  placeholder="Name, Designation"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Contact Email" type="email"
                  value={form.contactEmail} onChange={set('contactEmail')}
                  placeholder="contact@customer.gov.in"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Contact Phone"
                  value={form.contactPhone} onChange={set('contactPhone')}
                  placeholder="+91 …"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Customer Enquiry Reference #"
                  value={form.enquiryRef} onChange={set('enquiryRef')}
                  placeholder="Customer-issued reference number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Enquiry Date" type="date"
                  value={form.enquiryDate} onChange={set('enquiryDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* SECTION 2 */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SectionHeader num="02" label="Classification" />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <ToggleField
                  label="Lead Type"
                  value={form.leadType}
                  onChange={setDirect('leadType')}
                  options={['EOI', 'RFI', 'Customer Input']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ToggleField
                  label="Sector"
                  value={form.sector}
                  onChange={setDirect('sector')}
                  options={['Defence', 'Non-Defence']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ToggleField
                  label="Market"
                  value={form.market}
                  onChange={setDirect('market')}
                  options={['Domestic', 'Export']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ToggleField
                  label="Tender Type"
                  value={form.tenderType}
                  onChange={setDirect('tenderType')}
                  options={['Single', 'Multi / Open', 'Limited']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select fullWidth required label="Business Domain"
                  value={form.domain} onChange={set('domain')}
                  error={!!errors.domain} helperText={errors.domain}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.82rem', color: '#97a3b5' }}>Select domain…</MenuItem>
                  {DOMAINS.map((d) => (
                    <MenuItem key={d} value={d} sx={{ fontSize: '0.82rem' }}>{d}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select fullWidth required label="Lead Owner"
                  value={form.owner} onChange={set('owner')}
                  error={!!errors.owner} helperText={errors.owner}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.82rem', color: '#97a3b5' }}>Assign to…</MenuItem>
                  {OWNERS.map((o) => (
                    <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* SECTION 3 */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <SectionHeader num="03" label="Status & Financials" />
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select fullWidth label="Initial Status"
                  value={form.status} onChange={set('status')}
                >
                  {['New', 'Under Review', 'Qualified'].map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontSize: '0.82rem' }}>{s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth label="Estimated Value (₹ Crore)" type="number"
                  value={form.estimatedValue} onChange={set('estimatedValue')}
                  placeholder="0.00"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth label="Response Deadline" type="date"
                  value={form.responseDeadline} onChange={set('responseDeadline')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth multiline rows={4} label="Remarks / Notes"
                  value={form.remarks} onChange={set('remarks')}
                  placeholder="Initial observations, source of enquiry, strategic context…"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained" size="large" startIcon={<SaveOutlinedIcon />}
            onClick={handleSave}
          >
            Save Lead
          </Button>
          <Button variant="outlined" size="large" onClick={handleSave}>
            Save &amp; Add Another
          </Button>
          <Button
            variant="text" size="large" startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/leads')}
            sx={{ ml: 'auto' }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </AppShell>
  )
}
