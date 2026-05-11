import React, { useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, TextField, MenuItem, Grid, Paper, IconButton, LinearProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const DOC_STATUSES = ['Received', 'Requested', 'In Progress', 'Ready', 'Submitted', 'Pending', 'Not Required']

const STATUS_CHIP = {
  Received:      { bg: '#d4f0e5', color: '#1b8a5a' },
  Submitted:     { bg: '#d4f0e5', color: '#1b8a5a' },
  Ready:         { bg: '#e8f0fb', color: '#1a56a0' },
  'In Progress': { bg: '#fef8e8', color: '#c07000' },
  Requested:     { bg: '#fef8e8', color: '#c07000' },
  Pending:       { bg: '#fde8e6', color: '#c0392b' },
  'Not Required':{ bg: '#f0f3f8', color: '#97a3b5' },
}

const EMPTY = { name: '', status: 'Pending', date: '' }

export default function DocumentsTab({ tender }) {
  const [rows, setRows]     = useState(tender.documents)
  const [adding, setAdding] = useState(false)
  const [form, setForm]     = useState(EMPTY)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const handleAdd = () => {
    if (!form.name.trim()) return
    setRows((r) => [...r, { ...form }])
    setForm(EMPTY)
    setAdding(false)
  }
  const handleDelete = (idx) => setRows((r) => r.filter((_, i) => i !== idx))
  const handleStatusChange = (idx, val) => setRows((r) => r.map((row, i) => i === idx ? { ...row, status: val } : row))

  const doneCount = rows.filter((r) => ['Received', 'Submitted', 'Ready'].includes(r.status)).length
  const progress  = rows.length ? Math.round((doneCount / rows.length) * 100) : 0

  return (
    <Box>
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
          <Typography variant="caption" sx={{ color: '#5a6880' }}>{doneCount} of {rows.length} documents ready / submitted</Typography>
          <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: '#0e7c7b', fontWeight: 600 }}>{progress}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress}
          sx={{ height: 5, borderRadius: 3, backgroundColor: '#e6f6f6', '& .MuiLinearProgress-bar': { backgroundColor: '#0e7c7b', borderRadius: 3 } }}
        />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Document</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.7rem', color: '#c3ccd9' }}>{String(i + 1).padStart(2, '0')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.82rem', color: '#1a2236', fontWeight: 500 }}>{r.name}</Typography>
                </TableCell>
                <TableCell>
                  <TextField select size="small" value={r.status} onChange={(e) => handleStatusChange(i, e.target.value)}
                    sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { fontSize: '0.78rem' } }}>
                    {DOC_STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>{s}</MenuItem>)}
                  </TextField>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#5a6880' }}>{r.date || '—'}</Typography>
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

      {adding ? (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth label="Document Name" value={form.name} onChange={set('name')} placeholder="e.g. EMD Bank Guarantee" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select fullWidth label="Status" value={form.status} onChange={set('status')}>
                {DOC_STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: '0.82rem' }}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Date" type="date" value={form.date} onChange={set('date')} InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Button variant="contained" size="small" onClick={handleAdd} sx={{ backgroundColor: '#0e7c7b', '&:hover': { backgroundColor: '#0b6665' } }}>Add</Button>
            <Button variant="outlined" size="small" onClick={() => { setAdding(false); setForm(EMPTY) }}>Cancel</Button>
          </Box>
        </Paper>
      ) : (
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setAdding(true)}>Add Document</Button>
      )}
    </Box>
  )
}
