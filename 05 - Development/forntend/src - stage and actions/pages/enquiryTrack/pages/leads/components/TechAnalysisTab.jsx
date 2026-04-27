import React, { useState } from 'react'
import { Box, Grid, TextField, MenuItem, Button, Alert } from '@mui/material'

const FEASIBILITY_OPTIONS = ['Feasible', 'Partially Feasible', 'Not Feasible', 'Under Assessment']
const TRL_OPTIONS = [
  'TRL 1 — Basic research',
  'TRL 2 — Technology concept',
  'TRL 3 — Experimental proof',
  'TRL 4 — Lab validation',
  'TRL 5 — Relevant environment',
  'TRL 6 — Relevant environment (prototype)',
  'TRL 7 — System prototype',
  'TRL 8 — System complete',
  'TRL 9 — Mission proven',
]

export default function TechAnalysisTab({ lead }) {
  const ta = lead.techAnalysis || {}
  const [form, setForm] = useState({
    summary: ta.summary || '',
    feasibility: ta.feasibility || 'Under Assessment',
    developmentMonths: ta.developmentMonths || '',
    trl: ta.trl || '',
    risks: ta.risks || '',
  })
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Box>
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Technical analysis saved.</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={3} label="Technical Requirement Summary"
            value={form.summary} onChange={set('summary')}
            placeholder="Describe the technical requirements, specifications and interface standards…"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField select fullWidth label="Feasibility Assessment" value={form.feasibility} onChange={set('feasibility')}>
            {FEASIBILITY_OPTIONS.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth type="number" label="Development Effort (months)"
            value={form.developmentMonths} onChange={set('developmentMonths')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField select fullWidth label="Technology Readiness Level" value={form.trl} onChange={set('trl')}>
            <MenuItem value="" sx={{ fontSize: '0.82rem', color: '#97a3b5' }}>Select TRL…</MenuItem>
            {TRL_OPTIONS.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={4} label="Key Technical Risks"
            value={form.risks} onChange={set('risks')}
            placeholder="List technical, compliance, and schedule risks…"
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSave}>Save Analysis</Button>
      </Box>
    </Box>
  )
}
