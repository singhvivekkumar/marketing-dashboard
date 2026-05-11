import React, { useState } from 'react'
import {
  Box, Typography, Grid, TextField, MenuItem, Button,
  Alert, Divider, Paper, Chip, Stack,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SendIcon from '@mui/icons-material/Send'
import BlockIcon from '@mui/icons-material/Block'
import { TENDER_STAGES } from '../../../data/mockTenders'

const APPROVAL_COLORS = {
  Approved:       { bg: '#d4f0e5', color: '#1b8a5a' },
  Pending:        { bg: '#fef8e8', color: '#c07000' },
  'Not Required': { bg: '#f0f3f8', color: '#97a3b5' },
  'Not Started':  { bg: '#f0f3f8', color: '#97a3b5' },
}

const STAGE_OPTIONS = [
  'Scope of Work Study',
  'Feasibility Study',
  'Tech Head Approval',
  'Core Committee Presentation',
  'Passed to Bidding',
  'Not Participated',
]

const OWNERS = ['Ravi Kumar', 'Sunita Menon', 'Amit Shah', 'Priya Nair', 'Deepak Verma']

export default function TenderStageActionPanel({ tender }) {
  const [stage, setStage]                       = useState('')
  const [owner, setOwner]                       = useState(tender.owner)
  const [remarks, setRemarks]                   = useState('')
  const [showNoParticipate, setShowNoParticipate] = useState(false)
  const [noPartReason, setNoPartReason]         = useState('')
  const [saved, setSaved]                       = useState(false)

  const handleUpdate = () => {
    if (!stage && owner === tender.owner) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const techChip = APPROVAL_COLORS[tender.techHeadApproval.status] || APPROVAL_COLORS['Not Started']

  return (
    <Box>
      {/* Current state banner */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2.5, backgroundColor: '#f4f7fc', borderColor: '#c3ccd9', borderRadius: 2 }}>
        <Stack direction="row" spacing={3} flexWrap="wrap" divider={<Divider orientation="vertical" flexItem />}>
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Stage</Typography>
            <Typography variant="subtitle1" sx={{ color: '#1a2236', fontWeight: 700 }}>{TENDER_STAGES[tender.currentStage]}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Participation</Typography>
            <Box sx={{ mt: 0.3 }}>
              <Chip
                label={tender.participated ? 'Participating' : 'Not Participating'}
                size="small"
                sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: tender.participated ? '#d4f0e5' : '#fde8e6', color: tender.participated ? '#1b8a5a' : '#c0392b' }}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Owner</Typography>
            <Typography variant="subtitle1" sx={{ color: '#1a2236', fontWeight: 600 }}>{tender.owner}</Typography>
          </Box>
        </Stack>
      </Paper>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>Stage updated successfully.</Alert>}

      <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
        Update Stage / Owner
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField select fullWidth label="Move Stage To" value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGE_OPTIONS.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: '0.82rem' }}>{s}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField select fullWidth label="Change Owner" value={owner} onChange={(e) => setOwner(e.target.value)}>
            {OWNERS.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={2} label="Stage Remarks"
            placeholder="Add remarks for this stage update…"
            value={remarks} onChange={(e) => setRemarks(e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={handleUpdate} endIcon={<ArrowForwardIcon />}>Update Stage</Button>
        <Button variant="outlined" color="error" startIcon={<BlockIcon />} onClick={() => setShowNoParticipate(!showNoParticipate)}>
          Mark Not Participating
        </Button>
      </Box>

      {showNoParticipate && (
        <Paper variant="outlined" sx={{ mt: 2.5, p: 2.5, borderColor: '#f5c6c3', backgroundColor: '#fffbfb', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#c0392b', mb: 1.5, fontWeight: 700 }}>Mark as Not Participating</Typography>
          <Typography variant="body2" sx={{ color: '#5a6880', mb: 2, lineHeight: 1.6 }}>
            This tender will be marked as <strong>Not Participated</strong>. The reason will be recorded for audit. All previously gathered lead, BQ, and tender data is preserved.
          </Typography>
          <TextField
            fullWidth multiline rows={3} label="Reason for Non-Participation *"
            placeholder="State the reason: certification gap, capacity constraint, strategic decision…"
            value={noPartReason} onChange={(e) => setNoPartReason(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="error" onClick={() => { setSaved(true); setShowNoParticipate(false); setTimeout(() => setSaved(false), 2500) }}>
              Confirm Not Participating
            </Button>
            <Button variant="outlined" onClick={() => setShowNoParticipate(false)}>Cancel</Button>
          </Box>
        </Paper>
      )}

      {/* Tech Head Approval */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
        Tech Head Approval
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 1.5, flexShrink: 0,
            backgroundColor: tender.techHeadApproval.status === 'Approved' ? '#d4f0e5' : '#f0f3f8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.62rem', fontWeight: 700, color: tender.techHeadApproval.status === 'Approved' ? '#1b8a5a' : '#97a3b5' }}>TH</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a2236' }}>Tech Head</Typography>
            <Typography variant="body2" sx={{ color: '#5a6880' }}>{tender.techHeadApproval.approver}</Typography>
            {tender.techHeadApproval.remarks && (
              <Typography variant="body2" sx={{ color: '#5a6880', mt: 0.5, fontStyle: 'italic' }}>{tender.techHeadApproval.remarks}</Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Chip label={tender.techHeadApproval.status} size="small" sx={{ ...techChip, fontFamily: "'JetBrains Mono'" }} />
            {tender.techHeadApproval.date && (
              <Typography variant="caption" sx={{ display: 'block', color: '#97a3b5', mt: 0.4, fontFamily: "'JetBrains Mono'" }}>
                {tender.techHeadApproval.date}
              </Typography>
            )}
            {tender.techHeadApproval.status === 'Pending' && (
              <Button size="small" variant="outlined" endIcon={<SendIcon sx={{ fontSize: 11 }} />} sx={{ mt: 0.5, fontSize: '0.7rem', py: 0.2 }}>
                Remind
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Pass to Bidding */}
      {tender.participated && tender.currentStage >= 3 && tender.status !== 'Passed to Bidding' && (
        <>
          <Divider sx={{ my: 3 }} />
          <Paper variant="outlined" sx={{ p: 2, borderColor: '#b7d9c4', backgroundColor: '#f6fdf9', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#1b8a5a', mb: 1, fontWeight: 700 }}>Pass to Bidding Module</Typography>
            <Typography variant="body2" sx={{ color: '#5a6880', mb: 1.5 }}>
              Core Committee has approved participation. Tender, BQ, and Lead data will all be forwarded to the Bidding module.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {[
                { label: 'Lead',   val: tender.leadRef, color: '#1a56a0' },
                { label: 'BQ',     val: tender.bqRef,   color: '#7c3aed' },
                { label: 'Tender', val: tender.id,      color: '#0e7c7b' },
              ].map(({ label, val, color }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, backgroundColor: `${color}10`, border: `1px solid ${color}30`, borderRadius: 1, px: 1.2, py: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#97a3b5' }}>{label}:</Typography>
                  <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color, fontWeight: 600 }}>{val}</Typography>
                </Box>
              ))}
            </Box>
            <Button variant="contained" color="secondary" endIcon={<ArrowForwardIcon />}>
              Pass to Bidding Module →
            </Button>
          </Paper>
        </>
      )}
    </Box>
  )
}
