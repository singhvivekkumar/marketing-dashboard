import React, { useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, TextField, Grid, Paper, Alert, IconButton, Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const EMPTY = { ref: '', date: '', description: '', applied: true }

export default function CorrigendaTab({ tender }) {
  const [rows, setRows]     = useState(tender.corrigenda)
  const [adding, setAdding] = useState(false)
  const [form, setForm]     = useState(EMPTY)
  const [saved, setSaved]   = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleAdd = () => {
    if (!form.ref.trim() || !form.description.trim()) return
    setRows((r) => [...r, { ...form, applied: true }])
    setForm(EMPTY)
    setAdding(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = (idx) => setRows((r) => r.filter((_, i) => i !== idx))

  return (
    <Box>
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Corrigendum recorded.</Alert>}

      {rows.length === 0 && !adding ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 2, borderStyle: 'dashed', borderColor: '#c3ccd9', mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#97a3b5', mb: 1.5 }}>No corrigenda recorded for this tender.</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} size="small" onClick={() => setAdding(true)}>Add Corrigendum</Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ref</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amendment Description</TableCell>
                  <TableCell align="center">Applied</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Chip label={r.ref} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#e6f6f6', color: '#0e7c7b', fontSize: '0.68rem' }} />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: '#5a6880' }}>{r.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.8rem', color: '#1a2236' }}>{r.description}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {r.applied
                        ? <CheckCircleIcon sx={{ fontSize: 16, color: '#1b8a5a' }} />
                        : <Typography sx={{ fontSize: '0.72rem', color: '#c3ccd9' }}>—</Typography>}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDelete(i)} sx={{ color: '#c3ccd9', '&:hover': { color: '#c0392b' } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setAdding(true)}>Add Corrigendum</Button>
        </>
      )}

      {adding && (
        <>
          <Divider sx={{ my: 2.5 }} />
          <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>New Corrigendum</Typography>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Reference" value={form.ref} onChange={set('ref')} placeholder="e.g. C-02" />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Date Issued" type="date" value={form.date} onChange={set('date')} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Amendment Description" value={form.description} onChange={set('description')} placeholder="What changed…" />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <Button variant="contained" onClick={handleAdd} sx={{ backgroundColor: '#0e7c7b', '&:hover': { backgroundColor: '#0b6665' } }}>Add</Button>
              <Button variant="outlined" onClick={() => { setAdding(false); setForm(EMPTY) }}>Cancel</Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  )
}
