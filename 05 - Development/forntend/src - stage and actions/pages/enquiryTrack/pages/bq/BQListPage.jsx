import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, TextField, MenuItem,
  InputAdornment, Button, Stack, Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import AppShell from '../../components/Layout/AppShell'
import { mockBQs } from '../../data/mockBQ'

const STATUS_CHIP = {
  Draft:              { bg: '#f0f3f8', color: '#5a6880' },
  'Scope Study':      { bg: '#e8f0fb', color: '#1a56a0' },
  Feasibility:        { bg: '#fef8e8', color: '#c07000' },
  'Technical Proposal':{ bg: '#f3eeff', color: '#7c3aed' },
  'Tech Head Approval':{ bg: '#fef3da', color: '#b45309' },
  'Finance Approval': { bg: '#e6f6f1', color: '#0e7c61' },
  Submitted:          { bg: '#d4f0e5', color: '#1b8a5a' },
  Revised:            { bg: '#fef8e8', color: '#c07000' },
  Won:                { bg: '#d4f0e5', color: '#1b8a5a' },
  Lost:               { bg: '#fde8e6', color: '#c0392b' },
}

export default function BQListPage() {
  const navigate = useNavigate()
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('All')
  const [sector, setSector]   = useState('All')
  const [market, setMarket]   = useState('All')

  const filtered = mockBQs.filter((b) => {
    const q = search.toLowerCase()
    const matchQ      = !q || b.projectName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.leadRef.toLowerCase().includes(q)
    const matchStatus = status === 'All' || b.status === status
    const matchSector = sector === 'All' || b.sector === sector
    const matchMarket = market === 'All' || b.market === market
    return matchQ && matchStatus && matchSector && matchMarket
  })

  return (
    <AppShell topbarProps={{ title: 'Budgetary Quotation' }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236' }}>Budgetary Quotations</Typography>
            <Typography variant="body2" sx={{ color: '#5a6880', mt: 0.3 }}>
              {filtered.length} of {mockBQs.length} BQs
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/bq/new')}>
              New BQ
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <TextField
              size="small" placeholder="Search BQ ref, project, lead ref…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 240 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#97a3b5' }} /></InputAdornment> }}
            />
            <TextField select size="small" label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 170 }}>
              {['All', 'Draft', 'Scope Study', 'Feasibility', 'Technical Proposal', 'Tech Head Approval', 'Finance Approval', 'Submitted', 'Won', 'Lost'].map((o) => (
                <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>
              ))}
            </TextField>
            <TextField select size="small" label="Sector" value={sector} onChange={(e) => setSector(e.target.value)} sx={{ minWidth: 130 }}>
              {['All', 'Defence', 'Non-Defence'].map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Market" value={market} onChange={(e) => setMarket(e.target.value)} sx={{ minWidth: 130 }}>
              {['All', 'Domestic', 'Export'].map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
            </TextField>
          </Stack>
        </Card>

        {/* Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>BQ Ref</TableCell>
                  <TableCell>Lead Ref</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value Ex-GST</TableCell>
                  <TableCell>Value Inc-GST</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Extended Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Owner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((bq) => {
                  const cs = STATUS_CHIP[bq.status] || STATUS_CHIP['Draft']
                  const isOverdue = bq.submissionDate && new Date(bq.submissionDate) < new Date() && bq.status !== 'Submitted'
                  return (
                    <TableRow key={bq.id} onClick={() => navigate(`/bq/${bq.id}`)}>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>
                          {bq.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View linked lead">
                          <Typography
                            sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#1a56a0', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline dotted' }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/leads/${bq.leadRef}`) }}
                          >
                            {bq.leadRef}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, color: '#1a2236', fontSize: '0.82rem' }}>{bq.projectName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={bq.customer}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#5a6880' }}>{bq.customerShort}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip label={bq.customerType} size="small"
                          sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem',
                            backgroundColor: bq.customerType === 'Internal' ? '#e6f6f1' : '#f3eeff',
                            color: bq.customerType === 'Internal' ? '#0e7c61' : '#7c3aed' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.82rem', fontWeight: 600, color: '#1a2236' }}>
                          {bq.currency === 'INR' ? '₹' : '£'} {bq.estimatedValueExGST.toFixed(2)} Cr
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.78rem', color: '#5a6880' }}>
                          {bq.currency === 'INR' ? '₹' : '£'} {bq.estimatedValueIncGST.toFixed(2)} Cr
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: isOverdue ? '#c0392b' : '#5a6880', fontWeight: isOverdue ? 600 : 400 }}>
                          {bq.submissionDate || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: bq.extendedDate ? '#c07000' : '#c3ccd9' }}>
                          {bq.extendedDate || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={bq.status} size="small" sx={{ ...cs, fontFamily: "'JetBrains Mono'" }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1a2236' }}>{bq.owner}</Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ textAlign: 'center', py: 5, color: '#97a3b5' }}>
                      No BQs match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </AppShell>
  )
}
