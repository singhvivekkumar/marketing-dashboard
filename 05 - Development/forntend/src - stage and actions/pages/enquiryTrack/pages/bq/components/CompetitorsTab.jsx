import React, { useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, TextField, MenuItem,
  Grid, Paper, Alert, IconButton, Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { COMPETITOR_TYPES } from '../../../data/mockBQ'

const EMPTY = { name: '', type: 'Indian Private', estimatedBid: '', strengths: '', weaknesses: '', likelyL1: false }

export default function CompetitorsTab({ bq }) {
  const [rows, setRows]         = useState(bq.competitors)
  const [adding, setAdding]     = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [saved, setSaved]       = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleAdd = () => {
    if (!form.name.trim()) return
    setRows((r) => [...r, { ...form, estimatedBid: parseFloat(form.estimatedBid) || 0 }])
    setForm(EMPTY)
    setAdding(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = (idx) => setRows((r) => r.filter((_, i) => i !== idx))

  const TYPE_COLORS = {
    'Indian Private':  { bg: '#e8f0fb', color: '#1a56a0' },
    'Indian PSU':      { bg: '#fef8e8', color: '#c07000' },
    'Foreign OEM':     { bg: '#fde8e6', color: '#c0392b' },
    'JV / Consortium': { bg: '#f3eeff', color: '#7c3aed' },
  }

  return (
    <Box>
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Competitor added.</Alert>}

      {rows.length === 0 && !adding ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 2, borderStyle: 'dashed', borderColor: '#c3ccd9' }}>
          <Typography variant="body2" sx={{ color: '#97a3b5', mb: 1.5 }}>No competitor intelligence added yet.</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} size="small" onClick={() => setAdding(true)}>
            Add Competitor
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Competitor</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Est. Bid (₹ Cr)</TableCell>
                  <TableCell>Strengths</TableCell>
                  <TableCell>Weaknesses</TableCell>
                  <TableCell align="center">Likely L1</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r, i) => {
                  const tc = TYPE_COLORS[r.type] || TYPE_COLORS['Indian Private']
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a2236' }}>{r.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={r.type} size="small" sx={{ ...tc, fontFamily: "'JetBrains Mono'", fontSize: '0.65rem' }} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.82rem', fontWeight: 600, color: '#1a2236' }}>
                          {r.estimatedBid ? r.estimatedBid.toFixed(2) : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#5a6880' }}>{r.strengths || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#5a6880' }}>{r.weaknesses || '—'}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        {r.likelyL1 ? (
                          <EmojiEventsIcon sx={{ fontSize: 16, color: '#c07000' }} />
                        ) : (
                          <Typography sx={{ fontSize: '0.72rem', color: '#c3ccd9' }}>—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleDelete(i)} sx={{ color: '#c3ccd9', '&:hover': { color: '#c0392b' } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setAdding(true)}>
            Add Competitor
          </Button>
        </>
      )}

      {/* Add form */}
      {adding && (
        <>
          <Divider sx={{ my: 2.5 }} />
          <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>
            Add Competitor
          </Typography>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Competitor Name" value={form.name} onChange={set('name')} placeholder="e.g. ECIL" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Type" value={form.type} onChange={set('type')}>
                  {COMPETITOR_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ fontSize: '0.82rem' }}>{t}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Estimated Bid (₹ Cr)" type="number" value={form.estimatedBid} onChange={set('estimatedBid')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Strengths" value={form.strengths} onChange={set('strengths')} placeholder="Key competitive advantages…" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Weaknesses" value={form.weaknesses} onChange={set('weaknesses')} placeholder="Limitations or risks…" />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <Button variant="contained" onClick={handleAdd}>Add</Button>
              <Button variant="outlined" onClick={() => { setAdding(false); setForm(EMPTY) }}>Cancel</Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  )
}
