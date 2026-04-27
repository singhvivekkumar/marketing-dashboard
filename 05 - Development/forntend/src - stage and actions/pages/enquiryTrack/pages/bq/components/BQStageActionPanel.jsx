import React, { useState } from 'react'
import {
  Box, Typography, Grid, TextField, MenuItem, Button,
  Alert, Divider, Paper, Chip, Stack,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SendIcon from '@mui/icons-material/Send'
import { BQ_STAGES } from '../../../data/mockBQ'

const APPROVAL_STATUS_COLORS = {
  Approved:      { bg: '#d4f0e5', color: '#1b8a5a' },
  Pending:       { bg: '#fef8e8', color: '#c07000' },
  'Not Started': { bg: '#f0f3f8', color: '#97a3b5' },
}

const NEXT_STAGE_OPTIONS = [
  'Scope of Work Study',
  'Feasibility Study',
  'Technical Proposal',
  'Tech Head Approval',
  'FLM / Finance Approval',
  'BQ Submitted',
]

const OWNERS = ['Ravi Kumar', 'Sunita Menon', 'Amit Shah', 'Priya Nair', 'Deepak Verma']

export default function BQStageActionPanel({ bq }) {
  const [stage, setStage]     = useState('')
  const [owner, setOwner]     = useState(bq.owner)
  const [remarks, setRemarks] = useState('')
  const [saved, setSaved]     = useState(false)

  const handleUpdate = () => {
    if (!stage && owner === bq.owner) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Box>
      {/* Current state banner */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2.5, backgroundColor: '#f4f7fc', borderColor: '#c3ccd9', borderRadius: 2 }}>
        <Stack direction="row" spacing={3} flexWrap="wrap" divider={<Divider orientation="vertical" flexItem />}>
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Stage</Typography>
            <Typography variant="subtitle1" sx={{ color: '#1a2236', fontWeight: 700 }}>{BQ_STAGES[bq.currentStage]}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Owner</Typography>
            <Typography variant="subtitle1" sx={{ color: '#1a2236', fontWeight: 600 }}>{bq.owner}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</Typography>
            <Box sx={{ mt: 0.3 }}>
              <Chip label={bq.status} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#e8f0fb', color: '#1a56a0' }} />
            </Box>
          </Box>
        </Stack>
      </Paper>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>Stage updated successfully.</Alert>}

      {/* Stage update form */}
      <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
        Update Stage / Owner
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField select fullWidth label="Move Stage To" value={stage} onChange={(e) => setStage(e.target.value)}>
            {NEXT_STAGE_OPTIONS.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: '0.82rem' }}>{s}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField select fullWidth label="Change Owner" value={owner} onChange={(e) => setOwner(e.target.value)}>
            {OWNERS.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={3} label="Remarks"
            placeholder="Add remarks for this stage update…"
            value={remarks} onChange={(e) => setRemarks(e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <Button variant="contained" onClick={handleUpdate} endIcon={<ArrowForwardIcon />}>
          Update Stage
        </Button>
      </Box>

      {/* Approval chain */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
        Approval Chain
      </Typography>

      <Stack spacing={0} divider={<Divider />} sx={{ border: '1px solid #dde3ed', borderRadius: 2, overflow: 'hidden' }}>
        {bq.approvals.map((a, i) => {
          const cs = APPROVAL_STATUS_COLORS[a.status] || APPROVAL_STATUS_COLORS['Not Started']
          return (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5 }}>
              <Box sx={{
                width: 34, height: 34, borderRadius: 1.5, flexShrink: 0,
                backgroundColor: a.status === 'Approved' ? '#d4f0e5' : '#f0f3f8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.62rem', fontWeight: 700, color: a.status === 'Approved' ? '#1b8a5a' : '#97a3b5' }}>
                  {a.level.slice(0, 3).toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a2236' }}>{a.role}</Typography>
                <Typography variant="body2" sx={{ color: '#5a6880' }}>{a.name}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Chip label={a.status} size="small" sx={{ ...cs, fontFamily: "'JetBrains Mono'" }} />
                {a.date && <Typography variant="caption" sx={{ display: 'block', color: '#97a3b5', mt: 0.4, fontFamily: "'JetBrains Mono'" }}>{a.date}</Typography>}
                {a.status === 'Pending' && (
                  <Button size="small" variant="outlined" endIcon={<SendIcon sx={{ fontSize: 11 }} />} sx={{ mt: 0.5, fontSize: '0.7rem', py: 0.2 }}>
                    Remind
                  </Button>
                )}
              </Box>
            </Box>
          )
        })}
      </Stack>

      {/* Final submission */}
      {bq.currentStage >= 4 && bq.status !== 'Submitted' && (
        <>
          <Divider sx={{ my: 3 }} />
          <Paper variant="outlined" sx={{ p: 2, borderColor: '#b7d9c4', backgroundColor: '#f6fdf9', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#1b8a5a', mb: 1, fontWeight: 700 }}>Ready for Submission</Typography>
            <Typography variant="body2" sx={{ color: '#5a6880', mb: 2 }}>
              All approvals received. BQ can now be submitted to the customer.
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Button variant="contained" color="secondary" endIcon={<ArrowForwardIcon />}>
                Mark as BQ Submitted
              </Button>
              <Button variant="outlined" color="secondary">
                Pass to Tender Module →
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </Box>
  )
}
