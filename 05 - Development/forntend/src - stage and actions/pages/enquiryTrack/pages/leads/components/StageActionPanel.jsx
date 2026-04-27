import React, { useState } from 'react'
import {
  Box, Typography, Grid, TextField, MenuItem, Button,
  Alert, Divider, Paper, Chip,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { LEAD_STAGES, OWNERS } from '../../../data/mockLeads'

const NEXT_STAGE_OPTIONS = [
  'Executive Summary',
  'Go / No-Go Decision',
  'Lead Owner Assigned',
  'Technical Analysis',
  'Internal Approval — L1',
  'Internal Approval — L2',
  'Management Approval',
  'Feasibility Confirmed',
  'Pass to BQ Module',
  'Pass to Tender Module',
  'No-Go — Push to CRM',
]

export default function StageActionPanel({ lead, onUpdate }) {
  const [stage, setStage] = useState('')
  const [owner, setOwner] = useState(lead.owner)
  const [remarks, setRemarks] = useState('')
  const [crmNote, setCrmNote] = useState('')
  const [showNoGo, setShowNoGo] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleUpdate = () => {
    if (!stage && owner === lead.owner) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    if (onUpdate) onUpdate({ stage, owner, remarks })
  }

  const handleNoGo = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Box>
      {/* Current state banner */}
      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2.5, backgroundColor: '#f4f7fc', borderColor: '#c3ccd9', borderRadius: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Current Stage
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#1a2236', fontWeight: 700 }}>
              {LEAD_STAGES[lead.currentStage]}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Lead Owner
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#1a2236', fontWeight: 600 }}>
              {lead.owner}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Status
            </Typography>
            <Box>
              <Chip
                label={lead.status}
                size="small"
                sx={{
                  mt: 0.3,
                  backgroundColor: lead.status === 'Go Decision' || lead.status === 'Passed to Tender' ? '#d4f0e5' : lead.status === 'No-Go' ? '#fde8e6' : '#fef8e8',
                  color: lead.status === 'Go Decision' || lead.status === 'Passed to Tender' ? '#1b8a5a' : lead.status === 'No-Go' ? '#c0392b' : '#c07000',
                  fontFamily: "'JetBrains Mono'",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Update form */}
      <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
        Update Stage / Owner
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>Stage updated successfully.</Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select fullWidth label="Move Stage To"
            value={stage} onChange={(e) => setStage(e.target.value)}
          >
            {NEXT_STAGE_OPTIONS.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: '0.82rem' }}>{s}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select fullWidth label="Change Lead Owner"
            value={owner} onChange={(e) => setOwner(e.target.value)}
          >
            {OWNERS.map((o) => (
              <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={3} label="Stage Remarks"
            placeholder="Add remarks for this stage update…"
            value={remarks} onChange={(e) => setRemarks(e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <Button variant="contained" onClick={handleUpdate} endIcon={<ArrowForwardIcon />}>
          Update Stage
        </Button>
        <Button
          variant="outlined" color="error"
          startIcon={<CancelOutlinedIcon />}
          onClick={() => setShowNoGo(!showNoGo)}
        >
          Mark No-Go → CRM
        </Button>
      </Box>

      {/* No-Go section */}
      {showNoGo && (
        <Paper
          variant="outlined"
          sx={{ mt: 2.5, p: 2.5, borderColor: '#f5c6c3', backgroundColor: '#fffbfb', borderRadius: 2 }}
        >
          <Typography variant="subtitle2" sx={{ color: '#c0392b', mb: 1.5, fontWeight: 700 }}>
            No-Go Decision — Push to CRM Portal
          </Typography>
          <Typography variant="body2" sx={{ color: '#5a6880', mb: 2, lineHeight: 1.6 }}>
            This action will mark the lead as <strong>No-Go</strong> and notify the CRM portal team. Other internal teams will be able to view and evaluate this opportunity. The lead record will be retained for audit purposes.
          </Typography>
          <TextField
            fullWidth multiline rows={3} label="Non-Participation Remarks (for CRM)"
            placeholder="State reason for non-participation. This note will be visible to internal CRM team…"
            value={crmNote} onChange={(e) => setCrmNote(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="error" onClick={handleNoGo}>
              Confirm No-Go &amp; Push to CRM
            </Button>
            <Button variant="outlined" onClick={() => setShowNoGo(false)}>Cancel</Button>
          </Box>
        </Paper>
      )}

      {/* Pass to next module */}
      {(lead.status === 'Go Decision' || lead.status === 'Feasibility Confirmed') && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
            Pass to Next Module
          </Typography>
          <Paper
            variant="outlined"
            sx={{ p: 2, borderColor: '#b7d9c4', backgroundColor: '#f6fdf9', borderRadius: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#5a6880' }}>Lead Reference:</Typography>
              <Chip
                label={lead.id}
                size="small"
                sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#e8f0fb', color: '#1a56a0' }}
              />
              <Typography variant="body2" sx={{ color: '#97a3b5' }}>
                — will be auto-fetched in the downstream module
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="contained" color="secondary" endIcon={<ArrowForwardIcon />}>
                Pass to BQ Module
              </Button>
              <Button variant="outlined" color="secondary" endIcon={<ArrowForwardIcon />}>
                Pass to Tender Module
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  )
}
