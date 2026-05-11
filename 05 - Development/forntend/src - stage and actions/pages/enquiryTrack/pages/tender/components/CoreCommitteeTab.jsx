import React, { useState } from 'react'
import { Box, Grid, TextField, MenuItem, Button, Alert, Paper, Typography, Divider, Chip } from '@mui/material'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import GroupsIcon from '@mui/icons-material/Groups'

const DECISIONS = ['Approved to Participate', 'Not Participate', 'Deferred', 'Pending']

export default function CoreCommitteeTab({ tender }) {
  const [form, setForm] = useState({ ...tender.coreCommittee })
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const decisionColor = {
    'Approved to Participate': { bg: '#d4f0e5', color: '#1b8a5a' },
    'Not Participate':         { bg: '#fde8e6', color: '#c0392b' },
    'Deferred':                { bg: '#fef8e8', color: '#c07000' },
    'Pending':                 { bg: '#f0f3f8', color: '#97a3b5' },
  }[form.decision] || { bg: '#f0f3f8', color: '#97a3b5' }

  return (
    <Box>
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Core Committee details saved.</Alert>}

      {form.decision && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2.5, borderRadius: 2, borderColor: decisionColor.color + '60', backgroundColor: decisionColor.bg + '60', display: 'flex', alignItems: 'center', gap: 2 }}>
          <GroupsIcon sx={{ color: decisionColor.color, fontSize: 20 }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Committee Decision</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
              <Chip label={form.decision} size="small" sx={{ fontFamily: "'JetBrains Mono'", ...decisionColor }} />
              {form.decisionDate && (
                <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#97a3b5' }}>{form.decisionDate}</Typography>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Scheduled Date" type="date" value={form.scheduledDate} onChange={set('scheduledDate')} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Venue / Mode" value={form.venue} onChange={set('venue')} placeholder="Board Room 2, HQ / Video Conference" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Presented By" value={form.presentedBy} onChange={set('presentedBy')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Attendees" value={form.attendees} onChange={set('attendees')} placeholder="VP-BD, GM-Electronics, CFO, MD…" />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        <Grid item xs={12} sm={6}>
          <TextField select fullWidth label="Committee Decision" value={form.decision} onChange={set('decision')}>
            {DECISIONS.map((d) => (
              <MenuItem key={d} value={d} sx={{ fontSize: '0.82rem' }}>{d}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Decision Date" type="date" value={form.decisionDate} onChange={set('decisionDate')} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={3} label="Committee Remarks / Minutes" value={form.remarks} onChange={set('remarks')} placeholder="Key decisions, conditions, management directives…" />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave}
          sx={{ backgroundColor: '#0e7c7b', '&:hover': { backgroundColor: '#0b6665' } }}>
          Save Committee Details
        </Button>
      </Box>
    </Box>
  )
}
